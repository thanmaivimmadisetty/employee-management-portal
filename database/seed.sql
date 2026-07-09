-- Seed Data for Employee Management Portal

USE employee_db;

-- 1. Insert Roles
INSERT INTO roles (id, name) VALUES
(1, 'Admin'),
(2, 'HR'),
(3, 'Manager'),
(4, 'Employee')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. Insert Departments
INSERT INTO departments (id, name, description, manager_id) VALUES
(1, 'Administration', 'Core management and executive actions', NULL),
(2, 'Human Resources', 'Recruitment, employee relations, and benefits', NULL),
(3, 'Engineering', 'Software development and technical operations', NULL),
(4, 'Marketing', 'Sales, public relations, and campaigns', NULL)
ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description);

-- 3. Insert Employees
-- Password for all default accounts is 'password123' (bcrypt hash: $2a$10$g.k7i97tFj4j8X37z17PzOUwE/x3n2i6o9x.6t8t0jC4y4i0P8uW2)
INSERT INTO employees (id, first_name, last_name, email, password, role_id, department_id, joining_date, status, salary) VALUES
(1, 'System', 'Admin', 'admin@portal.com', '$2a$10$g.k7i97tFj4j8X37z17PzOUwE/x3n2i6o9x.6t8t0jC4y4i0P8uW2', 1, 1, '2020-01-01', 'Active', 95000.00),
(2, 'Sarah', 'HR', 'hr@portal.com', '$2a$10$g.k7i97tFj4j8X37z17PzOUwE/x3n2i6o9x.6t8t0jC4y4i0P8uW2', 2, 2, '2021-06-15', 'Active', 75000.00),
(3, 'John', 'Manager', 'manager@portal.com', '$2a$10$g.k7i97tFj4j8X37z17PzOUwE/x3n2i6o9x.6t8t0jC4y4i0P8uW2', 3, 3, '2022-03-10', 'Active', 85000.00),
(4, 'David', 'Employee', 'employee@portal.com', '$2a$10$g.k7i97tFj4j8X37z17PzOUwE/x3n2i6o9x.6t8t0jC4y4i0P8uW2', 4, 3, '2023-08-01', 'Active', 60000.00)
ON DUPLICATE KEY UPDATE email=VALUES(email), password=VALUES(password), role_id=VALUES(role_id), department_id=VALUES(department_id), status=VALUES(status), salary=VALUES(salary);

-- 4. Update Departments with Managers
UPDATE departments SET manager_id = 1 WHERE id = 1;
UPDATE departments SET manager_id = 2 WHERE id = 2;
UPDATE departments SET manager_id = 3 WHERE id = 3;

-- 5. Seed Holidays
INSERT INTO holidays (id, name, date) VALUES
(1, 'New Year\'s Day', '2026-01-01'),
(2, 'Good Friday', '2026-04-03'),
(3, 'Independence Day', '2026-07-04'),
(4, 'Labor Day', '2026-09-07'),
(5, 'Thanksgiving Day', '2026-11-26'),
(6, 'Christmas Day', '2026-12-25')
ON DUPLICATE KEY UPDATE name=VALUES(name), date=VALUES(date);

-- 6. Seed Attendance
INSERT INTO attendance (employee_id, date, check_in, check_out, status) VALUES
(3, '2026-06-29', '09:00:00', '17:00:00', 'Present'),
(4, '2026-06-29', '09:15:00', '17:00:00', 'Present'),
(3, '2026-06-30', '08:55:00', NULL, 'Present'),
(4, '2026-06-30', '09:45:00', NULL, 'Late')
ON DUPLICATE KEY UPDATE check_in=VALUES(check_in), check_out=VALUES(check_out), status=VALUES(status);

-- 7. Seed Leaves
INSERT INTO leaves (employee_id, leave_type, start_date, end_date, reason, status, approved_by) VALUES
(4, 'Sick Leave', '2026-06-20', '2026-06-22', 'Medical checkup and rest', 'Approved', 2),
(4, 'Annual Leave', '2026-07-10', '2026-07-15', 'Family vacation', 'Pending', NULL);

-- 8. Seed Payroll
INSERT INTO payroll (employee_id, base_salary, allowances, deductions, net_salary, payment_date, status) VALUES
(1, 95000.00, 5000.00, 2000.00, 98000.00, '2026-05-31', 'Paid'),
(2, 75000.00, 3000.00, 1500.00, 76500.00, '2026-05-31', 'Paid'),
(3, 85000.00, 4000.00, 1800.00, 87200.00, '2026-05-31', 'Paid'),
(4, 60000.00, 2000.00, 1200.00, 60800.00, '2026-05-31', 'Paid');

-- 9. Seed Recruitment Jobs & Candidates
INSERT INTO recruitment_jobs (id, title, description, department_id, status) VALUES
(1, 'Senior React Developer', 'Looking for a Senior Frontend Engineer proficient in React, Tailwind CSS, and state management libraries.', 3, 'Open'),
(2, 'HR Specialist', 'Seeking an experienced recruiter to manage personnel relations and source talent.', 2, 'Open')
ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), status=VALUES(status);

INSERT INTO recruitment_candidates (id, job_id, first_name, last_name, email, resume_url, status) VALUES
(1, 1, 'Alice', 'Smith', 'alice.smith@gmail.com', 'https://example.com/resumes/alice.pdf', 'Interviewing'),
(2, 1, 'Bob', 'Jones', 'bob.jones@yahoo.com', 'https://example.com/resumes/bob.pdf', 'Applied'),
(3, 2, 'Emily', 'Brown', 'emily.b@outlook.com', 'https://example.com/resumes/emily.pdf', 'Offered')
ON DUPLICATE KEY UPDATE first_name=VALUES(first_name), last_name=VALUES(last_name), email=VALUES(email), status=VALUES(status);

-- 10. Seed Performance Reviews
INSERT INTO performance_reviews (employee_id, reviewer_id, review_period, rating, feedback, review_date) VALUES
(4, 3, 'Q1 2026', 4, 'David showed excellent commitment in engineering projects. Needs slight improvement in communication timelines.', '2026-04-10');

-- 11. Seed Notifications
INSERT INTO notifications (employee_id, message, is_read) VALUES
(1, 'System update scheduled for July 1st.', 0),
(2, 'New candidate application for HR Specialist.', 0),
(3, 'David has applied for Annual Leave.', 0),
(4, 'Your Q1 performance review has been posted.', 1);
