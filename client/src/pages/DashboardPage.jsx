import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CheckCircle2,
  XCircle,
  Award,
  TrendingUp,
  BarChart3,
  BookOpen,
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  Plus
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';
import api from '../services/api';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { mergeDashboardWithCache } from '../services/storageCache';

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast, darkMode } = useAuth();

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/dashboard/stats');
      const mergedData = mergeDashboardWithCache(response.data);
      setData(mergedData);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
      const fallbackMerged = mergeDashboardWithCache(null);
      if (fallbackMerged) {
        setData(fallbackMerged);
      } else {
        setError('Failed to fetch dashboard statistics from server.');
        showToast('Error connecting to backend server', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading Dashboard Analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-rose-50 dark:bg-rose-950/40 rounded-3xl border border-rose-200 dark:border-rose-900 my-8">
        <XCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Dashboard Load Failed</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{error || 'No data returned'}</p>
        <button
          onClick={fetchStats}
          className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-all inline-flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  const { metrics, charts, topPerformers, recentExams } = data;

  const COLORS = ['#3b62f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-semibold text-xs mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Academic Performance Dashboard</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Institutional Overview
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time analytics for students, examination records, and grade performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="p-2.5 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/students"
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white gradient-bg rounded-xl shadow-md shadow-brand-500/20 hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Students</span>
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={metrics.totalStudents}
          icon={Users}
          badgeText="Enrolled"
          badgeColor="blue"
          subtext={`${metrics.graduatedStudents} Graduated Alum`}
        />
        <StatCard
          title="Active Students"
          value={metrics.activeStudents}
          icon={CheckCircle2}
          badgeText={`${((metrics.activeStudents / (metrics.totalStudents || 1)) * 100).toFixed(0)}%`}
          badgeColor="emerald"
          subtext={`${metrics.inactiveStudents} Inactive / On Leave`}
        />
        <StatCard
          title="Overall Pass Rate"
          value={`${metrics.overallPassRate}%`}
          icon={TrendingUp}
          badgeText="Academic"
          badgeColor="purple"
          subtext={`${metrics.passedExams} of ${metrics.totalExams} Exams Passed`}
        />
        <StatCard
          title="Avg Exam Score"
          value={`${metrics.averagePercentage}%`}
          icon={Award}
          badgeText="Mean Score"
          badgeColor="amber"
          subtext="Calculated across all courses"
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Grade Distribution Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-500" />
                Grade Distribution
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Breakdown of grades achieved across all student examinations
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.gradeDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="grade" stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={12} />
                <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                    borderColor: darkMode ? '#334155' : '#e2e8f0',
                    borderRadius: '12px',
                    color: darkMode ? '#ffffff' : '#0f172a',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="count" fill="#3b62f6" radius={[8, 8, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Course Wise Enrollment Pie Chart */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-purple-500" />
              Course Enrollment
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Share of students enrolled by program
            </p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts.courseDistribution}
                  dataKey="students"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {charts.courseDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                    borderColor: darkMode ? '#334155' : '#e2e8f0',
                    borderRadius: '12px',
                    color: darkMode ? '#ffffff' : '#0f172a'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend list */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 max-h-24 overflow-y-auto">
            {charts.courseDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                  ></span>
                  <span className="text-slate-600 dark:text-slate-300 truncate max-w-[140px]">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900 dark:text-white">{item.students}</span>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Bottom Section: Top Performers & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Performers */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Top Performing Students
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Highest average score across all subjects
              </p>
            </div>
            <Link
              to="/students"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {topPerformers.map((student, idx) => (
              <Link
                key={student._id}
                to={`/students/${student._id}`}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50/50 dark:hover:bg-brand-950/40 border border-slate-200/60 dark:border-slate-700/50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center text-xs font-extrabold text-amber-500">
                    #{idx + 1}
                  </span>
                  <img
                    src={student.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                    alt={student.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {student.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {student.rollNo} • {student.course}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 text-xs font-extrabold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {student.avgScore}%
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{student.examsCount} Exams</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Exam Activity */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                Recent Examination Activity
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Latest test scores logged in system
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {recentExams.map((exam) => (
              <div
                key={exam._id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white ${
                      exam.passStatus === 'Pass' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                  >
                    {exam.grade}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {exam.subject}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {exam.student?.name || 'Student'} ({exam.examName})
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {exam.scoreObtained}/{exam.totalMarks}
                  </span>
                  <span
                    className={`block text-[10px] font-bold ${
                      exam.passStatus === 'Pass' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {exam.passStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DashboardPage;
