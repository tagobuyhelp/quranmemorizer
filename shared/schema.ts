import mongoose, { Schema, Document, Types } from "mongoose";
import { z } from "zod";

// MongoDB Schema Definitions
export interface IStudent extends Document {
  organizationId: Types.ObjectId;
  studentId: string;
  name: string;
  section: string;
  teacher: string;
  currentPara: number;
  totalParas: number;
}

export interface IHifzEntry extends Document {
  organizationId: Types.ObjectId;
  studentId: string;
  date: string;
  section: string;
  taskType: string;
  para?: number;
  fromPage?: number;
  toPage?: number;
  pagesRead?: number;
  parasRevised?: number[];
  accuracyScore?: number;
  remarks?: string;
  createdAt: Date;
}

export interface IParaData extends Document {
  paraNumber: number;
  startPage: number;
  endPage: number;
  totalPages: number;
}

export interface IOrganization extends Document {
  name: string;
  slug?: string; // optional subdomain
  subscriptionStatus: "trialing" | "active" | "past_due" | "canceled";
  trialEndsAt?: Date | null;
  // Billing fields
  plan?: "basic" | "pro" | "enterprise" | null;
  paymentProvider?: "razorpay" | "phonepe" | null;
  currentPeriodEnd?: Date | null;
  billingEmail?: string | null;
  lastPaymentAt?: Date | null;
  razorpayCustomerId?: string | null;
  // Display
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMembership extends Document {
  userId: Types.ObjectId;
  organizationId: Types.ObjectId;
  role: UserRole; // role within org
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schemas
const StudentSchema = new Schema<IStudent>({
  organizationId: { type: Schema.Types.ObjectId, required: true, index: true },
  studentId: { type: String, required: true },
  name: { type: String, required: true },
  section: { type: String, required: true },
  teacher: { type: String, required: true },
  currentPara: { type: Number, required: true },
  totalParas: { type: Number, required: true },
}, {
  timestamps: true
});

const HifzEntrySchema = new Schema<IHifzEntry>({
  organizationId: { type: Schema.Types.ObjectId, required: true, index: true },
  studentId: { type: String, required: true, index: true },
  date: { type: String, required: true, index: true },
  section: { type: String, required: true },
  taskType: { type: String, required: true },
  para: { type: Number },
  fromPage: { type: Number },
  toPage: { type: Number },
  pagesRead: { type: Number },
  parasRevised: [{ type: Number }],
  accuracyScore: { type: Number, min: 1, max: 5 },
  remarks: { type: String },
}, {
  timestamps: true
});

const ParaDataSchema = new Schema<IParaData>({
  paraNumber: { type: Number, required: true },
  startPage: { type: Number, required: true },
  endPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
}, {
  timestamps: true
});

const OrganizationSchema = new Schema<IOrganization>({
  name: { type: String, required: true },
  slug: { type: String },
  subscriptionStatus: { type: String, enum: ["trialing", "active", "past_due", "canceled"], default: "trialing" },
  trialEndsAt: { type: Date, default: null },
  plan: { type: String, enum: ["basic", "pro", "enterprise"], default: null },
  paymentProvider: { type: String, enum: ["razorpay", "phonepe"], default: null },
  currentPeriodEnd: { type: Date, default: null },
  billingEmail: { type: String, default: null },
  lastPaymentAt: { type: Date, default: null },
  razorpayCustomerId: { type: String, default: null },
  description: { type: String, default: null },
}, { timestamps: true });

const MembershipSchema = new Schema<IMembership>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  role: { type: String, enum: ["teacher", "head-teacher", "admin"], required: true },
}, { timestamps: true });

const PaymentIntentSchema = new Schema({
  organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
  plan: { type: String, required: true },
  amount: { type: Number, required: true },
  provider: { type: String, enum: ['razorpay', 'phonepe'], required: true },
  transactionId: { type: String, required: true, unique: true },
  providerTransactionId: { type: String },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create indexes for better performance
StudentSchema.index({ organizationId: 1, studentId: 1 }, { unique: true });
StudentSchema.index({ organizationId: 1, name: 1 });
StudentSchema.index({ organizationId: 1, section: 1 });
StudentSchema.index({ organizationId: 1, teacher: 1 });

HifzEntrySchema.index({ organizationId: 1, studentId: 1, date: 1, taskType: 1 }); // For duplicate checking

ParaDataSchema.index({ paraNumber: 1 });

MembershipSchema.index({ userId: 1, organizationId: 1 }, { unique: true });

// Export Models
export const Student = mongoose.model<IStudent>("Student", StudentSchema);
export const HifzEntry = mongoose.model<IHifzEntry>("HifzEntry", HifzEntrySchema);
export const ParaData = mongoose.model<IParaData>("ParaData", ParaDataSchema);
export const Organization = mongoose.model<IOrganization>("Organization", OrganizationSchema);
export const Membership = mongoose.model<IMembership>("Membership", MembershipSchema);
export const PaymentIntent = mongoose.model('PaymentIntent', PaymentIntentSchema);

// Zod Schemas for validation
export const insertStudentSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  name: z.string().min(1, "Name is required"),
  section: z.string().min(1, "Section is required"),
  teacher: z.string().min(1, "Teacher is required"),
  currentPara: z.number().min(1, "Current para must be at least 1"),
  totalParas: z.number().min(1, "Total paras must be at least 1"),
});

export const insertHifzEntrySchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  date: z.string().min(1, "Date is required"),
  section: z.string().min(1, "Section is required"),
  taskType: z.string().min(1, "Task type is required"),
  para: z.number().optional(),
  fromPage: z.number().optional(),
  toPage: z.number().optional(),
  pagesRead: z.number().optional(),
  parasRevised: z.array(z.number()).optional(),
  accuracyScore: z.number().min(1).max(5).optional(),
  remarks: z.string().optional(),
});

export const insertParaDataSchema = z.object({
  paraNumber: z.number().min(1).max(30, "Para number must be between 1 and 30"),
  startPage: z.number().min(1, "Start page must be at least 1"),
  endPage: z.number().min(1, "End page must be at least 1"),
  totalPages: z.number().min(1, "Total pages must be at least 1"),
});

// User and Auth
export type UserRole = "teacher" | "head-teacher" | "admin";

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  section?: string | null; // optional for teacher scoping
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ["teacher", "head-teacher", "admin"], required: true },
  section: { type: String, required: false },
}, { timestamps: true });

export const User = mongoose.model<IUser>("User", UserSchema);

export const createUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(["teacher", "head-teacher", "admin"]),
  section: z.string().optional(),
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export type Student = IStudent;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type HifzEntry = IHifzEntry;
export type InsertHifzEntry = z.infer<typeof insertHifzEntrySchema>;
export type ParaData = IParaData;
export type InsertParaData = z.infer<typeof insertParaDataSchema>;
export type Organization = IOrganization;
export type Membership = IMembership;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
