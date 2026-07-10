const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// ================= REGISTER USER =================
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if email already exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const result = await pool.query(
            `INSERT INTO users(name, email, password)
             VALUES($1, $2, $3)
             RETURNING id, name, email`,
            [name, email, hashedPassword]
        );

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// ================= LOGIN USER =================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check whether user exists
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const user = result.rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid Password"
            });
        }

        // Generate JWT Token
        console.log("Login Secret:", process.env.JWT_SECRET);
        const token = jwt.sign(
        {
            id: user.id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "24h"
        }
    );

        // Login successful
        return res.status(200).json({
        success: true,
        message: "Login Successful",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
// ================= USER PROFILE =================
const getUserProfile = async (req, res) => {
    try {

        return res.status(200).json({
            success: true,
            message: "Protected Route Accessed Successfully",
            loggedInUser: req.user
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
// ================= EXPORT =================
module.exports = {
    registerUser,
    loginUser,
    getUserProfile
};