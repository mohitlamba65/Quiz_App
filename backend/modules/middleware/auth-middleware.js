import jwt from "jsonwebtoken";
import { UserModel } from "../models/user-schema.js";

// Verify JWT token
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Check if user still exists
        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
};

// Check if user is student
export const isStudent = (req, res, next) => {
    if (req.user.role !== 'student' && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Student access required." });
    }
    next();
};

// Optional auth - allows both authenticated and guest users
export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } else {
            req.user = { isGuest: true };
        }

        next();
    } catch (error) {
        req.user = { isGuest: true };
        next();
    }
};
