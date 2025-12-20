import express from "express";
import { signup, login, guestLogin, getCurrentUser } from "../controllers/auth-controller.js";
import { verifyToken } from "../middleware/auth-middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/guest", guestLogin);
router.get("/me", verifyToken, getCurrentUser);

export const authRoutes = router;
