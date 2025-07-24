import apiClient from '../apiClient';

// Lấy chi tiết lớp học
export const getClassDetail = (classId) =>
  apiClient.get(`/education/class/detail`, { params: { classId } });

// Lấy danh sách lịch học của lớp
export const getClassScheduleList = (classId) =>
  apiClient.get(`/education/class/schedule/list`, { params: { classId } });

// Lấy danh sách hoạt động theo lịch học
export const getScheduleActivityList = (scheduleId) =>
  apiClient.get(`/education/schedule/activity/list`, { params: { scheduleId } });

// Lấy danh sách năm học
export const getSchoolYears = () =>
  apiClient.get('/admission/years');

// Lấy danh sách syllabus theo khối
export const getSyllabusByGrade = (gradeName) =>
  apiClient.get('/education/syllabus/listByGrade', { params: { gradeName } });

// Lấy danh sách lớp học theo năm học và khối
export const getClassesByYearAndGrade = (year, grade) =>
  apiClient.get('/education/class/listByGradeAndYear', { params: { year, grade } });

// Tạo lớp học mới
export const createClass = (data) =>
  apiClient.post('/education/classes', data);

// Lấy danh sách lesson được assign cho syllabus
export const getLessonsBySyllabus = (syllabusId) =>
  apiClient.get('/education/syllabus/assign/lessons', { params: { id: syllabusId } });

// Xóa lớp học theo ID
export const deleteClass = (classId) =>
  apiClient.delete('/education/class', { params: { classId } });

// Lấy danh sách học sinh chưa gán vào lớp (theo năm học và khối)
export const getAvailableChildren = (year, grade, page = 0, size = 100) =>
  apiClient.get('/education/availableChildren/list', { params: { year, grade, page, size } });

// Lấy danh sách học sinh đã gán vào lớp
export const getAssignedStudentsOfClass = (classId) =>
  apiClient.get('/education/assignedStudentOfClass/list', { params: { classId } });

// Gán học sinh vào lớp
export const assignStudentsToClass = (classId, studentIds) =>
  apiClient.put('/education/availableStudents/assign', { classId, studentIds });

// Bỏ gán học sinh khỏi lớp
export const unassignStudentsFromClass = (classId, studentIds) =>
  apiClient.put('/education/studentsOfClass/unassign', { classId, studentIds });

export const getNumberOfAvailableChildren = (year, grade) =>
  apiClient.get('/education/numberOfAvailableChildren', { params: { year, grade } });

export const assignAvailableStudentsAuto = (year, grade) =>
  apiClient.put('/education/assignAvailableStudentsAuto', null, { params: { year, grade } });

// Delete activities for a specific day and schedule
export const deleteActivitiesByDayAndSchedule = (scheduleId, date) =>
  apiClient.delete('/education/activitiesByDayAndSchedule', {
    data: { scheduleId, date }
  });

// Export students list for a class
export const exportStudentsOfClass = (classId) =>
  apiClient.get('/education/student/export', {
    params: { classId },
    responseType: 'blob' // For file download
  });

//Get ra danh sách các lớp của học sinh
export const getClassesOfStudent = (childId) =>
  apiClient.get('/education/assignedClassesOfChild/list', { params: { childId } });

export const getClassReportByYear = (year) =>
  apiClient.get('/education/classes/reportByYear', { params: { year } });

// Lấy thống kê số lượng học sinh tham gia theo sự kiện (event)
export const getEventParticipantsStats = (params) =>
  apiClient.put('/education/event/numberOfParticipants/stats', params);

export const getEducationDashboardData = () =>
  apiClient.get('/education/dashboard');
