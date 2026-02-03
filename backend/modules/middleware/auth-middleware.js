import jwt from "jsonwebtoken";
import { UserModel } from "../models/user-schema.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

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

        req.user = user;
        req.user.userId = user._id;

        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
});

export const verifyToken = verifyJWT;

export const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
};

export const isStudent = (req, res, next) => {
    if (req.user.role !== 'student' && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied. Student access required." });
    }
    next();
};

export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (token) {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            const user = await UserModel.findById(decoded?._id).select("-password -refreshToken");

            if (user) {
                req.user = user;
                req.user.userId = user._id;
            } else {
                req.user = { role: 'guest' };
            }
        } else {
            req.user = { role: 'guest' };
        }

        next();
    } catch (error) {
        req.user = { role: 'guest' };
        next();
    }
};
