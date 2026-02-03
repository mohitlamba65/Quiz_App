import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    guestLogin,
    getCurrentUser,
    refreshAccessToken
} from "../controllers/auth-controller.js";
import { verifyJWT } from "../middleware/auth-middleware.js";

export const authRoutes = express.Router();

authRoutes.post("/signup", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/guest", guestLogin);
authRoutes.post("/logout", verifyJWT, logoutUser);
authRoutes.post("/refresh-token", refreshAccessToken);
authRoutes.get("/me", verifyJWT, getCurrentUser);
authRoutes.get("/current-user", verifyJWT, getCurrentUser);
