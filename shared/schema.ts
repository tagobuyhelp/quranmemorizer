import mongoose, { Schema, Document, Types } from "mongoose";
import { z } from "zod";

// MongoDB Schema Definitions

// Enhanced User Roles for Multi-Tenant SaaS
export type UserRole = "super-admin" | "madrasah-admin" | "teacher" | "parent" | "student";

// Multi-Tenant Organization (Madrasah)
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
  // Display & Branding
  description?: string | null;
  logo?: string | null;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  } | null;
  // Academic Settings
  academicYear?: string;
  defaultLanguage?: "en" | "ar" | "ur";
  createdAt: Date;
  updatedAt: Date;
}

// Enhanced User Model with Multi-Tenant Support
export interface IUser extends Document {
  username: string;
  passwordHash: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// User-Organization Membership (Multi-Tenant)
export interface IMembership extends Document {
  userId: Types.ObjectId;
  organizationId: Types.ObjectId;
  role: UserRole;
  // Role-specific fields
  section?: string; // for teachers
  studentId?: string; // for parents/students
  permissions?: string[]; // granular permissions
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Enhanced Student Model
export interface IStudent extends Document {
  organizationId: Types.ObjectId;
  studentId: string;
  name: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: "male" | "female";
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  // Academic Information
  section: string;
  teacherId: Types.ObjectId;
  currentPara: number;
  totalParas: number;
  // Progress Tracking
  enrollmentDate: Date;
  lastAssessmentDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Enhanced Teacher Model
export interface ITeacher extends Document {
  organizationId: Types.ObjectId;
  teacherId: string;
  name: string;
  email?: string;
  phone?: string;
  qualification?: string;
  specialization?: string[];
  // Teaching Assignment
  sections: string[];
  maxStudents?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Enhanced Hifz Entry with Better Tracking
export interface IHifzEntry extends Document {
  organizationId: Types.ObjectId;
  studentId: string;
  teacherId: Types.ObjectId;
  date: string;
  section: string;
  taskType: "sabaq" | "sabaqi" | "manzil" | "revision";
  // Detailed Progress
  para?: number;
  fromPage?: number;
  toPage?: number;
  pagesRead?: number;
  parasRevised?: number[];
  // Assessment
  accuracyScore?: number; // 1-5 scale
  tajweedScore?: number; // 1-5 scale
  fluencyScore?: number; // 1-5 scale
  remarks?: string;
  // Audio/Video Recording
  recordingUrl?: string;
  duration?: number; // in seconds
  createdAt: Date;
  updatedAt: Date;
}

// Najera Entry (Reading Progress)
export interface INajeraEntry extends Document {
  organizationId: Types.ObjectId;
  studentId: string;
  teacherId: Types.ObjectId;
  date: string;
  section: string;
  // Reading Progress
  fromPage: number;
  toPage: number;
  pagesRead: number;
  // Assessment
  readingAccuracy?: number; // 1-5 scale
  pronunciationScore?: number; // 1-5 scale
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Noorani Qaida Entry
export interface INooraniEntry extends Document {
  organizationId: Types.ObjectId;
  studentId: string;
  teacherId: Types.ObjectId;
  date: string;
  section: string;
  // Lesson Progress
  lessonNumber: number;
  lessonType: "harakat" | "sukoon" | "tanween" | "madd" | "shadda" | "other";
  // Assessment
  accuracyScore?: number; // 1-5 scale
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Khatm Entry (Completion Tracking)
export interface IKhatmEntry extends Document {
  organizationId: Types.ObjectId;
  studentId: string;
  teacherId: Types.ObjectId;
  date: string;
  section: string;
  // Khatm Details
  khatmType: "full" | "partial";
  fromPara: number;
  toPara: number;
  totalParas: number;
  // Assessment
  overallScore?: number; // 1-5 scale
  remarks?: string;
  // Completion Certificate
  certificateUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Attendance Tracking
export interface IAttendance extends Document {
  organizationId: Types.ObjectId;
  studentId: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  markedBy: Types.ObjectId; // teacher/admin who marked
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Communication/Messaging
export interface IMessage extends Document {
  organizationId: Types.ObjectId;
  fromUserId: Types.ObjectId;
  toUserId: Types.ObjectId;
  subject: string;
  content: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Notification System
export interface INotification extends Document {
  organizationId: Types.ObjectId;
  userId: Types.ObjectId;
  type: "message" | "announcement" | "reminder" | "achievement";
  title: string;
  content: string;
  isRead: boolean;
  readAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Para Data (Quran Structure)
export interface IParaData extends Document {
  paraNumber: number;
  startPage: number;
  endPage: number;
  totalPages: number;
  juzNumber: number;
  surahs: Array<{
    name: string;
    arabicName: string;
    startAyah: number;
    endAyah: number;
  }>;
}

// Mongoose Schemas

const OrganizationSchema = new Schema<IOrganization>({
  name: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  subscriptionStatus: { type: String, enum: ["trialing", "active", "past_due", "canceled"], default: "trialing" },
  trialEndsAt: { type: Date, default: null },
  plan: { type: String, enum: ["basic", "pro", "enterprise"], default: null },
  paymentProvider: { type: String, enum: ["razorpay", "phonepe"], default: null },
  currentPeriodEnd: { type: Date, default: null },
  billingEmail: { type: String, default: null },
  lastPaymentAt: { type: Date, default: null },
  razorpayCustomerId: { type: String, default: null },
  description: { type: String, default: null },
  logo: { type: String, default: null },
  theme: {
    primaryColor: { type: String, default: "#3b82f6" },
    secondaryColor: { type: String, default: "#1e40af" }
  },
  academicYear: { type: String, default: null },
  defaultLanguage: { type: String, enum: ["en", "ar", "ur"], default: "en" }
}, { timestamps: true });

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, default: null },
  phone: { type: String, default: null },
  avatar: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date, default: null }
}, { timestamps: true });

const MembershipSchema = new Schema<IMembership>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
  role: { type: String, enum: ["super-admin", "madrasah-admin", "teacher", "parent", "student"], required: true },
  section: { type: String, required: false },
  studentId: { type: String, required: false },
  permissions: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const StudentSchema = new Schema<IStudent>({
  organizationId: { type: Schema.Types.ObjectId, required: true, index: true },
  studentId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, default: null },
  phone: { type: String, default: null },
  dateOfBirth: { type: Date, default: null },
  gender: { type: String, enum: ["male", "female"], default: null },
  address: { type: String, default: null },
  emergencyContact: {
    name: { type: String, required: false },
    phone: { type: String, required: false },
    relationship: { type: String, required: false }
  },
  section: { type: String, required: true },
  teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  currentPara: { type: Number, required: true },
  totalParas: { type: Number, required: true },
  enrollmentDate: { type: Date, default: Date.now },
  lastAssessmentDate: { type: Date, default: null },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const TeacherSchema = new Schema<ITeacher>({
  organizationId: { type: Schema.Types.ObjectId, required: true, index: true },
  teacherId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, default: null },
  phone: { type: String, default: null },
  qualification: { type: String, default: null },
  specialization: [{ type: String }],
  sections: [{ type: String, required: true }],
  maxStudents: { type: Number, default: null },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const HifzEntrySchema = new Schema<IHifzEntry>({
  organizationId: { type: Schema.Types.ObjectId, required: true, index: true },
  studentId: { type: String, required: true, index: true },
  teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  date: { type: String, required: true, index: true },
  section: { type: String, required: true },
  taskType: { type: String, enum: ["sabaq", "sabaqi", "manzil", "revision"], required: true },
  para: { type: Number },
  fromPage: { type: Number },
  toPage: { type: Number },
  pagesRead: { type: Number },
  parasRevised: [{ type: Number }],
  accuracyScore: { type: Number, min: 1, max: 5 },
  tajweedScore: { type: Number, min: 1, max: 5 },
  fluencyScore: { type: Number, min: 1, max: 5 },
  remarks: { type: String },
  recordingUrl: { type: String, default: null },
  duration: { type: Number, default: null }
}, { timestamps: true });

const NajeraEntrySchema = new Schema<INajeraEntry>({
  organizationId: { type: Schema.Types.ObjectId, required: true, index: true },
  studentId: { type: String, required: true, index: true },
  teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  date: { type: String, required: true, index: true },
  section: { type: String, required: true },
  fromPage: { type: Number, required: true },
  toPage: { type: Number, required: true },
  pagesRead: { type: Number, required: true },
  readingAccuracy: { type: Number, min: 1, max: 5 },
  pronunciationScore: { type: Number, min: 1, max: 5 },
  remarks: { type: String }
}, { timestamps: true });

const NooraniEntrySchema = new Schema<INooraniEntry>({
  organizationId: { type: Schema.Types.ObjectId, required: true, index: true },
  studentId: { type: String, required: true, index: true },
  teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  date: { type: String, required: true, index: true },
  section: { type: String, required: true },
  lessonNumber: { type: Number, required: true },
  lessonType: { type: String, enum: ["harakat", "sukoon", "tanween", "madd", "shadda", "other"], required: true },
  accuracyScore: { type: Number, min: 1, max: 5 },
  remarks: { type: String }
}, { timestamps: true });

const KhatmEntrySchema = new Schema<IKhatmEntry>({
  organizationId: { type: Schema.Types.ObjectId, required: true, index: true },
  studentId: { type: String, required: true, index: true },
  teacherId: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  date: { type: String, required: true, index: true },
  section: { type: String, required: true },
  khatmType: { type: String, enum: ["full", "partial"], required: true },
  fromPara: { type: Number, required: true },
  toPara: { type: Number, required: true },
  totalParas: { type: Number, required: true },
  overallScore: { type: Number, min: 1, max: 5 },
  remarks: { type: String },
  certificateUrl: { type: String, default: null }
}, { timestamps: true });

const AttendanceSchema = new Schema<IAttendance>({
  organizationId: { type: Schema.Types.ObjectId, required: true, index: true },
  studentId: { type: String, required: true, index: true },
  date: { type: String, required: true, index: true },
  status: { type: String, enum: ["present", "absent", "late", "excused"], required: true },
  markedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  remarks: { type: String }
}, { timestamps: true });

const MessageSchema = new Schema<IMessage>({
  organizationId: { type: Schema.Types.ObjectId, required: true, index: true },
  fromUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  toUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date, default: null }
}, { timestamps: true });

const NotificationSchema = new Schema<INotification>({
  organizationId: { type: Schema.Types.ObjectId, required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type: { type: String, enum: ["message", "announcement", "reminder", "achievement"], required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date, default: null },
  metadata: { type: Schema.Types.Mixed, default: {} }
}, { timestamps: true });

const ParaDataSchema = new Schema<IParaData>({
  paraNumber: { type: Number, required: true, unique: true },
  startPage: { type: Number, required: true },
  endPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  juzNumber: { type: Number, required: true },
  surahs: [{
    name: { type: String, required: true },
    arabicName: { type: String, required: true },
    startAyah: { type: Number, required: true },
    endAyah: { type: Number, required: true }
  }]
}, { timestamps: true });

// Payment Intent Schema (unchanged)
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
StudentSchema.index({ organizationId: 1, teacherId: 1 });

TeacherSchema.index({ organizationId: 1, teacherId: 1 }, { unique: true });
TeacherSchema.index({ organizationId: 1, name: 1 });
TeacherSchema.index({ organizationId: 1, sections: 1 });

HifzEntrySchema.index({ organizationId: 1, studentId: 1, date: 1, taskType: 1 });
NajeraEntrySchema.index({ organizationId: 1, studentId: 1, date: 1 });
NooraniEntrySchema.index({ organizationId: 1, studentId: 1, date: 1 });
KhatmEntrySchema.index({ organizationId: 1, studentId: 1, date: 1 });

AttendanceSchema.index({ organizationId: 1, studentId: 1, date: 1 }, { unique: true });
AttendanceSchema.index({ organizationId: 1, date: 1 });

MessageSchema.index({ organizationId: 1, fromUserId: 1, createdAt: -1 });
MessageSchema.index({ organizationId: 1, toUserId: 1, isRead: 1 });

NotificationSchema.index({ organizationId: 1, userId: 1, isRead: 1 });
NotificationSchema.index({ organizationId: 1, userId: 1, createdAt: -1 });

MembershipSchema.index({ userId: 1, organizationId: 1 }, { unique: true });
MembershipSchema.index({ organizationId: 1, role: 1 });

ParaDataSchema.index({ paraNumber: 1 });

// Export Models
export const Organization = mongoose.model<IOrganization>("Organization", OrganizationSchema);
export const User = mongoose.model<IUser>("User", UserSchema);
export const Membership = mongoose.model<IMembership>("Membership", MembershipSchema);
export const Student = mongoose.model<IStudent>("Student", StudentSchema);
export const Teacher = mongoose.model<ITeacher>("Teacher", TeacherSchema);
export const HifzEntry = mongoose.model<IHifzEntry>("HifzEntry", HifzEntrySchema);
export const NajeraEntry = mongoose.model<INajeraEntry>("NajeraEntry", NajeraEntrySchema);
export const NooraniEntry = mongoose.model<INooraniEntry>("NooraniEntry", NooraniEntrySchema);
export const KhatmEntry = mongoose.model<IKhatmEntry>("KhatmEntry", KhatmEntrySchema);
export const Attendance = mongoose.model<IAttendance>("Attendance", AttendanceSchema);
export const Message = mongoose.model<IMessage>("Message", MessageSchema);
export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);
export const ParaData = mongoose.model<IParaData>("ParaData", ParaDataSchema);
export const PaymentIntent = mongoose.model('PaymentIntent', PaymentIntentSchema);

// Zod Schemas for validation

export const createOrganizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
  billingEmail: z.string().email().optional(),
  defaultLanguage: z.enum(["en", "ar", "ur"]).default("en")
});

export const createUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional(),
  phone: z.string().optional()
});

export const createMembershipSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  organizationId: z.string().min(1, "Organization ID is required"),
  role: z.enum(["super-admin", "madrasah-admin", "teacher", "parent", "student"]),
  section: z.string().optional(),
  studentId: z.string().optional()
});

export const insertStudentSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female"]).optional(),
  address: z.string().optional(),
  emergencyContact: z.object({
    name: z.string(),
    phone: z.string(),
    relationship: z.string()
  }).optional(),
  section: z.string().min(1, "Section is required"),
  teacherId: z.string().min(1, "Teacher ID is required"),
  currentPara: z.number().min(1, "Current para must be at least 1"),
  totalParas: z.number().min(1, "Total paras must be at least 1")
});

