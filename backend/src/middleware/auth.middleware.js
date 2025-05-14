import jwt from "jsonwebtoken";
import User from "../models/Users.js";

export const protectRoute = async (req, res, next) => {
    try {
        // 1. Get token from cookies
        const token = req.cookies.jwt;
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized - No token provided" 
            });
        }

        // 2. Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        } catch (verifyError) {
            // Handle different JWT errors specifically
            if (verifyError instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized - Invalid token"
                });
            }
            if (verifyError instanceof jwt.TokenExpiredError) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized - Token expired"
                });
            }
            throw verifyError; // Re-throw other errors
        }

        // 3. Find user
        const user = await User.findById(decoded.userId).select("-password -refreshToken");
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - User not found"
            });
        }

        // 4. Attach user to request
        req.user = user;
        next();

    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        
        // Don't expose internal errors to client
        return res.status(500).json({ 
            success: false,
            message: "Internal Server Error" 
        });
    }
};