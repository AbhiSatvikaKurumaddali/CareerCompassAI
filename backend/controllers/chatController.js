const Profile = require("../models/Profile");
const Progress = require("../models/Progress");
const { asyncHandler } = require("../middleware/errorHandler");
const { generateCompletion } = require("../services/agents/aiProvider");
const { recommendCareers } = require("../services/agents/careerRecommendationAgent");
const careersData = require("../data/careers.json");

/**
 * Very small intent-matching "chat assistant" that answers common career
 * questions using the same rule-based agents as the rest of the app. If an
 * AI_PROVIDER is configured (openai/ollama), it defers to that instead.
 */
function ruleBasedReply(message, profile, progress) {
  const lower = message.toLowerCase();

  if (/(recommend|which|what).*(career|job|path)/.test(lower)) {
    const [top] = recommendCareers(profile, 1);
    if (top) {
      return `Based on your profile, your strongest career match is ${top.title} (${top.matchPercentage}% match). ${top.explanation.join(" ")} Check the Career Recommendations page for the full ranked list.`;
    }
    return "Add some skills and interests to your profile first, and I'll be able to suggest careers for you.";
  }

  if (/(skill gap|missing skill|what.*learn)/.test(lower)) {
    return "Head to the Skill Gap Analysis page, pick a target career, and I'll show you exactly which skills you're missing, their priority, and how long they'll take to learn.";
  }

  if (/(resume|cv)/.test(lower)) {
    return "Upload your resume on the Profile page, then run a review from the Resume Review page — you'll get an ATS score plus concrete suggestions to improve it.";
  }

  if (/(interview)/.test(lower)) {
    return "You can practice technical, HR, and behavioral questions on the Interview Practice page. I'll score your answers and give you improvement tips using the STAR method where relevant.";
  }

  if (/(job)/.test(lower)) {
    return "Check the Job Recommendations page — I match open roles against your current skills and career goals with an explainable match score.";
  }

  if (/(readiness|score)/.test(lower)) {
    const score = progress?.careerReadinessScore ?? 0;
    return `Your current career readiness score is ${score}/100. It's calculated from your skills, experience, education, resume, and stated interests. Complete more of your profile and roadmap to raise it.`;
  }

  if (/(roadmap|plan|learn)/.test(lower)) {
    return "Generate a personalized week-by-week learning roadmap on the Learning Roadmap page — pick your target career and I'll sequence courses, projects, and certifications for you.";
  }

  if (/(hi|hello|hey)/.test(lower)) {
    return "Hi! I'm your CareerCompass AI assistant. Ask me about career recommendations, skill gaps, your resume, interview prep, or job matches.";
  }

  return `I can help with career recommendations, skill gaps, resume reviews, interview prep, and job matches. Try asking things like "what career should I choose?" or "what skills am I missing for ${careersData[0].title}?"`;
}

// @desc    Chat with the AI career assistant
// @route   POST /api/chat
// @access  Private
const chatWithAssistant = asyncHandler(async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: "message is required." });
  }

  const [profile, progress] = await Promise.all([
    Profile.findOne({ user: req.user._id }),
    Progress.findOne({ user: req.user._id }),
  ]);

  let reply;
  try {
    // Attempt real AI provider first (no-op / null when AI_PROVIDER=mock)
    const aiResponse = await generateCompletion(
      `You are a career advisor. User profile skills: ${(profile?.skills || []).join(", ")}. User asks: ${message}`
    );
    reply = aiResponse || ruleBasedReply(message, profile || {}, progress || {});
  } catch (err) {
    // Any AI provider failure gracefully falls back to rule-based logic
    reply = ruleBasedReply(message, profile || {}, progress || {});
  }

  res.json({ success: true, reply });
});

module.exports = { chatWithAssistant };
