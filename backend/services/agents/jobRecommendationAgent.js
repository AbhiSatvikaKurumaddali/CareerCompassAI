const jobsData = require("../../data/jobs.json");

/**
 * Job Recommendation Agent
 * ---------------------------------------------------------------------------
 * Matches open job postings (from data/jobs.json — in production this would
 * be a live job-board API) against the user's skills and career goals,
 * returning a ranked list with match scores.
 * ---------------------------------------------------------------------------
 */
function scoreJob(job, profile) {
  const userSkills = new Set((profile.skills || []).map((s) => s.toLowerCase()));
  const requiredSkills = job.requiredSkills.map((s) => s.toLowerCase());
  const matched = requiredSkills.filter((s) => userSkills.has(s));
  const skillRatio = requiredSkills.length ? matched.length / requiredSkills.length : 0;

  const careerGoals = (profile.careerGoals || []).map((g) => g.toLowerCase());
  const goalBonus = careerGoals.some((g) => job.role.toLowerCase().includes(g)) ? 0.15 : 0;

  const matchScore = Math.round(Math.min((skillRatio * 0.85 + goalBonus) * 100, 100));

  return {
    company: job.company,
    role: job.role,
    matchScore: Math.max(matchScore, 5),
    requiredSkills: job.requiredSkills,
    matchedSkills: matched,
    location: job.location,
    salaryRange: job.salaryRange,
    applyLink: job.applyLink,
  };
}

function recommendJobs(profile, limit = 8) {
  const scored = jobsData.map((job) => scoreJob(job, profile));
  scored.sort((a, b) => b.matchScore - a.matchScore);
  return scored.slice(0, limit);
}

module.exports = { recommendJobs, scoreJob };
