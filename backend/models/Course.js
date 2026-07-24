const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    provider: { type: String, default: "" }, // e.g. Coursera, Udemy, freeCodeCamp
    skillTags: [{ type: String }],
    level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    url: { type: String, default: "" },
    estimatedHours: { type: Number, default: 10 },
    isCertification: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
