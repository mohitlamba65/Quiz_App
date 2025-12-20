import express from "express";
import {
    createQuiz,
    getQuizByLink,
    getMyQuizzes,
    getAllQuizzes,
    updateQuiz,
    deleteQuiz,
    getQuizStats,
    getQuizLeaderboard
} from "../controllers/quiz-controller.js";
import { verifyToken, isAdmin, optionalAuth } from "../middleware/auth-middleware.js";

const router = express.Router();

// Admin routes
router.post("/create", verifyToken, isAdmin, createQuiz);
router.get("/my-quizzes", verifyToken, isAdmin, getMyQuizzes);
router.put("/:id", verifyToken, isAdmin, updateQuiz);
router.delete("/:id", verifyToken, isAdmin, deleteQuiz);
router.get("/stats/:id", verifyToken, isAdmin, getQuizStats);
router.get("/leaderboard/:id", verifyToken, isAdmin, getQuizLeaderboard);

// Public/Student routes
router.get("/link/:link", optionalAuth, getQuizByLink);
router.get("/all", optionalAuth, getAllQuizzes);

export const quizRoutes = router;
