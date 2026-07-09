const db = require('../config/db');

exports.getAllDepartments = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT d.id, d.name, d.description, d.manager_id as managerId, 
              CONCAT(e.first_name, ' ', e.last_name) as managerName
       FROM departments d
       LEFT JOIN employees e ON d.manager_id = e.id`
    );
    res.json(rows);
  } catch (error) {
    console.error('Get all departments error:', error);
    res.status(500).json({ message: 'Server error retrieving departments', error: error.message });
  }
};

exports.createDepartment = async (req, res) => {
  const { name, description, managerId } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Department name is required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO departments (name, description, manager_id) VALUES (?, ?, ?)',
      [name, description || '', managerId || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Department created successfully' });
  } catch (error) {
    console.error('Create department error:', error);
    res.status(500).json({ message: 'Server error creating department', error: error.message });
  }
};

exports.updateDepartment = async (req, res) => {
  const { name, description, managerId } = req.body;

  try {
    const [original] = await db.query('SELECT * FROM departments WHERE id = ?', [req.params.id]);
    if (original.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }

    await db.query(
      'UPDATE departments SET name = ?, description = ?, manager_id = ? WHERE id = ?',
      [
        name !== undefined ? name : original[0].name,
        description !== undefined ? description : original[0].description,
        managerId !== undefined ? managerId : original[0].manager_id,
        req.params.id
      ]
    );

    res.json({ message: 'Department updated successfully' });
  } catch (error) {
    console.error('Update department error:', error);
    res.status(500).json({ message: 'Server error updating department', error: error.message });
  }
};

exports.deleteDepartment = async (req, res) => {
  try {
    const [original] = await db.query('SELECT id FROM departments WHERE id = ?', [req.params.id]);
    if (original.length === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }

    // Set department_id to NULL for employees in this department (MySQL cascade set null takes care of this if FK is set to set null, which it is)
    await db.query('DELETE FROM departments WHERE id = ?', [req.params.id]);
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Delete department error:', error);
    res.status(500).json({ message: 'Server error deleting department', error: error.message });
  }
};
