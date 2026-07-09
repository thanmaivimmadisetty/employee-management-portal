const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
  database: process.env.DB_NAME || 'employee_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper to test database connection on load
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully to database:', process.env.DB_NAME || 'employee_db');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed. Please ensure MySQL is running and your configurations in backend/.env are correct.');
    console.error(error);
  }
}

testConnection();

module.exports = pool;
