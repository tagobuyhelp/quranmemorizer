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

    // Seed users for all roles
    console.log("🔐 Seeding users for all roles...");
    
    const defaultPassword = "password123";
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    // Super Admin
    let superAdmin = await User.findOne({ username: "superadmin" });
    if (!superAdmin) {
      superAdmin = await User.create({ 
        username: "superadmin", 
        passwordHash, 
        name: "Super Administrator",
        email: "superadmin@hafizo.com",
        isActive: true
      });
      await Membership.create({ 
        userId: superAdmin.id, 
        organizationId: org!.id, 
        role: "super-admin",
        isActive: true
      });
      console.log("👑 Created Super Admin (username: superadmin / password: password123)");
    }

    // Madrasah Admin
    let madrasahAdmin = await User.findOne({ username: "admin" });
    if (!madrasahAdmin) {
      madrasahAdmin = await User.create({ 
        username: "admin", 
        passwordHash, 
        name: "Madrasah Administrator",
        email: "admin@hafizo.com",
        isActive: true
      });
      await Membership.create({ 
        userId: madrasahAdmin.id, 
        organizationId: org!.id, 
        role: "madrasah-admin",
        isActive: true
      });
      console.log("🏫 Created Madrasah Admin (username: admin / password: password123)");
    } else {
      // Check if admin has proper membership
      const adminMembership = await Membership.findOne({ 
        userId: madrasahAdmin.id, 
        organizationId: org!.id 
      });
      
      if (!adminMembership) {
        await Membership.create({ 
          userId: madrasahAdmin.id, 
          organizationId: org!.id, 
          role: "madrasah-admin",
          isActive: true
        });
        console.log("🏫 Updated existing admin with proper membership");
      } else if (adminMembership.role !== "madrasah-admin") {
        // Update existing membership to correct role
        await Membership.findByIdAndUpdate(adminMembership.id, { 
          role: "madrasah-admin",
          isActive: true
        });
        console.log("🏫 Updated existing admin role to madrasah-admin");
      }
    }

    // Teachers
    const teacherUsers = [
      { username: "teacher1", name: "Ustad Ahmed Hassan", email: "ahmed@hafizo.com" },
      { username: "teacher2", name: "Ustadah Fatima Ali", email: "fatima@hafizo.com" },
      { username: "teacher3", name: "Ustad Omar Khan", email: "omar@hafizo.com" },
      { username: "teacher4", name: "Ustad Muhammad Saleem", email: "muhammad@hafizo.com" }
    ];

    for (const teacherData of teacherUsers) {
      let teacher = await User.findOne({ username: teacherData.username });
      if (!teacher) {
        teacher = await User.create({ 
          username: teacherData.username, 
          passwordHash, 
          name: teacherData.name,
          email: teacherData.email,
          isActive: true
        });
        await Membership.create({ 
          userId: teacher.id, 
          organizationId: org!.id, 
          role: "teacher",
          isActive: true
        });
        console.log(`👨‍🏫 Created Teacher ${teacherData.name} (username: ${teacherData.username} / password: password123)`);
      }
    }

    // Parents
    const parentUsers = [
      { username: "parent1", name: "Abdullah's Father", email: "abdullah.parent@hafizo.com" },
      { username: "parent2", name: "Fatima's Mother", email: "fatima.parent@hafizo.com" },
      { username: "parent3", name: "Omar's Father", email: "omar.parent@hafizo.com" },
      { username: "parent4", name: "Aisha's Mother", email: "aisha.parent@hafizo.com" }
    ];

    for (const parentData of parentUsers) {
      let parent = await User.findOne({ username: parentData.username });
      if (!parent) {
        parent = await User.create({ 
          username: parentData.username, 
          passwordHash, 
          name: parentData.name,
          email: parentData.email,
          isActive: true
        });
        await Membership.create({ 
          userId: parent.id, 
          organizationId: org!.id, 
          role: "parent",
          isActive: true
        });
        console.log(`👨‍👩‍👧‍👦 Created Parent ${parentData.name} (username: ${parentData.username} / password: password123)`);
      }
    }

    // Students
    const studentUsers = [
      { username: "student1", name: "Abdullah Farid", email: "abdullah@hafizo.com" },
      { username: "student2", name: "Fatima Noor", email: "fatima.student@hafizo.com" },
      { username: "student3", name: "Omar Hassan", email: "omar.student@hafizo.com" },
      { username: "student4", name: "Aisha Khan", email: "aisha.student@hafizo.com" }
    ];

    for (const studentData of studentUsers) {
      let student = await User.findOne({ username: studentData.username });
      if (!student) {
        student = await User.create({ 
          username: studentData.username, 
          passwordHash, 
          name: studentData.name,
          email: studentData.email,
          isActive: true
        });
        await Membership.create({ 
          userId: student.id, 
          organizationId: org!.id, 
          role: "student",
          isActive: true
        });
        console.log(`👨‍🎓 Created Student ${studentData.name} (username: ${studentData.username} / password: password123)`);
      }
    }

    console.log("🎉 Database initialization completed");
    console.log("\n📋 Login Credentials Summary:");
    console.log("================================");
    console.log("👑 Super Admin: superadmin / password123");
    console.log("🏫 Madrasah Admin: admin / password123");
    console.log("👨‍🏫 Teachers: teacher1, teacher2, teacher3, teacher4 / password123");
    console.log("👨‍👩‍👧‍👦 Parents: parent1, parent2, parent3, parent4 / password123");
    console.log("👨‍🎓 Students: student1, student2, student3, student4 / password123");
    console.log("================================");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  }
} 