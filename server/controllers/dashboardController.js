const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const ExamRecord = require('../models/ExamRecord');

// @desc    Get comprehensive dashboard analytics and statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  // 1. Student Counts
  const totalStudents = await Student.countDocuments();
  const activeStudents = await Student.countDocuments({ status: 'Active' });
  const inactiveStudents = await Student.countDocuments({ status: 'Inactive' });
  const graduatedStudents = await Student.countDocuments({ status: 'Graduated' });

  // 2. Exam Statistics
  const totalExams = await ExamRecord.countDocuments();
  const passedExams = await ExamRecord.countDocuments({ passStatus: 'Pass' });
  const failedExams = await ExamRecord.countDocuments({ passStatus: 'Fail' });
  const overallPassRate = totalExams > 0 ? ((passedExams / totalExams) * 100).toFixed(1) : 0;

  // Average Score calculation using aggregation
  const avgScoreAgg = await ExamRecord.aggregate([
    {
      $project: {
        percentage: { $multiply: [{ $divide: ['$scoreObtained', '$totalMarks'] }, 100] }
      }
    },
    {
      $group: {
        _id: null,
        avgPercentage: { $avg: '$percentage' }
      }
    }
  ]);
  const averagePercentage = avgScoreAgg.length > 0 ? Number(avgScoreAgg[0].avgPercentage.toFixed(1)) : 0;

  // 3. Grade Distribution Breakdown
  const gradeAgg = await ExamRecord.aggregate([
    {
      $group: {
        _id: '$grade',
        count: { $sum: 1 }
      }
    }
  ]);
  const gradeDistribution = {
    'A+': 0,
    'A': 0,
    'B+': 0,
    'B': 0,
    'C': 0,
    'F': 0
  };
  gradeAgg.forEach((item) => {
    if (gradeDistribution[item._id] !== undefined) {
      gradeDistribution[item._id] = item.count;
    }
  });

  // Format grade distribution for charts
  const gradeChartData = Object.keys(gradeDistribution).map((grade) => ({
    grade,
    count: gradeDistribution[grade]
  }));

  // 4. Course Distribution (Students per Course)
  const courseAgg = await Student.aggregate([
    {
      $group: {
        _id: '$course',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);
  const courseDistribution = courseAgg.map((c) => ({
    name: c._id || 'Unassigned',
    students: c.count
  }));

  // 5. Institute Distribution
  const instituteAgg = await Student.aggregate([
    {
      $group: {
        _id: '$institute',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);
  const instituteDistribution = instituteAgg.map((i) => ({
    name: i._id || 'Unknown',
    count: i.count
  }));

  // 6. Top Performing Students (by avg percentage across exams)
  const topPerformersAgg = await ExamRecord.aggregate([
    {
      $project: {
        student: 1,
        percentage: { $multiply: [{ $divide: ['$scoreObtained', '$totalMarks'] }, 100] }
      }
    },
    {
      $group: {
        _id: '$student',
        avgScore: { $avg: '$percentage' },
        examsCount: { $sum: 1 }
      }
    },
    { $sort: { avgScore: -1 } },
    { $limit: 5 }
  ]);

  // Populate student details for top performers
  const topPerformerIds = topPerformersAgg.map((tp) => tp._id);
  const topStudentsList = await Student.find({ _id: { $in: topPerformerIds } });

  const topPerformers = topPerformersAgg
    .map((tp) => {
      const studentObj = topStudentsList.find((s) => s._id.toString() === tp._id.toString());
      if (!studentObj) return null;
      return {
        _id: studentObj._id,
        name: studentObj.name,
        rollNo: studentObj.rollNo,
        course: studentObj.course,
        institute: studentObj.institute,
        avatarUrl: studentObj.avatarUrl,
        avgScore: Number(tp.avgScore.toFixed(1)),
        examsCount: tp.examsCount
      };
    })
    .filter(Boolean);

  // 7. Recent Exam Activity Feed
  const recentExams = await ExamRecord.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('student', 'name rollNo avatarUrl course');

  res.json({
    metrics: {
      totalStudents,
      activeStudents,
      inactiveStudents,
      graduatedStudents,
      totalExams,
      passedExams,
      failedExams,
      overallPassRate: Number(overallPassRate),
      averagePercentage
    },
    charts: {
      gradeDistribution: gradeChartData,
      courseDistribution,
      instituteDistribution
    },
    topPerformers,
    recentExams
  });
});

module.exports = {
  getDashboardStats
};
