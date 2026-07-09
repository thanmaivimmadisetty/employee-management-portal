const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getAllEmployees = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT e.id, e.first_name as firstName, e.last_name as lastName, e.email, e.role_id as roleId, e.department_id as departmentId, 
              e.joining_date as joiningDate, e.status, e.salary, r.name as roleName, d.name as departmentName
       FROM employees e
       JOIN roles r ON e.role_id = r.id
       LEFT JOIN departments d ON e.department_id = d.id`
    );
    res.json(rows);
  } catch (error) {
    console.error('Get all employees error:', error);
    res.status(500).json({ message: 'Server error retrieving employees', error: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT e.id, e.first_name as firstName, e.last_name as lastName, e.email, e.role_id as roleId, e.department_id as departmentId, 
              e.joining_date as joiningDate, e.status, e.salary, r.name as roleName, d.name as departmentName
       FROM employees e
       JOIN roles r ON e.role_id = r.id
       LEFT JOIN departments d ON e.department_id = d.id
       WHERE e.id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get employee details error:', error);
    res.status(500).json({ message: 'Server error retrieving employee details', error: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  const { firstName, lastName, email, password, roleId, departmentId, joiningDate, salary, status } = req.body;

  if (!firstName || !lastName || !email || !password || !roleId || !joiningDate || salary === undefined) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    // Check if email already exists
    const [existing] = await db.query('SELECT id FROM employees WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      `INSERT INTO employees (first_name, last_name, email, password, role_id, department_id, joining_date, salary, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [firstName, lastName, email, hashedPassword, roleId, departmentId || null, joiningDate, salary, status || 'Active']
    );

    // Create a system announcement notification for the user
    await db.query(
      `INSERT INTO notifications (employee_id, message) VALUES (?, ?)`,
      [result.insertId, `Welcome to the Employee Management Portal, ${firstName}! Your account has been created.`]
    );

    res.status(201).json({ id: result.insertId, message: 'Employee created successfully' });
  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ message: 'Server error creating employee', error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  const { firstName, lastName, email, password, roleId, departmentId, joiningDate, salary, status } = req.body;

  try {
    // Fetch original employee details first
    const [original] = await db.query('SELECT * FROM employees WHERE id = ?', [req.params.id]);
    if (original.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    let query = `
      UPDATE employees 
      SET first_name = ?, last_name = ?, email = ?, role_id = ?, department_id = ?, joining_date = ?, salary = ?, status = ?
    `;
    let params = [
      firstName || original[0].first_name,
      lastName || original[0].last_name,
      email || original[0].email,
      roleId !== undefined ? roleId : original[0].role_id,
      departmentId !== undefined ? departmentId : original[0].department_id,
      joiningDate || original[0].joining_date,
      salary !== undefined ? salary : original[0].salary,
      status || original[0].status
    ];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += `, password = ?`;
      params.push(hashedPassword);
    }

    query += ` WHERE id = ?`;
    params.push(req.params.id);

    await db.query(query, params);
    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Update employee error:', error);
    res.status(500).json({ message: 'Server error updating employee', error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const [original] = await db.query('SELECT id FROM employees WHERE id = ?', [req.params.id]);
    if (original.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await db.query('DELETE FROM employees WHERE id = ?', [req.params.id]);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ message: 'Server error deleting employee', error: error.message });
  }
};
