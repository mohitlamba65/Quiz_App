import jwt from "jsonwebtoken";
import { UserModel } from "../models/user-schema.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// Verify JWT token from Cookies or Header
export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await UserModel.findById(decodedToken?._id).select("-password -refreshToken")
        if (!user) {
            throw new ApiError(401, "Invalid access token")
        }

        // Add legacy role support for existing codebase
        req.user = user;
        req.user.userId = user._id; // Backward compatibility with existing controllers expecting req.user.userId

        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
});

// Alias for backward compatibility if needed, or update import elsewhere
export const verifyToken = verifyJWT;

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
