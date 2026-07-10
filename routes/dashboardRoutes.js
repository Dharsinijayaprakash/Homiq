const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");

const {
    getDashboardStats,
    getWarrantyExpiring
} = require("../controllers/dashboardController");

router.get(
    "/warranty-expiring",
    authenticateUser,
    getWarrantyExpiring
);

module.exports = router;