import express from 'express';
import dbconnect from './database.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import { exec } from 'child_process';
import path, { dirname } from 'path';
import multer from 'multer';
import fs from 'fs'; // Import fs module
import { fileURLToPath } from 'url';
import XLSX from 'xlsx'; // Import xlsx library
import { fetchAndEmailData } from './Report.js'; 
import cron from 'node-cron'; // Import node-cron for scheduling tasks

import ExcelJS from 'exceljs';
import { scheduleReportTime } from './Report.js'; // Adjust the path if necessary
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3300;
const JWT_SECRET = 'bala222333';

// Middleware
app.use(cors({
    origin: 'http://localhost:3000'  // Your frontend URL
}));
app.use(bodyParser.json());


// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify your upload directory
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use original file name
    }
});
const upload = multer({ storage: storage });

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log('Uploads directory created:', uploadDir);
}

// Registration Endpoint
app.post('/register', async (req, res) => {
    const { name, roll_no, year, branch, hostel_block_name, room_no, parent_no } = req.body;

    try {
        const query = ` INSERT INTO users ( studentId,sname,syear, branch, hostelblock,  roomno,parentno) VALUES (?, ?, ?, ?, ?, ?, ?) `;

        const values = [roll_no,name,  year, branch, hostel_block_name, room_no, parent_no|| null];

        await dbconnect.execute(query, values);
        res.status(201).send({ message: 'Registration details inserted successfully!' });
    } catch (error) {
        console.error('Error inserting registration details:', error);
        res.status(500).send({ error: 'Failed to insert registration details.' });
    }
});



// Endpoint to verify roll number and get user data
app.get('/verify-roll/:roll_no', async (req, res) => {
    const rollNo = req.params.roll_no;

    try {
        const query = 'SELECT * FROM users WHERE studentId = ?';
        const [rows] = await dbconnect.execute(query, [rollNo]);

        if (rows.length > 0) {
            const gatepassQuery = `
            SELECT 
                g.date,
                g.outTime,
                g.inTime
            FROM 
                Gatepass g
            WHERE 
                g.roll_no = ?
        `;
        const [gatepassRows] = await dbconnect.execute(gatepassQuery, [rollNo]);

        // Get the current year and month
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // getMonth() returns 0 for January

        // Count the number of entries in the Gatepass table for the user for the current month
        const countQuery = `
            SELECT COUNT(*) as count 
            FROM Gatepass 
            WHERE roll_no = ? 
              AND YEAR(date) = ? 
              AND MONTH(date) = ?
        `;
        const [countRows] = await dbconnect.execute(countQuery, [rollNo, currentYear, currentMonth]);

      
        const studentData = {
            ...rows[0], // Student details
            gatepasses: gatepassRows, // All Gatepass entries (date, outTime, inTime)
            gatepassCount: countRows[0].count // Gatepass count for the current month
        };

        res.json(studentData); // Return the user data
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send({ error: 'Failed to fetch user data' });
    }
});

app.get('/verify-roll-outpass/:roll_no', async (req, res) => {
    const rollNo = req.params.roll_no;

    try {
        const query = 'SELECT * FROM users WHERE studentId = ?';
        const [rows] = await dbconnect.execute(query, [rollNo]);

        if (rows.length > 0) {
            const gatepassQuery = `
            SELECT 
                g.date,
                g.outTime,
                g.inTime
            FROM 
                Outpass g
            WHERE 
                g.roll_no = ?
        `;
        const [gatepassRows] = await dbconnect.execute(gatepassQuery, [rollNo]);

        // Get the current year and month
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1; // getMonth() returns 0 for January

        // Count the number of entries in the Gatepass table for the user for the current month
        const countQuery = `
            SELECT COUNT(*) as count 
            FROM Outpass 
            WHERE roll_no = ? 
              AND YEAR(date) = ? 
              AND MONTH(date) = ?
        `;
        const [countRows] = await dbconnect.execute(countQuery, [rollNo, currentYear, currentMonth]);

      
        const studentData = {
            ...rows[0], // Student details
            gatepasses: gatepassRows, // All Gatepass entries (date, outTime, inTime)
            gatepassCount: countRows[0].count // Gatepass count for the current month
        };

        res.json(studentData); // Return the user data
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send({ error: 'Failed to fetch user data' });
    }
});


// Endpoint to run the JAR file
app.post('/run-jar', async (req, res) => {
    // const jarPath = path.join(__dirname, '..', 'Register.jar');
    const jarPath="Register.jar";
    exec(`java -jar ${jarPath}`, async (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).send(stderr);
        }

        console.log(`Output: ${stdout}`);
        const lines = stdout.split('\n');
        const id = lines[0].trim();
        const getUserDataById = async (id) => {
            const query = `SELECT * FROM users WHERE studentId = ?`;
            const values = [id];
          
            try {
              const [rows, fields] = await dbconnect.execute(query, values);
              return rows;
            } catch (error) {
              console.error('Error retrieving user data:', error);
              return [];
            }
          };
        try {
            const userData = await getUserDataById(id);
            if (userData.length > 0) {
                res.json(userData);
            } else {
                res.status(404).send('User not found');
            }
        } catch (dbError) {
            console.error('Database query failed:', dbError);
            res.status(500).send('Database query failed');
        }
    });
});


