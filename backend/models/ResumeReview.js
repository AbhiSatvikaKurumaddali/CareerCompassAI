const mongoose = require("mongoose");

const ResumeReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fileName: { type: String, default: "" },
    atsScore: { type: Number, default: 0 },
    formattingScore: { type: Number, default: 0 },
    keywordScore: { type: Number, default: 0 },
    grammarScore: { type: Number, default: 0 },
    projectDescriptionScore: { type: Number, default: 0 },
    overallScore: { type: Number, default: 0 },
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    suggestions: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResumeReview", ResumeReviewSchema);
