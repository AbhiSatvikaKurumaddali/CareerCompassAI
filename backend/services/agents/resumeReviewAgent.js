const skillsData = require("../../data/skills.json");

const ALL_SKILLS = skillsData.map((s) => s.name.toLowerCase());

const ACTION_VERBS = [
  "built", "developed", "designed", "led", "managed", "created", "implemented",
  "optimized", "improved", "launched", "automated", "reduced", "increased",
  "architected", "deployed", "collaborated", "mentored", "analyzed",
];

const SECTION_HEADERS = ["experience", "education", "skills", "projects", "summary", "contact"];

/**
 * Resume Review Agent
 * ---------------------------------------------------------------------------
 * Evaluates resume text across 5 dimensions (ATS keyword match, formatting,
 * keyword density, grammar heuristics, project description quality) and
 * returns a composite score with actionable suggestions.
 * ---------------------------------------------------------------------------
 */
function reviewResume(resumeText = "", targetCareerSkills = []) {
  const text = resumeText || "";
  const lower = text.toLowerCase();
  const suggestions = [];

  // --- 1. Keyword / ATS score ----------------------------------------------
  const targetSkills = (targetCareerSkills.length ? targetCareerSkills : ALL_SKILLS).map((s) => s.toLowerCase());
  const matchedKeywords = targetSkills.filter((k) => lower.includes(k));
  const missingKeywords = targetSkills.filter((k) => !lower.includes(k)).slice(0, 10);
  const keywordScore = targetSkills.length
    ? Math.round((matchedKeywords.length / targetSkills.length) * 100)
    : 50;
  const atsScore = Math.round(keywordScore * 0.7 + (SECTION_HEADERS.filter((h) => lower.includes(h)).length / SECTION_HEADERS.length) * 30);

  if (missingKeywords.length > 0) {
    suggestions.push(`Consider adding relevant keywords: ${missingKeywords.slice(0, 5).join(", ")}.`);
  }

  // --- 2. Formatting score ---------------------------------------------------
  let formattingScore = 100;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount < 150) {
    formattingScore -= 30;
    suggestions.push("Resume seems short — aim for at least 400-600 words covering experience and projects.");
  }
  if (wordCount > 1200) {
    formattingScore -= 15;
    suggestions.push("Resume is quite long — consider trimming to 1-2 pages for readability.");
  }
  const foundSections = SECTION_HEADERS.filter((h) => lower.includes(h));
  if (foundSections.length < 3) {
    formattingScore -= 20;
    suggestions.push("Add clear section headers such as Experience, Education, Skills, and Projects.");
  }
  formattingScore = Math.max(formattingScore, 0);

  // --- 3. Grammar heuristic score --------------------------------------------
  let grammarScore = 100;
  const sentences = text.split(/[.!?]/).filter((s) => s.trim().length > 0);
  const veryLongSentences = sentences.filter((s) => s.trim().split(/\s+/).length > 40);
  if (veryLongSentences.length > 0) {
    grammarScore -= Math.min(veryLongSentences.length * 5, 25);
    suggestions.push("Some sentences are very long — break them up for clarity.");
  }
  const repeatedWordsMatch = lower.match(/\b(\w+)\s+\1\b/g);
  if (repeatedWordsMatch && repeatedWordsMatch.length > 0) {
    grammarScore -= 10;
    suggestions.push("Detected repeated consecutive words — proofread for typos.");
  }
  grammarScore = Math.max(grammarScore, 0);

  // --- 4. Project description score ------------------------------------------
  const actionVerbCount = ACTION_VERBS.filter((v) => lower.includes(v)).length;
  const hasNumbers = /\d+%|\d+x|\$\d+|\d+\s?(users|projects|hours|days|weeks)/i.test(text);
  let projectDescriptionScore = Math.min(actionVerbCount * 10, 70);
  if (hasNumbers) projectDescriptionScore += 30;
  projectDescriptionScore = Math.min(projectDescriptionScore, 100);

  if (actionVerbCount < 3) {
    suggestions.push("Use more strong action verbs (e.g. built, led, optimized) to describe your work.");
  }
  if (!hasNumbers) {
    suggestions.push("Quantify your impact with numbers (e.g. 'reduced load time by 40%', 'served 10,000 users').");
  }

  // --- Overall composite score -------------------------------------------
  const overallScore = Math.round(
    atsScore * 0.3 + formattingScore * 0.2 + keywordScore * 0.2 + grammarScore * 0.15 + projectDescriptionScore * 0.15
  );

  if (overallScore >= 85) {
    suggestions.unshift("Strong resume overall — minor polish will make it even better.");
  } else if (overallScore < 50) {
    suggestions.unshift("Your resume needs significant improvement to pass ATS screening — focus on keywords and structure first.");
  }

  return {
    atsScore: clamp(atsScore),
    formattingScore: clamp(formattingScore),
    keywordScore: clamp(keywordScore),
    grammarScore: clamp(grammarScore),
    projectDescriptionScore: clamp(projectDescriptionScore),
    overallScore: clamp(overallScore),
    matchedKeywords,
    missingKeywords,
    suggestions,
  };
}

function clamp(n) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

module.exports = { reviewResume };
