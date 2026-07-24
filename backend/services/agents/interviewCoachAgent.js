const questionBank = require("../../data/interviewQuestions.json");

/**
 * Interview Coach Agent
 * ---------------------------------------------------------------------------
 * Generates technical / HR / behavioral interview questions and evaluates
 * free-text answers using a keyword + structure rubric, returning a score,
 * feedback, and improvement tips.
 * ---------------------------------------------------------------------------
 */
function generateQuestions(sessionType = "mixed", countPerCategory = 2) {
  const categories = sessionType === "mixed" ? ["technical", "hr", "behavioral"] : [sessionType];
  const questions = [];
  categories.forEach((cat) => {
    const pool = questionBank[cat] || [];
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    shuffled.slice(0, countPerCategory).forEach((q) => {
      questions.push({ category: cat, question: q.question, keywords: q.keywords });
    });
  });
  return questions;
}

/**
 * Evaluates a single answer against the rubric:
 *   - Keyword coverage (relevance to expected concepts)
 *   - Length / depth (too short = weak answer)
 *   - Use of specific examples (behavioral/HR)
 */
function evaluateAnswer(question, answerText, category, keywords = []) {
  const answer = (answerText || "").trim();
  const lower = answer.toLowerCase();

  if (!answer) {
    return {
      score: 0,
      feedback: "No answer provided.",
      improvementTips: ["Attempt every question, even a partial answer scores better than none."],
    };
  }

  const wordCount = answer.split(/\s+/).filter(Boolean).length;
  const matchedKeywords = keywords.filter((k) => lower.includes(k.toLowerCase()));
  const keywordScore = keywords.length ? (matchedKeywords.length / keywords.length) * 6 : 4; // up to 6 pts

  let lengthScore = 0;
  if (wordCount >= 40) lengthScore = 3;
  else if (wordCount >= 15) lengthScore = 2;
  else if (wordCount >= 5) lengthScore = 1;

  let structureScore = 0;
  const usesExample = /(for example|for instance|e\.g\.|in my (last|previous)|once i|when i)/i.test(answer);
  if (usesExample && (category === "behavioral" || category === "hr")) structureScore += 1;

  const rawScore = keywordScore + lengthScore + structureScore; // out of ~10
  const score = Math.max(0, Math.min(10, Math.round(rawScore)));

  const improvementTips = [];
  let feedback = "";

  if (score >= 8) {
    feedback = "Excellent answer — clear, relevant, and well-supported.";
  } else if (score >= 6) {
    feedback = "Good answer with solid relevance, but could be more detailed.";
  } else if (score >= 3) {
    feedback = "Answer touches the topic but lacks depth or key concepts.";
  } else {
    feedback = "Answer needs significant improvement in relevance and detail.";
  }

  if (matchedKeywords.length < keywords.length / 2) {
    improvementTips.push(`Try to mention concepts like: ${keywords.slice(0, 3).join(", ")}.`);
  }
  if (wordCount < 15) {
    improvementTips.push("Expand your answer — aim for 3-5 sentences with specific detail.");
  }
  if ((category === "behavioral" || category === "hr") && !usesExample) {
    improvementTips.push("Use the STAR method (Situation, Task, Action, Result) with a concrete example.");
  }
  if (improvementTips.length === 0) {
    improvementTips.push("Keep practicing to maintain this level of quality under time pressure.");
  }

  return { score, feedback, improvementTips };
}

function evaluateSession(answers) {
  // answers: [{ question, category, answer, keywords }]
  const evaluated = answers.map((a) => {
    const result = evaluateAnswer(a.question, a.answer, a.category, a.keywords || []);
    return { ...a, ...result };
  });
  const averageScore = evaluated.length
    ? Math.round((evaluated.reduce((sum, e) => sum + e.score, 0) / evaluated.length) * 10) / 10
    : 0;
  return { answers: evaluated, averageScore };
}

module.exports = { generateQuestions, evaluateAnswer, evaluateSession };
