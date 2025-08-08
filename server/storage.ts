import { Student, HifzEntry, ParaData, type InsertStudent, type InsertHifzEntry, type InsertParaData } from "@shared/schema";
import { Types } from "mongoose";

export interface IStorage {
  // Student operations
  getStudents(organizationId: string): Promise<any[]>;
  getStudent(id: string): Promise<any | undefined>;
  getStudentByStudentId(organizationId: string, studentId: string): Promise<any | undefined>;
  createStudent(organizationId: string, student: InsertStudent): Promise<any>;
  searchStudents(organizationId: string, query: string): Promise<any[]>;

  // Hifz entry operations
  getHifzEntries(organizationId: string): Promise<any[]>;
  getHifzEntry(id: string): Promise<any | undefined>;
  getHifzEntriesByStudent(organizationId: string, studentId: string): Promise<any[]>;
  createHifzEntry(organizationId: string, entry: InsertHifzEntry): Promise<any>;
  checkDuplicateEntry(organizationId: string, studentId: string, date: string, taskType: string): Promise<boolean>;

  // Para data operations (global)
  getParaData(): Promise<any[]>;
  getParaDataByNumber(paraNumber: number): Promise<any | undefined>;
  createParaData(paraData: InsertParaData): Promise<any>;
}

export class MongoStorage implements IStorage {
  async getStudents(organizationId: string): Promise<any[]> {
    const org = new Types.ObjectId(organizationId);
    return await Student.find({ organizationId: org }).sort({ name: 1 });
  }

  async getStudent(id: string): Promise<any | undefined> {
    return await Student.findById(id);
  }

  async getStudentByStudentId(organizationId: string, studentId: string): Promise<any | undefined> {
    const org = new Types.ObjectId(organizationId);
    return await Student.findOne({ organizationId: org, studentId });
  }

  async createStudent(organizationId: string, insertStudent: InsertStudent): Promise<any> {
    const org = new Types.ObjectId(organizationId);
    const student = new Student({ ...insertStudent, organizationId: org });
    return await student.save();
  }

  async searchStudents(organizationId: string, query: string): Promise<any[]> {
    const org = new Types.ObjectId(organizationId);
    const lowercaseQuery = query.toLowerCase();
    return await Student.find({
      organizationId: org,
      $or: [
        { name: { $regex: lowercaseQuery, $options: 'i' } },
        { studentId: { $regex: lowercaseQuery, $options: 'i' } },
        { teacher: { $regex: lowercaseQuery, $options: 'i' } }
      ]
    }).sort({ name: 1 });
  }

  async getHifzEntries(organizationId: string): Promise<any[]> {
    const org = new Types.ObjectId(organizationId);
    return await HifzEntry.find({ organizationId: org }).sort({ createdAt: -1 });
  }

  async getHifzEntry(id: string): Promise<any | undefined> {
    return await HifzEntry.findById(id);
  }

  async getHifzEntriesByStudent(organizationId: string, studentId: string): Promise<any[]> {
    const org = new Types.ObjectId(organizationId);
    return await HifzEntry.find({ organizationId: org, studentId }).sort({ date: -1, createdAt: -1 });
  }

  async createHifzEntry(organizationId: string, insertHifzEntry: InsertHifzEntry): Promise<any> {
    const org = new Types.ObjectId(organizationId);
    const hifzEntry = new HifzEntry({ ...insertHifzEntry, organizationId: org });
    return await hifzEntry.save();
  }

  async checkDuplicateEntry(organizationId: string, studentId: string, date: string, taskType: string): Promise<boolean> {
    const org = new Types.ObjectId(organizationId);
    const existingEntry = await HifzEntry.findOne({ organizationId: org, studentId, date, taskType });
    return !!existingEntry;
  }

  async getParaData(): Promise<any[]> {
    return await ParaData.find().sort({ paraNumber: 1 });
  }

  async getParaDataByNumber(paraNumber: number): Promise<any | undefined> {
    return await ParaData.findOne({ paraNumber });
  }

  async createParaData(insertParaData: InsertParaData): Promise<any> {
    const paraData = new ParaData(insertParaData);
    return await paraData.save();
  }
}

export const storage = new MongoStorage();
