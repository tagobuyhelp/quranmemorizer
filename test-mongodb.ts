// Simple MongoDB connection test
import mongoose from "mongoose";
import { Student, ParaData } from "./shared/schema";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/quran-memorizer";

async function testMongoDB() {
  try {
    console.log("🔌 Testing MongoDB connection...");
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully");
    
    // Test basic operations
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("📚 Available collections:", collections.map(c => c.name));
    
    // Count documents
    const studentCount = await Student.countDocuments();
    const paraCount = await ParaData.countDocuments();
    
    console.log(`👥 Students in database: ${studentCount}`);
    console.log(`📖 Paras in database: ${paraCount}`);
    
    // Test a sample query
    const sampleStudent = await Student.findOne();
    if (sampleStudent) {
      console.log(`📝 Sample student: ${sampleStudent.name} (${sampleStudent.studentId})`);
    }
    
    // Disconnect
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    
    console.log("🎉 MongoDB test completed successfully!");
    
  } catch (error) {
    console.error("❌ MongoDB test failed:", error);
    process.exit(1);
  }
}

testMongoDB(); 