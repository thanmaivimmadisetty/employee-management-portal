const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required'
    });
  }

  try {
    const [rows] = await db.query(
      `SELECT e.*, r.name as roleName
       FROM employees e
       JOIN roles r ON e.role_id = r.id
       WHERE e.email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    const employee = rows[0];

    if (employee.status !== 'Active') {
      return res.status(403).json({
        message: 'Account is deactivated'
      });
    }

    // Verify Password
    console.log("Email entered:", email);
    console.log("Password entered:", password);
    console.log("Password in DB:", employee.password);

    const isMatch = await bcrypt.compare(password, employee.password);

    console.log("Password matched:", isMatch);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid email or password'
      });
    }

    // Create JWT Token
    const jwtSecret =
      process.env.JWT_SECRET ||
      'super_secret_jwt_token_for_employee_management_portal';

    const token = jwt.sign(
      {
        id: employee.id,
        email: employee.email,
        firstName: employee.first_name,
        lastName: employee.last_name,
        roleId: employee.role_id,
        roleName: employee.roleName,
        departmentId: employee.department_id
      },
      jwtSecret,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      }
    );

    // ==========================
    // Tracker Login Stamp
    // ==========================
  // Record Login Time in Tracker
await db.query(
  `INSERT INTO employee_tracker
  (employee_id, login_time, work_date, activity)
  VALUES (?, NOW(), CURDATE(), ?)`,
  [
    employee.id,
    "Login"
  ]
);

    res.json({
      token,
      user: {
        id: employee.id,
        email: employee.email,
        firstName: employee.first_name,
        lastName: employee.last_name,
        roleId: employee.role_id,
        roleName: employee.roleName,
        departmentId: employee.department_id
      }
    });

  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      message: 'Server error during login',
      error: error.message
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT
        e.id,
        e.first_name,
        e.last_name,
        e.email,
        e.role_id,
        e.department_id,
        e.joining_date,
        e.status,
        e.salary,
        r.name as roleName,
        d.name as departmentName
      FROM employees e
      JOIN roles r
      ON e.role_id = r.id
      LEFT JOIN departments d
      ON e.department_id = d.id
      WHERE e.id = ?`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'Employee not found'
      });
    }

    res.json({
      user: rows[0]
    });

  } catch (error) {
    console.error('Get profile error:', error);

    res.status(500).json({
      message: 'Server error retrieving profile',
      error: error.message
    });
  }
};
exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required"
    });
  }

  try {
    const [rows] = await db.query(
      "SELECT id FROM employees WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Email not found"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "UPDATE employees SET password = ? WHERE email = ?",
      [hashedPassword, email]
    );

    res.json({
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to reset password"
    });
  }
};
