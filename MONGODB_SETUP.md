# MongoDB Setup Guide

## Prerequisites

1. **MongoDB Installation**
   - Install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud hosted)

2. **Node.js Dependencies**
   - MongoDB and Mongoose are already installed in the project

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/quran-memorizer

# For MongoDB Atlas (cloud hosted)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/quran-memorizer?retryWrites=true&w=majority

# For local MongoDB with authentication
# MONGODB_URI=mongodb://username:password@localhost:27017/quran-memorizer

# Environment
NODE_ENV=development
```

## Database Setup

### Local MongoDB

1. **Start MongoDB Service**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

2. **Create Database**
   - MongoDB will automatically create the database when you first connect
   - Database name: `quran-memorizer`

### MongoDB Atlas (Cloud)

1. **Create Atlas Account**
   - Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Create a free account

2. **Create Cluster**
   - Choose "Shared" (free tier)
   - Select cloud provider and region
   - Create cluster

3. **Database Access**
   - Create a database user with read/write permissions
   - Note down username and password

4. **Network Access**
   - Add your IP address or `0.0.0.0/0` for all IPs

5. **Connection String**
   - Get the connection string from Atlas
   - Replace `<username>`, `<password>`, and `<cluster>` with your values

## Running the Application

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   - Create `.env` file with your MongoDB URI

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Database Initialization**
   - The application will automatically:
     - Connect to MongoDB
     - Create collections if they don't exist
     - Initialize sample data (students and para data)

## Database Collections

The application creates three collections:

1. **students** - Student information and progress
2. **hifzentries** - Daily hifz entries and progress tracking
3. **paradata** - Quran para information (pages, ranges)

## Sample Data

The application automatically initializes:

- **30 Paras** with page ranges (1-604 pages)
- **24 Sample Students** across different sections:
  - Hifz Section (8 students)
  - Najera Section (8 students)
  - Noorani Qaida Section (8 students)

## Troubleshooting

### Connection Issues

1. **Check MongoDB Service**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl status mongod
   ```

2. **Check Connection String**
   - Verify MONGODB_URI in `.env` file
   - Test connection with MongoDB Compass

3. **Firewall Issues**
   - Ensure MongoDB port (27017) is open
   - For Atlas, check network access settings

### Data Issues

1. **Reset Database**
   ```bash
   # Connect to MongoDB shell
   mongosh
   
   # Switch to database
   use quran-memorizer
   
   # Drop collections
   db.students.drop()
   db.hifzentries.drop()
   db.paradata.drop()
   ```

2. **Reinitialize Data**
   - Restart the application
   - Sample data will be recreated automatically

## Production Deployment

1. **Use MongoDB Atlas** for production
2. **Set Strong Passwords** for database users
3. **Configure Network Access** properly
4. **Use Environment Variables** for sensitive data
5. **Enable MongoDB Monitoring** and alerts

## Migration from In-Memory Storage

The application has been migrated from in-memory storage to MongoDB:

- ✅ **Schema Migration** - Updated to use Mongoose models
- ✅ **Storage Layer** - Replaced MemStorage with MongoStorage
- ✅ **Database Connection** - Added MongoDB connection handling
- ✅ **Sample Data** - Automatic initialization of sample data
- ✅ **Error Handling** - Proper error handling for database operations 