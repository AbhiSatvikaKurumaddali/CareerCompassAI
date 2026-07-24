const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    category: { type: String, enum: ["technical", "hr", "behavioral"], required: true },
    answer: { type: String, default: "" },
    score: { type: Number, default: 0 }, // 0-10
    feedback: { type: String, default: "" },
    improvementTips: [{ type: String }],
  },
  { _id: true }
);

const InterviewHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetCareer: { type: String, default: "" },
    sessionType: { type: String, enum: ["technical", "hr", "behavioral", "mixed"], default: "mixed" },
    answers: [AnswerSchema],
    averageScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewHistory", InterviewHistorySchema);
