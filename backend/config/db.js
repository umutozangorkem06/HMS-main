const mysql = require("mysql2/promise");
require("dotenv").config();

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};



const pool = mysql.createPool(config);

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to database as ID " + connection.threadId);
    connection.release();
  } catch (err) {
    console.error("Database connection failed: " + err.stack);
    process.exit(1); // Exit the application if database connection fails
  }
})();

// Handle pool errors
pool.on("error", (err) => {
  console.error("MySQL Pool Error: " + err.stack);
});

module.exports = pool;
