const pool = require("../config/db");

const getDashboardStats = async (req, res) => {

    try {

        const userId = req.user.id;

        // Total appliances

        const applianceResult = await pool.query(
            `
            SELECT COUNT(*) AS total_appliances
            FROM appliances
            WHERE user_id = $1
            `,
            [userId]
        );

        // Total maintenance cost

        const maintenanceResult = await pool.query(
            `
            SELECT COALESCE(SUM(mh.cost), 0) AS total_maintenance_cost
            FROM maintenance_history mh
            JOIN appliances a
            ON mh.appliance_id = a.id
            WHERE a.user_id = $1
            `,
            [userId]
        );

        return res.status(200).json({

            success: true,

            stats: {

                totalAppliances:
                    Number(
                        applianceResult.rows[0].total_appliances
                    ),

                totalMaintenanceCost:
                    Number(
                        maintenanceResult.rows[0].total_maintenance_cost
                    )

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
const getWarrantyExpiring = async (req, res) => {

    try {

        const userId = req.user.id;

        const result = await pool.query(
            `
            SELECT
                id,
                name,
                brand,
                warranty_expiry
            FROM appliances
            WHERE user_id = $1
            AND warranty_expiry BETWEEN CURRENT_DATE
            AND CURRENT_DATE + INTERVAL '30 days'
            ORDER BY warranty_expiry ASC
            `,
            [userId]
        );

        return res.status(200).json({

            success: true,

            count: result.rows.length,

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
const getRecentMaintenance = async (req, res) => {

    try {

        const userId = req.user.id;

        const result = await pool.query(
            `
            SELECT
                mh.id,
                mh.service_date,
                mh.service_type,
                mh.cost,
                a.name AS appliance_name,
                a.brand
            FROM maintenance_history mh
            JOIN appliances a
            ON mh.appliance_id = a.id
            WHERE a.user_id = $1
            ORDER BY mh.service_date DESC
            LIMIT 5
            `,
            [userId]
        );

        return res.status(200).json({
            success: true,
            count: result.rows.length,
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
const getUpcomingServices = async (req, res) => {

    try {

        const userId = req.user.id;

        const result = await pool.query(
            `
            SELECT
                mh.id,
                mh.next_service_date,
                mh.service_type,
                a.name AS appliance_name,
                a.brand
            FROM maintenance_history mh
            JOIN appliances a
            ON mh.appliance_id = a.id
            WHERE a.user_id = $1
            AND mh.next_service_date BETWEEN CURRENT_DATE
            AND CURRENT_DATE + INTERVAL '30 days'
            ORDER BY mh.next_service_date ASC
            `,
            [userId]
        );

        return res.status(200).json({

            success: true,

            count: result.rows.length,

            services: result.rows

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
    getDashboardStats,
    getWarrantyExpiring,
    getRecentMaintenance,
    getUpcomingServices
};