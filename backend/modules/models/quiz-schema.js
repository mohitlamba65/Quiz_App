import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    questions: [{
        questId: { type: Number, required: true },
        quest: { type: String, required: true },
        option1: { type: String, required: true },
        option2: { type: String, required: true },
        option3: { type: String, required: true },
        option4: { type: String, required: true },
        answer: { type: String, required: true }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shareableLink: {
        type: String,
        unique: true,
        index: true,
        default: () => uuidv4()
    },
    accessCode: {
        type: String,
        default: null, 
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    timeLimit: {
        type: Number, 
        default: 3600 // 1 hour default
    },
    passingScore: {
        type: Number,
        default: 50 // percentage
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

quizSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

export const QuizModel = mongoose.model("Quiz", quizSchema, "quizzes");
