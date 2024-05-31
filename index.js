require('dotenv').config();

const mysql = require('mysql2');
const nodemailer = require('nodemailer');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "#sql#sql",
    database: "emailallusers"
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to mysql database:', err);
    } else {
        console.log('Connected to mysql database');
    }
});

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

connection.query(`
    CREATE TABLE IF NOT EXISTS users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       username VARCHAR(255) NOT NULL UNIQUE,
       gender VARCHAR(255) NOT NULL,
       password VARCHAR(255) NOT NULL,
       email VARCHAR(255) NOT NULL,
       isVerified BOOLEAN DEFAULT FALSE,
       verificationToken VARCHAR(255)
    )
  `, (err, results, fields) => {
    if (err) {
        console.error('Error creating users table:', err);
        return;
    }
    console.log('Users table created successfully');
});

process.on('SIGINT', () => {
    connection.end();
    console.log('MySQL connection closed');
});

module.exports = { connection, transporter };
