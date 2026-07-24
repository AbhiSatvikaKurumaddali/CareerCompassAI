const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    careerReadinessScore: { type: Number, default: 0 },
    roadmapTasksCompleted: { type: Number, default: 0 },
    roadmapTasksTotal: { type: Number, default: 0 },
    skillsLearned: [{ type: String }],
    resumeScoreHistory: [
      {
        score: Number,
        date: { type: Date, default: Date.now },
      },
    ],
    interviewScoreHistory: [
      {
        score: Number,
        date: { type: Date, default: Date.now },
      },
    ],
    badges: [
      {
        name: String,
        description: String,
        earnedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Progress", ProgressSchema);
