const db = require('../config/db');

exports.getLeaves = async (req, res) => {
  let query = `
    SELECT l.id, l.employee_id as employeeId, l.leave_type as leaveType, l.start_date as startDate, l.end_date as endDate, 
           l.reason, l.status, l.approved_by as approvedBy,
           CONCAT(e.first_name, ' ', e.last_name) as employeeName, d.name as departmentName,
           CONCAT(approver.first_name, ' ', approver.last_name) as approverName
    FROM leaves l
    JOIN employees e ON l.employee_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    LEFT JOIN employees approver ON l.approved_by = approver.id
    WHERE 1=1
  `;
  let params = [];

  if (req.user.roleName === 'Employee') {
    query += ' AND l.employee_id = ?';
    params.push(req.user.id);
  } else if (req.user.roleName === 'Manager') {
    query += ' AND e.department_id = ?';
    params.push(req.user.departmentId);
  }

  query += ' ORDER BY l.start_date DESC';

  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Get leaves error:', error);
    res.status(500).json({ message: 'Server error retrieving leaves', error: error.message });
  }
};

exports.applyLeave = async (req, res) => {
  const { leaveType, startDate, endDate, reason } = req.body;

  if (!leaveType || !startDate || !endDate || !reason) {
    return res.status(400).json({ message: 'All leave fields are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO leaves (employee_id, leave_type, start_date, end_date, reason, status) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, leaveType, startDate, endDate, reason, 'Pending']
    );

    const [dept] = await db.query(
      'SELECT manager_id FROM departments WHERE id = ?',
      [req.user.departmentId]
    );

    if (dept.length > 0 && dept[0].manager_id) {
      await db.query(
        'INSERT INTO notifications (employee_id, message) VALUES (?, ?)',
        [
          dept[0].manager_id,
          `${req.user.firstName} ${req.user.lastName} has requested leave from ${startDate} to ${endDate}.`
        ]
      );
    }

    // Tracker Entry
    await db.query(
      `INSERT INTO employee_tracker
      (employee_id, activity, module, status, login_time, work_date)
      VALUES (?, ?, ?, ?, NOW(), CURDATE())`,
      [
        req.user.id,
        "Applied Leave",
        "Leave",
        "Pending"
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Leave request submitted successfully'
    });

  } catch (error) {
    console.error('Apply leave error:', error);
    res.status(500).json({
      message: 'Server error submitting leave request',
      error: error.message
    });
  }
};

exports.approveRejectLeave = async (req, res) => {
  const { status } = req.body;
  const leaveId = req.params.id;

  if (!status || !['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({
      message: 'Valid status (Approved/Rejected) is required'
    });
  }

  try {
    const [leaveRows] = await db.query(
      'SELECT * FROM leaves WHERE id = ?',
      [leaveId]
    );

    if (leaveRows.length === 0) {
      return res.status(404).json({
        message: 'Leave request not found'
      });
    }

    const leave = leaveRows[0];

    await db.query(
      'UPDATE leaves SET status = ?, approved_by = ? WHERE id = ?',
      [status, req.user.id, leaveId]
    );

    await db.query(
      'INSERT INTO notifications (employee_id, message) VALUES (?, ?)',
      [
        leave.employee_id,
        `Your leave request for ${leave.leave_type} has been ${status.toLowerCase()}.`
      ]
    );

    // Tracker Entry
    await db.query(
      `INSERT INTO employee_tracker
      (employee_id, activity, module, status, login_time, work_date)
      VALUES (?, ?, ?, ?, NOW(), CURDATE())`,
      [
        leave.employee_id,
        status === "Approved"
          ? "Leave Approved"
          : "Leave Rejected",
        "Leave",
        "Completed"
      ]
    );

    res.json({
      message: `Leave request has been ${status}`
    });

  } catch (error) {
    console.error('Approve/Reject leave error:', error);
    res.status(500).json({
      message: 'Server error updating leave status',
      error: error.message
    });
  }
};
