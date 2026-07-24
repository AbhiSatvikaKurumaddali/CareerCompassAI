const careersData = require("../../data/careers.json");

/**
 * Career Recommendation Agent
 * ---------------------------------------------------------------------------
 * Scores every career path in the catalog against the user's skills,
 * interests, education, and experience, and returns a ranked list with
 * explainable match percentages.
 * ---------------------------------------------------------------------------
 */
function scoreCareer(career, profile) {
  const userSkills = new Set((profile.skills || []).map((s) => s.toLowerCase()));
  const userInterests = new Set((profile.interests || []).map((i) => i.toLowerCase()));

  const requiredSkills = career.requiredSkills.map((s) => s.toLowerCase());
  const matchedSkills = requiredSkills.filter((s) => userSkills.has(s));
  const skillMatchRatio = requiredSkills.length ? matchedSkills.length / requiredSkills.length : 0;

  const interestMatches = career.relatedInterests.filter((i) => userInterests.has(i.toLowerCase()));
  const interestMatchRatio = career.relatedInterests.length
    ? interestMatches.length / career.relatedInterests.length
    : 0;

  const expMonths = (profile.experience || []).reduce((s, e) => s + (e.durationMonths || 0), 0);
  const experienceBonus = Math.min(expMonths / 36, 1); // caps out at 3 years relevant experience

  // Weighted composite: skills matter most, then interests, then experience
  const matchPercentage = Math.round(
    (skillMatchRatio * 0.6 + interestMatchRatio * 0.25 + experienceBonus * 0.15) * 100
  );

  const explanation = [];
  if (matchedSkills.length > 0) {
    explanation.push(`Matches ${matchedSkills.length}/${requiredSkills.length} required skills (${matchedSkills.join(", ")}).`);
  } else {
    explanation.push("No direct skill overlap yet — this would be a growth path.");
  }
  if (interestMatches.length > 0) {
    explanation.push(`Aligns with your interests in ${interestMatches.join(", ")}.`);
  }
  if (expMonths > 0) {
    explanation.push(`${expMonths} months of relevant experience considered.`);
  }

  return {
    title: career.title,
    description: career.description,
    matchPercentage: Math.max(matchPercentage, 5), // never show a 0% to avoid discouraging users
    salaryRange: career.salaryRange,
    requiredSkills: career.requiredSkills,
    missingSkills: requiredSkills.filter((s) => !userSkills.has(s)),
    growthOutlook: career.growthOutlook,
    industry: career.industry,
    explanation,
  };
}

function recommendCareers(profile, limit = 6) {
  const scored = careersData.map((career) => scoreCareer(career, profile));
  scored.sort((a, b) => b.matchPercentage - a.matchPercentage);
  return scored.slice(0, limit);
}

module.exports = { recommendCareers, scoreCareer };
