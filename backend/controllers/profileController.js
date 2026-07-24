const path = require("path");
const Profile = require("../models/Profile");
const Progress = require("../models/Progress");
const { asyncHandler } = require("../middleware/errorHandler");
const { analyzeProfile } = require("../services/agents/profileAnalyzerAgent");
const { extractTextFromPDF } = require("../utils/resumeParser");

// @desc    Get current user's profile
// @route   GET /api/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  let profile = await Profile.findOne({ user: req.user._id });
  if (!profile) profile = await Profile.create({ user: req.user._id });
  res.json({ success: true, profile });
});

// @desc    Update profile fields (education, experience, interests, skills, goals)
// @route   PUT /api/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    "headline",
    "bio",
    "education",
    "experience",
    "interests",
    "skills",
    "careerGoals",
  ];
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const profile = await Profile.findOneAndUpdate(
    { user: req.user._id },
    { $set: updates },
    { new: true, upsert: true }
  );

  res.json({ success: true, profile });
});

// @desc    Upload resume PDF, extract text, and store on profile
// @route   POST /api/profile/resume
// @access  Private
const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded. Field name must be 'resume'." });
  }

  const resumeText = await extractTextFromPDF(req.file.path);
  const resumeUrl = `/uploads/${path.basename(req.file.path)}`;

  const profile = await Profile.findOneAndUpdate(
    { user: req.user._id },
    { $set: { resumeUrl, resumeText } },
    { new: true, upsert: true }
  );

  res.json({ success: true, profile, message: "Resume uploaded and parsed successfully." });
});

// @desc    Run the Profile Analyzer Agent and cache results
// @route   POST /api/profile/analyze
// @access  Private
const runProfileAnalysis = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });
  if (!profile) {
    return res.status(404).json({ success: false, message: "Profile not found." });
  }

  const analysis = analyzeProfile(profile);
  profile.analysis = analysis;
  await profile.save();

  // Sync readiness score into Progress collection for dashboard/history
  await Progress.findOneAndUpdate(
    { user: req.user._id },
    { $set: { careerReadinessScore: analysis.careerReadinessScore } },
    { upsert: true }
  );

  res.json({ success: true, analysis });
});

module.exports = { getProfile, updateProfile, uploadResume, runProfileAnalysis };
