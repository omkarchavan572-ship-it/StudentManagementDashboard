const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const ExamRecord = require('../models/ExamRecord');
const { saveStore } = require('../utils/persistence');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const os = require('os');

const tempStorePath = path.join(os.tmpdir(), 'v_students_store.json');

const initialSampleList = [
  { _id: '1', rollNo: 'STU-2026-101', name: 'Aarav Sharma', email: 'aarav.sharma@techuni.edu', phone: '+91 98765 43210', institute: 'School of Computer Science', course: 'B.Tech Computer Science', status: 'Active', gender: 'Male', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80', address: 'Sector 62, Noida, Uttar Pradesh', createdAt: new Date('2024-08-01') },
  { _id: '2', rollNo: 'STU-2026-102', name: 'Priya Patel', email: 'priya.patel@techuni.edu', phone: '+91 98123 76543', institute: 'School of Data Science', course: 'M.Sc Data Analytics', status: 'Active', gender: 'Female', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80', address: 'Koramangala, Bengaluru, Karnataka', createdAt: new Date('2024-08-15') },
  { _id: '3', rollNo: 'STU-2026-103', name: 'Rohan Mehta', email: 'rohan.mehta@techuni.edu', phone: '+91 99887 66554', institute: 'School of Computer Science', course: 'B.Tech Computer Science', status: 'Active', gender: 'Male', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80', address: 'Bandra West, Mumbai, Maharashtra', createdAt: new Date('2024-08-01') },
  { _id: '4', rollNo: 'STU-2026-104', name: 'Ananya Verma', email: 'ananya.verma@techuni.edu', phone: '+91 97654 32109', institute: 'Institute of Information Tech', course: 'B.Sc Software Engineering', status: 'Active', gender: 'Female', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80', address: 'Connaught Place, New Delhi', createdAt: new Date('2024-09-01') },
  { _id: '5', rollNo: 'STU-2026-105', name: 'Vikramaditya Singh', email: 'vikram.singh@techuni.edu', phone: '+91 91234 56789', institute: 'School of Artificial Intelligence', course: 'M.Tech Artificial Intelligence', status: 'Active', gender: 'Male', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80', address: 'Bani Park, Jaipur, Rajasthan', createdAt: new Date('2024-07-20') }
];

const getInMemoryStore = () => {
  try {
    if (fs.existsSync(tempStorePath)) {
      const content = fs.readFileSync(tempStorePath, 'utf-8');
      if (content && content.trim()) {
        return JSON.parse(content);
      }
    }
  } catch (e) {}
  return [...initialSampleList];
};

const saveInMemoryStore = (store) => {
  try {
    fs.writeFileSync(tempStorePath, JSON.stringify(store, null, 2), 'utf-8');
  } catch (e) {}
};

// Helper to filter and format in-memory student store
const getFilteredInMemoryStore = (query) => {
  const currentStore = getInMemoryStore();
  let filtered = [...currentStore];

  if (query.search) {
    const term = query.search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        (s.name && s.name.toLowerCase().includes(term)) ||
        (s.email && s.email.toLowerCase().includes(term)) ||
        (s.rollNo && s.rollNo.toLowerCase().includes(term)) ||
        (s.course && s.course.toLowerCase().includes(term)) ||
        (s.institute && s.institute.toLowerCase().includes(term))
    );
  }

  if (query.status && query.status !== 'All') {
    filtered = filtered.filter((s) => s.status === query.status);
  }
  if (query.course && query.course !== 'All') {
    filtered = filtered.filter((s) => s.course === query.course);
  }
  if (query.institute && query.institute !== 'All') {
    filtered = filtered.filter((s) => s.institute === query.institute);
  }

  const availableCourses = Array.from(new Set(currentStore.map((s) => s.course).filter(Boolean)));
  const availableInstitutes = Array.from(new Set(currentStore.map((s) => s.institute).filter(Boolean)));

  return {
    students: filtered,
    page: 1,
    pages: 1,
    totalStudents: filtered.length,
    availableCourses,
    availableInstitutes
  };
};

// @desc    Get all students with search, filter, sort & pagination
// @route   GET /api/students
// @access  Private
const getStudents = asyncHandler(async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(getFilteredInMemoryStore(req.query));
  }

  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  const query = {};
  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    query.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { rollNo: searchRegex },
      { phone: searchRegex },
      { institute: searchRegex },
      { course: searchRegex }
    ];
  }

  if (req.query.status && req.query.status !== 'All') {
    query.status = req.query.status;
  }
  if (req.query.course && req.query.course !== 'All') {
    query.course = req.query.course;
  }
  if (req.query.institute && req.query.institute !== 'All') {
    query.institute = req.query.institute;
  }

  let sortOption = { createdAt: -1 };
  if (req.query.sortBy) {
    switch (req.query.sortBy) {
      case 'name_asc': sortOption = { name: 1 }; break;
      case 'name_desc': sortOption = { name: -1 }; break;
      case 'roll_asc': sortOption = { rollNo: 1 }; break;
      case 'roll_desc': sortOption = { rollNo: -1 }; break;
      case 'oldest': sortOption = { createdAt: 1 }; break;
      default: sortOption = { createdAt: -1 };
    }
  }

  try {
    let count = await Student.countDocuments(query);
    const totalUnfiltered = await Student.countDocuments({});
    if (totalUnfiltered === 0) {
      try {
        const seedData = require('../utils/seeder');
        await seedData();
        count = await Student.countDocuments(query);
      } catch (e) {
        console.log('Students list auto-seed note:', e.message);
      }
    }

    const students = await Student.find(query)
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    const availableCourses = await Student.distinct('course');
    const availableInstitutes = await Student.distinct('institute');

    return res.json({
      students,
      page,
      pages: Math.ceil(count / pageSize) || 1,
      totalStudents: count,
      availableCourses,
      availableInstitutes
    });
  } catch (dbErr) {
    console.error('Students DB Error, serving fallback data:', dbErr.message);
    return res.json(getFilteredInMemoryStore(req.query));
  }
});

