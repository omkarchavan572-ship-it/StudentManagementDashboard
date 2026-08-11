const express = require('express');
const router = express.Router();
const {
  getStudentExams,
  addExamRecord,
  deleteExamRecord
} = require('../controllers/examController');
const { protect } = require('../middleware/authMiddleware');

router.route('/student/:studentId')
  .get(protect, getStudentExams)
  .post(protect, addExamRecord);

router.route('/:id')
  .delete(protect, deleteExamRecord);

module.exports = router;
