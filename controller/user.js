// const { connection, transporter } = require('../index');
// const jwt = require('jsonwebtoken');

// async function create(req, res, next) {
//     const { name, username, gender, email, password } = req.body; 
//     const value = [name, username, gender, email, password];

//     const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     const sql = 'INSERT INTO users (name, username, gender, email, password, verificationToken) VALUES (?, ?, ?, ?, ?, ?)';
//     value.push(verificationToken);
  

//     connection.query(sql, value, (err, result) => {
//         if (err) {
//             console.error(err);
//             return res.status(400).json({ error: "Something went wrong" });
//         } else {
//             console.log('User data inserted successfully');

//             const verificationUrl = `http://localhost:9898/api/user/verify/${verificationToken}`;
//             transporter.sendMail({
//                 to: email,
//                 subject: 'Email Verification',
//                 html: `<p>Please verify your email by clicking the following link: <a href="${verificationUrl}">${verificationUrl}</a></p>`
//             });

//             return res.status(200).json({ message: "User created successfully. Please check your email to verify your account." });
//         }
//     });
// }

// async function verifyEmail(req, res, next) {
//     const { token } = req.params;

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const email = decoded.email;
      

//         const sql = 'UPDATE users SET isVerified = true, verificationToken = NULL WHERE email = ? AND verificationToken = ?';
//         connection.query(sql, [email, token], (err, result) => {
     
//             if (err || result.affectedRows === 0) {
//                 return res.status(400).json({ message: "Invalid or expired token." });
//             }

//             return res.status(200).json({ message: "Email verified successfully." });
//         });
//     } catch (err) {
//         return res.status(400).json({ message: "Invalid or expired token." });
//     }
// }

// module.exports = {
//     create,
//     verifyEmail
// };


const { connection, transporter } = require('../index');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


async function create(req, res, next) {
    const { name, username, gender, email, password } = req.body;
    const otp = crypto.randomInt(100000, 999999).toString();
    const value = [name, username, gender, email, password,otp];

    const sql = 'INSERT INTO users (name, username, gender, email, password, otp) VALUES (?, ?, ?, ?, ?, ?)';

    connection.query(sql, value, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(400).json({ error: "Something went wrong" });
        } else {
            console.log('User data inserted successfully');

            transporter.sendMail({
                to: email,
                subject: 'Email Verification',
                html: `<p>Your OTP for email verification is: ${otp}</p>`
            });

            return res.status(200).json({ message: "User created successfully. Please check your email for the OTP to verify your account." });
        }
    });
}


async function verifyOtp(req, res, next) {
    const { email, otp } = req.body;

    const selectSql = 'SELECT * FROM users WHERE email = ? AND otp = ?';
    connection.query(selectSql, [email, otp], (err, result) => {
        if (err || result.length === 0) {
            return res.status(400).json({ message: "Invalid or expired OTP." });
        }

        const updateSql = 'UPDATE users SET isVerified = true, otp = NULL WHERE email = ?';
        connection.query(updateSql, [email], (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Something went wrong while verifying the OTP." });
            }

            return res.status(200).json({ message: "Email verified successfully." });
        });
    });
}


module.exports = { 
    create,
    verifyOtp
};



