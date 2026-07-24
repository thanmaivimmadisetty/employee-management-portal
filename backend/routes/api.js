const express = require('express');
const router = express.Router();

const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Import Controllers
const authController = require('../controllers/authController');
const employeeController = require('../controllers/employeeController');
const departmentController = require('../controllers/departmentController');
const attendanceController = require('../controllers/attendanceController');
const leaveController = require('../controllers/leaveController');
const payrollController = require('../controllers/payrollController');
const recruitmentController = require('../controllers/recruitmentController');
const performanceController = require('../controllers/performanceController');
const holidayController = require('../controllers/holidayController');
const reportController = require('../controllers/reportController');
const notificationController = require('../controllers/notificationController');
const onboardingController = require('../controllers/onboardingController');
const trackerController = require('../controllers/trackerController');
const activityController=require("../controllers/activityController");
router.post('/auth/login', authController.login);

router.post(
  '/auth/reset-password',
  authController.resetPassword
);

router.get(
  '/auth/me',
  authenticateToken,
  authController.getMe
);

// --- Employee Routes ---
router.get('/employees', authenticateToken, authorizeRoles('Admin', 'HR', 'Manager'), employeeController.getAllEmployees);
router.get('/employees/:id', authenticateToken, employeeController.getEmployeeById);
router.post('/employees', authenticateToken, authorizeRoles('Admin', 'HR'), employeeController.createEmployee);
router.put('/employees/:id', authenticateToken, authorizeRoles('Admin', 'HR'), employeeController.updateEmployee);
router.delete('/employees/:id', authenticateToken, authorizeRoles('Admin', 'HR'), employeeController.deleteEmployee);

// --- Department Routes ---
router.get('/departments', authenticateToken, departmentController.getAllDepartments);
router.post('/departments', authenticateToken, authorizeRoles('Admin', 'HR'), departmentController.createDepartment);
router.put('/departments/:id', authenticateToken, authorizeRoles('Admin', 'HR'), departmentController.updateDepartment);
router.delete('/departments/:id', authenticateToken, authorizeRoles('Admin', 'HR'), departmentController.deleteDepartment);

// --- Attendance Routes ---
router.get('/attendance', authenticateToken, attendanceController.getAttendanceLogs);
router.get('/attendance/today', authenticateToken, attendanceController.getTodayStatus);
router.post('/attendance/check-in', authenticateToken, attendanceController.checkIn);
router.post('/attendance/check-out', authenticateToken, attendanceController.checkOut);

// --- Leave Routes ---
router.get('/leaves', authenticateToken, leaveController.getLeaves);
router.post('/leaves', authenticateToken, leaveController.applyLeave);
router.patch('/leaves/:id/status', authenticateToken, authorizeRoles('Admin', 'HR', 'Manager'), leaveController.approveRejectLeave);

// --- Payroll Routes ---
router.get('/payroll', authenticateToken, payrollController.getPayrollRecords);
router.post('/payroll', authenticateToken, authorizeRoles('Admin', 'HR'), payrollController.generatePayroll);
router.patch('/payroll/:id/status', authenticateToken, authorizeRoles('Admin', 'HR'), payrollController.updatePayrollStatus);

// --- Recruitment Routes ---
router.get('/recruitment/jobs', authenticateToken, recruitmentController.getJobs);
router.post('/recruitment/jobs', authenticateToken, authorizeRoles('Admin', 'HR'), recruitmentController.createJob);
router.patch('/recruitment/jobs/:id/status', authenticateToken, authorizeRoles('Admin', 'HR'), recruitmentController.updateJobStatus);
router.get('/recruitment/candidates', authenticateToken, authorizeRoles('Admin', 'HR'), recruitmentController.getCandidates);
router.post('/recruitment/candidates', recruitmentController.createCandidate); // Public apply
router.patch('/recruitment/candidates/:id/status', authenticateToken, authorizeRoles('Admin', 'HR'), recruitmentController.updateCandidateStatus);

// --- Performance Routes ---
router.get('/performance', authenticateToken, performanceController.getPerformanceReviews);
router.post('/performance', authenticateToken, authorizeRoles('Admin', 'HR', 'Manager'), performanceController.createPerformanceReview);

// --- Holiday Routes ---
router.get('/holidays', authenticateToken, holidayController.getHolidays);
router.post('/holidays', authenticateToken, authorizeRoles('Admin', 'HR'), holidayController.createHoliday);
router.delete('/holidays/:id', authenticateToken, authorizeRoles('Admin', 'HR'), holidayController.deleteHoliday);

// --- Report Routes ---
router.get('/reports/dashboard', authenticateToken, authorizeRoles('Admin', 'HR', 'Manager'), reportController.getDashboardStats);
router.get('/reports/export', authenticateToken, authorizeRoles('Admin', 'HR'), reportController.getReportData);

router.get(
"/activity",
authenticateToken,
authorizeRoles("Admin","HR"),
activityController.getActivities
);

// --- Notification Routes ---
router.get('/notifications', authenticateToken, notificationController.getNotifications);
router.patch('/notifications/read-all', authenticateToken, notificationController.markAllAsRead);
router.patch('/notifications/:id/read', authenticateToken, notificationController.markAsRead);
// ---------- Onboarding Routes ----------

// Public Employee Form
router.post(
  '/onboarding',
  onboardingController.createRequest
);

// HR/Admin View
router.get(
  '/onboarding',
  authenticateToken,
  authorizeRoles('Admin', 'HR'),
  onboardingController.getRequests
);
// HR/Admin Approve or Reject
router.put(
  '/onboarding/:id',
  authenticateToken,
  authorizeRoles('Admin', 'HR'),
  onboardingController.updateStatus
);
// ================= Tracker Routes =================

// Employee Login Stamp
router.post(
  '/tracker/login',
  authenticateToken,
  trackerController.loginStamp
);

// Employee Logout Stamp
router.put(
  '/tracker/logout',
  authenticateToken,
  trackerController.logoutStamp
);

// Employee Update Daily Task
router.put(
  '/tracker/task',
  authenticateToken,
  trackerController.addTask
);

// HR/Admin View All Tracker Records
router.get(
  '/tracker',
  authenticateToken,
  authorizeRoles('Admin', 'HR'),
  trackerController.getAllTracker
);
module.exports = router;
