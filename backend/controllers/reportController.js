const db = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    // 1. Core KPIs (Depending on DB being connected)
    let stats = {
      totalEmployees: 0,
      totalDepartments: 0,
      openJobs: 0,
      pendingLeaves: 0,
      attendanceRateToday: 0,
      departmentHeadcounts: [],
      monthlyPayrollTotals: [],
      recentAttendanceLogs: []
    };

    // Total employees count
    const [empCount] = await db.query('SELECT COUNT(*) as count FROM employees WHERE status = "Active"');
    stats.totalEmployees = empCount[0].count;

    // Total departments count
    const [deptCount] = await db.query('SELECT COUNT(*) as count FROM departments');
    stats.totalDepartments = deptCount[0].count;

    // Open jobs
    const [jobCount] = await db.query('SELECT COUNT(*) as count FROM recruitment_jobs WHERE status = "Open"');
    stats.openJobs = jobCount[0].count;

    // Pending leaves
    const [leaveCount] = await db.query('SELECT COUNT(*) as count FROM leaves WHERE status = "Pending"');
    stats.pendingLeaves = leaveCount[0].count;

    // Today's attendance rate
    const [attendanceToday] = await db.query('SELECT COUNT(DISTINCT employee_id) as count FROM attendance WHERE date = ?', [today]);
    stats.attendanceRateToday = stats.totalEmployees > 0 
      ? Math.round((attendanceToday[0].count / stats.totalEmployees) * 100) 
      : 0;

    // Department headcounts for chart
    const [deptHeadcounts] = await db.query(`
      SELECT d.name, COUNT(e.id) as headcount
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id AND e.status = 'Active'
      GROUP BY d.id, d.name
    `);
    stats.departmentHeadcounts = deptHeadcounts;

    // Monthly payroll totals (last 6 payroll entries or aggregated payments)
    const [payrollTotals] = await db.query(`
      SELECT DATE_FORMAT(payment_date, '%b %Y') as month, SUM(net_salary) as total
      FROM payroll
      WHERE status = 'Paid' AND payment_date IS NOT NULL
      GROUP BY DATE_FORMAT(payment_date, '%Y-%m'), DATE_FORMAT(payment_date, '%b %Y')
      ORDER BY DATE_FORMAT(payment_date, '%Y-%m') ASC
      LIMIT 6
    `);
    stats.monthlyPayrollTotals = payrollTotals;

    // Recent attendance logs
    const [recentAttendance] = await db.query(`
      SELECT a.date, a.check_in as checkIn, a.status, CONCAT(e.first_name, ' ', e.last_name) as employeeName
      FROM attendance a
      JOIN employees e ON a.employee_id = e.id
      ORDER BY a.date DESC, a.check_in DESC
      LIMIT 5
    `);
    stats.recentAttendanceLogs = recentAttendance;

    res.json(stats);
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    // Return empty fallback stats instead of failing completely if database tables don't exist yet
    res.status(500).json({ message: 'Server error retrieving dashboard stats', error: error.message });
  }
};

exports.getReportData = async (req, res) => {
  const { type } = req.query; // 'attendance', 'payroll', 'employees'
  try {
    let data = [];
    if (type === 'attendance') {
      const [rows] = await db.query(`
        SELECT a.date, a.check_in as checkIn, a.check_out as checkOut, a.status,
               CONCAT(e.first_name, ' ', e.last_name) as employeeName, d.name as departmentName
        FROM attendance a
        JOIN employees e ON a.employee_id = e.id
        LEFT JOIN departments d ON e.department_id = d.id
        ORDER BY a.date DESC
      `);
      data = rows;
    } else if (type === 'payroll') {
      const [rows] = await db.query(`
        SELECT p.id, CONCAT(e.first_name, ' ', e.last_name) as employeeName, d.name as departmentName,
               p.base_salary as baseSalary, p.allowances, p.deductions, p.net_salary as netSalary, 
               p.payment_date as paymentDate, p.status
        FROM payroll p
        JOIN employees e ON p.employee_id = e.id
        LEFT JOIN departments d ON e.department_id = d.id
        ORDER BY p.payment_date DESC
      `);
      data = rows;
    } else {
      // Default to employee report
      const [rows] = await db.query(`
        SELECT e.id, CONCAT(e.first_name, ' ', e.last_name) as employeeName, e.email, r.name as roleName,
               d.name as departmentName, e.joining_date as joiningDate, e.salary, e.status
        FROM employees e
        JOIN roles r ON e.role_id = r.id
        LEFT JOIN departments d ON e.department_id = d.id
        ORDER BY e.id ASC
      `);
      data = rows;
    }
    res.json(data);
  } catch (error) {
    console.error('Get report data error:', error);
    res.status(500).json({ message: 'Server error retrieving report data', error: error.message });
  }
};
