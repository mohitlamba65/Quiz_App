import express from "express";
import { createConnection } from "./shared/db/connection.js";
import dotenv from "dotenv";
import cors from "cors";
import { AptitudesModel, CodingRoundModel, HrRoundModel } from "./modules/models/questions-schema.js";
import { questionRoutes } from "./modules/routes/questions-routes.js";
import { resultRoutes } from "./modules/routes/result-routes.js";
import { authRoutes } from "./modules/routes/auth-routes.js";
import { quizRoutes } from "./modules/routes/quiz-routes.js";

const app = express();
dotenv.config();

app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "https://quiz-app-sigma-one-61.vercel.app"
];


const corsOptions = {
  origin: function (origin, callback) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin) // Allow all Vercel deployments
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));




// New routes
app.use("/auth", authRoutes);
app.use("/quiz", quizRoutes);

// Legacy routes (for backward compatibility)
app.use("/", questionRoutes);
app.use("/", resultRoutes);

app.post("/", async (req, res) => {
  try {
    const body = req.body;
    console.log(body)
    let Model;

    const category = body.category?.toLowerCase();
    if (category === "aptitude") {
      Model = AptitudesModel;
    } else if (category === "coding") {
      Model = CodingRoundModel;
    } else if (category === "interview") {
      Model = HrRoundModel;
    } else {
      return res.status(400).json({ error: "Unknown category" });
    }

    const questions = await Model.create(body);
    console.log(`Question saved to ${category} collection:`, questions);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const promise = createConnection();
promise.then(() => {
  const PORT = process.env.PORT || 4444;
  app.listen(PORT, (err) => {
    if (err) {
      console.log("application is not running");
    } else {
      console.log(`application is running on port ${PORT}`);
    }
  });
});
