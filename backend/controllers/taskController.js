const pool = require("../db");

exports.getTasks = async (req, res) => {
  try {
    const [tasks] = await pool.query(
      "SELECT * FROM tasks ORDER BY created_at DESC"
    );
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      assigned_to,
      created_by,
      due_date,
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO tasks
      (title, description, status, priority, assigned_to, created_by, due_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        status || "To Do",
        priority || "Medium",
        assigned_to || null,
        created_by || null,
        due_date || null,
      ]
    );

    res.json({
      success: true,
      id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create task" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `UPDATE tasks
       SET title=?,
           description=?,
           status=?,
           priority=?,
           assigned_to=?,
           due_date=?
       WHERE id=?`,
      [
        req.body.title,
        req.body.description,
        req.body.status,
        req.body.priority,
        req.body.assigned_to,
        req.body.due_date,
        id,
      ]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update task" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM tasks WHERE id=?",
      [req.params.id]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete task" });
  }
};