export const insertTeacherSchema = z.object({
  teacherId: z.string().min(1, "Teacher ID is required"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  qualification: z.string().optional(),
  specialization: z.array(z.string()).optional(),
  sections: z.array(z.string()).min(1, "At least one section is required"),
  maxStudents: z.number().optional()
});

export const insertHifzEntrySchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  teacherId: z.string().min(1, "Teacher ID is required"),
  date: z.string().min(1, "Date is required"),
  section: z.string().min(1, "Section is required"),
  taskType: z.enum(["sabaq", "sabaqi", "manzil", "revision"]),
  para: z.number().optional(),
  fromPage: z.number().optional(),
  toPage: z.number().optional(),
  pagesRead: z.number().optional(),
  parasRevised: z.array(z.number()).optional(),
  accuracyScore: z.number().min(1).max(5).optional(),
  tajweedScore: z.number().min(1).max(5).optional(),
  fluencyScore: z.number().min(1).max(5).optional(),
  remarks: z.string().optional(),
  recordingUrl: z.string().optional(),
  duration: z.number().optional()
});

export const insertNajeraEntrySchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  teacherId: z.string().min(1, "Teacher ID is required"),
  date: z.string().min(1, "Date is required"),
  section: z.string().min(1, "Section is required"),
  fromPage: z.number().min(1, "From page is required"),
  toPage: z.number().min(1, "To page is required"),
  pagesRead: z.number().min(1, "Pages read is required"),
  readingAccuracy: z.number().min(1).max(5).optional(),
  pronunciationScore: z.number().min(1).max(5).optional(),
  remarks: z.string().optional()
});

