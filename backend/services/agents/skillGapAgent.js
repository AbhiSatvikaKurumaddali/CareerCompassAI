const careersData = require("../../data/careers.json");

/**
 * Skill Gap Agent
 * ---------------------------------------------------------------------------
 * Compares the user's current skills against the skills required for a
 * target career, and returns missing skills with priority and an estimated
 * learning time for each.
 * ---------------------------------------------------------------------------
 */

// Simple priority + time heuristics. In a real system this could come from
// labor-market data; here we use skill category difficulty as a proxy.
const HARD_SKILLS = ["machine learning", "deep learning", "system design", "kubernetes", "mlops", "tensorflow"];
const MEDIUM_SKILLS = ["node.js", "react", "python", "sql", "docker", "aws", "azure", "terraform"];

function estimateLearningWeeks(skill) {
  if (HARD_SKILLS.includes(skill)) return 6;
  if (MEDIUM_SKILLS.includes(skill)) return 3;
  return 2;
}

function priorityFor(skill, index, totalMissing) {
  // Skills earlier in the required list / harder skills get higher priority
  if (HARD_SKILLS.includes(skill)) return "High";
  if (index < Math.ceil(totalMissing / 2)) return "High";
  if (MEDIUM_SKILLS.includes(skill)) return "Medium";
  return "Low";
}

function analyzeSkillGap(profile, targetCareerTitle) {
  const career = careersData.find(
    (c) => c.title.toLowerCase() === (targetCareerTitle || "").toLowerCase()
  );

  if (!career) {
    return {
      error: `Career "${targetCareerTitle}" not found in catalog.`,
      availableCareers: careersData.map((c) => c.title),
    };
  }

  const userSkills = new Set((profile.skills || []).map((s) => s.toLowerCase()));
  const requiredSkills = career.requiredSkills.map((s) => s.toLowerCase());
  const missing = requiredSkills.filter((s) => !userSkills.has(s));
  const possessed = requiredSkills.filter((s) => userSkills.has(s));

  const missingSkills = missing.map((skill, idx) => ({
    skill,
    priority: priorityFor(skill, idx, missing.length),
    estimatedWeeks: estimateLearningWeeks(skill),
  }));

  const gapPercentage = requiredSkills.length
    ? Math.round((missing.length / requiredSkills.length) * 100)
    : 0;

  return {
    targetCareer: career.title,
    currentSkills: possessed,
    missingSkills,
    gapPercentage,
    readinessPercentage: 100 - gapPercentage,
    totalEstimatedWeeks: missingSkills.reduce((sum, m) => sum + m.estimatedWeeks, 0),
  };
}

module.exports = { analyzeSkillGap };
