/**
 * Progress Tracker Agent
 * ---------------------------------------------------------------------------
 * Aggregates signals from other agents (roadmap completion, resume scores,
 * interview scores, career readiness) into a single progress snapshot and
 * determines whether any achievement badges have been newly earned.
 * ---------------------------------------------------------------------------
 */

const BADGE_RULES = [
  {
    name: "First Steps",
    description: "Completed your profile and got your first career readiness score.",
    check: (p) => p.careerReadinessScore > 0,
  },
  {
    name: "Resume Ready",
    description: "Scored 70+ on a resume review.",
    check: (p) => (p.resumeScoreHistory || []).some((r) => r.score >= 70),
  },
  {
    name: "Interview Warm-Up",
    description: "Completed your first mock interview.",
    check: (p) => (p.interviewScoreHistory || []).length > 0,
  },
  {
    name: "Interview Ace",
    description: "Averaged 8+ in a mock interview session.",
    check: (p) => (p.interviewScoreHistory || []).some((r) => r.score >= 8),
  },
  {
    name: "Roadmap Halfway",
    description: "Completed 50% of your learning roadmap.",
    check: (p) => p.roadmapTasksTotal > 0 && p.roadmapTasksCompleted / p.roadmapTasksTotal >= 0.5,
  },
  {
    name: "Roadmap Champion",
    description: "Completed 100% of your learning roadmap.",
    check: (p) => p.roadmapTasksTotal > 0 && p.roadmapTasksCompleted === p.roadmapTasksTotal,
  },
  {
    name: "Skill Builder",
    description: "Learned 5+ new skills.",
    check: (p) => (p.skillsLearned || []).length >= 5,
  },
  {
    name: "Career Ready",
    description: "Reached a career readiness score of 80+.",
    check: (p) => p.careerReadinessScore >= 80,
  },
];

/**
 * Evaluates badge rules against the current progress document and returns
 * any newly-earned badges (ones not already in progress.badges).
 */
function evaluateNewBadges(progress) {
  const existingNames = new Set((progress.badges || []).map((b) => b.name));
  const newlyEarned = [];
  BADGE_RULES.forEach((rule) => {
    if (!existingNames.has(rule.name) && rule.check(progress)) {
      newlyEarned.push({ name: rule.name, description: rule.description, earnedAt: new Date() });
    }
  });
  return newlyEarned;
}

/**
 * Builds a simplified summary object for dashboard charts.
 */
function buildProgressSummary(progress) {
  return {
    careerReadinessScore: progress.careerReadinessScore || 0,
    roadmapProgressPercent: progress.roadmapTasksTotal
      ? Math.round((progress.roadmapTasksCompleted / progress.roadmapTasksTotal) * 100)
      : 0,
    skillsLearnedCount: (progress.skillsLearned || []).length,
    latestResumeScore: (progress.resumeScoreHistory || []).slice(-1)[0]?.score || 0,
    latestInterviewScore: (progress.interviewScoreHistory || []).slice(-1)[0]?.score || 0,
    resumeScoreTrend: progress.resumeScoreHistory || [],
    interviewScoreTrend: progress.interviewScoreHistory || [],
    badges: progress.badges || [],
  };
}

module.exports = { evaluateNewBadges, buildProgressSummary, BADGE_RULES };
