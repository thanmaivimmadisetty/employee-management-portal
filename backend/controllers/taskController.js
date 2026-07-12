const db = require("../config/db");

// ================= GET ALL TASKS =================
exports.getTasks = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        t.*,
        CONCAT(e.first_name,' ',e.last_name) AS employeeName
      FROM tasks t
      LEFT JOIN employees e
      ON t.assigned_to = e.id
      ORDER BY t.created_at DESC
    `);

    res.json(rows);

  } catch (err) {

    console.error("GET TASKS ERROR");
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Unable to fetch tasks",
      error: err.message
    });
  }
};

// ================= CREATE TASK =================
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
      VALUES (?,?,?,?,?,?,?,?)`,

      [
        title,
        description,
        project_name,

        assigned_to
          ? Number(assigned_to)
          : null,

        assigned_by
          ? Number(assigned_by)
          : null,

        priority || "Medium",

        due_date || null,

        estimated_hours
          ? Number(estimated_hours)
          : 0
      ]

    );

    res.status(201).json({

      success: true,

      message: "Task created successfully",

      id: result.insertId

    });

  } catch (err) {

    console.log("============== TASK CREATE ERROR ==============");

    console.log(err);

    console.log("Message:", err.message);

    console.log("SQL:", err.sqlMessage);

    console.log("Code:", err.code);

    console.log("==============================================");

    res.status(500).json({

      success: false,

      message: "Unable to create task",

      error: err.message,

      sqlMessage: err.sqlMessage,

      code: err.code

    });

  }

};

// ================= UPDATE TASK =================
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

    console.error(err);

    res.status(500).json({

      success: false,

      message: "Unable to update task",

      error: err.message

    });

  }

};

// ================= DELETE TASK =================
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

    console.error(err);

    res.status(500).json({

      success: false,

      message: "Unable to delete task",

      error: err.message

    });

  }

};