// Endpoint to run the JAR file to update
app.post('/run-jar-update', async (req, res) => {
    // const jarPath = path.join(__dirname, '..', 'Register.jar');
    const jarPath="Update.jar";
    exec(`java -jar ${jarPath}`, async (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).send(stderr);
        }

        console.log(`Output: ${stdout}`);
        const lines = stdout.split('\n');
        const id = lines[0].trim();
        const getUserDataById = async (id) => {
            const query = `SELECT * FROM users WHERE studentId = ?`;
            const values = [id];
          
            try {
              const [rows, fields] = await dbconnect.execute(query, values);
              return rows;
            } catch (error) {
              console.error('Error retrieving user data:', error);
              return [];
            }
          };
        try {
            const userData = await getUserDataById(id);
            if (userData.length > 0) {
                res.json(userData);
            } else {
                res.status(404).send('User not found');
            }
        } catch (dbError) {
            console.error('Database query failed:', dbError);
            res.status(500).send('Database query failed');
        }
    });
});



// Endpoint to run the JAR file
app.post('/run-jar-verify', async (req, res) => {
    // const jarPath = path.join(__dirname, '..', 'Verify.jar');
    const jarPath="Verify.jar";

    exec(`java -jar ${jarPath}`, async (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).send(stderr);
        }

        console.log(`Output: ${stdout}`);
        const lines = stdout.split('\n');
        const id = lines[0].trim(); // Assuming the first line contains the studentId

        const getUserDataById = async (id) => {
            const query = `SELECT * FROM users WHERE studentId = ?`;
            const values = [id];

            try {
                const [rows, fields] = await dbconnect.execute(query, values);
                return rows;
            } catch (error) {
                console.error('Error retrieving user data:', error);
                return [];
            }
        };

        try {
            const userData = await getUserDataById(id);
            if (userData.length > 0) {
                const gatepassQuery = `
                    SELECT 
                        g.date,
                        g.outTime,
                        g.inTime
                    FROM 
                        Gatepass g
                    WHERE 
                        g.roll_no = ?`;
                const [gatepassRows] = await dbconnect.execute(gatepassQuery, [id]);

                const now = new Date();
                const currentYear = now.getFullYear();
                const currentMonth = now.getMonth() + 1;

                const countQuery = `
                    SELECT COUNT(*) as count 
                    FROM Gatepass 
                    WHERE roll_no = ? 
                      AND YEAR(date) = ? 
                      AND MONTH(date) = ?`;
                const [countRows] = await dbconnect.execute(countQuery, [id, currentYear, currentMonth]);

                const studentData = {
                    ...userData[0], // Ensure you're merging the first object from the userData array
                    gatepasses: gatepassRows,
                    gatepassCount: countRows[0].count
                };

                res.json(studentData);
            } else {
                res.status(404).send('User not found');
            }
        } catch (dbError) {
            console.error('Database query failed:', dbError);
            res.status(500).send('Database query failed');
        }
    });
});



