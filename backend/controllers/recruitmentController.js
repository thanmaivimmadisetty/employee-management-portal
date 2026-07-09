const db = require('../config/db');

// --- Jobs Controller ---

exports.getJobs = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT j.id, j.title, j.description, j.department_id as departmentId, j.status, j.created_at as createdAt,
              d.name as departmentName
       FROM recruitment_jobs j
       LEFT JOIN departments d ON j.department_id = d.id
       ORDER BY j.created_at DESC`
    );
    res.json(rows);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error retrieving jobs', error: error.message });
  }
};

exports.createJob = async (req, res) => {
  const { title, description, departmentId } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO recruitment_jobs (title, description, department_id, status) VALUES (?, ?, ?, ?)',
      [title, description, departmentId || null, 'Open']
    );

    // Tracker Entry
    await db.query(
      `INSERT INTO employee_tracker
      (employee_id, activity, module, status, login_time, work_date)
      VALUES (?, ?, ?, ?, NOW(), CURDATE())`,
      [
        req.user.id,
        `Created Job: ${title}`,
        "Recruitment",
        "Completed"
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Job posting created successfully'
    });

  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({
      message: 'Server error creating job posting',
      error: error.message
    });
  }
};

exports.updateJobStatus = async (req, res) => {
  const { status } = req.body;
  const jobId = req.params.id;

  if (!status || !['Open', 'Closed'].includes(status)) {
    return res.status(400).json({ message: 'Valid status (Open/Closed) is required' });
  }

  try {
    await db.query('UPDATE recruitment_jobs SET status = ? WHERE id = ?', [status, jobId]);
    res.json({ message: `Job posting status updated to ${status}` });
  } catch (error) {
    console.error('Update job status error:', error);
    res.status(500).json({ message: 'Server error updating job status', error: error.message });
  }
};

// --- Candidates Controller ---

exports.getCandidates = async (req, res) => {
  const { jobId } = req.query;
  let query = `
    SELECT c.id, c.job_id as jobId, c.first_name as firstName, c.last_name as lastName, c.email, c.resume_url as resumeUrl, 
           c.status, c.created_at as createdAt, j.title as jobTitle
    FROM recruitment_candidates c
    JOIN recruitment_jobs j ON c.job_id = j.id
    WHERE 1=1
  `;
  let params = [];

  if (jobId) {
    query += ' AND c.job_id = ?';
    params.push(jobId);
  }

  query += ' ORDER BY c.created_at DESC';

  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Get candidates error:', error);
    res.status(500).json({ message: 'Server error retrieving candidates', error: error.message });
  }
};

exports.createCandidate = async (req, res) => {
  const { jobId, firstName, lastName, email, resumeUrl } = req.body;

  if (!jobId || !firstName || !lastName || !email) {
    return res.status(400).json({ message: 'Job, Name, and Email are required' });
  }

  try {

    const [result] = await db.query(
      'INSERT INTO recruitment_candidates (job_id, first_name, last_name, email, resume_url, status) VALUES (?, ?, ?, ?, ?, ?)',
      [jobId, firstName, lastName, email, resumeUrl || '', 'Applied']
    );

    // Tracker Entry
    await db.query(
      `INSERT INTO employee_tracker
      (employee_id, activity, module, status, login_time, work_date)
      VALUES (?, ?, ?, ?, NOW(), CURDATE())`,
      [
        1,
        `Candidate Applied: ${firstName} ${lastName}`,
        "Recruitment",
        "Pending"
      ]
    );

    // Notify HR
    const [hrUsers] = await db.query(
      'SELECT e.id FROM employees e JOIN roles r ON e.role_id = r.id WHERE r.name = "HR"'
    );

    for (const hr of hrUsers) {
      await db.query(
        'INSERT INTO notifications (employee_id, message) VALUES (?, ?)',
        [hr.id, `New candidate application from ${firstName} ${lastName} for job ID ${jobId}.`]
      );
    }

    res.status(201).json({
      id: result.insertId,
      message: 'Application submitted successfully'
    });

  } catch (error) {
    console.error('Create candidate error:', error);
    res.status(500).json({
      message: 'Server error applying for job',
      error: error.message
    });
  }
};

exports.updateCandidateStatus = async (req, res) => {

  const { status } = req.body;
  const candidateId = req.params.id;

  if (!status || !['Applied', 'Interviewing', 'Offered', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid candidate status' });
  }

  try {

    await db.query(
      'UPDATE recruitment_candidates SET status = ? WHERE id = ?',
      [status, candidateId]
    );

    // Tracker Entry
    await db.query(
      `INSERT INTO employee_tracker
      (employee_id, activity, module, status, login_time, work_date)
      VALUES (?, ?, ?, ?, NOW(), CURDATE())`,
      [
        req.user.id,
        `Candidate Status Updated`,
        "Recruitment",
        status
      ]
    );

    res.json({
      message: `Candidate status updated to ${status}`
    });

  } catch (error) {
    console.error('Update candidate status error:', error);
    res.status(500).json({
      message: 'Server error updating candidate status',
      error: error.message
    });
  }
};