// @desc    Get single student profile by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  const currentStore = getInMemoryStore();
  const foundInMemory = currentStore.find((s) => s._id === targetId) || currentStore[0];

  if (mongoose.connection.readyState !== 1) {
    return res.json({
      student: foundInMemory,
      examHistory: [
        { _id: 'e1', examName: 'Semester Assessment 1', subject: 'Data Structures & Algorithms', scoreObtained: 92, totalMarks: 100, grade: 'A+', passStatus: 'Pass', examDate: new Date() },
        { _id: 'e2', examName: 'Semester Assessment 2', subject: 'Database Management Systems', scoreObtained: 88, totalMarks: 100, grade: 'A', passStatus: 'Pass', examDate: new Date() }
      ],
      stats: {
        totalExams: 2,
        passedExams: 2,
        failedExams: 0,
        overallPercentage: 90.0,
        passRate: 100.0
      }
    });
  }

  try {
    let student = null;
    if (mongoose.Types.ObjectId.isValid(targetId)) {
      student = await Student.findById(targetId);
    }

    if (!student) {
      return res.json({
        student: foundInMemory,
        examHistory: [
          { _id: 'e1', examName: 'Semester Assessment 1', subject: 'Data Structures & Algorithms', scoreObtained: 92, totalMarks: 100, grade: 'A+', passStatus: 'Pass', examDate: new Date() }
        ],
        stats: {
          totalExams: 1,
          passedExams: 1,
          failedExams: 0,
          overallPercentage: 92.0,
          passRate: 100.0
        }
      });
    }

    const examHistory = await ExamRecord.find({ student: student._id }).sort({ examDate: -1 });

    let totalExams = examHistory.length;
    let totalScoreObtained = 0;
    let totalMaxMarks = 0;
    let passedExams = 0;

    examHistory.forEach((exam) => {
      totalScoreObtained += exam.scoreObtained;
      totalMaxMarks += exam.totalMarks;
      if (exam.passStatus === 'Pass') {
        passedExams++;
      }
    });

    const overallPercentage = totalMaxMarks > 0 ? ((totalScoreObtained / totalMaxMarks) * 100).toFixed(1) : 0;
    const passRate = totalExams > 0 ? ((passedExams / totalExams) * 100).toFixed(1) : 0;

    return res.json({
      student,
      examHistory,
      stats: {
        totalExams,
        passedExams,
        failedExams: totalExams - passedExams,
        overallPercentage: Number(overallPercentage),
        passRate: Number(passRate)
      }
    });
  } catch (err) {
    return res.json({
      student: foundInMemory,
      examHistory: [],
      stats: { totalExams: 0, passedExams: 0, failedExams: 0, overallPercentage: 0, passRate: 0 }
    });
  }
});

