const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");
const {
    addAppliance,
    getMyAppliances,
    getSingleAppliance,
    updateAppliance,
    deleteAppliance
} = require("../controllers/applianceController");

// Protected Route
router.post("/", authenticateUser, addAppliance);
router.get("/", authenticateUser, getMyAppliances);
router.get("/:id", authenticateUser, getSingleAppliance);
router.put("/:id", authenticateUser, updateAppliance);
router.delete("/:id", authenticateUser, deleteAppliance);
module.exports = router;