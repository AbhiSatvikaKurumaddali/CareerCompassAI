const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["learn", "project", "certification", "practice"], default: "learn" },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { _id: true }
);

const WeekSchema = new mongoose.Schema(
  {
    weekNumber: { type: Number, required: true },
    focus: { type: String, default: "" },
    tasks: [TaskSchema],
  },
  { _id: false }
);

const RoadmapSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetCareer: { type: String, required: true },
    durationWeeks: { type: Number, default: 8 },
    weeks: [WeekSchema],
    certifications: [{ type: String }],
    recommendedProjects: [{ type: String }],
    progressPercent: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Roadmap", RoadmapSchema);
