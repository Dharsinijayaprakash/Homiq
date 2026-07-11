const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");

const {
    getDashboardStats,
    getWarrantyExpiring,
    getRecentMaintenance,
    getUpcomingServices
} = require("../controllers/dashboardController");

router.get(
    "/warranty-expiring",
    authenticateUser,
    getWarrantyExpiring
);

router.get(
    "/upcoming-services",
    authenticateUser,
    getUpcomingServices
);

router.get(
    "/recent-maintenance",
    authenticateUser,
    getRecentMaintenance
);

module.exports = router;