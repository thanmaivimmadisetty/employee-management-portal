const db = require("../config/db");

exports.getActivities = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT
      a.*,
      e.first_name,
      e.last_name
      FROM activity_logs a
      JOIN employees e
      ON a.employee_id=e.id
      ORDER BY a.created_at DESC
    `);

    res.json(rows);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server Error"
    });

  }

};