const db = require('../config/db');

exports.getPayrollRecords = async (req, res) => {
  let query = `
    SELECT p.id, p.employee_id as employeeId, p.base_salary as baseSalary, p.allowances, p.deductions, p.net_salary as netSalary,
           p.payment_date as paymentDate, p.status,
           CONCAT(e.first_name, ' ', e.last_name) as employeeName,
           e.email as employeeEmail,
           d.name as departmentName
    FROM payroll p
    JOIN employees e ON p.employee_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE 1=1
  `;

  let params = [];

  if (req.user.roleName === 'Employee') {
    query += ' AND p.employee_id = ?';
    params.push(req.user.id);
  }

  query += ' ORDER BY p.payment_date DESC, p.id DESC';

  try {
    const [rows] = await db.query(query, params);
    res.json(rows);

  } catch (error) {
    console.error('Get payroll records error:', error);
    res.status(500).json({
      message: 'Server error retrieving payroll records',
      error: error.message
    });
  }
};

exports.generatePayroll = async (req, res) => {

  const { employeeId, baseSalary, allowances, deductions } = req.body;

  if (!employeeId || baseSalary === undefined) {
    return res.status(400).json({
      message: 'Employee ID and Base Salary are required'
    });
  }

  const base = parseFloat(baseSalary);
  const allow = parseFloat(allowances || 0);
  const deduct = parseFloat(deductions || 0);

  const netSalary = base + allow - deduct;

  try {

    // Check employee exists
    const [emp] = await db.query(
      'SELECT first_name, last_name FROM employees WHERE id = ?',
      [employeeId]
    );

    if (emp.length === 0) {
      return res.status(404).json({
        message: 'Employee not found'
      });
    }

    const [result] = await db.query(
      'INSERT INTO payroll (employee_id, base_salary, allowances, deductions, net_salary, status) VALUES (?, ?, ?, ?, ?, ?)',
      [
        employeeId,
        base,
        allow,
        deduct,
        netSalary,
        'Unpaid'
      ]
    );

    // Notify Employee
    await db.query(
      'INSERT INTO notifications (employee_id, message) VALUES (?, ?)',
      [
        employeeId,
        `A new payslip of net amount $${netSalary.toFixed(2)} has been generated. Status: Unpaid.`
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
        "Payroll Generated",
        "Payroll",
        "Completed"
      ]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Payroll record generated successfully'
    });

  } catch (error) {

    console.error('Generate payroll error:', error);

    res.status(500).json({
      message: 'Server error generating payroll',
      error: error.message
    });

  }

};

exports.updatePayrollStatus = async (req, res) => {

  const { status } = req.body;

  const payrollId = req.params.id;

  if (!status || !['Paid', 'Unpaid'].includes(status)) {
    return res.status(400).json({
      message: 'Valid status (Paid/Unpaid) is required'
    });
  }

  const paymentDate =
    status === 'Paid'
      ? new Date().toISOString().split('T')[0]
      : null;

  try {

    const [payrollRows] = await db.query(
      'SELECT * FROM payroll WHERE id = ?',
      [payrollId]
    );

    if (payrollRows.length === 0) {
      return res.status(404).json({
        message: 'Payroll record not found'
      });
    }

    const payroll = payrollRows[0];

    await db.query(
      'UPDATE payroll SET status = ?, payment_date = ? WHERE id = ?',
      [
        status,
        paymentDate,
        payrollId
      ]
    );

    if (status === 'Paid') {

      await db.query(
        'INSERT INTO notifications (employee_id, message) VALUES (?, ?)',
        [
          payroll.employee_id,
          `Your payslip of net amount $${parseFloat(payroll.net_salary).toFixed(2)} has been paid.`
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
          payroll.employee_id,
          "Payroll Paid",
          "Payroll",
          "Completed"
        ]
      );

    }

    res.json({
      message: `Payroll status updated to ${status}`
    });

  } catch (error) {

    console.error('Update payroll status error:', error);

    res.status(500).json({
      message: 'Server error updating payroll status',
      error: error.message
    });

  }

};