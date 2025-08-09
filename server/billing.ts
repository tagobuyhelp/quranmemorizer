import type { Express } from "express";
import { requireAuth, requireRole } from "./auth";
import { Organization, PaymentIntent } from "@shared/schema";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_your_key_id",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "your_secret_key",
});

export function registerBillingRoutes(app: Express) {
  // Get organization billing info
  app.get("/api/billing", requireAuth(), requireRole("admin"), async (req, res) => {
    try {
      const orgId = req.session.organizationId;
      if (!orgId) return res.status(400).json({ error: "Organization not selected" });
      
      const org = await Organization.findById(orgId).lean();
      if (!org) return res.status(404).json({ error: "Organization not found" });
      
      res.json({
        plan: org.plan || "basic",
        status: org.subscriptionStatus || "inactive",
        nextBillingDate: org.nextBillingDate,
        paymentMethod: org.paymentMethod,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch billing info" });
    }
  });

  // Create payment intent
  app.post("/api/billing/create-payment", requireAuth(), requireRole("admin"), async (req, res) => {
    try {
      const { plan, paymentMethod } = req.body;
      const orgId = req.session.organizationId;
      
      if (!orgId) return res.status(400).json({ error: "Organization not selected" });
      
      const org = await Organization.findById(orgId);
      if (!org) return res.status(404).json({ error: "Organization not found" });
      
      // Calculate amount based on plan
      const planAmounts = {
        basic: 99900, // ₹999 in paise
        pro: 199900,  // ₹1999 in paise
        enterprise: 499900, // ₹4999 in paise
      };
      
      const amount = planAmounts[plan as keyof typeof planAmounts] || 99900;
      
      // Create Razorpay order
      const order = await razorpay.orders.create({
        amount,
        currency: "INR",
        receipt: `org_${orgId}_${Date.now()}`,
        notes: {
          organizationId: orgId,
          plan,
          paymentMethod,
        },
      });
      
      // Create payment intent record
      const paymentIntent = await PaymentIntent.create({
        organizationId: orgId,
        orderId: order.id,
        amount,
        currency: "INR",
        plan,
        paymentMethod,
        status: "pending",
      });
      
      res.json({
        orderId: order.id,
        amount,
        currency: "INR",
        key: razorpay.key_id,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error) {
      console.error("Payment creation error:", error);
      res.status(500).json({ error: "Failed to create payment" });
    }
  });

  // Verify payment webhook
  app.post("/api/billing/verify-payment", async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      
      // Verify signature
      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const signature = crypto
        .createHmac("sha256", razorpay.key_secret)
        .update(text)
        .digest("hex");
      
      if (signature !== razorpay_signature) {
        return res.status(400).json({ error: "Invalid signature" });
      }
      
      // Update payment intent
      const paymentIntent = await PaymentIntent.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
          status: "completed",
          paymentId: razorpay_payment_id,
          completedAt: new Date(),
        },
        { new: true }
      );
      
      if (paymentIntent) {
        // Update organization subscription
        await Organization.findByIdAndUpdate(paymentIntent.organizationId, {
          plan: paymentIntent.plan,
          subscriptionStatus: "active",
          paymentMethod: paymentIntent.paymentMethod,
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({ error: "Payment verification failed" });
    }
  });

  // Get payment history
  app.get("/api/billing/payments", requireAuth(), requireRole("admin"), async (req, res) => {
    try {
      const orgId = req.session.organizationId;
      if (!orgId) return res.status(400).json({ error: "Organization not selected" });
      
      const payments = await PaymentIntent.find({ organizationId: orgId })
        .sort({ createdAt: -1 })
        .lean();
      
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment history" });
    }
  });
}
