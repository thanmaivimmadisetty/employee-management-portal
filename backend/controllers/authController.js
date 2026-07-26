const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const { sendOTP } = require("../utils/mailer");
const pool = require("../config/db");

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
  employeeId: employee.employee_id,
  email: employee.email,
  firstName: employee.first_name,
  lastName: employee.last_name,
  roleId: employee.role_id,
  roleName: employee.roleName,
  departmentId: employee.department_id,
  profilePhoto: employee.profile_photo
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
    e.employee_id AS employeeId,
    e.first_name AS firstName,
    e.last_name AS lastName,
    e.email,
    e.role_id AS roleId,
    e.department_id AS departmentId,
    e.joining_date AS joiningDate,
    e.status,
    e.salary,
    e.profile_photo AS profilePhoto,
    r.name AS roleName,
    d.name AS departmentName
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
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if employee exists
    const [employees] = await pool.query(
      "SELECT id FROM employees WHERE email = ?",
      [email]
    );

    if (employees.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP valid for 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Delete old OTPs
    await pool.query(
      "DELETE FROM password_reset_otp WHERE email = ?",
      [email]
    );

    // Save new OTP
    await pool.query(
      "INSERT INTO password_reset_otp (email, otp, expires_at) VALUES (?, ?, ?)",
      [email, otp, expiresAt]
    );

    // Send email
    await sendOTP(email, otp);

    return res.json({
      success: true,
      message: "OTP sent successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP.",
    });
  }
};
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const [rows] = await pool.query(
      `SELECT * FROM password_reset_otp
       WHERE email=? AND otp=? AND expires_at > NOW()`,
      [email, otp]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    return res.json({
      success: true,
      message: "OTP verified successfully",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const [rows] = await pool.query(
      `SELECT * FROM password_reset_otp
       WHERE email=? AND otp=? AND expires_at > NOW()`,
      [email, otp]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "UPDATE employees SET password=? WHERE email=?",
      [hashedPassword, email]
    );

    await pool.query(
      "DELETE FROM password_reset_otp WHERE email=?",
      [email]
    );

    return res.json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
