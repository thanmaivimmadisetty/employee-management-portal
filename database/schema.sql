-- 12. Employee Tracker
CREATE TABLE IF NOT EXISTS employee_tracker (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    work_date DATE DEFAULT (CURRENT_DATE),
    login_time DATETIME NULL,
    logout_time DATETIME NULL,

    task_name VARCHAR(255),
    project_name VARCHAR(255),
    description TEXT,

    status ENUM(
        'Pending',
        'In Progress',
        'Completed'
    ) DEFAULT 'Pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (employee_id)
        REFERENCES employees(id)
        ON DELETE CASCADE
);