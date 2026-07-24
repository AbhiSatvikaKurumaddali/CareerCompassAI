const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    headline: { type: String, default: "" },
    bio: { type: String, default: "" },
    education: [
      {
        degree: String,
        institution: String,
        fieldOfStudy: String,
        startYear: Number,
        endYear: Number,
      },
    ],
    experience: [
      {
        title: String,
        company: String,
        durationMonths: Number,
        description: String,
      },
    ],
    interests: [{ type: String }],
    skills: [{ type: String }],
    resumeUrl: { type: String, default: "" },
    resumeText: { type: String, default: "" },
    careerGoals: [{ type: String }],
    // Cached results of the Profile Analyzer Agent
    analysis: {
      extractedSkills: [{ type: String }],
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      careerReadinessScore: { type: Number, default: 0 },
      lastAnalyzedAt: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);
