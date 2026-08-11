const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const ExamRecord = require('../models/ExamRecord');

// @desc    Get all students with search, filter, sort & pagination
// @route   GET /api/students
// @access  Private
const getStudents = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 10;
  const page = Number(req.query.page) || 1;

  // Build query filter
  const query = {};

  // Search keyword (matches name, email, rollNo, phone, institute, course)
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

  // Filter by status
  if (req.query.status && req.query.status !== 'All') {
    query.status = req.query.status;
  }

  // Filter by course
  if (req.query.course && req.query.course !== 'All') {
    query.course = req.query.course;
  }

  // Filter by institute
  if (req.query.institute && req.query.institute !== 'All') {
    query.institute = req.query.institute;
  }

  // Sorting
  let sortOption = { createdAt: -1 }; // Default: newest first
  if (req.query.sortBy) {
    switch (req.query.sortBy) {
      case 'name_asc':
        sortOption = { name: 1 };
        break;
      case 'name_desc':
        sortOption = { name: -1 };
        break;
      case 'roll_asc':
        sortOption = { rollNo: 1 };
        break;
      case 'roll_desc':
        sortOption = { rollNo: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
  }

  const count = await Student.countDocuments(query);
  const students = await Student.find(query)
    .sort(sortOption)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  // Get unique courses & institutes for frontend filter dropdowns
  const availableCourses = await Student.distinct('course');
  const availableInstitutes = await Student.distinct('institute');

  res.json({
    students,
    page,
    pages: Math.ceil(count / pageSize),
    totalStudents: count,
    availableCourses,
    availableInstitutes
  });
});

// @desc    Get single student profile by ID
// @route   GET /api/students/:id
// @access  Private
const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // Fetch student's exam history
  const examHistory = await ExamRecord.find({ student: student._id }).sort({ examDate: -1 });

  // Calculate statistics
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

  res.json({
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
});

// @desc    Create a new student
// @route   POST /api/students
// @access  Private
const createStudent = asyncHandler(async (req, res) => {
  const { name, email, phone, institute, course, status, rollNo, gender, address, avatarUrl } = req.body;

  // Validation
  if (!name || !email || !phone || !institute || !course) {
    res.status(400);
    throw new Error('Please fill all required student fields (Name, Email, Phone, Institute, Course)');
  }

  // Generate roll number if not provided
  let studentRollNo = rollNo;
  if (!studentRollNo) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    studentRollNo = `STU-2026-${randomNum}`;
  }

  // Check if roll number or email already exists
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

  res.status(201).json(student);
});

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const { name, email, phone, institute, course, status, rollNo, gender, address, avatarUrl } = req.body;

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
  res.json(updatedStudent);
});

// @desc    Delete a student & associated exams
// @route   DELETE /api/students/:id
// @access  Private
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // Remove all exam records belonging to this student
  await ExamRecord.deleteMany({ student: student._id });
  
  // Delete student
  await Student.deleteOne({ _id: student._id });

  res.json({ message: 'Student and associated academic records deleted successfully', id: req.params.id });
});

module.exports = {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};
