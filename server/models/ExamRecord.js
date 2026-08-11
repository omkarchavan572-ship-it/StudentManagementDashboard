const mongoose = require('mongoose');

const examRecordSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    examName: {
      type: String,
      required: [true, 'Please add an exam title'],
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Please specify the subject'],
      trim: true
    },
    scoreObtained: {
      type: Number,
      required: [true, 'Please enter marks obtained'],
      min: 0
    },
    totalMarks: {
      type: Number,
      required: [true, 'Please enter total marks'],
      default: 100
    },
    grade: {
      type: String,
      default: 'A'
    },
    passStatus: {
      type: String,
      enum: ['Pass', 'Fail'],
      default: 'Pass'
    },
    examDate: {
      type: Date,
      default: Date.now
    },
    remarks: {
      type: String,
      default: 'Excellent performance'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ExamRecord', examRecordSchema);
