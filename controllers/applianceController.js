const pool = require("../config/db");

// ================= ADD APPLIANCE =================
const addAppliance = async (req, res) => {
    try {

        // Get logged-in user ID from JWT middleware
        const userId = req.user.id;

        // Get appliance details from request body
        const {
            name,
            brand,
            model,
            purchase_date,
            warranty_expiry,
            location,
            notes
        } = req.body;

        // Insert appliance into database
        const result = await pool.query(
            `INSERT INTO appliances
            (user_id, name, brand, model, purchase_date, warranty_expiry, location, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
                userId,
                name,
                brand,
                model,
                purchase_date,
                warranty_expiry,
                location,
                notes
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Appliance Added Successfully",
            appliance: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
// ================= GET MY APPLIANCES =================
const getMyAppliances = async (req, res) => {
    try {

        // Logged-in user's ID from JWT
        const userId = req.user.id;

        // Get all appliances belonging to this user
        const result = await pool.query(
            `SELECT *
             FROM appliances
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [userId]
        );

        return res.status(200).json({
            success: true,
            total: result.rows.length,
            appliances: result.rows
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
// ================= GET SINGLE APPLIANCE =================
const getSingleAppliance = async (req, res) => {
    try {

        // Appliance ID from URL
        const applianceId = req.params.id;

        // Logged-in user ID from JWT
        const userId = req.user.id;

        // Find appliance that belongs to this user
        const result = await pool.query(
            `SELECT *
             FROM appliances
             WHERE id = $1
             AND user_id = $2`,
            [applianceId, userId]
        );

        // Appliance not found
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Appliance not found"
            });
        }

        return res.status(200).json({
            success: true,
            appliance: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
// ================= UPDATE APPLIANCE =================
const updateAppliance = async (req, res) => {
    try {

        const applianceId = req.params.id;
        const userId = req.user.id;

        const {
            name,
            brand,
            model,
            purchase_date,
            warranty_expiry,
            location,
            notes
        } = req.body;

        // Check ownership
        const existingAppliance = await pool.query(
            `SELECT * FROM appliances
             WHERE id = $1
             AND user_id = $2`,
            [applianceId, userId]
        );

        if (existingAppliance.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Appliance not found"
            });
        }

        // Update appliance
        const result = await pool.query(
            `UPDATE appliances
             SET
                name = $1,
                brand = $2,
                model = $3,
                purchase_date = $4,
                warranty_expiry = $5,
                location = $6,
                notes = $7
             WHERE id = $8
             AND user_id = $9
             RETURNING *`,
            [
                name,
                brand,
                model,
                purchase_date,
                warranty_expiry,
                location,
                notes,
                applianceId,
                userId
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Appliance Updated Successfully",
            appliance: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
// ================= DELETE APPLIANCE =================
const deleteAppliance = async (req, res) => {
    try {

        const applianceId = req.params.id;
        const userId = req.user.id;

        // Check ownership
        const existingAppliance = await pool.query(
            `SELECT *
             FROM appliances
             WHERE id = $1
             AND user_id = $2`,
            [applianceId, userId]
        );

        if (existingAppliance.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Appliance not found"
            });
        }

        // Delete appliance
        await pool.query(
            `DELETE FROM appliances
             WHERE id = $1
             AND user_id = $2`,
            [applianceId, userId]
        );

        return res.status(200).json({
            success: true,
            message: "Appliance Deleted Successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};
module.exports = {
    addAppliance,
    getMyAppliances,
    getSingleAppliance,
    updateAppliance,
    deleteAppliance
};