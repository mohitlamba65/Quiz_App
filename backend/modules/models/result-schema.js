import mongoose, { SchemaTypes } from "mongoose";

const resultSchema = mongoose.Schema({
  userId: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: false
  },
  quizId: {
    type: SchemaTypes.ObjectId,
    ref: 'Quiz',
    required: false
  },
  username: { type: SchemaTypes.String, required: true },
  score: { type: SchemaTypes.Number, required: true },
  attempts: { type: SchemaTypes.Number, required: true },
  status: { type: SchemaTypes.String, required: true },
  category: { type: SchemaTypes.String, required: true },
  totalQuestions: { type: SchemaTypes.Number, required: true },
  correctAnswers: { type: SchemaTypes.Number, default: 0 },
  incorrectAnswers: { type: SchemaTypes.Number, default: 0 },
  timestamp: { type: SchemaTypes.Date, default: Date.now },
});

export const ResultModel = mongoose.model("results", resultSchema);