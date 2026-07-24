const Profile = require("../models/Profile");
const Roadmap = require("../models/Roadmap");
const Progress = require("../models/Progress");
const Notification = require("../models/Notification");
const { asyncHandler } = require("../middleware/errorHandler");
const { generateRoadmap, computeProgress } = require("../services/agents/roadmapAgent");
const { evaluateNewBadges } = require("../services/agents/progressTrackerAgent");

// @desc    Generate a new learning roadmap for a target career
// @route   POST /api/roadmap/generate
// @access  Private
const createRoadmap = asyncHandler(async (req, res) => {
  const { targetCareer, durationWeeks } = req.body;
  if (!targetCareer) {
    return res.status(400).json({ success: false, message: "targetCareer is required." });
  }

  const profile = await Profile.findOne({ user: req.user._id });
  if (!profile) {
    return res.status(404).json({ success: false, message: "Profile not found." });
  }

  const generated = generateRoadmap(profile, targetCareer, durationWeeks || 8);
  if (generated.error) {
    return res.status(404).json({ success: false, message: generated.error });
  }

  // Deactivate previous roadmaps and create the new active one
  await Roadmap.updateMany({ user: req.user._id }, { $set: { isActive: false } });
  const roadmap = await Roadmap.create({ user: req.user._id, ...generated });

  await Progress.findOneAndUpdate(
    { user: req.user._id },
    {
      $set: {
        roadmapTasksTotal: roadmap.weeks.reduce((s, w) => s + w.tasks.length, 0),
        roadmapTasksCompleted: 0,
      },
    },
    { upsert: true }
  );

  res.status(201).json({ success: true, roadmap });
});

// @desc    Get the active roadmap for the current user
// @route   GET /api/roadmap
// @access  Private
const getActiveRoadmap = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findOne({ user: req.user._id, isActive: true }).sort({ createdAt: -1 });
  res.json({ success: true, roadmap: roadmap || null });
});

// @desc    Get all roadmaps (history)
// @route   GET /api/roadmap/history
// @access  Private
const getRoadmapHistory = asyncHandler(async (req, res) => {
  const roadmaps = await Roadmap.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, roadmaps });
});

// @desc    Toggle completion of a specific task within the roadmap
// @route   PATCH /api/roadmap/:roadmapId/task/:taskId
// @access  Private
const toggleTask = asyncHandler(async (req, res) => {
  const { roadmapId, taskId } = req.params;
  const roadmap = await Roadmap.findOne({ _id: roadmapId, user: req.user._id });
  if (!roadmap) {
    return res.status(404).json({ success: false, message: "Roadmap not found." });
  }

  let found = false;
  let completedSkillName = null;
  roadmap.weeks.forEach((week) => {
    week.tasks.forEach((task) => {
      if (task._id.toString() === taskId) {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date() : undefined;
        found = true;
        if (task.completed) completedSkillName = week.focus.split(" (")[0];
      }
    });
  });

  if (!found) {
    return res.status(404).json({ success: false, message: "Task not found." });
  }

  roadmap.progressPercent = computeProgress(roadmap);
  await roadmap.save();

  // Update Progress collection
  const totalTasks = roadmap.weeks.reduce((s, w) => s + w.tasks.length, 0);
  const completedTasks = roadmap.weeks.reduce(
    (s, w) => s + w.tasks.filter((t) => t.completed).length,
    0
  );

  const progress = await Progress.findOneAndUpdate(
    { user: req.user._id },
    {
      $set: { roadmapTasksTotal: totalTasks, roadmapTasksCompleted: completedTasks },
      ...(completedSkillName ? { $addToSet: { skillsLearned: completedSkillName } } : {}),
    },
    { new: true, upsert: true }
  );

  const newBadges = evaluateNewBadges(progress);
  if (newBadges.length) {
    progress.badges.push(...newBadges);
    await progress.save();
    await Notification.insertMany(
      newBadges.map((b) => ({
        user: req.user._id,
        title: `Achievement unlocked: ${b.name} 🏆`,
        message: b.description,
        type: "achievement",
      }))
    );
  }

  res.json({ success: true, roadmap, newBadges });
});

module.exports = { createRoadmap, getActiveRoadmap, getRoadmapHistory, toggleTask };
