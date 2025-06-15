import { students, hifzEntries, paraData, type Student, type InsertStudent, type HifzEntry, type InsertHifzEntry, type ParaData, type InsertParaData } from "@shared/schema";

export interface IStorage {
  // Student operations
  getStudents(): Promise<Student[]>;
  getStudent(id: number): Promise<Student | undefined>;
  getStudentByStudentId(studentId: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  searchStudents(query: string): Promise<Student[]>;

  // Hifz entry operations
  getHifzEntries(): Promise<HifzEntry[]>;
  getHifzEntry(id: number): Promise<HifzEntry | undefined>;
  getHifzEntriesByStudent(studentId: string): Promise<HifzEntry[]>;
  createHifzEntry(entry: InsertHifzEntry): Promise<HifzEntry>;
  checkDuplicateEntry(studentId: string, date: string, taskType: string): Promise<boolean>;

  // Para data operations
  getParaData(): Promise<ParaData[]>;
  getParaDataByNumber(paraNumber: number): Promise<ParaData | undefined>;
  createParaData(paraData: InsertParaData): Promise<ParaData>;
}

export class MemStorage implements IStorage {
  private students: Map<number, Student>;
  private hifzEntries: Map<number, HifzEntry>;
  private paraData: Map<number, ParaData>;
  private currentStudentId: number;
  private currentHifzEntryId: number;
  private currentParaDataId: number;

  constructor() {
    this.students = new Map();
    this.hifzEntries = new Map();
    this.paraData = new Map();
    this.currentStudentId = 1;
    this.currentHifzEntryId = 1;
    this.currentParaDataId = 1;

    // Initialize with sample data
    this.initializeData();
  }

  private async initializeData() {
    // Initialize para data (30 paras with page ranges)
    const paraRanges = [
      { para: 1, start: 1, end: 21 },
      { para: 2, start: 22, end: 41 },
      { para: 3, start: 42, end: 62 },
      { para: 4, start: 63, end: 82 },
      { para: 5, start: 83, end: 102 },
      { para: 6, start: 103, end: 121 },
      { para: 7, start: 122, end: 142 },
      { para: 8, start: 143, end: 162 },
      { para: 9, start: 163, end: 182 },
      { para: 10, start: 183, end: 201 },
      { para: 11, start: 202, end: 221 },
      { para: 12, start: 222, end: 241 },
      { para: 13, start: 242, end: 261 },
      { para: 14, start: 262, end: 281 },
      { para: 15, start: 282, end: 302 },
      { para: 16, start: 303, end: 322 },
      { para: 17, start: 323, end: 342 },
      { para: 18, start: 343, end: 362 },
      { para: 19, start: 363, end: 382 },
      { para: 20, start: 383, end: 402 },
      { para: 21, start: 403, end: 422 },
      { para: 22, start: 423, end: 442 },
      { para: 23, start: 443, end: 462 },
      { para: 24, start: 463, end: 482 },
      { para: 25, start: 483, end: 502 },
      { para: 26, start: 503, end: 522 },
      { para: 27, start: 523, end: 542 },
      { para: 28, start: 543, end: 562 },
      { para: 29, start: 563, end: 582 },
      { para: 30, start: 583, end: 604 },
    ];

    for (const range of paraRanges) {
      const paraData: ParaData = {
        id: this.currentParaDataId++,
        paraNumber: range.para,
        startPage: range.start,
        endPage: range.end,
        totalPages: range.end - range.start + 1,
      };
      this.paraData.set(paraData.id, paraData);
    }

    // Initialize sample students
    const sampleStudents = [
      // Hifz Section Students
      { studentId: 'S102', name: 'Abdullah Farid', section: 'Hifz', teacher: 'Ustad Kareem', currentPara: 15, totalParas: 14 },
      { studentId: 'S104', name: 'Muhammad Yusuf', section: 'Hifz', teacher: 'Ustad Ahmed', currentPara: 8, totalParas: 7 },
      { studentId: 'S107', name: 'Omar Hassan', section: 'Hifz', teacher: 'Ustad Kareem', currentPara: 22, totalParas: 21 },
      { studentId: 'S109', name: 'Ali Rahman', section: 'Hifz', teacher: 'Ustad Ibrahim', currentPara: 5, totalParas: 4 },
      { studentId: 'S112', name: 'Khalid Mahmood', section: 'Hifz', teacher: 'Ustad Ahmed', currentPara: 12, totalParas: 11 },
      { studentId: 'S115', name: 'Hassan Malik', section: 'Hifz', teacher: 'Ustad Ibrahim', currentPara: 18, totalParas: 17 },
      { studentId: 'S118', name: 'Bilal Tariq', section: 'Hifz', teacher: 'Ustad Kareem', currentPara: 3, totalParas: 2 },
      { studentId: 'S120', name: 'Zaid Ahmad', section: 'Hifz', teacher: 'Ustad Ahmed', currentPara: 25, totalParas: 24 },
      
      // Najera Section Students
      { studentId: 'N205', name: 'Fatima Noor', section: 'Najera', teacher: 'Ustad Ali', currentPara: 12, totalParas: 30 },
      { studentId: 'N208', name: 'Aisha Khan', section: 'Najera', teacher: 'Ustad Ali', currentPara: 8, totalParas: 30 },
      { studentId: 'N210', name: 'Maryam Siddiq', section: 'Najera', teacher: 'Ustad Rashid', currentPara: 15, totalParas: 30 },
      { studentId: 'N213', name: 'Khadija Ahmad', section: 'Najera', teacher: 'Ustad Ali', currentPara: 4, totalParas: 30 },
      { studentId: 'N215', name: 'Hafsa Malik', section: 'Najera', teacher: 'Ustad Rashid', currentPara: 20, totalParas: 30 },
      { studentId: 'N218', name: 'Zainab Omar', section: 'Najera', teacher: 'Ustad Ali', currentPara: 9, totalParas: 30 },
      { studentId: 'N220', name: 'Ruqayyah Hassan', section: 'Najera', teacher: 'Ustad Rashid', currentPara: 17, totalParas: 30 },
      { studentId: 'N222', name: 'Safia Ibrahim', section: 'Najera', teacher: 'Ustad Ali', currentPara: 6, totalParas: 30 },
      
      // Noorani Qaida Section Students
      { studentId: 'Q201', name: 'Fatima Zahra', section: 'Noorani Qaida', teacher: 'Ustad Ali', currentPara: 5, totalParas: 30 },
      { studentId: 'Q203', name: 'Ahmed Malik', section: 'Noorani Qaida', teacher: 'Ustad Hassan', currentPara: 3, totalParas: 30 },
      { studentId: 'Q205', name: 'Zara Siddiq', section: 'Noorani Qaida', teacher: 'Ustad Ali', currentPara: 8, totalParas: 30 },
      { studentId: 'Q207', name: 'Omar Tariq', section: 'Noorani Qaida', teacher: 'Ustad Hassan', currentPara: 2, totalParas: 30 },
      { studentId: 'Q209', name: 'Layla Ahmad', section: 'Noorani Qaida', teacher: 'Ustad Ali', currentPara: 12, totalParas: 30 },
      { studentId: 'Q211', name: 'Yusuf Rahman', section: 'Noorani Qaida', teacher: 'Ustad Hassan', currentPara: 6, totalParas: 30 },
      { studentId: 'Q213', name: 'Amina Khan', section: 'Noorani Qaida', teacher: 'Ustad Ali', currentPara: 10, totalParas: 30 },
      { studentId: 'Q215', name: 'Ibrahim Malik', section: 'Noorani Qaida', teacher: 'Ustad Hassan', currentPara: 4, totalParas: 30 },
    ];

    for (const studentData of sampleStudents) {
      const student: Student = {
        id: this.currentStudentId++,
        ...studentData,
      };
      this.students.set(student.id, student);
    }
  }

