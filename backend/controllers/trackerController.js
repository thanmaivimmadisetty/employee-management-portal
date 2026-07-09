const db = require('../config/db');

// Employee Login Stamp
exports.loginStamp = async (req, res) => {
  try {
    const employeeId = req.user.id;

    await db.query(
      `INSERT INTO employee_tracker
      (employee_id, login_time, work_date)
      VALUES (?, NOW(), CURDATE())`,
      [employeeId]
    );

    res.json({
      message: "Login time recorded successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

// Employee Logout Stamp
exports.logoutStamp = async (req, res) => {
  try {
    const employeeId = req.user.id;

    await db.query(
      `UPDATE employee_tracker
       SET logout_time = NOW()
       WHERE employee_id = ?
       ORDER BY id DESC
       LIMIT 1`,
      [employeeId]
    );

    res.json({
      message: "Logout time updated"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

// Add Daily Task
exports.addTask = async (req, res) => {

  try {

    const employeeId = req.user.id;

    const {
      task_name,
      project_name,
      description,
      status
    } = req.body;

    await db.query(
      `UPDATE employee_tracker
SET
task_name=?,
project_name=?,
description=?,
status=?,
activity=?,
module=?
WHERE employee_id=?
ORDER BY id DESC
LIMIT 1`,
      [
  task_name,
  project_name,
  description,
  status,
  "Working",
  project_name,
  employeeId
]
    );

    res.json({
      message: "Task Updated Successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error"
    });
  }

};

// HR/Admin View All Tracker Records
exports.getAllTracker = async (req, res) => {

  try {

    const [rows] = await db.query(
      `SELECT
      t.*,
      e.first_name,
      e.last_name
      FROM employee_tracker t
      JOIN employees e
      ON t.employee_id=e.id
      ORDER BY t.id DESC`
    );

    res.json(rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Server Error"
    });

  }

};