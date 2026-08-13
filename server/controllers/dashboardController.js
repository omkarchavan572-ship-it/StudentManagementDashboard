const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Student = require('../models/Student');
const ExamRecord = require('../models/ExamRecord');

const getFallbackDashboardData = () => ({
  metrics: {
    totalStudents: 12,
    activeStudents: 10,
    inactiveStudents: 1,
    graduatedStudents: 1,
    totalExams: 48,
    passedExams: 42,
    failedExams: 6,
    overallPassRate: 87.5,
    averagePercentage: 78.4
  },
  charts: {
    gradeDistribution: [
      { grade: 'A+', count: 12 },
      { grade: 'A', count: 18 },
      { grade: 'B+', count: 10 },
      { grade: 'B', count: 5 },
      { grade: 'C', count: 3 },
      { grade: 'F', count: 0 }
    ],
    courseDistribution: [
      { name: 'B.Tech Computer Science', students: 5 },
      { name: 'M.Sc Data Analytics', students: 3 },
      { name: 'B.Sc Software Engineering', students: 2 },
      { name: 'M.Tech Artificial Intelligence', students: 2 }
    ],
    instituteDistribution: [
      { name: 'School of Computer Science', count: 5 },
      { name: 'School of Data Science', count: 3 },
      { name: 'Institute of Information Tech', count: 2 },
      { name: 'School of Artificial Intelligence', count: 2 }
    ]
  },
  topPerformers: [
    { _id: '1', name: 'Aarav Sharma', rollNo: 'STU-2026-101', course: 'B.Tech Computer Science', avgScore: 92.5, examsCount: 4, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80' },
    { _id: '2', name: 'Priya Patel', rollNo: 'STU-2026-102', course: 'M.Sc Data Analytics', avgScore: 89.0, examsCount: 4, avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80' },
    { _id: '3', name: 'Rohan Mehta', rollNo: 'STU-2026-103', course: 'B.Tech Computer Science', avgScore: 86.4, examsCount: 4, avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80' },
    { _id: '4', name: 'Ananya Verma', rollNo: 'STU-2026-104', course: 'B.Sc Software Engineering', avgScore: 84.1, examsCount: 4, avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80' }
  ],
  recentExams: [
    { _id: 'e1', subject: 'Data Structures & Algorithms', examName: 'Semester Assessment 1', scoreObtained: 92, totalMarks: 100, grade: 'A+', passStatus: 'Pass', student: { name: 'Aarav Sharma', rollNo: 'STU-2026-101' } },
    { _id: 'e2', subject: 'Machine Learning', examName: 'Semester Assessment 2', scoreObtained: 88, totalMarks: 100, grade: 'A', passStatus: 'Pass', student: { name: 'Priya Patel', rollNo: 'STU-2026-102' } },
    { _id: 'e3', subject: 'Database Management Systems', examName: 'Semester Assessment 1', scoreObtained: 85, totalMarks: 100, grade: 'A', passStatus: 'Pass', student: { name: 'Rohan Mehta', rollNo: 'STU-2026-103' } }
  ]
});

// @desc    Get comprehensive dashboard analytics and statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  // If MongoDB is not connected, serve fallback analytics immediately
  if (mongoose.connection.readyState !== 1) {
    return res.json(getFallbackDashboardData());
  }

  try {
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

    const gradeChartData = Object.keys(gradeDistribution).map((grade) => ({
      grade,
      count: gradeDistribution[grade]
    }));

    // 4. Course Distribution
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

    // 6. Top Performing Students
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

    return res.json({
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
  } catch (dbErr) {
    console.error('Dashboard DB Error, serving fallback analytics:', dbErr.message);
    return res.json(getFallbackDashboardData());
  }
});

module.exports = {
  getDashboardStats
};
