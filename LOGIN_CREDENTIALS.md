# 🔐 Login Credentials for All User Roles

## 📋 Quick Reference

| **Role** | **Username** | **Password** | **Description** |
|----------|-------------|--------------|-----------------|
| **👑 Super Admin** | `superadmin` | `password123` | Full system access |
| **🏫 Madrasah Admin** | `admin` | `password123` | Organization management |
| **👨‍🏫 Teacher 1** | `teacher1` | `password123` | Ustad Ahmed Hassan |
| **👨‍🏫 Teacher 2** | `teacher2` | `password123` | Ustadah Fatima Ali |
| **👨‍🏫 Teacher 3** | `teacher3` | `password123` | Ustad Omar Khan |
| **👨‍🏫 Teacher 4** | `teacher4` | `password123` | Ustad Muhammad Saleem |
| **👨‍👩‍👧‍👦 Parent 1** | `parent1` | `password123` | Abdullah's Father |
| **👨‍👩‍👧‍👦 Parent 2** | `parent2` | `password123` | Fatima's Mother |
| **👨‍👩‍👧‍👦 Parent 3** | `parent3` | `password123` | Omar's Father |
| **👨‍👩‍👧‍👦 Parent 4** | `parent4` | `password123` | Aisha's Mother |
| **👨‍🎓 Student 1** | `student1` | `password123` | Abdullah Farid |
| **👨‍🎓 Student 2** | `student2` | `password123` | Fatima Noor |
| **👨‍🎓 Student 3** | `student3` | `password123` | Omar Hassan |
| **👨‍🎓 Student 4** | `student4` | `password123` | Aisha Khan |

---

## 🎯 Role-Based Access Control

### 👑 Super Admin (`superadmin`)
**Full system access with complete administrative privileges**

#### **Accessible Routes:**
- **Dashboard**: `/admin/dashboard`
- **Organizations**: `/admin/organizations`
- **Users**: `/admin/users`
- **Subscriptions**: `/admin/subscriptions`
- **Analytics**: `/admin/analytics`
- **System Settings**: `/admin/system-settings`

#### **Permissions:**
- Create and manage organizations
- Manage all users across all organizations
- View system-wide analytics
- Configure system settings
- Manage subscription plans

---

### 🏫 Madrasah Admin (`admin`)
**Organization-level administrative access**

#### **Accessible Routes:**
- **Dashboard**: `/admin/dashboard`
- **Students**: `/admin/students`
- **Teachers**: `/admin/teachers`
- **Classes**: `/admin/classes`
- **Attendance**: `/admin/attendance`
- **Reports**: `/admin/reports`
- **Finance**: `/admin/finance`
- **Messaging**: `/admin/messaging`

#### **Permissions:**
- Manage students within the organization
- Manage teachers and staff
- View attendance reports
- Manage class schedules
- Handle financial matters
- Send announcements

---

### 👨‍🏫 Teachers (`teacher1`, `teacher2`, `teacher3`, `teacher4`)
**Classroom and student management access**

#### **Accessible Routes:**
- **Dashboard**: `/teacher/dashboard`
- **Attendance**: `/teacher/attendance`
- **Students**: `/teacher/students`
- **Reports**: `/teacher/reports`
- **Messaging**: `/teacher/messaging`
- **Resources**: `/teacher/resources`
- **Entry Forms**: 
  - `/teacher/hifz` - Hifz progress entry
  - `/teacher/najera` - Najera progress entry
  - `/teacher/noorani` - Noorani Qaida entry
  - `/teacher/khatm` - Khatm completion entry

#### **Permissions:**
- Mark student attendance
- Update student progress
- Generate student reports
- Communicate with parents
- Access teaching resources
- Enter memorization progress

---

### 👨‍👩‍👧‍👦 Parents (`parent1`, `parent2`, `parent3`, `parent4`)
**Child progress monitoring and communication access**

#### **Accessible Routes:**
- **Dashboard**: `/parent/dashboard`
- **Attendance**: `/parent/attendance`
- **Progress**: `/parent/progress`
- **Messaging**: `/parent/messaging`
- **Finance**: `/parent/finance`
- **Notifications**: `/parent/notifications`

#### **Permissions:**
- View child's attendance
- Monitor academic progress
- Communicate with teachers
- View financial statements
- Receive notifications
- Access parent resources

---

### 👨‍🎓 Students (`student1`, `student2`, `student3`, `student4`)
**Personal learning and progress tracking access**

#### **Accessible Routes:**
- **Dashboard**: `/student/dashboard`
- **Lessons**: `/student/lessons`
- **Progress**: `/student/progress`
- **Schedule**: `/student/schedule`
- **Resources**: `/student/resources`
- **Achievements**: `/student/achievements`

#### **Permissions:**
- View personal progress
- Access learning materials
- Check class schedule
- Track achievements
- View lesson plans
- Access student resources

---

## 🎨 User Interface Features

### **Hafizo Brand Integration**
- **Primary Color**: Deep Green (`#1E6B3A`)
- **Secondary Color**: Gold (`#D4AF37`)
- **Responsive Design**: Works on desktop and mobile
- **Role-Based Navigation**: Dynamic menus based on user role

### **Navigation Features**
- **Desktop**: Top navigation bar with role-specific menu
- **Mobile**: Bottom navigation bar for easy access
- **Quick Actions**: Role-specific action buttons
- **User Menu**: Profile dropdown with role display

---

## 🔧 Technical Details

### **Authentication System**
- **Session-based**: Uses Express sessions
- **Password Hashing**: bcrypt with salt rounds
- **Role Management**: Membership-based multi-tenant system
- **Organization Context**: Users can belong to multiple organizations

### **Database Schema**
- **Users**: Core user information
- **Memberships**: User-organization-role relationships
- **Organizations**: Multi-tenant support
- **Students**: Student-specific data
- **Progress Tracking**: Hifz, Najera, Noorani, Khatm entries

### **API Endpoints**
- **Authentication**: `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- **Organization**: `/api/organization`, `/api/organizations`
- **Role-based**: Protected routes with role verification

---

## 🚀 Getting Started

### **1. Start the Application**
```bash
npm run dev
```

### **2. Access the Application**
- **URL**: `http://localhost:4000`
- **Default Organization**: "Default Madrasa"

### **3. Login with Any Role**
Use any of the credentials above to test different user experiences.

### **4. Test Role-Based Access**
- Try accessing different routes with different roles
- Verify that access control works properly
- Test the responsive navigation

---

## 📝 Notes

- **All passwords are**: `password123`
- **Organization**: All users belong to "Default Madrasa"
- **Session Timeout**: 24 hours
- **Multi-Tenant Ready**: System supports multiple organizations
- **Role Persistence**: Roles are stored in membership records

---

## 🔒 Security Considerations

- **Production**: Change default passwords before deployment
- **Environment Variables**: Set proper session secrets
- **HTTPS**: Enable in production environment
- **Rate Limiting**: Implement for login endpoints
- **Password Policy**: Enforce strong password requirements

---

*Last Updated: December 2024*
*System Version: Quran Memorizer v2.0* 