// Endpoint to update the Gatepass table
app.post('/update-gatepass', async (req, res) => {
    const { roll_no } = req.body; // Get roll number from request body

    // Get current date and time
    const currentDateTime = new Date();

    // Function to format date and time as 'YYYY-MM-DD HH:MM:SS'
    const formatDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const formattedDateTime = formatDateTime(currentDateTime);
    console.log("Formatted DateTime:", formattedDateTime); // To verify the format

    try {
        // Check if the last transaction for the student has non-null outTime but null inTime (incomplete transaction)
        const checkQuery = `
            SELECT * FROM Gatepass
            WHERE roll_no = ?
            ORDER BY gatepassID DESC
            LIMIT 1
        `;
        const [rows] = await dbconnect.execute(checkQuery, [roll_no]);
        const outpassCheckQuery = `
        SELECT * FROM Outpass
        WHERE roll_no = ?
        ORDER BY outpassID DESC
        LIMIT 1
    `;
    const [outpassRows] = await dbconnect.execute(outpassCheckQuery, [roll_no]);
    const gatepassIncomplete = rows.length > 0 && rows[0].inTime === null;
    const outpassIncomplete = outpassRows.length > 0 && outpassRows[0].inTime === null;

    // If either the Gatepass or Outpass tables have an incomplete transaction, block the insertion
    if (gatepassIncomplete || outpassIncomplete) {
        res.status(400).send({ 
            message: 'Cannot create new gatepass. The student has not yet returned from a previous outing (either Gatepass or Outpass is incomplete).' 
        });
    } else {
        // Insert a new record into the Gatepass table
        const insertQuery = `
            INSERT INTO Gatepass (roll_no, outTime, date)
            VALUES (?, ?, ?)
        `;
        const values = [roll_no, formattedDateTime, formattedDateTime.split(' ')[0]]; // Insert formatted datetime and date

        await dbconnect.execute(insertQuery, values);
        res.status(200).send({ message: 'Gatepass updated successfully!' });
    }
    } catch (error) {
        console.error('Error updating Gatepass:', error);
        res.status(500).send({ error: 'Failed to update Gatepass.' });
    }
});


app.post('/update-outpass', async (req, res) => {
    const { roll_no } = req.body; // Get roll number from request body

    // Get current date and time
    const currentDateTime = new Date();

    // Function to format date and time as 'YYYY-MM-DD HH:MM:SS'
    const formatDateTime = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const formattedDateTime = formatDateTime(currentDateTime);
    console.log("Formatted DateTime:", formattedDateTime); // To verify the format

    try {
        // Check if the last transaction for the student has non-null outTime but null inTime (incomplete transaction) in the Outpass table
        const outpassCheckQuery = `
            SELECT * FROM Outpass
            WHERE roll_no = ?
            ORDER BY outpassID DESC
            LIMIT 1
        `;
        const [outpassRows] = await dbconnect.execute(outpassCheckQuery, [roll_no]);
    
        // Check if the last transaction for the student has non-null outTime but null inTime (incomplete transaction) in the Gatepass table
        const gatepassCheckQuery = `
            SELECT * FROM Gatepass
            WHERE roll_no = ?
            ORDER BY gatepassID DESC
            LIMIT 1
        `;
        const [gatepassRows] = await dbconnect.execute(gatepassCheckQuery, [roll_no]);

        // Check for incomplete transactions in both Outpass and Gatepass tables
        const outpassIncomplete = outpassRows.length > 0 && outpassRows[0].inTime === null;
        const gatepassIncomplete = gatepassRows.length > 0 && gatepassRows[0].inTime === null;

        // If either the Outpass or Gatepass tables have an incomplete transaction, block the insertion
        if (outpassIncomplete || gatepassIncomplete) {
            res.status(400).send({ 
                message: 'Cannot create new outpass. The student has not yet returned from a previous outing (either Gatepass or Outpass is incomplete).' 
            });
        } else {
            // Insert a new record into the Outpass table
            const insertQuery = `
                INSERT INTO Outpass (roll_no, outTime, date)
                VALUES (?, ?, ?)
            `;
            const values = [roll_no, formattedDateTime, formattedDateTime.split(' ')[0]]; // Insert formatted datetime and date
    
            await dbconnect.execute(insertQuery, values);
            res.status(200).send({ message: 'Outpass updated successfully!' });
        }
    } catch (error) {
        console.error('Error updating outpass:', error);
        res.status(500).send({ error: 'Failed to update outpass.' });
    }
});


