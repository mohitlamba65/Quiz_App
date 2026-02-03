import { ResultModel } from "../models/result-schema.js";

export const saveResult = async (req, res) => {
  try {
    const resultData = {
      ...req.body,
      userId: req.body.userId || null,
      quizId: req.body.quizId || null
    };

    const result = await ResultModel.create(resultData);
    res.status(200).json({ message: "Result saved successfully", result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getResults = async (req, res) => {
  try {
    const results = await ResultModel.find();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserResults = async (req, res) => {
  try {
    const { userId } = req.params;
    const results = await ResultModel.find({ userId })
      .populate('quizId', 'title category')
      .sort({ timestamp: -1 });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

