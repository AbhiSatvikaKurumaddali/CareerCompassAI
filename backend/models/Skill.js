const mongoose = require("mongoose");

// Master catalog of skills known to the system (used for gap analysis / matching)
const SkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    category: { type: String, default: "General" }, // e.g. Frontend, Backend, Data, Soft Skill
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", SkillSchema);
