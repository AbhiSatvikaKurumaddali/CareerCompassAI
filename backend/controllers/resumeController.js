const Profile = require("../models/Profile");
const ResumeReview = require("../models/ResumeReview");
const Progress = require("../models/Progress");
const Notification = require("../models/Notification");
const { asyncHandler } = require("../middleware/errorHandler");
const { reviewResume } = require("../services/agents/resumeReviewAgent");
const careersData = require("../data/careers.json");
const { evaluateNewBadges } = require("../services/agents/progressTrackerAgent");

// @desc    Run the Resume Review Agent on the stored resume text
// @route   POST /api/resume/review
// @access  Private
const runResumeReview = asyncHandler(async (req, res) => {
  const { targetCareer } = req.body;

  const profile = await Profile.findOne({ user: req.user._id });
  if (!profile || !profile.resumeText) {
    return res.status(400).json({ success: false, message: "No resume found. Please upload a resume first." });
  }

  let targetSkills = [];
  if (targetCareer) {
    const career = careersData.find((c) => c.title.toLowerCase() === targetCareer.toLowerCase());
    if (career) targetSkills = career.requiredSkills;
  }

  const result = reviewResume(profile.resumeText, targetSkills);

  const review = await ResumeReview.create({
    user: req.user._id,
    fileName: profile.resumeUrl,
    ...result,
  });

  const progress = await Progress.findOneAndUpdate(
    { user: req.user._id },
    { $push: { resumeScoreHistory: { score: result.overallScore } } },
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

  res.status(201).json({ success: true, review, newBadges });
});

// @desc    Get resume review history
// @route   GET /api/resume/history
// @access  Private
const getResumeHistory = asyncHandler(async (req, res) => {
  const reviews = await ResumeReview.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, reviews });
});

module.exports = { runResumeReview, getResumeHistory };
