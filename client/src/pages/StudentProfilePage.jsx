import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  GraduationCap,
  Building2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Award,
  BookOpen,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
  Edit2,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import api from '../services/api';
import ExamModal from '../components/ExamModal';
import StudentModal from '../components/StudentModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { useAuth } from '../context/AuthContext';

const StudentProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAuth();

  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [deletingExam, setDeletingExam] = useState(null);

  const [isSubmittingExam, setIsSubmittingExam] = useState(false);
  const [isSubmittingStudent, setIsSubmittingStudent] = useState(false);
  const [isDeletingExam, setIsDeletingExam] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/students/${id}`);
      setStudentData(response.data);
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError(err.response?.data?.message || 'Failed to fetch student profile');
      showToast('Error loading student profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleAddExam = async (examFormData) => {
    setIsSubmittingExam(true);
    try {
      await api.post(`/exams/student/${id}`, examFormData);
      showToast('Exam record added successfully', 'success');
      setIsExamModalOpen(false);
      fetchProfile();
    } catch (err) {
      console.error('Add exam error:', err);
      showToast(err.response?.data?.message || 'Error recording exam score', 'error');
    } finally {
      setIsSubmittingExam(false);
    }
  };

  const handleDeleteExam = async () => {
    if (!deletingExam) return;
    setIsDeletingExam(true);
    try {
      await api.delete(`/exams/${deletingExam._id}`);
      showToast('Exam record deleted', 'success');
      setDeletingExam(null);
      fetchProfile();
    } catch (err) {
      console.error('Delete exam error:', err);
      showToast('Error deleting exam record', 'error');
    } finally {
      setIsDeletingExam(false);
    }
  };

  const handleUpdateStudent = async (studentFormData) => {
    setIsSubmittingStudent(true);
    try {
      await api.put(`/students/${id}`, studentFormData);
      showToast('Student profile updated', 'success');
      setIsStudentModalOpen(false);
      fetchProfile();
    } catch (err) {
      console.error('Update student error:', err);
      showToast('Error updating student info', 'error');
    } finally {
      setIsSubmittingStudent(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Loading Student Profile...</p>
        </div>
      </div>
    );
  }

  if (error || !studentData) {
    return (
      <div className="p-8 text-center bg-rose-50 dark:bg-rose-950/40 rounded-3xl border border-rose-200 dark:border-rose-900 my-8">
        <XCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Student Not Found</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{error || 'Invalid student ID'}</p>
        <Link
          to="/students"
          className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-all inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Directory</span>
        </Link>
      </div>
    );
  }

  const { student, examHistory, stats } = studentData;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Inactive':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Graduated':
        return 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border-brand-200 dark:border-brand-800';
      default:
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Back Navigation Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/students"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsStudentModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setIsExamModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white gradient-bg rounded-xl shadow-md shadow-brand-500/20 hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Exam Score</span>
          </button>
        </div>
      </div>

      {/* Main Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={student.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
            alt={student.name}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-brand-100 dark:border-brand-950 shadow-md shadow-brand-500/10"
          />

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {student.name}
              </h1>
              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusBadge(student.status)}`}>
                {student.status}
              </span>
            </div>

            <p className="text-sm font-mono font-bold text-brand-600 dark:text-brand-400">
              Student ID: {student.rollNo}
            </p>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                <GraduationCap className="w-4 h-4 text-brand-500" />
                {student.course}
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-purple-500" />
                {student.institute}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-500" />
                Joined: {new Date(student.joinDate || student.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Mean Score</span>
            <TrendingUp className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {stats.overallPercentage}%
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Calculated across {stats.totalExams} subjects</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pass / Fail Ratio</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {stats.passedExams} / {stats.totalExams}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">{stats.failedExams} Exams Failed</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pass Percentage</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {stats.passRate}%
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Success Rate</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Academic Standing</span>
            <UserCheck className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {stats.overallPercentage >= 75 ? 'Good Standing' : stats.overallPercentage >= 50 ? 'Satisfactory' : 'Needs Support'}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">Evaluation Status</p>
        </div>
      </div>

      {/* Grid: Student Detailed Info & Exam History Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Student Contact & Info Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Contact & Bio Details
          </h3>

          <div className="space-y-3.5 text-xs">
            <div>
              <span className="text-slate-400 font-medium block mb-1">Email Address</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-500" />
                {student.email}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-medium block mb-1">Phone Contact</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-500" />
                {student.phone}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-medium block mb-1">Gender</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                {student.gender || 'Not specified'}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-medium block mb-1">Campus Location</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-500" />
                {student.address || 'Tech University Main Campus'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Exam & Performance History Table */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-purple-500" />
                Exam History & Subject Scores
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comprehensive record of test assessments and grades
              </p>
            </div>

            <button
              onClick={() => setIsExamModalOpen(true)}
              className="px-3 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all inline-flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Score</span>
            </button>
          </div>

          {examHistory.length === 0 ? (
            <div className="py-12 text-center">
              <Award className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No Exam Records Found</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Click "Record Score" to log the student's first examination result.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-3 px-3">Subject & Title</th>
                    <th className="py-3 px-3">Score / Max</th>
                    <th className="py-3 px-3">Grade</th>
                    <th className="py-3 px-3">Pass / Fail</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {examHistory.map((exam) => (
                    <tr key={exam._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-3">
                        <p className="font-bold text-slate-900 dark:text-white">{exam.subject}</p>
                        <p className="text-[11px] text-slate-400">{exam.examName}</p>
                      </td>

                      <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                        {exam.scoreObtained} / {exam.totalMarks}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {((exam.scoreObtained / exam.totalMarks) * 100).toFixed(0)}%
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {exam.grade}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                            exam.passStatus === 'Pass'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                          }`}
                        >
                          {exam.passStatus}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-500">
                        {new Date(exam.examDate).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setDeletingExam(exam)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-800 transition-all"
                          title="Delete Exam Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>

      {/* Modals */}
      <ExamModal
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        onSubmit={handleAddExam}
        isSubmitting={isSubmittingExam}
        studentName={student.name}
      />

      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSubmit={handleUpdateStudent}
        initialData={student}
        isSubmitting={isSubmittingStudent}
      />

      <DeleteConfirmModal
        isOpen={!!deletingExam}
        onClose={() => setDeletingExam(null)}
        onConfirm={handleDeleteExam}
        title="Delete Exam Score?"
        message={`Remove test score for ${deletingExam?.subject} (${deletingExam?.scoreObtained}/${deletingExam?.totalMarks})?`}
        isDeleting={isDeletingExam}
      />

    </div>
  );
};

export default StudentProfilePage;
