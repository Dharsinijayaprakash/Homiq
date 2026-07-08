const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    try {

        // Get Authorization Header
        const authHeader = req.headers.authorization;

        // Check if token exists
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access Denied. No Token Provided."
            });
        }

        // Extract Token
        const token = authHeader.split(" ")[1];

        // Verify Token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Save user id inside request
        req.user = decoded;

        // Move to next function
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or Expired Token"
        });
    }
};

module.exports = authenticateUser;