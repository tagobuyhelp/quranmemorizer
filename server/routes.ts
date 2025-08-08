import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHifzEntrySchema, createUserSchema, User, Membership, Organization } from "@shared/schema";
import { z } from "zod";
import passport from "passport";
import { requireAuth, requireRole, requireOrganization } from "./auth";
import bcrypt from "bcryptjs";
import { PaymentIntent } from "@shared/schema";
import crypto from "crypto";

function requireActiveSubscription() {
  return async (req, res, next) => {
    try {
      const orgId = req.session.organizationId;
      if (!orgId) return res.status(400).json({ error: "Organization not selected" });
      const org = await Organization.findById(orgId).lean();
      if (!org) return res.status(404).json({ error: "Organization not found" });
      if (org.subscriptionStatus === "canceled") return res.status(402).json({ error: "Subscription inactive" });
      return next();
    } catch (e) {
      return res.status(500).json({ error: "Subscription check failed" });
    }
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", async (req, res, next) => {
    passport.authenticate("local", async (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ error: info?.message || "Unauthorized" });
      req.logIn(user, async (err) => {
        if (err) return next(err);
        // Pick an organization for this user (first membership)
        const membership = await Membership.findOne({ userId: user.id }).sort({ createdAt: 1 });
        if (membership) {
          req.session.organizationId = membership.organizationId.toString();
        }
        const safeUser = { id: user.id, username: user.username, name: user.name, role: user.role, organizationId: req.session.organizationId || null };
        res.json({ user: safeUser });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    const user = req.user as any;
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    const safeUser = { id: user._id || user.id, username: user.username, name: user.name, role: user.role, organizationId: req.session.organizationId || null };
    res.json({ user: safeUser });
  });

  // Organization selection and listing memberships
  app.get("/api/organizations", requireAuth(), async (req, res) => {
    const user = req.user as any;
    const memberships = await Membership.find({ userId: user.id }).lean();
    const orgIds = memberships.map(m => m.organizationId);
    const orgs = await Organization.find({ _id: { $in: orgIds } }).lean();
    res.json(orgs);
  });

  app.post("/api/organizations/select", requireAuth(), async (req, res) => {
    const orgId = req.body.organizationId as string;
    const user = req.user as any;
    const hasMembership = await Membership.findOne({ userId: user.id, organizationId: orgId });
    if (!hasMembership) return res.status(403).json({ error: "Not a member of this organization" });
    req.session.organizationId = orgId;
    res.json({ success: true });
  });

  // Organization info (name/description)
  app.get("/api/organization", requireAuth(), requireOrganization(), async (req, res) => {
    const org = await Organization.findById(req.session.organizationId).lean();
    if (!org) return res.status(404).json({ error: "Organization not found" });
    res.json({ name: org.name, description: org.description, subscriptionStatus: org.subscriptionStatus, plan: org.plan });
  });

  app.post("/api/organization", requireAuth(), requireOrganization(), requireRole("admin", "head-teacher"), async (req, res) => {
    const { name, description } = req.body as { name?: string; description?: string };
    const update: any = {};
    if (typeof name === "string") update.name = name;
    if (typeof description === "string") update.description = description;
    const org = await Organization.findByIdAndUpdate(req.session.organizationId, update, { new: true }).lean();
    if (!org) return res.status(404).json({ error: "Organization not found" });
    res.json({ name: org.name, description: org.description });
  });

  // User management (admin/head-teacher)
  app.get("/api/users", requireAuth(), requireRole("admin", "head-teacher"), async (_req, res) => {
    const users = await User.find({}, { username: 1, name: 1, role: 1, section: 1 }).sort({ role: 1, name: 1 });
    res.json(users);
  });

  app.post("/api/users", requireAuth(), requireRole("admin"), async (req, res) => {
    try {
      const input = createUserSchema.parse(req.body);
      const existing = await User.findOne({ username: input.username });
      if (existing) return res.status(409).json({ error: "Username already exists" });
      const passwordHash = await bcrypt.hash(input.password, 10);
      const created = await User.create({
        username: input.username,
        passwordHash,
        name: input.name,
        role: input.role,
        section: input.section,
      });
      res.status(201).json({ id: created.id, username: created.username, name: created.name, role: created.role, section: created.section });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create user" });
      }
    }
  });

  // Get all students
  app.get("/api/students", requireAuth(), requireOrganization(), requireActiveSubscription(), async (req, res) => {
    try {
      const orgId = req.session.organizationId!;
      const students = await storage.getStudents(orgId);
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  // Search students
  app.get("/api/students/search", requireAuth(), requireOrganization(), requireActiveSubscription(), async (req, res) => {
    try {
      const orgId = req.session.organizationId!;
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }
      const students = await storage.searchStudents(orgId, query);
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: "Failed to search students" });
    }
  });

  // Get student by ID
  app.get("/api/students/:studentId", requireAuth(), requireOrganization(), requireActiveSubscription(), async (req, res) => {
    try {
      const orgId = req.session.organizationId!;
      const student = await storage.getStudentByStudentId(orgId, req.params.studentId);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student" });
    }
  });

  // Get all para data (global)
  app.get("/api/paras", requireAuth(), async (_req, res) => {
    try {
      const paras = await storage.getParaData();
      res.json(paras);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch para data" });
    }
  });

  // Get para data by number (global)
  app.get("/api/paras/:paraNumber", requireAuth(), async (req, res) => {
    try {
      const paraNumber = parseInt(req.params.paraNumber);
      if (isNaN(paraNumber) || paraNumber < 1 || paraNumber > 30) {
        return res.status(400).json({ error: "Invalid para number" });
      }
      const para = await storage.getParaDataByNumber(paraNumber);
      if (!para) {
        return res.status(404).json({ error: "Para not found" });
      }
      res.json(para);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch para data" });
    }
  });

  // Create hifz entry
  app.post("/api/hifz-entries", requireAuth(), requireOrganization(), requireActiveSubscription(), async (req, res) => {
    try {
      const orgId = req.session.organizationId!;
      const validatedData = insertHifzEntrySchema.parse(req.body);
      
      // Check for duplicate entries
      const isDuplicate = await storage.checkDuplicateEntry(
        orgId,
        validatedData.studentId,
        validatedData.date,
        validatedData.taskType
      );
      
      if (isDuplicate) {
        return res.status(409).json({ 
          error: "Duplicate entry found for this student, date, and task type" 
        });
      }

      const entry = await storage.createHifzEntry(orgId, validatedData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create hifz entry" });
      }
    }
  });

  // Get hifz entries by student
  app.get("/api/hifz-entries/student/:studentId", requireAuth(), requireOrganization(), requireActiveSubscription(), async (req, res) => {
    try {
      const orgId = req.session.organizationId!;
      const entries = await storage.getHifzEntriesByStudent(orgId, req.params.studentId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hifz entries" });
    }
  });

  // Get all hifz entries
  app.get("/api/hifz-entries", requireAuth(), requireOrganization(), requireActiveSubscription(), async (req, res) => {
    try {
      const orgId = req.session.organizationId!;
      const entries = await storage.getHifzEntries(orgId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hifz entries" });
    }
  });

  // PhonePe Payment Endpoints
  app.post("/api/billing/phonepe/checkout", requireAuth(), requireOrganization(), async (req, res) => {
    try {
      const { plan, organizationId } = req.body;
      const organization = await Organization.findById(organizationId);
      if (!organization) return res.status(404).json({ error: "Organization not found" });

      const plans = {
        basic: { price: 99900, name: "Basic Plan" },
        pro: { price: 199900, name: "Pro Plan" },
        enterprise: { price: 499900, name: "Enterprise Plan" }
      };

      const planData = plans[plan as keyof typeof plans];
      if (!planData) return res.status(400).json({ error: "Invalid plan" });

      const merchantId = "TEST-M226SUOS8KL7F_25080";
      const saltKey = "ODBkY2E0NzQtMjU4Ni00MTE1LTg0MDAtMTFiMmY5MmRhYzU4";
      const saltIndex = "1";
      const redirectUrl = `${req.protocol}://${req.get('host')}/api/billing/phonepe/callback`;
      const callbackUrl = `${req.protocol}://${req.get('host')}/api/billing/phonepe/callback`;

      const payload = {
        merchantId: merchantId,
        merchantTransactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        merchantUserId: organizationId,
        amount: planData.price,
        redirectUrl: redirectUrl,
        redirectMode: "POST",
        callbackUrl: callbackUrl,
        merchantOrderId: `ORDER_${Date.now()}`,
        mobileNumber: organization.phone || "9999999999",
        paymentInstrument: {
          type: "PAY_PAGE"
        }
      };

      const base64 = Buffer.from(JSON.stringify(payload)).toString('base64');
      const string = `${base64}/pg/v1/pay${saltKey}`;
      const sha256 = crypto.createHash('sha256').update(string).digest('hex');
      const checksum = `${sha256}###${saltIndex}`;

      const phonepePayload = {
        request: base64
      };

      const response = await fetch('https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
        },
        body: JSON.stringify(phonepePayload)
      });

      const data = await response.json();
      
      if (data.success) {
        // Store payment intent in database
        await PaymentIntent.create({
          organizationId,
          plan,
          amount: planData.price,
          provider: 'phonepe',
          transactionId: payload.merchantTransactionId,
          status: 'pending'
        });

        res.json({
          success: true,
          redirectUrl: data.data.instrumentResponse.redirectInfo.url
        });
      } else {
        res.status(400).json({ error: "Payment initiation failed" });
      }
    } catch (error) {
      console.error('PhonePe checkout error:', error);
      res.status(500).json({ error: "Payment initiation failed" });
    }
  });

  app.post("/api/billing/phonepe/callback", async (req, res) => {
    try {
      const { merchantTransactionId, transactionId, amount, merchantId, transactionStatus } = req.body;
      
      // Verify the transaction
      const paymentIntent = await PaymentIntent.findOne({ 
        transactionId: merchantTransactionId,
        provider: 'phonepe'
      });
      
      if (!paymentIntent) {
        return res.status(404).json({ error: "Payment intent not found" });
      }

      if (transactionStatus === 'PAYMENT_SUCCESS') {
        // Update payment intent
        paymentIntent.status = 'completed';
        paymentIntent.providerTransactionId = transactionId;
        await paymentIntent.save();

        // Activate subscription
        const organization = await Organization.findById(paymentIntent.organizationId);
        if (organization) {
          organization.subscriptionStatus = 'active';
          organization.plan = paymentIntent.plan;
          organization.subscriptionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
          await organization.save();
        }

        res.json({ success: true, message: "Payment successful" });
      } else {
        paymentIntent.status = 'failed';
        await paymentIntent.save();
        res.json({ success: false, message: "Payment failed" });
      }
    } catch (error) {
      console.error('PhonePe callback error:', error);
      res.status(500).json({ error: "Callback processing failed" });
    }
  });

  // Admin Routes
  app.get("/api/admin/users", requireAuth(), requireRole("admin"), async (req, res) => {
    try {
      const users = await User.find({}).populate('organizationId', 'name').lean();
      res.json(users.map(user => ({
        id: user._id,
        username: user.username,
        role: user.role,
        organizationId: user.organizationId?._id,
        organization: user.organizationId ? { name: user.organizationId.name } : undefined,
        createdAt: user.createdAt
      })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/organizations", requireAuth(), requireRole("admin"), async (req, res) => {
    try {
      const organizations = await Organization.find({}, 'name').lean();
      res.json(organizations.map(org => ({
        id: org._id,
        name: org.name
      })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch organizations" });
    }
  });

  app.patch("/api/admin/users/:userId", requireAuth(), requireRole("admin"), async (req, res) => {
    try {
      const { userId } = req.params;
      const { role, organizationId } = req.body;
      
      const updates: any = {};
      if (role) updates.role = role;
      if (organizationId !== undefined) updates.organizationId = organizationId || null;
      
      const user = await User.findByIdAndUpdate(userId, updates, { new: true });
      if (!user) return res.status(404).json({ error: "User not found" });
      
      res.json({ success: true, user });
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:userId", requireAuth(), requireRole("admin"), async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findByIdAndDelete(userId);
      if (!user) return res.status(404).json({ error: "User not found" });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Admin Dashboard
  app.get("/api/admin/dashboard", requireAuth(), requireRole("admin"), async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalOrganizations = await Organization.countDocuments();
      const activeSubscriptions = await Organization.countDocuments({ subscriptionStatus: 'active' });
      const pendingPayments = await PaymentIntent.countDocuments({ status: 'pending' });

      // Get recent activities (simplified for now)
      const recentActivities = [
        {
          id: '1',
          type: 'subscription',
          description: 'New organization subscription activated',
          timestamp: new Date().toISOString(),
          status: 'success'
        }
      ];

      const subscriptionStats = {
        basic: await Organization.countDocuments({ plan: 'basic', subscriptionStatus: 'active' }),
        pro: await Organization.countDocuments({ plan: 'pro', subscriptionStatus: 'active' }),
        enterprise: await Organization.countDocuments({ plan: 'enterprise', subscriptionStatus: 'active' })
      };

      res.json({
        totalUsers,
        totalOrganizations,
        activeSubscriptions,
        pendingPayments,
        recentActivities,
        subscriptionStats
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
  });

  // Admin Organizations
  app.get("/api/admin/organizations", requireAuth(), requireRole("admin"), async (req, res) => {
    try {
      const organizations = await Organization.aggregate([
        {
          $lookup: {
            from: 'memberships',
            localField: '_id',
            foreignField: 'organizationId',
            as: 'members'
          }
        },
        {
          $addFields: {
            memberCount: { $size: '$members' }
          }
        },
        {
          $project: {
            members: 0
          }
        }
      ]);

      res.json(organizations.map(org => ({
        id: org._id,
        name: org.name,
        description: org.description,
        email: org.email,
        phone: org.phone,
        address: org.address,
        subscriptionStatus: org.subscriptionStatus,
        plan: org.plan,
        subscriptionExpiresAt: org.subscriptionExpiresAt,
        createdAt: org.createdAt,
        updatedAt: org.updatedAt,
        memberCount: org.memberCount
      })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch organizations" });
    }
  });

  app.post("/api/admin/organizations", requireAuth(), requireRole("admin"), async (req, res) => {
    try {
      const { name, description, email, phone, address, plan, subscriptionStatus } = req.body;
      
      const organization = await Organization.create({
        name,
        description,
        email,
        phone,
        address,
        plan,
        subscriptionStatus,
        subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      });
      
      res.status(201).json({ success: true, organization });
    } catch (error) {
      res.status(500).json({ error: "Failed to create organization" });
    }
  });

  app.patch("/api/admin/organizations/:orgId", requireAuth(), requireRole("admin"), async (req, res) => {
    try {
      const { orgId } = req.params;
      const updates = req.body;
      
      const organization = await Organization.findByIdAndUpdate(orgId, updates, { new: true });
      if (!organization) return res.status(404).json({ error: "Organization not found" });
      
      res.json({ success: true, organization });
    } catch (error) {
      res.status(500).json({ error: "Failed to update organization" });
    }
  });

  app.delete("/api/admin/organizations/:orgId", requireAuth(), requireRole("admin"), async (req, res) => {
    try {
      const { orgId } = req.params;
      const organization = await Organization.findByIdAndDelete(orgId);
      if (!organization) return res.status(404).json({ error: "Organization not found" });
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete organization" });
    }
  });

  // Admin Subscriptions
  app.get("/api/admin/subscriptions", requireAuth(), requireRole("admin"), async (req, res) => {
    try {
      const organizations = await Organization.aggregate([
        {
          $lookup: {
            from: 'memberships',
            localField: '_id',
            foreignField: 'organizationId',
            as: 'members'
          }
        },
        {
          $addFields: {
            memberCount: { $size: '$members' }
          }
        },
        {
          $project: {
            members: 0
          }
        }
      ]);

      const subscriptions = organizations.map(org => ({
        id: org._id,
        organizationId: org._id,
        organizationName: org.name,
        plan: org.plan || 'basic',
        status: org.subscriptionStatus,
        amount: org.plan === 'basic' ? 99900 : org.plan === 'pro' ? 199900 : 499900,
        currency: 'INR',
        billingCycle: 'monthly',
        startDate: org.createdAt,
        endDate: org.subscriptionExpiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        nextBillingDate: org.subscriptionExpiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        paymentMethod: 'razorpay',
        totalPayments: 1,
        memberCount: org.memberCount
      }));

      res.json(subscriptions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
  });

  app.get("/api/admin/subscriptions/stats", requireAuth(), requireRole("admin"), async (req, res) => {
    try {
      const totalRevenue = 0; // Calculate from PaymentIntent
      const monthlyRecurringRevenue = 0; // Calculate from active subscriptions
      const activeSubscriptions = await Organization.countDocuments({ subscriptionStatus: 'active' });
      const churnRate = 0; // Calculate churn rate
      const averageRevenuePerUser = 0; // Calculate ARPU

      const planDistribution = {
        basic: await Organization.countDocuments({ plan: 'basic', subscriptionStatus: 'active' }),
        pro: await Organization.countDocuments({ plan: 'pro', subscriptionStatus: 'active' }),
        enterprise: await Organization.countDocuments({ plan: 'enterprise', subscriptionStatus: 'active' })
      };

      const paymentMethods = {
        razorpay: await PaymentIntent.countDocuments({ provider: 'razorpay', status: 'completed' }),
        phonepe: await PaymentIntent.countDocuments({ provider: 'phonepe', status: 'completed' })
      };

      res.json({
        totalRevenue,
        monthlyRecurringRevenue,
        activeSubscriptions,
        churnRate,
        averageRevenuePerUser,
        planDistribution,
        paymentMethods
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
