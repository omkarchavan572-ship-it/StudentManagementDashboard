const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_management_db';
    
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 2000
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
    }
  }

  // Load persistent snapshot if available
  try {
    const { loadStore } = require('../utils/persistence');
    await loadStore();
  } catch (e) {
    console.log('[Persistence] Load store note:', e.message);
  }
};

module.exports = connectDB;

