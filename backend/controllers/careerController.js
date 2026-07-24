const Profile = require("../models/Profile");
const { asyncHandler } = require("../middleware/errorHandler");
const { recommendCareers } = require("../services/agents/careerRecommendationAgent");
const careersData = require("../data/careers.json");

// @desc    Get career recommendations for the current user
// @route   GET /api/careers/recommendations
// @access  Private
const getCareerRecommendations = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });
  if (!profile) {
    return res.status(404).json({ success: false, message: "Profile not found. Please complete your profile first." });
  }
  const recommendations = recommendCareers(profile);
  res.json({ success: true, recommendations });
});

// @desc    List the full career catalog (for browsing / skill-gap target selection)
// @route   GET /api/careers/catalog
// @access  Private
const getCareerCatalog = asyncHandler(async (req, res) => {
  res.json({ success: true, careers: careersData });
});

module.exports = { getCareerRecommendations, getCareerCatalog };
