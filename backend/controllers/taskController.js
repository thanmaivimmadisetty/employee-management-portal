const db = require("../config/db");

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        t.*,
        CONCAT(e.first_name,' ',e.last_name) AS employeeName,
        CONCAT(a.first_name,' ',a.last_name) AS assignedBy
      FROM tasks t
      LEFT JOIN employees e
        ON t.assigned_to=e.id
      LEFT JOIN employees a
        ON t.assigned_by=a.id
      ORDER BY t.created_at DESC
    `);

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Unable to fetch tasks"
    });
  }
};

// Create Task
exports.createTask = async (req,res)=>{

  try{

    const{
      title,
      description,
      project_name,
      assigned_to,
      assigned_by,
      priority,
      due_date,
      estimated_hours
    }=req.body;

    await db.query(`
      INSERT INTO tasks
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

      VALUES
      (?,?,?,?,?,?,?,?)
    `,

    [
      title,
      description,
      project_name,
      assigned_to,
      assigned_by,
      priority,
      due_date,
      estimated_hours
    ]);

    res.json({
      success:true,
      message:"Task Created Successfully"
    });

  }

  catch(err){

    console.error(err);

    res.status(500).json({
      message:"Unable to create task"
    });

  }
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

    await db.query(`
      UPDATE tasks
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
      WHERE id=?
    `,
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
    ]);

    res.json({
      success:true,
      message:"Task Updated"
    });

  }
  catch(err){

    console.error(err);

    res.status(500).json({
      message:"Unable to update task"
    });

  }
};
  exports.deleteTask = async(req,res)=>{

try{

await db.query(
"DELETE FROM tasks WHERE id=?",
[req.params.id]
);

res.json({
success:true
});

}

catch(err){

console.error(err);

res.status(500).json({
message:"Unable to delete task"
});

}

};

};