export const insertNooraniEntrySchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  teacherId: z.string().min(1, "Teacher ID is required"),
  date: z.string().min(1, "Date is required"),
  section: z.string().min(1, "Section is required"),
  lessonNumber: z.number().min(1, "Lesson number is required"),
  lessonType: z.enum(["harakat", "sukoon", "tanween", "madd", "shadda", "other"]),
  accuracyScore: z.number().min(1).max(5).optional(),
  remarks: z.string().optional()
});

export const insertKhatmEntrySchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  teacherId: z.string().min(1, "Teacher ID is required"),
  date: z.string().min(1, "Date is required"),
  section: z.string().min(1, "Section is required"),
  khatmType: z.enum(["full", "partial"]),
  fromPara: z.number().min(1, "From para is required"),
  toPara: z.number().min(1, "To para is required"),
  totalParas: z.number().min(1, "Total paras is required"),
  overallScore: z.number().min(1).max(5).optional(),
  remarks: z.string().optional()
});

export const insertAttendanceSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  date: z.string().min(1, "Date is required"),
  status: z.enum(["present", "absent", "late", "excused"]),
  remarks: z.string().optional()
});

export const insertParaDataSchema = z.object({
  paraNumber: z.number().min(1).max(30, "Para number must be between 1 and 30"),
  startPage: z.number().min(1, "Start page must be at least 1"),
  endPage: z.number().min(1, "End page must be at least 1"),
  totalPages: z.number().min(1, "Total pages must be at least 1"),
  juzNumber: z.number().min(1, "Juz number must be at least 1"),
  surahs: z.array(z.object({
    name: z.string(),
    arabicName: z.string(),
    startAyah: z.number(),
    endAyah: z.number()
  }))
});

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});

// Type exports
export type Organization = IOrganization;
export type User = IUser;
export type Membership = IMembership;
export type Student = IStudent;
export type Teacher = ITeacher;
export type HifzEntry = IHifzEntry;
export type NajeraEntry = INajeraEntry;
export type NooraniEntry = INooraniEntry;
export type KhatmEntry = IKhatmEntry;
export type Attendance = IAttendance;
export type Message = IMessage;
export type Notification = INotification;
export type ParaData = IParaData;

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type CreateMembershipInput = z.infer<typeof createMembershipSchema>;
export type InsertStudentInput = z.infer<typeof insertStudentSchema>;
export type InsertTeacherInput = z.infer<typeof insertTeacherSchema>;
export type InsertHifzEntryInput = z.infer<typeof insertHifzEntrySchema>;
export type InsertNajeraEntryInput = z.infer<typeof insertNajeraEntrySchema>;
export type InsertNooraniEntryInput = z.infer<typeof insertNooraniEntrySchema>;
export type InsertKhatmEntryInput = z.infer<typeof insertKhatmEntrySchema>;
export type InsertAttendanceInput = z.infer<typeof insertAttendanceSchema>;
export type InsertParaDataInput = z.infer<typeof insertParaDataSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
