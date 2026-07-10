const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");

const {
    addMaintenance,
    getMaintenanceHistory,
    getSingleMaintenance,
    updateMaintenance,
    deleteMaintenance
} = require("../controllers/maintenanceController");


router.post("/", authenticateUser, addMaintenance);
router.get("/record/:id", authenticateUser, getSingleMaintenance);
router.get("/:appliance_id", authenticateUser, getMaintenanceHistory);
router.put("/:id", authenticateUser, updateMaintenance);
router.delete("/:id", authenticateUser, deleteMaintenance);
module.exports = router;