const db = require('../config/db');

exports.getAttendanceLogs = async (req, res) => {
  const { employeeId, startDate, endDate } = req.query;
  let query = `
    SELECT a.id, a.employee_id as employeeId, a.date, a.check_in as checkIn, a.check_out as checkOut, a.status,
           CONCAT(e.first_name, ' ', e.last_name) as employeeName, d.name as departmentName
    FROM attendance a
    JOIN employees e ON a.employee_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE 1=1
  `;
  let params = [];

  if (req.user.roleName === 'Employee') {
    query += ' AND a.employee_id = ?';
    params.push(req.user.id);
  } else if (employeeId) {
    query += ' AND a.employee_id = ?';
    params.push(employeeId);
  }

  if (startDate && endDate) {
    query += ' AND a.date BETWEEN ? AND ?';
    params.push(startDate, endDate);
  }

  query += ' ORDER BY a.date DESC, a.check_in DESC';

  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ message: 'Server error retrieving attendance logs', error: error.message });
  }
};

exports.getTodayStatus = async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  try {
    const [rows] = await db.query(
      'SELECT * FROM attendance WHERE employee_id = ? AND date = ?',
      [req.user.id, today]
    );

    if (rows.length === 0) {
      return res.json({ checkedIn: false, checkedOut: false, log: null });
    }

    const log = rows[0];
    res.json({
      checkedIn: !!log.check_in,
      checkedOut: !!log.check_out,
      log: {
        id: log.id,
        date: log.date,
        checkIn: log.check_in,
        checkOut: log.check_out,
        status: log.status
      }
    });
  } catch (error) {
    console.error('Get today status error:', error);
    res.status(500).json({ message: 'Server error checking status', error: error.message });
  }
};

exports.checkIn = async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toTimeString().split(' ')[0]; // HH:MM:SS
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();

  let status = 'Present';
  if (currentHour > 9 || (currentHour === 9 && currentMinute > 30)) {
    status = 'Late';
  }

  try {
    const [existing] = await db.query(
      'SELECT id FROM attendance WHERE employee_id = ? AND date = ?',
      [req.user.id, today]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Already checked in for today' });
    }

    await db.query(
      'INSERT INTO attendance (employee_id, date, check_in, check_out, status) VALUES (?, ?, ?, NULL, ?)',
      [req.user.id, today, currentTime, status]
    );
await db.query(
  `INSERT INTO employee_tracker
  (employee_id, login_time, work_date, activity, module, status)
  VALUES (?, NOW(), CURDATE(), ?, ?, ?)`,
  [
    req.user.id,
    "Checked In",
    "Attendance",
    "Completed"
  ]
);
    res.status(201).json({ message: 'Checked in successfully', time: currentTime, status });
  } catch (error) {
    console.error('Check in error:', error);
    res.status(500).json({ message: 'Server error checking in', error: error.message });
  }
};

exports.checkOut = async (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const currentTime = new Date().toTimeString().split(' ')[0]; // HH:MM:SS

  try {
    const [existing] = await db.query(
      'SELECT id, check_in, check_out FROM attendance WHERE employee_id = ? AND date = ?',
      [req.user.id, today]
    );

    if (existing.length === 0) {
      return res.status(400).json({ message: 'You must check in first before checking out' });
    }

    if (existing[0].check_out) {
      return res.status(400).json({ message: 'Already checked out for today' });
    }

    await db.query(
      'UPDATE attendance SET check_out = ? WHERE employee_id = ? AND date = ?',
      [currentTime, req.user.id, today]
    );
await db.query(
  `UPDATE employee_tracker
   SET logout_time = NOW(),
       activity = ?,
       module = ?
   WHERE employee_id = ?
   ORDER BY login_time DESC
   LIMIT 1`,
  [
    "Checked Out",
    "Attendance",
    req.user.id
  ]
);
    res.json({ message: 'Checked out successfully', time: currentTime });
  } catch (error) {
    console.error('Check out error:', error);
    res.status(500).json({ message: 'Server error checking out', error: error.message });
  }
};
