const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: {
    ca: fs.readFileSync(__dirname + '/../ca.pem')
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to Aiven MySQL");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed");
    console.error(error);
  }
}

testConnection();

async function createTasksTable() {
  try {

    // Create table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        project_name VARCHAR(150),
        assigned_to INT,
        assigned_by INT,
        priority ENUM('Low','Medium','High','Critical') DEFAULT 'Medium',
        status ENUM('To Do','In Progress','Review','Done') DEFAULT 'To Do',
        due_date DATE,
        estimated_hours INT DEFAULT 0,
        actual_hours INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Add missing columns if the table already exists
    const alterQueries = [
      "ALTER TABLE tasks ADD COLUMN project_name VARCHAR(150)",
      "ALTER TABLE tasks ADD COLUMN assigned_to INT",
      "ALTER TABLE tasks ADD COLUMN assigned_by INT",
      "ALTER TABLE tasks ADD COLUMN priority ENUM('Low','Medium','High','Critical') DEFAULT 'Medium'",
      "ALTER TABLE tasks ADD COLUMN status ENUM('To Do','In Progress','Review','Done') DEFAULT 'To Do'",
      "ALTER TABLE tasks ADD COLUMN due_date DATE",
      "ALTER TABLE tasks ADD COLUMN estimated_hours INT DEFAULT 0",
      "ALTER TABLE tasks ADD COLUMN actual_hours INT DEFAULT 0"
    ];

    for (const query of alterQueries) {
      try {
        await pool.query(query);
      } catch (err) {
        // Ignore "Duplicate column" errors
      }
    }

    console.log("✅ Tasks table is ready");

  } catch (err) {
    console.error("❌ Error creating tasks table:", err);
  }
}

createTasksTable();
async function updateTasksTable() {
  try {
    await pool.query(`
      ALTER TABLE tasks
      ADD COLUMN project_name VARCHAR(150);
    `);

    console.log("✅ project_name column added");
  } catch (err) {
    console.log("Column already exists or another error:", err.message);
  }
}

updateTasksTable();

module.exports = pool;
