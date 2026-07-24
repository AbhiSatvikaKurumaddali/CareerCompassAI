require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorHandler");

// Route modules
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const careerRoutes = require("./routes/careerRoutes");
const skillGapRoutes = require("./routes/skillGapRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const resumeRoutes = require("./routes/resumeRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const jobRoutes = require("./routes/jobRoutes");
const progressRoutes = require("./routes/progressRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();

// Connect to MongoDB Atlas
connectDB();

// --- Global middleware -----------------------------------------------------
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL || "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "test") app.use(morgan("dev"));

// Serve uploaded resumes statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Health check -----------------------------------------------------------
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "CareerCompass AI API is running.", aiProvider: process.env.AI_PROVIDER || "mock" });
});

// --- API routes ---------------------------------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/skill-gap", skillGapRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", chatRoutes);

// --- 404 + error handling ---------------------------------------------------
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 CareerCompass AI API running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
});

module.exports = app;
