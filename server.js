const express = require("express");
require("dotenv").config();

console.log(process.env.DB_USER);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_NAME);
const pool = require("./config/db");
const app = express();

app.use(express.json());

// Import Routes
const userRoutes = require("./routes/userRoutes");

// Home Route
app.get("/", (req, res) => {
    res.send("HomePulse AI Backend");
});

// Use Routes
app.use("/api/users", userRoutes);
pool.connect()
    .then(() => {
        console.log("✅ PostgreSQL Connected Successfully!");
    })
    .catch((err) => {
        console.error("❌ Database Connection Failed");
        console.error(err.message);
    });
app.listen(5000, () => {
    console.log("Server Running on Port 5000");
});