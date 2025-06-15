import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  studentId: text("student_id").notNull().unique(),
  name: text("name").notNull(),
  section: text("section").notNull(),
  teacher: text("teacher").notNull(),
  currentPara: integer("current_para").notNull(),
  totalParas: integer("total_paras").notNull(),
});

export const hifzEntries = pgTable("hifz_entries", {
  id: serial("id").primaryKey(),
  studentId: text("student_id").notNull(),
  date: text("date").notNull(),
  section: text("section").notNull(),
  taskType: text("task_type").notNull(),
  para: integer("para"),
  fromPage: integer("from_page"),
  toPage: integer("to_page"),
  pagesRead: integer("pages_read"),
  parasRevised: jsonb("paras_revised").$type<number[]>(),
  accuracyScore: integer("accuracy_score"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const paraData = pgTable("para_data", {
  id: serial("id").primaryKey(),
  paraNumber: integer("para_number").notNull().unique(),
  startPage: integer("start_page").notNull(),
  endPage: integer("end_page").notNull(),
  totalPages: integer("total_pages").notNull(),
});

export const insertStudentSchema = createInsertSchema(students).omit({
  id: true,
});

export const insertHifzEntrySchema = createInsertSchema(hifzEntries).omit({
  id: true,
  createdAt: true,
});

export const insertParaDataSchema = createInsertSchema(paraData).omit({
  id: true,
});

export type Student = typeof students.$inferSelect;
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type HifzEntry = typeof hifzEntries.$inferSelect;
export type InsertHifzEntry = z.infer<typeof insertHifzEntrySchema>;
export type ParaData = typeof paraData.$inferSelect;
export type InsertParaData = z.infer<typeof insertParaDataSchema>;