  async getStudents(): Promise<Student[]> {
    return Array.from(this.students.values());
  }

  async getStudent(id: number): Promise<Student | undefined> {
    return this.students.get(id);
  }

  async getStudentByStudentId(studentId: string): Promise<Student | undefined> {
    return Array.from(this.students.values()).find(
      (student) => student.studentId === studentId,
    );
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = this.currentStudentId++;
    const student: Student = { ...insertStudent, id };
    this.students.set(id, student);
    return student;
  }

  async searchStudents(query: string): Promise<Student[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.students.values()).filter(
      (student) =>
        student.name.toLowerCase().includes(lowercaseQuery) ||
        student.studentId.toLowerCase().includes(lowercaseQuery) ||
        student.teacher.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getHifzEntries(): Promise<HifzEntry[]> {
    return Array.from(this.hifzEntries.values());
  }

  async getHifzEntry(id: number): Promise<HifzEntry | undefined> {
    return this.hifzEntries.get(id);
  }

  async getHifzEntriesByStudent(studentId: string): Promise<HifzEntry[]> {
    return Array.from(this.hifzEntries.values()).filter(
      (entry) => entry.studentId === studentId
    );
  }

  async createHifzEntry(insertHifzEntry: InsertHifzEntry): Promise<HifzEntry> {
    const id = this.currentHifzEntryId++;
    const hifzEntry: HifzEntry = { 
      id,
      studentId: insertHifzEntry.studentId,
      date: insertHifzEntry.date,
      section: insertHifzEntry.section,
      taskType: insertHifzEntry.taskType,
      para: insertHifzEntry.para ?? null,
      fromPage: insertHifzEntry.fromPage ?? null,
      toPage: insertHifzEntry.toPage ?? null,
      pagesRead: insertHifzEntry.pagesRead ?? null,
      parasRevised: Array.isArray(insertHifzEntry.parasRevised) ? insertHifzEntry.parasRevised : null,
      accuracyScore: insertHifzEntry.accuracyScore ?? null,
      remarks: insertHifzEntry.remarks ?? null,
      createdAt: new Date(),
    };
    this.hifzEntries.set(id, hifzEntry);
    return hifzEntry;
  }

  async checkDuplicateEntry(studentId: string, date: string, taskType: string): Promise<boolean> {
    return Array.from(this.hifzEntries.values()).some(
      (entry) => entry.studentId === studentId && entry.date === date && entry.taskType === taskType
    );
  }

  async getParaData(): Promise<ParaData[]> {
    return Array.from(this.paraData.values());
  }

  async getParaDataByNumber(paraNumber: number): Promise<ParaData | undefined> {
    return Array.from(this.paraData.values()).find(
      (para) => para.paraNumber === paraNumber
    );
  }

  async createParaData(insertParaData: InsertParaData): Promise<ParaData> {
    const id = this.currentParaDataId++;
    const paraData: ParaData = { ...insertParaData, id };
    this.paraData.set(id, paraData);
    return paraData;
  }
}

export const storage = new MemStorage();
