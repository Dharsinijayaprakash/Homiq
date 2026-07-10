const pool = require("../config/db");


// ================= ADD MAINTENANCE RECORD =================

const addMaintenance = async (req, res) => {

    try {

        const userId = req.user.id;

        const {
            appliance_id,
            service_date,
            service_type,
            cost,
            technician_name,
            service_center,
            invoice_number,
            next_service_date,
            remarks
        } = req.body;


        // Check appliance ownership

        const appliance = await pool.query(
            `SELECT *
             FROM appliances
             WHERE id = $1
             AND user_id = $2`,
            [appliance_id, userId]
        );


        if (appliance.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Appliance not found"
            });

        }


        // Insert maintenance record

        const result = await pool.query(
            `INSERT INTO maintenance_history
            (
                appliance_id,
                service_date,
                service_type,
                cost,
                technician_name,
                service_center,
                invoice_number,
                next_service_date,
                remarks
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            RETURNING *`,
            [
                appliance_id,
                service_date,
                service_type,
                cost,
                technician_name,
                service_center,
                invoice_number,
                next_service_date,
                remarks
            ]
        );


        return res.status(201).json({

            success: true,
            message: "Maintenance Added Successfully",
            maintenance: result.rows[0]

        });


    } catch(error) {

        console.error(error);

        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });

    }

};
// ================= GET MAINTENANCE HISTORY =================

const getMaintenanceHistory = async (req, res) => {

    try {

        const applianceId = req.params.appliance_id;
        const userId = req.user.id;

        // Verify ownership

        const appliance = await pool.query(
            `SELECT *
             FROM appliances
             WHERE id = $1
             AND user_id = $2`,
            [applianceId, userId]
        );

        if (appliance.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Appliance not found"
            });

        }

        // Get maintenance records

        const result = await pool.query(
            `SELECT *
             FROM maintenance_history
             WHERE appliance_id = $1
             ORDER BY service_date DESC`,
            [applianceId]
        );

        return res.status(200).json({

            success: true,
            total: result.rows.length,
            maintenance: result.rows

        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};
// ================= GET SINGLE MAINTENANCE =================

const getSingleMaintenance = async (req, res) => {

    try {

        const maintenanceId = req.params.id;
        const userId = req.user.id;

        const result = await pool.query(
            `
            SELECT mh.*
            FROM maintenance_history mh
            JOIN appliances a
            ON mh.appliance_id = a.id
            WHERE mh.id = $1
            AND a.user_id = $2
            `,
            [maintenanceId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Maintenance record not found"
            });
        }

        return res.status(200).json({
            success: true,
            maintenance: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};
// ================= UPDATE MAINTENANCE =================

const updateMaintenance = async (req, res) => {

    try {

        const maintenanceId = req.params.id;
        const userId = req.user.id;

        const {
            service_date,
            service_type,
            cost,
            technician_name,
            service_center,
            invoice_number,
            next_service_date,
            remarks
        } = req.body;

        // Verify ownership

        const existingRecord = await pool.query(
            `
            SELECT mh.*
            FROM maintenance_history mh
            JOIN appliances a
            ON mh.appliance_id = a.id
            WHERE mh.id = $1
            AND a.user_id = $2
            `,
            [maintenanceId, userId]
        );

        if (existingRecord.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Maintenance record not found"
            });
        }

        // Update record

        const result = await pool.query(
            `
            UPDATE maintenance_history
            SET
                service_date = $1,
                service_type = $2,
                cost = $3,
                technician_name = $4,
                service_center = $5,
                invoice_number = $6,
                next_service_date = $7,
                remarks = $8
            WHERE id = $9
            RETURNING *
            `,
            [
                service_date,
                service_type,
                cost,
                technician_name,
                service_center,
                invoice_number,
                next_service_date,
                remarks,
                maintenanceId
            ]
        );

        return res.status(200).json({
            success: true,
            message: "Maintenance updated successfully",
            maintenance: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};
// ================= DELETE MAINTENANCE =================

const deleteMaintenance = async (req, res) => {

    try {

        const maintenanceId = req.params.id;
        const userId = req.user.id;

        // Verify ownership

        const existingRecord = await pool.query(
            `
            SELECT mh.*
            FROM maintenance_history mh
            JOIN appliances a
            ON mh.appliance_id = a.id
            WHERE mh.id = $1
            AND a.user_id = $2
            `,
            [maintenanceId, userId]
        );

        if (existingRecord.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Maintenance record not found"
            });
        }

        // Delete maintenance record

        await pool.query(
            `
            DELETE FROM maintenance_history
            WHERE id = $1
            `,
            [maintenanceId]
        );

        return res.status(200).json({
            success: true,
            message: "Maintenance record deleted successfully"
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
    addMaintenance,
    getMaintenanceHistory,
    getSingleMaintenance,
    updateMaintenance,
    deleteMaintenance
};