const mongoose = require("mongoose");

const CareerPathSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    requiredSkills: [{ type: String }],
    salaryRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: "USD" },
    },
    growthOutlook: { type: String, default: "" }, // e.g. "High growth (22% by 2032)"
    relatedInterests: [{ type: String }],
    industry: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareerPath", CareerPathSchema);
