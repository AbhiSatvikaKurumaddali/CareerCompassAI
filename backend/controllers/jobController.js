const Profile = require("../models/Profile");
const JobRecommendation = require("../models/JobRecommendation");
const { asyncHandler } = require("../middleware/errorHandler");
const { recommendJobs } = require("../services/agents/jobRecommendationAgent");

// @desc    Get job recommendations for the current user
// @route   GET /api/jobs/recommendations
// @access  Private
const getJobRecommendations = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });
  if (!profile) {
    return res.status(404).json({ success: false, message: "Profile not found." });
  }
  const jobs = recommendJobs(profile);
  res.json({ success: true, jobs });
});

// @desc    Save a job recommendation for the user
// @route   POST /api/jobs/save
// @access  Private
const saveJob = asyncHandler(async (req, res) => {
  const { company, role, matchScore, requiredSkills, location, salaryRange, applyLink } = req.body;
  const job = await JobRecommendation.create({
    user: req.user._id,
    company,
    role,
    matchScore,
    requiredSkills,
    location,
    salaryRange,
    applyLink,
    savedByUser: true,
  });
  res.status(201).json({ success: true, job });
});

// @desc    Get saved jobs
// @route   GET /api/jobs/saved
// @access  Private
const getSavedJobs = asyncHandler(async (req, res) => {
  const jobs = await JobRecommendation.find({ user: req.user._id, savedByUser: true }).sort({ createdAt: -1 });
  res.json({ success: true, jobs });
});

module.exports = { getJobRecommendations, saveJob, getSavedJobs };
