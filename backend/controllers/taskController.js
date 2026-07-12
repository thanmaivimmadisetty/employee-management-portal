const db = require("../config/db");

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM tasks
      ORDER BY created_at DESC
    `);

    res.status(200).json(rows);
  } catch (err) {
    console.error("GET TASKS ERROR:", err);
    res.status(500).json({
      message: "Unable to fetch tasks",
      error: err.message
    });
  }
};

// Create Task
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      project_name,
      assigned_to,
      assigned_by,
      priority,
      due_date,
      estimated_hours
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO tasks
      (
        title,
        description,
        project_name,
        assigned_to,
        assigned_by,
        priority,
        due_date,
        estimated_hours
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        project_name,
        assigned_to || null,
        assigned_by || null,
        priority || "Medium",
        due_date || null,
        estimated_hours || 0
      ]
    );

    res.status(201).json({
      success: true,
      id: result.insertId,
      message: "Task created successfully"
    });
  } catch (err) {
    console.error("CREATE TASK ERROR:", err);
    res.status(500).json({
      message: "Unable to create task",
      error: err.message
    });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      project_name,
      assigned_to,
      priority,
      status,
      due_date,
      estimated_hours,
      actual_hours
    } = req.body;

    await db.query(
      `UPDATE tasks
       SET
        title=?,
        description=?,
        project_name=?,
        assigned_to=?,
        priority=?,
        status=?,
        due_date=?,
        estimated_hours=?,
        actual_hours=?
       WHERE id=?`,
      [
        title,
        description,
        project_name,
        assigned_to,
        priority,
        status,
        due_date,
        estimated_hours,
        actual_hours,
        id
      ]
    );

    res.json({
      success: true,
      message: "Task updated successfully"
    });
  } catch (err) {
    console.error("UPDATE TASK ERROR:", err);
    res.status(500).json({
      message: "Unable to update task",
      error: err.message
    });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    await db.query(
      "DELETE FROM tasks WHERE id=?",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (err) {
    console.error("DELETE TASK ERROR:", err);
    res.status(500).json({
      message: "Unable to delete task",
      error: err.message
    });
  }
};
