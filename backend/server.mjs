import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";

import connectDB from "./config/db.mjs";

import authRoutes from "./routes/auth.mjs";
import quizRoutes from "./routes/quiz.mjs";
import questionRoutes from "./routes/question.mjs";
import attemptRoutes from "./routes/attempt.mjs";
import { errorHandler, notFound } from "./middleware/errorMiddleware.mjs";

dotenv.config();

const app = express();

// connect database
connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api", attemptRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;