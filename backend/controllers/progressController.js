const Progress = require("../models/Progress");
const Roadmap = require("../models/Roadmap");
const ResumeReview = require("../models/ResumeReview");
const InterviewHistory = require("../models/InterviewHistory");
const JobRecommendation = require("../models/JobRecommendation");
const Profile = require("../models/Profile");
const { asyncHandler } = require("../middleware/errorHandler");
const { buildProgressSummary } = require("../services/agents/progressTrackerAgent");
const { recommendCareers } = require("../services/agents/careerRecommendationAgent");
const { recommendJobs } = require("../services/agents/jobRecommendationAgent");

// @desc    Get progress summary + charts data
// @route   GET /api/progress
// @access  Private
const getProgress = asyncHandler(async (req, res) => {
  let progress = await Progress.findOne({ user: req.user._id });
  if (!progress) progress = await Progress.create({ user: req.user._id });
  const summary = buildProgressSummary(progress);
  res.json({ success: true, progress: summary });
});

// @desc    Aggregate everything needed for the main Dashboard page in one call
// @route   GET /api/progress/dashboard
// @access  Private
const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [progress, profile, roadmap, latestResume, latestInterview, savedJobsCount] = await Promise.all([
    Progress.findOne({ user: userId }),
    Profile.findOne({ user: userId }),
    Roadmap.findOne({ user: userId, isActive: true }),
    ResumeReview.findOne({ user: userId }).sort({ createdAt: -1 }),
    InterviewHistory.findOne({ user: userId }).sort({ createdAt: -1 }),
    JobRecommendation.countDocuments({ user: userId, savedByUser: true }),
  ]);

  const summary = buildProgressSummary(progress || {});
  const topCareer = profile ? recommendCareers(profile, 1)[0] : null;
  const jobMatches = profile ? recommendJobs(profile, 3) : [];

  // Today's tasks: first incomplete task per active week (roadmap not exhausted)
  let todaysTasks = [];
  if (roadmap) {
    for (const week of roadmap.weeks) {
      const incomplete = week.tasks.filter((t) => !t.completed);
      if (incomplete.length > 0) {
        todaysTasks = incomplete.slice(0, 3).map((t) => ({ id: t._id, title: t.title, type: t.type }));
        break;
      }
    }
  }

  res.json({
    success: true,
    dashboard: {
      careerReadinessScore: summary.careerReadinessScore,
      recommendedCareer: topCareer,
      skillGapPercentage: topCareer ? 100 - topCareer.matchPercentage : null,
      roadmapProgressPercent: summary.roadmapProgressPercent,
      todaysTasks,
      resumeScore: latestResume ? latestResume.overallScore : null,
      interviewScore: latestInterview ? latestInterview.averageScore : null,
      jobMatches,
      savedJobsCount,
      badges: summary.badges,
    },
  });
});

module.exports = { getProgress, getDashboard };
