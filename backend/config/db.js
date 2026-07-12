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
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status ENUM('To Do','In Progress','Done') DEFAULT 'To Do',
        priority ENUM('Low','Medium','High') DEFAULT 'Medium',
        assigned_to INT,
        created_by INT,
        due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Tasks table is ready");
  } catch (err) {
    console.error("❌ Failed to create tasks table:", err);
  }
}

createTasksTable();
module.exports = pool;
