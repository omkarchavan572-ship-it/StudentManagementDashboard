const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_management_db';
    
    // Set connection options
    mongoose.set('strictQuery', false);
    
    // Attempt standard connection with 3000ms timeout
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 3000
    });
    
    console.log(`MongoDB Connected (Primary): ${conn.connection.host}`);
  } catch (error) {
    console.log(`Primary MongoDB Connection failed: ${error.message}`);
    console.log(`Attempting in-memory MongoDB Server fallback...`);
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
    } catch (memError) {
      console.error(`In-Memory MongoDB connection failed: ${memError.message}`);
      process.exit(1);
    }
  }

  // Load persistent snapshot if available
  const { loadStore } = require('../utils/persistence');
  await loadStore();
};

module.exports = connectDB;

