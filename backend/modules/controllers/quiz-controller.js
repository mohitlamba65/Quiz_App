import { QuizModel } from "../models/quiz-schema.js";

// Create a new quiz (Admin only)
export const createQuiz = async (req, res) => {
    try {
        const { title, description, category, questions, timeLimit, passingScore } = req.body;

        // Validation
        if (!title || !category || !questions || questions.length === 0) {
            return res.status(400).json({
                message: "Title, category, and at least one question are required"
            });
        }

        // Create quiz
        const quiz = await QuizModel.create({
            title,
            description,
            category,
            questions,
            createdBy: req.user.userId,
            timeLimit: timeLimit || questions.length * 60, // 1 min per question default
            passingScore: passingScore || 50
        });

        res.status(201).json({
            message: "Quiz created successfully",
            quiz: {
                id: quiz._id,
                title: quiz.title,
                shareableLink: quiz.shareableLink,
                category: quiz.category,
                questionCount: quiz.questions.length
            }
        });
    } catch (error) {
        console.error("Create quiz error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get quiz by shareable link
export const getQuizByLink = async (req, res) => {
    try {
        const { link } = req.params;
        const { accessCode } = req.query;

        const quiz = await QuizModel.findOne({
            shareableLink: link,
            isActive: true
        }).populate('createdBy', 'username');

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found or inactive" });
        }

        // Check if quiz requires access code
        if (quiz.accessCode) {
            if (!accessCode) {
                return res.status(403).json({
                    message: "Access code required",
                    requiresCode: true
                });
            }

            if (quiz.accessCode !== accessCode) {
                return res.status(403).json({
                    message: "Invalid access code",
                    requiresCode: true
                });
            }
        }

        res.status(200).json({ quiz });
    } catch (error) {
        console.error("Get quiz error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get all quizzes created by the admin
export const getMyQuizzes = async (req, res) => {
    try {
        const quizzes = await QuizModel.find({ createdBy: req.user.userId })
            .sort({ createdAt: -1 })
            .select('-questions.answer'); // Don't send answers

        res.status(200).json({ quizzes });
    } catch (error) {
        console.error("Get my quizzes error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get all active quizzes (for students)
export const getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await QuizModel.find({ isActive: true })
            .populate('createdBy', 'username')
            .sort({ createdAt: -1 })
            .select('title description category shareableLink createdAt timeLimit passingScore');

        res.status(200).json({ quizzes });
    } catch (error) {
        console.error("Get all quizzes error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Update quiz (Admin only)
export const updateQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Find quiz and check ownership
        const quiz = await QuizModel.findOne({
            _id: id,
            createdBy: req.user.userId
        });

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found or you don't have permission to edit it"
            });
        }

        // Update quiz
        Object.assign(quiz, updates);
        await quiz.save();

        res.status(200).json({
            message: "Quiz updated successfully",
            quiz
        });
    } catch (error) {
        console.error("Update quiz error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Delete quiz (Admin only)
export const deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete quiz
        const quiz = await QuizModel.findOneAndDelete({
            _id: id,
            createdBy: req.user.userId
        });

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found or you don't have permission to delete it"
            });
        }

        res.status(200).json({ message: "Quiz deleted successfully from database" });
    } catch (error) {
        console.error("Delete quiz error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get quiz statistics (Admin only)
export const getQuizStats = async (req, res) => {
    try {
        const { id } = req.params;

        const quiz = await QuizModel.findOne({
            _id: id,
            createdBy: req.user.userId
        });

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        // Import ResultModel here to avoid circular dependency
        const { ResultModel } = await import("../models/result-schema.js");

        const results = await ResultModel.find({ quizId: id });

        const stats = {
            totalAttempts: results.length,
            averageScore: results.length > 0
                ? results.reduce((sum, r) => sum + r.score, 0) / results.length
                : 0,
            passRate: results.length > 0
                ? (results.filter(r => r.status === 'Passed').length / results.length) * 100
                : 0
        };

        res.status(200).json({ quiz, stats });
    } catch (error) {
        console.error("Get quiz stats error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get quiz leaderboard (Admin only)
export const getQuizLeaderboard = async (req, res) => {
    try {
        const { id } = req.params;

        const quiz = await QuizModel.findOne({
            _id: id,
            createdBy: req.user.userId
        });

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found" });
        }

        const { ResultModel } = await import("../models/result-schema.js");

        const results = await ResultModel.find({ quizId: id })
            .populate('userId', 'username email')
            .sort({ score: -1, timestamp: 1 }) // Sort by score descending, then by time ascending
            .limit(100); // Top 100 attempts

        const leaderboard = results.map((result, index) => ({
            rank: index + 1,
            username: result.username,
            email: result.userId?.email || 'N/A',
            score: result.score,
            totalQuestions: result.totalQuestions,
            correctAnswers: result.correctAnswers,
            incorrectAnswers: result.incorrectAnswers,
            status: result.status,
            attemptedAt: result.timestamp
        }));

        res.status(200).json({
            quiz: {
                title: quiz.title,
                category: quiz.category,
                totalQuestions: quiz.questions.length
            },
            leaderboard
        });
    } catch (error) {
        console.error("Get quiz leaderboard error:", error);
        res.status(500).json({ message: error.message });
    }
};
