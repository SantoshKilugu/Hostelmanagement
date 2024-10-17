// // database.js
import mysql from 'mysql2/promise'; // Import MySQL library


const dbconnect = mysql.createPool({
  host: 'localhost',
  user: 'root',
  port:'3308',
  password: 'root',
  database: 'fingerprint',
  timezone: 'utc',
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 1000,
  queueLimit: 0,
});

// Log connection success
console.log('Successfully connected to the database.');

export default dbconnect; // Export the connection pool
