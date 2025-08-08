import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/quran-memorizer";

export async function connectDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully");
    
    // Handle connection events
    mongoose.connection.on("error", (error) => {
      console.error("❌ MongoDB connection error:", error);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ MongoDB disconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🔌 MongoDB connection closed through app termination");
      process.exit(0);
    });

  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

export async function disconnectDatabase() {
  try {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  } catch (error) {
    console.error("❌ Error closing MongoDB connection:", error);
  }
}

// Initialize database with sample data if empty
export async function initializeDatabase() {
  try {
    const { Student, ParaData, User, Organization, Membership } = await import("@shared/schema");
    const bcrypt = await import("bcryptjs");
    
    // Ensure a default organization exists
    let org = await Organization.findOne({ name: "Default Madrasa" });
    if (!org) {
      org = await Organization.create({ name: "Default Madrasa", subscriptionStatus: "trialing" });
      console.log("🏫 Created default organization");
    }

    // Check if para data exists
    const paraDataCount = await ParaData.countDocuments();
    if (paraDataCount === 0) {
      console.log("📚 Initializing para data...");
      
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

      const paraDataDocuments = paraRanges.map(range => ({
        paraNumber: range.para,
        startPage: range.start,
        endPage: range.end,
        totalPages: range.end - range.start + 1,
      }));

      await ParaData.insertMany(paraDataDocuments);
      console.log("✅ Para data initialized");
    }

    // Check if students exist
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      console.log("👥 Initializing sample students...");
      
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

      await Student.insertMany(sampleStudents.map(s => ({ ...s, organizationId: org!.id })));
      console.log("✅ Sample students initialized");
    }

    // Seed default admin if none exists
    let admin = await User.findOne({ username: "admin" });
    if (!admin) {
      console.log("🔐 Seeding default admin user (username: admin / password: admin123)");
      const passwordHash = await bcrypt.hash("admin123", 10);
      admin = await User.create({ username: "admin", passwordHash, name: "Administrator", role: "admin" });
    }

    // Ensure admin has membership in default org
    const hasMembership = await Membership.findOne({ userId: admin.id, organizationId: org!.id });
    if (!hasMembership) {
      await Membership.create({ userId: admin.id, organizationId: org!.id, role: "admin" });
      console.log("👤 Linked admin to default organization");
    }

    console.log("🎉 Database initialization completed");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  }
} 