// Endpoint to upload an Excel file
app.post('/upload-excel', upload.single('excelFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded.' });
    }

    const filePath = req.file.path; // Get the uploaded file path
    console.log('Excel file uploaded:', filePath);

    try {
        // Read the Excel file
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; // Get the first sheet
        const worksheet = workbook.Sheets[sheetName];

        // Convert the sheet to JSON
        const data = XLSX.utils.sheet_to_json(worksheet);

        // Insert data into the database
        for (const row of data) {
            const { roll_no,name,  year, branch, hostel_block_name, room_no, parent_no } = row;

            const query = `INSERT INTO users (studentId,sname, syear, branch, hostelblock,  roomno,parentno) VALUES (?, ?, ?, ?, ?, ?, ?) `;
            const values = [roll_no,name,  year, branch, hostel_block_name, room_no, parent_no || null];

            await dbconnect.execute(query, values);
        }

        res.status(200).send({ message: 'Excel file uploaded and data inserted successfully.' });
    } catch (error) {
        console.error('Error processing Excel file:', error);
        res.status(500).send({ message: 'Failed to process Excel file.' });
    }
});


app.get('/get-student-details/:roll_no', async (req, res) => {
    const rollNo = req.params.roll_no;

    try {
        // Fetch the student details
        const studentQuery = `SELECT r.studentId, r.sname, r.syear, r.branch, r.hostelblock, r.roomno, r.parentno FROM users r WHERE r.studentId = ?`;
        const [studentRows] = await dbconnect.execute(studentQuery, [rollNo]);

        if (studentRows.length > 0) {
            // Fetch the Gatepass details (date, outTime, inTime)
            const gatepassQuery = `
                SELECT 
                    g.date,
                    g.outTime,
                    g.inTime
                FROM 
                    Gatepass g
                WHERE 
                    g.roll_no = ?
            `;
            const outpassQuery = `
                SELECT 
                    g.date,
                    g.outTime,
                    g.inTime
                FROM 
                    Outpass g
                WHERE 
                    g.roll_no = ?
            `;
            const [outpassRows] = await dbconnect.execute(outpassQuery, [rollNo]);
            const [gatepassRows] = await dbconnect.execute(gatepassQuery, [rollNo]);

            // Fetch the image URL associated with the student
            const imageQuery = `SELECT imageUrl FROM images WHERE studentId = ?`;
            const [imageRows] = await dbconnect.execute(imageQuery, [rollNo]);

            // Get the current year and month
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth() + 1; // getMonth() returns 0 for January

            // Count the number of entries in the Gatepass table for the user for the current month
            const countQuery = `
                SELECT COUNT(*) as count 
                FROM Gatepass 
                WHERE roll_no = ? 
                  AND YEAR(date) = ? 
                  AND MONTH(date) = ?
            `;
            const countoutQuery = `
                SELECT COUNT(*) as count 
                FROM Outpass 
                WHERE roll_no = ? 
                  AND YEAR(date) = ? 
                  AND MONTH(date) = ?
            `;
            const [countRows] = await dbconnect.execute(countQuery, [rollNo, currentYear, currentMonth]);
            const [countoutRows] = await dbconnect.execute(countoutQuery, [rollNo, currentYear, currentMonth]);

            // Prepare student data
            const studentData = {
                ...studentRows[0], // Student details
                gatepasses: gatepassRows,
                outpasses: outpassRows,
                gatepassCount: countRows[0].count, // Gatepass count for the current month
                outpassCount: countoutRows[0].count, // Outpass count for the current month
                imageUrl: imageRows.length > 0 ? imageRows[0].imageUrl : null // Fetching the image URL, if available
            };

            res.json(studentData);
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching student details:', error);
        res.status(500).send({ error: 'Failed to fetch student details' });
    }
});



// REPORT routes


// Endpoint to fetch current gatepass report
app.get('/current-gatepass-report', async (req, res) => {
    const query = `
    SELECT 
        r.sname,
        r.studentId,
        r.syear,
        r.branch,
        r.hostelblock,
        r.roomno,
        r.parentno,
        g.outTime AS outTime,
        g.inTime AS inTime,
        DATE(g.date) AS date,  
        g.fine,
        'Gatepass' AS type
    FROM 
        users r
    JOIN 
        Gatepass g ON r.studentId = g.roll_no
    WHERE 
        (DATE(g.outTime) = CURDATE() OR DATE(g.inTime) = CURDATE())

    UNION ALL

    SELECT 
        r.sname,
        r.studentId,
        r.syear,
        r.branch,
        r.hostelblock,
        r.roomno,
        r.parentno,
        o.outTime AS outTime,
        o.inTime AS inTime,
        DATE(o.date) AS date,  
        o.fine,
        'Outpass' AS type
    FROM 
        users r
    JOIN 
        Outpass o ON r.studentId = o.roll_no
    WHERE 
        (DATE(o.outTime) = CURDATE() OR DATE(o.inTime) = CURDATE());
    `;

    try {
        const [rows] = await dbconnect.execute(query);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching current gatepass report:', error);
        res.status(500).send({ error: 'Failed to fetch current gatepass report' });
    }
});

///filtered report
app.get('/current-gatepass-report-filtered', async (req, res) => {
    const { from, to, type } = req.query; // Get the type from the query
    let query;
    let params = [from, to,from,to];

    if (type === 'gatepass') {
        query = `
            SELECT 
                r.sname,
                r.studentId,
                r.syear,
                r.branch,
                r.hostelblock,
                r.roomno,
                r.parentno,
                g.outTime AS outTime,
                g.inTime AS inTime,
                DATE(g.date) AS date,  
                g.fine
            FROM 
                users r
            JOIN 
                Gatepass g ON r.studentId = g.roll_no
            WHERE 
                DATE(g.outTime) BETWEEN ? AND ? 
                OR DATE(g.inTime) BETWEEN ? AND ?;  
        `;
       // Add params for inTime comparison
       
    } else if (type === 'outpass') {
        query = `
            SELECT 
                r.sname,
                r.studentId,
                r.syear,
                r.branch,
                r.hostelblock,
                r.roomno,
                r.parentno,
                o.outTime AS outTime,
                o.inTime AS inTime,
                DATE(o.date) AS date,  
                o.fine
            FROM 
                users r
            JOIN 
                Outpass o ON r.studentId = o.roll_no
            WHERE 
                DATE(o.outTime) BETWEEN ? AND ? 
                OR DATE(o.inTime) BETWEEN ? AND ?;  
        `;
        // Add params for inTime comparison
       
    } else if (type === 'all') {
        query = `
            SELECT 
                r.sname,
                r.studentId,
                r.syear,
                r.branch,
                r.hostelblock,
                r.roomno,
                r.parentno,
                g.outTime AS outTime,
                g.inTime AS inTime,
                DATE(g.date) AS date,  
                g.fine
            FROM 
                users r
            JOIN 
                Gatepass g ON r.studentId = g.roll_no
            WHERE 
                DATE(g.outTime) BETWEEN ? AND ? 
                OR DATE(g.inTime) BETWEEN ? AND ? 
            UNION ALL
            SELECT 
                r.sname,
                r.studentId,
                r.syear,
                r.branch,
                r.hostelblock,
                r.roomno,
                r.parentno,
                o.outTime AS outTime,
                o.inTime AS inTime,
                DATE(o.date) AS date,  
                o.fine
            FROM 
                users r
            JOIN 
                Outpass o ON r.studentId = o.roll_no
            WHERE 
                DATE(o.outTime) BETWEEN ? AND ? 
                OR DATE(o.inTime) BETWEEN ? AND ?;  
        `;
        params.push(from, to,from,to); // Add params for second query in the UNION
    } else {
        return res.status(400).send({ error: 'Invalid report type' });
    }

    try {
        const [rows] = await dbconnect.execute(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching current gatepass report:', error);
        res.status(500).send({ error: 'Failed to fetch current gatepass report' });
    }
});


app.post('/send-report', async (req, res) => {
    const { fromDate, toDate,filterType } = req.body;
    try {
        await fetchAndEmailData(fromDate, toDate,filterType);
        res.status(200).send('Report sent successfully.');
    } catch (error) {
        console.error('Error sending report:', error);
        res.status(500).send('Failed to send report.');
    }
});





// Endpoint to download current gatepass report
app.get('/download-current-gatepass-report', async (req, res) => {
    const query = `
        SELECT 
            r.sname,
        r.studentId,
        r.syear,
        r.branch,
        r.hostelblock,
        r.roomno,
        r.parentno,
        g.outTime AS outTime,
        g.inTime AS inTime,
        DATE(g.date) AS date,  
        g.fine
        FROM 
            users r
        JOIN 
            Gatepass g ON r.studentId = g.roll_no
        WHERE 
            (DATE(g.outTime) = CURDATE() OR DATE(g.inTime) = CURDATE());
    `;

    try {
        const [rows] = await dbconnect.execute(query);
        
        // Create Excel file
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Gatepass Data');

        // Add header row
        worksheet.columns = [
            { header: 'Name', key: 'name', width: 25 },
            { header: 'Roll No', key: 'roll_no', width: 15 },
            { header: 'Year', key: 'year', width: 10 },
            { header: 'Branch', key: 'branch', width: 20 },
            { header: 'Hostel Block Name', key: 'hostel_block_name', width: 25 },
            { header: 'Room No', key: 'room_no', width: 15 },
            { header: 'Parent No', key: 'parent_no', width: 15 },
            { header: 'Out Time', key: 'outTime', width: 20 },
            { header: 'In Time', key: 'inTime', width: 20 },
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Fine', key: 'fine', width: 10 },
        ];

        // Add rows to the Excel file
        rows.forEach(row => {
            worksheet.addRow({
                name: row.sname,
                roll_no: row.studentId,
                year: row.syear,
                branch: row.branch,
                hostel_block_name: row.hostelblock,
                room_no: row.roomno,
                parent_no: row.parentno,
                outTime: row.outTime,
                inTime: row.inTime,
                date: row.date,
                fine: row.fine,
            });
        });

        // Get current date and time for the file name
        const now = new Date();
        const dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD
        const timeString = now.toISOString().split('T')[1].replace(/:/g, '-').split('.')[0]; // HH-MM-SS

        // Folder path to save Excel files
        const folderPath = path.join(__dirname, './Daily_report');
        
        // Create the folder if it doesn't exist
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        // Create file name with current date and time
        const fileName = path.join(folderPath,` ${dateString}_${timeString}.xlsx`);
        await workbook.xlsx.writeFile(fileName);

        // Set the file name dynamically in the download response
        const downloadFileName = `${dateString}_${timeString}.xlsx`;

        // Send the file as a download response
        res.download(fileName, downloadFileName, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send({ error: 'Failed to download the file' });
            }
        });
    } catch (error) {
        console.error('Error downloading current gatepass report:', error);
        res.status(500).send({ error: 'Failed to download current gatepass report' });
    }
});


