import express from "express";
import { createConnection } from "./shared/db/connection.js";
import dotenv from "dotenv";
import cors from "cors";
import { resultRoutes } from "./modules/routes/result-routes.js";
import { authRoutes } from "./modules/routes/auth-routes.js";
import { quizRoutes } from "./modules/routes/quiz-routes.js";

import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const isAllowed = origin.includes(".vercel.app") ||
      origin.includes("localhost") ||
      (process.env.CORS_ORIGIN && process.env.CORS_ORIGIN.includes(origin));

    if (isAllowed) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));



app.use("/auth", authRoutes);
app.use("/quiz", quizRoutes);
app.use("/", resultRoutes);

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
