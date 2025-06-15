import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHifzEntrySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all students
  app.get("/api/students", async (req, res) => {
    try {
      const students = await storage.getStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  // Search students
  app.get("/api/students/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }
      const students = await storage.searchStudents(query);
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: "Failed to search students" });
    }
  });

  // Get student by ID
  app.get("/api/students/:studentId", async (req, res) => {
    try {
      const student = await storage.getStudentByStudentId(req.params.studentId);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch student" });
    }
  });

  // Get all para data
  app.get("/api/paras", async (req, res) => {
    try {
      const paras = await storage.getParaData();
      res.json(paras);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch para data" });
    }
  });

  // Get para data by number
  app.get("/api/paras/:paraNumber", async (req, res) => {
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
  app.post("/api/hifz-entries", async (req, res) => {
    try {
      const validatedData = insertHifzEntrySchema.parse(req.body);
      
      // Check for duplicate entries
      const isDuplicate = await storage.checkDuplicateEntry(
        validatedData.studentId,
        validatedData.date,
        validatedData.taskType
      );
      
      if (isDuplicate) {
        return res.status(409).json({ 
          error: "Duplicate entry found for this student, date, and task type" 
        });
      }

      const entry = await storage.createHifzEntry(validatedData);
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
  app.get("/api/hifz-entries/student/:studentId", async (req, res) => {
    try {
      const entries = await storage.getHifzEntriesByStudent(req.params.studentId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hifz entries" });
    }
  });

  // Get all hifz entries
  app.get("/api/hifz-entries", async (req, res) => {
    try {
      const entries = await storage.getHifzEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hifz entries" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