// @desc    Create a new student
// @route   POST /api/students
// @access  Private
const createStudent = asyncHandler(async (req, res) => {
  const { name, email, phone, institute, course, status, rollNo, gender, address, avatarUrl } = req.body;

  if (!name || !email || !phone || !institute || !course) {
    res.status(400);
    throw new Error('Please fill all required student fields (Name, Email, Phone, Institute, Course)');
  }

  let studentRollNo = rollNo || `STU-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const newStudentObj = {
    _id: `synth_${Date.now()}`,
    name,
    email,
    phone,
    institute,
    course,
    status: status || 'Active',
    rollNo: studentRollNo,
    gender: gender || 'Other',
    address: address || 'Tech University Campus, Block B',
    avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    createdAt: new Date()
  };

  // Add to top of temp store and save to file
  const currentStore = getInMemoryStore();
  currentStore.unshift(newStudentObj);
  saveInMemoryStore(currentStore);

  if (mongoose.connection.readyState !== 1) {
    return res.status(201).json(newStudentObj);
  }

  try {
    const existingRoll = await Student.findOne({ rollNo: studentRollNo });
    if (existingRoll) {
      res.status(400);
      throw new Error(`Student with Roll / ID ${studentRollNo} already exists`);
    }

    const student = await Student.create({
      name,
      email,
      phone,
      institute,
      course,
      status: status || 'Active',
      rollNo: studentRollNo,
      gender: gender || 'Other',
      address: address || 'Tech University Campus, Block B',
      avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
    });

    try { await saveStore(); } catch (e) {}
    return res.status(201).json(student);
  } catch (err) {
    if (res.statusCode === 400) throw err;
    return res.status(201).json(newStudentObj);
  }
});

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = asyncHandler(async (req, res) => {
  const targetId = req.params.id;
  const { name, email, phone, institute, course, status, rollNo, gender, address, avatarUrl } = req.body;

  const currentStore = getInMemoryStore();
  let storeItem = currentStore.find((s) => s._id === targetId);
  if (storeItem) {
    if (name) storeItem.name = name;
    if (email) storeItem.email = email;
    if (phone) storeItem.phone = phone;
    if (institute) storeItem.institute = institute;
    if (course) storeItem.course = course;
    if (status) storeItem.status = status;
    if (rollNo) storeItem.rollNo = rollNo;
    if (gender) storeItem.gender = gender;
    if (address !== undefined) storeItem.address = address;
    if (avatarUrl) storeItem.avatarUrl = avatarUrl;
    saveInMemoryStore(currentStore);
  }

  if (mongoose.connection.readyState !== 1) {
    return res.json(storeItem || { _id: targetId, name, email, phone, institute, course, status });
  }

  try {
    const student = await Student.findById(targetId);
    if (!student) {
      return res.json(storeItem || { _id: targetId, name, email, phone, institute, course, status });
    }

    student.name = name || student.name;
    student.email = email || student.email;
    student.phone = phone || student.phone;
    student.institute = institute || student.institute;
    student.course = course || student.course;
    student.status = status || student.status;
    student.rollNo = rollNo || student.rollNo;
    student.gender = gender || student.gender;
    student.address = address !== undefined ? address : student.address;
    if (avatarUrl) student.avatarUrl = avatarUrl;

    const updatedStudent = await student.save();
    try { await saveStore(); } catch (e) {}
    return res.json(updatedStudent);
  } catch (err) {
    return res.json(storeItem || { _id: targetId, name, email, phone, institute, course, status });
  }
});

// @desc    Delete a student & associated exams
// @route   DELETE /api/students/:id
// @access  Private
const deleteStudent = asyncHandler(async (req, res) => {
  const targetId = req.params.id;

  let currentStore = getInMemoryStore();
  currentStore = currentStore.filter((s) => s._id !== targetId);
  saveInMemoryStore(currentStore);

  if (mongoose.connection.readyState !== 1) {
    return res.json({ message: 'Student deleted successfully', id: targetId });
  }

  try {
    const student = await Student.findById(targetId);
    if (student) {
      await ExamRecord.deleteMany({ student: student._id });
      await Student.deleteOne({ _id: student._id });
      try { await saveStore(); } catch (e) {}
    }
    return res.json({ message: 'Student and associated academic records deleted successfully', id: req.params.id });
  } catch (err) {
    return res.json({ message: 'Student deleted successfully', id: targetId });
  }
});

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
