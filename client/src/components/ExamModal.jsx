import React, { useState } from 'react';
import { X, Award, AlertCircle } from 'lucide-react';

const ExamModal = ({ isOpen, onClose, onSubmit, isSubmitting = false, studentName = '' }) => {
  const [formData, setFormData] = useState({
    examName: 'Final Semester Assessment',
    subject: 'Computer Networks',
    scoreObtained: 85,
    totalMarks: 100,
    remarks: 'Strong analytical skills demonstrated'
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.examName.trim()) errs.examName = 'Exam title is required';
    if (!formData.subject.trim()) errs.subject = 'Subject name is required';
    if (formData.scoreObtained === '' || Number(formData.scoreObtained) < 0) {
      errs.scoreObtained = 'Valid marks obtained required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        scoreObtained: Number(formData.scoreObtained),
        totalMarks: Number(formData.totalMarks) || 100
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500 text-white shadow-md shadow-purple-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Add Exam Record
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Record subject score for <span className="font-semibold text-brand-600 dark:text-brand-400">{studentName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Exam Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Exam Title *
            </label>
            <input
              type="text"
              name="examName"
              value={formData.examName}
              onChange={handleChange}
              placeholder="e.g. Midterm 2026, Final Semester Exam"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            {errors.examName && <p className="mt-1 text-[11px] text-rose-500">{errors.examName}</p>}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Subject Name *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="e.g. Data Structures & Algorithms, Machine Learning"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
            {errors.subject && <p className="mt-1 text-[11px] text-rose-500">{errors.subject}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Score Obtained */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Marks Obtained *
              </label>
              <input
                type="number"
                name="scoreObtained"
                min="0"
                max="100"
                value={formData.scoreObtained}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
              {errors.scoreObtained && <p className="mt-1 text-[11px] text-rose-500">{errors.scoreObtained}</p>}
            </div>

            {/* Total Marks */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Total Maximum Marks
              </label>
              <input
                type="number"
                name="totalMarks"
                min="1"
                value={formData.totalMarks}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Evaluator Remarks / Notes
            </label>
            <input
              type="text"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="e.g. Excellent performance, Good effort"
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-500/20 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Recording...' : 'Add Exam Score'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ExamModal;
