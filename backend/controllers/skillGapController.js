const Profile = require("../models/Profile");
const { asyncHandler } = require("../middleware/errorHandler");
const { analyzeSkillGap } = require("../services/agents/skillGapAgent");

// @desc    Get skill gap analysis for a target career
// @route   GET /api/skill-gap?career=Frontend Developer
// @access  Private
const getSkillGap = asyncHandler(async (req, res) => {
  const { career } = req.query;
  if (!career) {
    return res.status(400).json({ success: false, message: "Query param 'career' is required." });
  }

  const profile = await Profile.findOne({ user: req.user._id });
  if (!profile) {
    return res.status(404).json({ success: false, message: "Profile not found." });
  }

  const result = analyzeSkillGap(profile, career);
  if (result.error) {
    return res.status(404).json({ success: false, message: result.error, availableCareers: result.availableCareers });
  }

  res.json({ success: true, ...result });
});

module.exports = { getSkillGap };
