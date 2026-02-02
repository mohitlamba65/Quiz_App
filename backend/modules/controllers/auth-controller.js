import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { UserModel } from "../models/user-schema.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await UserModel.findById(userId)
        const accessToken = user.getAccessToken()
        const refreshToken = user.getRefreshToken()
        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Failed to generate tokens", error.message);
    }
}

export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, role, isGuest } = req.body;

    if (
        [username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await UserModel.findOne({
        $or: [{ username }, { email }]
    })

    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    const user = await UserModel.create({
        username: username.toLowerCase(),
        email,
        password,
        role: role || 'student',
        isGuest
    })

    const createdUser = await UserModel.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(400, "User not found")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000
    }

    const loggedInUser = await UserModel.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser,
                accessToken,
                refreshToken
            }, "Login Successful")
        )
})

export const logoutUser = asyncHandler(async (req, res) => {
    await UserModel.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "Logged out successfully", {}))
})

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await UserModel.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token does not match");
        }

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(200, "Access token refreshed successfully", {
                accessToken,
                refreshToken: newRefreshToken
            }))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
})

export const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, "User fetched successfully", req.user));
})

// Guest login adapted to new structure
export const guestLogin = asyncHandler(async (req, res) => {
    const guestId = new mongoose.Types.ObjectId(); // We need a valid Object ID even fake
    // Better to actually create a temporary guest user in DB to support result constraints if needed
    // Or just bypass database for full guest mode if schema allows.
    // For now, let's create a real temporary user marked as guest

    // Actually, simplest is to just sign a token that has isGuest: true
    // But generateAccessAndRefreshTokens expects a DB user.
    // Let's create a temporary guest user in DB
    const username = `Guest_${Math.random().toString(36).substring(7)}`;

    const user = await UserModel.create({
        username,
        email: `${username}@guest.com`,
        password: `guest_${Date.now()}`, // Random password
        role: 'guest',
        isGuest: true
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: { ...user.toObject(), password: undefined, refreshToken: undefined },
                accessToken,
                refreshToken
            }, "Guest session created")
        )
})
