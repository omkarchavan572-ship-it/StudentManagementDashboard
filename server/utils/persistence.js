const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const Student = require('../models/Student');
const ExamRecord = require('../models/ExamRecord');

const os = require('os');

const dataDir = process.env.VERCEL ? os.tmpdir() : path.join(__dirname, '../data');
const storeFilePath = path.join(dataDir, 'db_store.json');

// Ensure data directory exists
try {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
} catch (e) {
  console.log('[Persistence] Data directory creation note:', e.message);
}

// Save all database collections to JSON file
const saveStore = async () => {
  try {
    const users = await User.find({}).select('+password').lean();
    const students = await Student.find({}).lean();
    const examRecords = await ExamRecord.find({}).lean();

    const dump = {
      users,
      students,
      examRecords,
      lastSavedAt: new Date().toISOString()
    };

    fs.writeFileSync(storeFilePath, JSON.stringify(dump, null, 2), 'utf-8');
    console.log(`[Persistence] Saved snapshot (${students.length} students, ${users.length} users, ${examRecords.length} exams)`);
  } catch (err) {
    console.error('[Persistence] Error saving store snapshot:', err.message);
  }
};

// Restore database collections from JSON file if present
const loadStore = async () => {
  try {
    if (!fs.existsSync(storeFilePath)) {
      console.log('[Persistence] No existing persistence snapshot found.');
      return false;
    }

    const fileData = fs.readFileSync(storeFilePath, 'utf-8');
    if (!fileData || !fileData.trim()) return false;

    const dump = JSON.parse(fileData);
    if (!dump.users || !dump.students) return false;

    await User.deleteMany({});
    await Student.deleteMany({});
    await ExamRecord.deleteMany({});

    if (dump.users.length > 0) {
      await User.insertMany(dump.users);
    }
    if (dump.students.length > 0) {
      await Student.insertMany(dump.students);
    }
    if (dump.examRecords && dump.examRecords.length > 0) {
      await ExamRecord.insertMany(dump.examRecords);
    }

    console.log(`[Persistence] Restored snapshot: ${dump.students.length} students, ${dump.users.length} users, ${dump.examRecords ? dump.examRecords.length : 0} exam records`);
    return true;
  } catch (err) {
    console.error('[Persistence] Error restoring store snapshot:', err.message);
    return false;
  }
};

const hasStore = () => {
  return fs.existsSync(storeFilePath);
};

module.exports = {
  saveStore,
  loadStore,
  hasStore
};
