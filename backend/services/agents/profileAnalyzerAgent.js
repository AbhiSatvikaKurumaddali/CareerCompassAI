const skillsData = require("../../data/skills.json");

const KNOWN_SKILLS = skillsData.map((s) => s.name.toLowerCase());

/**
 * Profile Analyzer Agent
 * ---------------------------------------------------------------------------
 * Analyzes a user's profile (resume text, declared skills, education,
 * interests, experience) and returns:
 *   - extractedSkills: skills detected/confirmed from resume + declared list
 *   - strengths: qualitative strengths derived from the data
 *   - weaknesses: gaps or missing signals
 *   - careerReadinessScore: 0-100 composite score
 * ---------------------------------------------------------------------------
 */
function extractSkillsFromText(text = "") {
  const lower = text.toLowerCase();
  return KNOWN_SKILLS.filter((skill) => lower.includes(skill));
}

function analyzeProfile(profile) {
  const declaredSkills = (profile.skills || []).map((s) => s.toLowerCase());
  const resumeSkills = extractSkillsFromText(profile.resumeText || "");
  const extractedSkills = Array.from(new Set([...declaredSkills, ...resumeSkills]));

  const strengths = [];
  const weaknesses = [];

  // --- Strength / weakness heuristics -------------------------------------
  if (extractedSkills.length >= 8) {
    strengths.push("Broad technical skill set across multiple domains.");
  } else if (extractedSkills.length >= 4) {
    strengths.push("Solid foundational skill set.");
  } else {
    weaknesses.push("Limited number of demonstrated skills — consider building more projects.");
  }

  if ((profile.experience || []).length > 0) {
    const totalMonths = profile.experience.reduce((sum, e) => sum + (e.durationMonths || 0), 0);
    if (totalMonths >= 24) {
      strengths.push("Meaningful professional experience (2+ years).");
    } else if (totalMonths > 0) {
      strengths.push("Some hands-on professional or internship experience.");
    }
  } else {
    weaknesses.push("No work experience listed — internships or freelance projects can help.");
  }

  if ((profile.education || []).length > 0) {
    strengths.push("Formal education background documented.");
  } else {
    weaknesses.push("Education details missing from profile.");
  }

  if ((profile.interests || []).length === 0) {
    weaknesses.push("No career interests specified — this limits recommendation accuracy.");
  }

  if (!profile.resumeText) {
    weaknesses.push("No resume uploaded — upload one for deeper analysis and ATS scoring.");
  }

  const softSkillHints = ["communication", "leadership", "teamwork", "agile"];
  if (extractedSkills.some((s) => softSkillHints.includes(s))) {
    strengths.push("Demonstrates soft skills valued by employers (communication/leadership).");
  }

  // --- Career readiness score (weighted composite) -------------------------
  const skillScore = Math.min(extractedSkills.length * 6, 40); // up to 40 pts
  const expMonths = (profile.experience || []).reduce((s, e) => s + (e.durationMonths || 0), 0);
  const expScore = Math.min(expMonths * 1.2, 25); // up to 25 pts
  const eduScore = (profile.education || []).length > 0 ? 15 : 0; // 15 pts
  const resumeScore = profile.resumeText ? 10 : 0; // 10 pts
  const interestScore = (profile.interests || []).length > 0 ? 10 : 0; // 10 pts

  const careerReadinessScore = Math.round(
    Math.min(skillScore + expScore + eduScore + resumeScore + interestScore, 100)
  );

  return {
    extractedSkills,
    strengths: strengths.length ? strengths : ["Profile created — keep adding details to unlock insights."],
    weaknesses: weaknesses.length ? weaknesses : ["No major gaps detected. Keep your profile up to date."],
    careerReadinessScore,
    lastAnalyzedAt: new Date(),
  };
}

module.exports = { analyzeProfile, extractSkillsFromText };
