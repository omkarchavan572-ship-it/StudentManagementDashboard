// Utility to keep user created / modified students and exams in localStorage
// so they persist across logouts and server restarts on stateless deployments.

const STORAGE_KEYS = {
  CUSTOM_STUDENTS: 'edu_custom_students_v1',
  DELETED_STUDENT_IDS: 'edu_deleted_student_ids_v1',
  CUSTOM_EXAMS: 'edu_custom_exams_v1',
  DELETED_EXAM_IDS: 'edu_deleted_exam_ids_v1'
};

export const getCustomStudents = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_STUDENTS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveCustomStudent = (student) => {
  try {
    if (!student || !student._id) return;
    const current = getCustomStudents();
    const idx = current.findIndex((s) => s._id === student._id || (s.rollNo && s.rollNo === student.rollNo));
    if (idx >= 0) {
      current[idx] = { ...current[idx], ...student };
    } else {
      current.unshift(student);
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOM_STUDENTS, JSON.stringify(current));
  } catch (e) {
    console.error('Cache save error:', e);
  }
};

export const removeCustomStudent = (studentId) => {
  try {
    let current = getCustomStudents();
    current = current.filter((s) => s._id !== studentId);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_STUDENTS, JSON.stringify(current));

    const deleted = getDeletedStudentIds();
    if (!deleted.includes(studentId)) {
      deleted.push(studentId);
      localStorage.setItem(STORAGE_KEYS.DELETED_STUDENT_IDS, JSON.stringify(deleted));
    }
  } catch (e) {}
};

export const getDeletedStudentIds = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DELETED_STUDENT_IDS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const mergeStudentsWithCache = (serverStudents) => {
  const deletedIds = getDeletedStudentIds();
  const customStudents = getCustomStudents();

  let result = (serverStudents || []).filter((s) => !deletedIds.includes(s._id));

  customStudents.forEach((cs) => {
    if (deletedIds.includes(cs._id)) return;
    const existingIndex = result.findIndex((s) => s._id === cs._id || (s.rollNo && s.rollNo === cs.rollNo));
    if (existingIndex >= 0) {
      result[existingIndex] = { ...result[existingIndex], ...cs };
    } else {
      result.unshift(cs);
    }
  });

  return result;
};

// Exam cache helpers
export const getCustomExams = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_EXAMS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveCustomExam = (exam) => {
  try {
    if (!exam || !exam._id) return;
    const current = getCustomExams();
    const idx = current.findIndex((e) => e._id === exam._id);
    if (idx >= 0) {
      current[idx] = { ...current[idx], ...exam };
    } else {
      current.unshift(exam);
    }
    localStorage.setItem(STORAGE_KEYS.CUSTOM_EXAMS, JSON.stringify(current));
  } catch (e) {}
};

export const removeCustomExam = (examId) => {
  try {
    let current = getCustomExams();
    current = current.filter((e) => e._id !== examId);
    localStorage.setItem(STORAGE_KEYS.CUSTOM_EXAMS, JSON.stringify(current));

    const deleted = getDeletedExamIds();
    if (!deleted.includes(examId)) {
      deleted.push(examId);
      localStorage.setItem(STORAGE_KEYS.DELETED_EXAM_IDS, JSON.stringify(deleted));
    }
  } catch (e) {}
};

export const getDeletedExamIds = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DELETED_EXAM_IDS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const mergeExamsWithCache = (studentId, serverExams) => {
  const deletedIds = getDeletedExamIds();
  const customExams = getCustomExams().filter((e) => String(e.student) === String(studentId) || e.student?._id === studentId);

  let result = (serverExams || []).filter((e) => !deletedIds.includes(e._id));

  customExams.forEach((ce) => {
    if (deletedIds.includes(ce._id)) return;
    const existingIndex = result.findIndex((e) => e._id === ce._id);
    if (existingIndex >= 0) {
      result[existingIndex] = { ...result[existingIndex], ...ce };
    } else {
      result.unshift(ce);
    }
  });

  return result;
};

// Dashboard Stats merge helper
export const mergeDashboardWithCache = (serverDashboard) => {
  if (!serverDashboard) return serverDashboard;

  const customStudents = getCustomStudents();
  const deletedStudentIds = getDeletedStudentIds();
  const customExams = getCustomExams();
  const deletedExamIds = getDeletedExamIds();

  // If no cache present, return original
  if (customStudents.length === 0 && deletedStudentIds.length === 0 && customExams.length === 0 && deletedExamIds.length === 0) {
    return serverDashboard;
  }

  const metrics = { ...serverDashboard.metrics };
  const charts = {
    gradeDistribution: (serverDashboard.charts?.gradeDistribution || []).map((g) => ({ ...g })),
    courseDistribution: (serverDashboard.charts?.courseDistribution || []).map((c) => ({ ...c })),
    instituteDistribution: (serverDashboard.charts?.instituteDistribution || []).map((i) => ({ ...i }))
  };
  let recentExams = [...(serverDashboard.recentExams || [])];

  // Process custom added students
  customStudents.forEach((st) => {
    if (deletedStudentIds.includes(st._id)) return;

    // Check if student is newly added (e.g. starts with synth_ or rollNo not in default stats)
    metrics.totalStudents += 1;
    if (st.status === 'Active') metrics.activeStudents += 1;
    else if (st.status === 'Inactive') metrics.inactiveStudents += 1;
    else if (st.status === 'Graduated') metrics.graduatedStudents += 1;

    // Update Course Distribution Chart
    if (st.course) {
      const courseIdx = charts.courseDistribution.findIndex((c) => c.name === st.course);
      if (courseIdx >= 0) {
        charts.courseDistribution[courseIdx].students += 1;
      } else {
        charts.courseDistribution.push({ name: st.course, students: 1 });
      }
    }

    // Update Institute Distribution Chart
    if (st.institute) {
      const instIdx = charts.instituteDistribution.findIndex((i) => i.name === st.institute);
      if (instIdx >= 0) {
        charts.instituteDistribution[instIdx].count += 1;
      } else {
        charts.instituteDistribution.push({ name: st.institute, count: 1 });
      }
    }
  });

  // Process custom added exams
  customExams.forEach((ex) => {
    if (deletedExamIds.includes(ex._id)) return;

    metrics.totalExams += 1;
    if (ex.passStatus === 'Pass') metrics.passedExams += 1;
    else metrics.failedExams += 1;

    // Update Grade Distribution Chart
    if (ex.grade) {
      const gradeIdx = charts.gradeDistribution.findIndex((g) => g.grade === ex.grade);
      if (gradeIdx >= 0) {
        charts.gradeDistribution[gradeIdx].count += 1;
      } else {
        charts.gradeDistribution.push({ grade: ex.grade, count: 1 });
      }
    }

    // Add to recent exams feed
    recentExams.unshift({
      _id: ex._id,
      subject: ex.subject || 'Academic Assessment',
      examName: ex.examName || 'Assessment',
      scoreObtained: ex.scoreObtained,
      totalMarks: ex.totalMarks,
      grade: ex.grade,
      passStatus: ex.passStatus,
      student: { name: 'Custom Student', rollNo: 'STU' }
    });
  });

  // Recalculate pass rate
  if (metrics.totalExams > 0) {
    metrics.overallPassRate = Number(((metrics.passedExams / metrics.totalExams) * 100).toFixed(1));
  }

  return {
    ...serverDashboard,
    metrics,
    charts,
    recentExams: recentExams.slice(0, 5)
  };
};
