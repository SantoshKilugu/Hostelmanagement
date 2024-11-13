// // database.js
import mysql from 'mysql2/promise'; // Import MySQL library


const dbconnect = mysql.createPool({
  host: '103.21.58.5',
  user: 'stepcone2024',
  port:'3306',
  password: 'Curie@1867',
  database: 'stepcone',
  timezone: 'utc',
  dateStrings: true,
  waitForConnections: true,
  connectionLimit: 1000,
  queueLimit: 0,
  connectTimeout: 100000, // 10 seconds
  acquireTimeout: 100000 
});

// Log connection success
console.log('Successfully connected to the database.');

export default dbconnect; // Export the connection pool
