const mongoose = require("mongoose");

const JobRecommendationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    matchScore: { type: Number, default: 0 },
    requiredSkills: [{ type: String }],
    location: { type: String, default: "Remote" },
    salaryRange: { type: String, default: "" },
    applyLink: { type: String, default: "" },
    savedByUser: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobRecommendation", JobRecommendationSchema);
