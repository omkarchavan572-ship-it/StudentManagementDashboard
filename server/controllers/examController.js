const asyncHandler = require('express-async-handler');
const ExamRecord = require('../models/ExamRecord');
const Student = require('../models/Student');

// @desc    Get all exam records for a student
// @route   GET /api/exams/student/:studentId
// @access  Private
const getStudentExams = asyncHandler(async (req, res) => {
  const exams = await ExamRecord.find({ student: req.params.studentId }).sort({ examDate: -1 });
  res.json(exams);
});

// @desc    Add a new exam record for a student
// @route   POST /api/exams/student/:studentId
// @access  Private
const addExamRecord = asyncHandler(async (req, res) => {
  const { examName, subject, scoreObtained, totalMarks, grade, passStatus, examDate, remarks } = req.body;

  const student = await Student.findById(req.params.studentId);
  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  if (!examName || !subject || scoreObtained === undefined) {
    res.status(400);
    throw new Error('Please fill in exam title, subject, and score');
  }

  const marks = Number(scoreObtained);
  const total = Number(totalMarks) || 100;
  const percentage = (marks / total) * 100;

  // Auto-calculate grade and passStatus if not provided
  let calculatedGrade = grade;
  if (!calculatedGrade) {
    if (percentage >= 90) calculatedGrade = 'A+';
    else if (percentage >= 80) calculatedGrade = 'A';
    else if (percentage >= 70) calculatedGrade = 'B+';
    else if (percentage >= 60) calculatedGrade = 'B';
    else if (percentage >= 50) calculatedGrade = 'C';
    else calculatedGrade = 'F';
  }

  const calculatedPassStatus = passStatus || (percentage >= 50 ? 'Pass' : 'Fail');

  const examRecord = await ExamRecord.create({
    student: student._id,
    examName,
    subject,
    scoreObtained: marks,
    totalMarks: total,
    grade: calculatedGrade,
    passStatus: calculatedPassStatus,
    examDate: examDate || Date.now(),
    remarks: remarks || (percentage >= 50 ? 'Good effort' : 'Needs improvement')
  });

  res.status(201).json(examRecord);
});

// @desc    Delete an exam record
// @route   DELETE /api/exams/:id
// @access  Private
const deleteExamRecord = asyncHandler(async (req, res) => {
  const exam = await ExamRecord.findById(req.params.id);

  if (!exam) {
    res.status(404);
    throw new Error('Exam record not found');
  }

  await ExamRecord.deleteOne({ _id: exam._id });
  res.json({ message: 'Exam record deleted successfully', id: req.params.id });
});

module.exports = {
  getStudentExams,
  addExamRecord,
  deleteExamRecord
};
