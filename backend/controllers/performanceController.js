const db = require('../config/db');

exports.getPerformanceReviews = async (req, res) => {
  let query = `
    SELECT pr.id,
           pr.employee_id as employeeId,
           pr.reviewer_id as reviewerId,
           pr.review_period as reviewPeriod,
           pr.rating,
           pr.feedback,
           pr.review_date as reviewDate,
           CONCAT(e.first_name, ' ', e.last_name) as employeeName,
           d.name as departmentName,
           CONCAT(r.first_name, ' ', r.last_name) as reviewerName
    FROM performance_reviews pr
    JOIN employees e ON pr.employee_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    JOIN employees r ON pr.reviewer_id = r.id
    WHERE 1=1
  `;

  let params = [];

  if (req.user.roleName === 'Employee') {
    query += ' AND pr.employee_id = ?';
    params.push(req.user.id);
  } else if (req.user.roleName === 'Manager') {
    query += ' AND (pr.reviewer_id = ? OR e.department_id = ?)';
    params.push(req.user.id, req.user.departmentId);
  }

  query += ' ORDER BY pr.review_date DESC';

  try {
    const [rows] = await db.query(query, params);
    res.json(rows);

  } catch (error) {
    console.error('Get performance reviews error:', error);
    res.status(500).json({
      message: 'Server error retrieving performance reviews',
      error: error.message
    });
  }
};

exports.createPerformanceReview = async (req, res) => {

  const {
    employeeId,
    reviewPeriod,
    rating,
    feedback
  } = req.body;

  if (!employeeId || !reviewPeriod || rating === undefined || !feedback) {
    return res.status(400).json({
      message: 'All performance review fields are required'
    });
  }

  const numericRating = parseInt(rating);

  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({
      message: 'Rating must be between 1 and 5'
    });
  }

  const today = new Date().toISOString().split('T')[0];

  try {

    // Check employee
    const [emp] = await db.query(
      'SELECT first_name,last_name FROM employees WHERE id=?',
      [employeeId]
    );

    if (emp.length === 0) {
      return res.status(404).json({
        message: 'Employee not found'
      });
    }

    // Save Review
    const [result] = await db.query(
      `INSERT INTO performance_reviews
      (employee_id, reviewer_id, review_period, rating, feedback, review_date)
      VALUES (?,?,?,?,?,?)`,
      [
        employeeId,
        req.user.id,
        reviewPeriod,
        numericRating,
        feedback,
        today
      ]
    );

    // Notify Employee
    await db.query(
      'INSERT INTO notifications (employee_id, message) VALUES (?, ?)',
      [
        employeeId,
        `Your performance review for ${reviewPeriod} has been submitted by ${req.user.firstName} ${req.user.lastName}. Rating: ${numericRating}/5.`
      ]
    );

    // ==========================
    // TRACKER ENTRY
    // ==========================
    await db.query(
      `INSERT INTO employee_tracker
      (employee_id, activity, module, status, login_time, work_date)
      VALUES (?, ?, ?, ?, NOW(), CURDATE())`,
      [
        employeeId,
        "Performance Review Added",
        "Performance",
        "Completed"
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Performance review submitted successfully'
    });

  } catch (error) {

    console.error('Create performance review error:', error);

    res.status(500).json({
      message: 'Server error submitting performance review',
      error: error.message
    });

  }

};