const db = require('../config/db');

// Employee submits onboarding form
exports.createRequest = async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      previous_company,
      previous_designation,
      new_designation,
      department,
      experience,
      joining_date,
      address
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO onboarding_requests
      (full_name,email,phone,previous_company,previous_designation,new_designation,department,experience,joining_date,address)
      VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        full_name,
        email,
        phone,
        previous_company,
        previous_designation,
        new_designation,
        department,
        experience,
        joining_date,
        address
      ]
    );

    // Add Tracker Entry
    await db.query(
      `INSERT INTO employee_tracker
      (employee_id, activity, module, status, login_time, work_date)
      VALUES (?, ?, ?, ?, NOW(), CURDATE())`,
      [
        1,
        "Submitted Onboarding Form",
        "Onboarding",
        "Pending"
      ]
    );

    res.status(201).json({
      message: "Onboarding request submitted successfully",
      id: result.insertId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

// HR/Admin view all requests
exports.getRequests = async (req, res) => {
  try {

    const [rows] = await db.query(
      "SELECT * FROM onboarding_requests ORDER BY created_at DESC"
    );

    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error"
    });
  }
};

// Approve / Reject
exports.updateStatus = async (req, res) => {

  try {

    const { status } = req.body;

    await db.query(
      "UPDATE onboarding_requests SET status=? WHERE id=?",
      [status, req.params.id]
    );

    // Get request details
    const [rows] = await db.query(
      "SELECT * FROM onboarding_requests WHERE id=?",
      [req.params.id]
    );

    // Add Tracker Entry
    await db.query(
      `INSERT INTO employee_tracker
      (employee_id, activity, module, status, login_time, work_date)
      VALUES (?, ?, ?, ?, NOW(), CURDATE())`,
      [
        1,
        status === "Approved"
          ? "Onboarding Approved"
          : "Onboarding Rejected",
        "Onboarding",
        status
      ]
    );

    res.json({
      message: "Status Updated Successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error"
    });
  }

};