const InterviewHistory = require("../models/InterviewHistory");
const Progress = require("../models/Progress");
const Notification = require("../models/Notification");
const { asyncHandler } = require("../middleware/errorHandler");
const { generateQuestions, evaluateSession } = require("../services/agents/interviewCoachAgent");
const { evaluateNewBadges } = require("../services/agents/progressTrackerAgent");

// @desc    Get a new set of interview questions
// @route   GET /api/interview/questions?type=mixed&count=2
// @access  Private
const getQuestions = asyncHandler(async (req, res) => {
  const { type = "mixed", count = 2 } = req.query;
  const questions = generateQuestions(type, parseInt(count, 10));
  res.json({ success: true, questions });
});

// @desc    Submit answers for evaluation and save the session
// @route   POST /api/interview/submit
// @access  Private
const submitAnswers = asyncHandler(async (req, res) => {
  const { targetCareer, sessionType, answers } = req.body;
  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ success: false, message: "answers array is required." });
  }

  const { answers: evaluated, averageScore } = evaluateSession(answers);

  const session = await InterviewHistory.create({
    user: req.user._id,
    targetCareer: targetCareer || "",
    sessionType: sessionType || "mixed",
    answers: evaluated,
    averageScore,
  });

  const progress = await Progress.findOneAndUpdate(
    { user: req.user._id },
    { $push: { interviewScoreHistory: { score: averageScore } } },
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

  res.status(201).json({ success: true, session, newBadges });
});

// @desc    Get interview history
// @route   GET /api/interview/history
// @access  Private
const getInterviewHistory = asyncHandler(async (req, res) => {
  const sessions = await InterviewHistory.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, sessions });
});

module.exports = { getQuestions, submitAnswers, getInterviewHistory };