// Endpoint to save report time
function timeToCron(time) {
    const [hours, minutes] = time.split(':');
    return `${minutes} ${hours} * * *`;
}


app.get('/get-filtered-gatepasses/:rollNo', async (req, res) => {
    const { rollNo } = req.params;
    const { month, year } = req.query;

    if (!month || !year) {
        return res.status(400).json({ message: 'Month and Year are required' });
    }

    try {
    
        const query = `
            SELECT * FROM Gatepass 
            WHERE roll_no = ? 
              AND YEAR(date) = ? 
              AND MONTH(date) = ?
        `;

        const [rows] = await dbconnect.execute(query, [rollNo, year, month]);

      
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No gatepass entries found for the specified month and year' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Error fetching filtered gatepasses:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


app.get('/get-filtered-outpasses/:rollNo', async (req, res) => {
    const { rollNo } = req.params;
    const { month, year } = req.query;

    if (!month || !year) {
        return res.status(400).json({ message: 'Month and Year are required' });
    }

    try {
    
        const query = `
            SELECT * FROM Outpass 
            WHERE roll_no = ? 
              AND YEAR(date) = ? 
              AND MONTH(date) = ?
        `;

        const [rows] = await dbconnect.execute(query, [rollNo, year, month]);

      
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No outpass entries found for the specified month and year' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Error fetching filtered outpasses:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



// Endpoint to save report time and schedule the cron job
app.post('/save-report-time', (req, res) => {
    const { time } = req.body; // Example: "10:00"

    // Convert time to a valid cron expression
    const cronExpression = timeToCron(time);

    // Schedule the report
    scheduleReportTime(cronExpression);

    res.send({ message: 'Report time saved successfully' });
});

//checkin
// Endpoint to check-in using roll number and update check-in time
const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

app.patch('/checkin/:roll_no', async (req, res) => {
    const { roll_no } = req.params;

    try {
        // Check if there's a pending checkout record for the student (roll_no)
        const checkQuery = `
            SELECT * FROM Gatepass 
            WHERE roll_no = ? AND outTime IS NOT NULL AND inTime IS NULL
        `;
        const [gatepassData] = await dbconnect.execute(checkQuery, [roll_no]);

        if (gatepassData.length === 0) {
            return res.status(404).send('No pending checkout record found');
        }

        // Update check-in time for the latest checkout record
        const currentDateTime = new Date();
        const formattedDateTime = formatDateTime(currentDateTime);  // Format the inTime before updating

        const updateQuery = `
            UPDATE Gatepass
            SET inTime = ?
            WHERE roll_no = ? AND outTime IS NOT NULL AND inTime IS NULL
        `;
        await dbconnect.execute(updateQuery, [formattedDateTime, roll_no]);

        res.status(200).send({ message: 'Check-in time for gatepass updated successfully!' });
    } catch (dbError) {
        console.error('Database query failed:', dbError);
        res.status(500).send('Database query failed.');
    }
});

//checkin fingerprint

app.post('/run-jar-verify-checkin', async (req, res) => {
    // const jarPath = path.join(__dirname, '..', 'Verify.jar');
    const jarPath="Verify.jar";
    exec(`java -jar ${jarPath}`, async (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).send(stderr);
        }

        console.log(`Output: ${stdout}`);
        const lines = stdout.split('\n');
        const id = lines[0].trim(); // Assuming the first line contains the studentId

        try {
            // Check if there's a pending checkout record for the student (roll_no)
            const checkQuery = `
                SELECT * FROM Gatepass 
                WHERE roll_no = ? AND outTime IS NOT NULL AND inTime IS NULL
            `;
            const [gatepassData] = await dbconnect.execute(checkQuery, [id]);
    
            if (gatepassData.length === 0) {
                return res.status(404).send('No pending checkout record found');
            }
    
            // Update check-in time for the latest checkout record
            const currentDateTime = new Date();
            const updateQuery = `
                UPDATE Gatepass
                SET inTime = ?
                WHERE roll_no = ? AND outTime IS NOT NULL AND inTime IS NULL
            `;
            await dbconnect.execute(updateQuery, [currentDateTime, id]);
    
            res.status(200).send({ message: 'Check-in time for gatepass updated successfully!' });
        } catch (dbError) {
            console.error('Database query failed:', dbError);
            res.status(500).send('Database query failed.');
        }
    });
});
//outpass
app.post('/run-jar-verify-checkin-out', async (req, res) => {
    // const jarPath = path.join(__dirname, '..', 'Verify.jar');
    const jarPath="Verify.jar";
    exec(`java -jar ${jarPath}`, async (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).send(stderr);
        }

        console.log(`Output: ${stdout}`);
        const lines = stdout.split('\n');
        const id = lines[0].trim(); // Assuming the first line contains the studentId

        try {
            // Check if there's a pending checkout record for the student (roll_no)
            const checkQuery = `
                SELECT * FROM Outpass 
                WHERE roll_no = ? AND outTime IS NOT NULL AND inTime IS NULL
            `;
            const [gatepassData] = await dbconnect.execute(checkQuery, [id]);
    
            if (gatepassData.length === 0) {
                return res.status(404).send('No pending checkout record found');
            }
    
            // Update check-in time for the latest checkout record
            const currentDateTime = new Date();
            const updateQuery = `
                UPDATE Outpass
                SET inTime = ?
                WHERE roll_no = ? AND outTime IS NOT NULL AND inTime IS NULL
            `;
            await dbconnect.execute(updateQuery, [currentDateTime, id]);
    
            res.status(200).send({ message: 'Check-in time for outpass updated successfully!' });
        } catch (dbError) {
            console.error('Database query failed:', dbError);
            res.status(500).send('Database query failed.');
        }
    });
});

app.patch('/checkin-out/:roll_no', async (req, res) => {
    const { roll_no } = req.params;

    try {
        // Check if there's a pending checkout record for the student (roll_no)
        const checkQuery = `
            SELECT * FROM Outpass 
            WHERE roll_no = ? AND outTime IS NOT NULL AND inTime IS NULL
        `;
        const [gatepassData] = await dbconnect.execute(checkQuery, [roll_no]);

        if (gatepassData.length === 0) {
            return res.status(404).send('No pending checkout record found');
        }

        // Update check-in time for the latest checkout record
        const currentDateTime = new Date();
        const formattedDateTime = formatDateTime(currentDateTime);  // Format the inTime before updating

        const updateQuery = `
            UPDATE Outpass
            SET inTime = ?
            WHERE roll_no = ? AND outTime IS NOT NULL AND inTime IS NULL
        `;
        await dbconnect.execute(updateQuery, [formattedDateTime, roll_no]);

        res.status(200).send({ message: 'Check-in time for outpass updated successfully!' });
    } catch (dbError) {
        console.error('Database query failed:', dbError);
        res.status(500).send('Database query failed.');
    }
});

//Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Default credentials
    const defaultUsername = 'admin';
    const defaultPassword = 'admin';

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check for default credentials
    if (username === defaultUsername && password === defaultPassword) {
        const token = jwt.sign(
            { username: defaultUsername },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        return res.json({ message: 'Login successful', token });
    }

    // If the username and password do not match the default, return 401
    return res.status(401).json({ message: 'Invalid username or password' });
});


// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) return res.status(403).json({ message: 'Access denied, token missing!' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// Protected route (example)
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'You have access to this protected route', user: req.user });
});


app.post('/verify-token', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Token is valid' });
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
