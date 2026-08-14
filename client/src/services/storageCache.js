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
