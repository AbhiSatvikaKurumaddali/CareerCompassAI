const coursesData = require("../../data/courses.json");
const { analyzeSkillGap } = require("./skillGapAgent");

/**
 * Learning Roadmap Agent
 * ---------------------------------------------------------------------------
 * Generates a week-by-week learning plan from the output of the Skill Gap
 * Agent: distributes missing skills across weeks, attaches recommended
 * courses/certifications, and suggests hands-on projects.
 * ---------------------------------------------------------------------------
 */
function coursesForSkill(skill) {
  return coursesData.filter((c) => c.skillTags.map((t) => t.toLowerCase()).includes(skill));
}

function projectIdeaFor(skill) {
  const ideas = {
    react: "Build a multi-page portfolio site with React Router and reusable components.",
    "node.js": "Build a REST API with authentication and CRUD endpoints.",
    mongodb: "Design a schema and build a small inventory/task-tracking app.",
    python: "Automate a data-cleaning workflow using pandas.",
    "machine learning": "Train and evaluate a classification model on a public dataset (e.g. Titanic/Iris).",
    sql: "Write complex queries and build a small analytics dashboard from a sample database.",
    figma: "Redesign a well-known app screen and build an interactive prototype.",
    docker: "Containerize a full-stack app with a Dockerfile and docker-compose.",
    aws: "Deploy a static site + serverless function using AWS S3 and Lambda.",
    "network security": "Set up a home lab and perform a basic vulnerability scan with reporting.",
  };
  return ideas[skill] || `Build a small project that applies ${skill} in a real-world scenario.`;
}

function generateRoadmap(profile, targetCareerTitle, durationWeeks = 8) {
  const gap = analyzeSkillGap(profile, targetCareerTitle);
  if (gap.error) return gap;

  const missing = gap.missingSkills.length
    ? gap.missingSkills
    : [{ skill: "advanced topics", priority: "Medium", estimatedWeeks: durationWeeks }];

  // Sort high priority first so critical skills are learned early
  const sorted = [...missing].sort((a, b) => {
    const order = { High: 0, Medium: 1, Low: 2 };
    return order[a.priority] - order[b.priority];
  });

  const weeks = [];
  let weekCursor = 1;
  const certifications = new Set();
  const recommendedProjects = [];

  for (const item of sorted) {
    const weeksNeeded = Math.max(1, Math.min(item.estimatedWeeks, durationWeeks));
    const relatedCourses = coursesForSkill(item.skill);
    relatedCourses.forEach((c) => {
      if (c.isCertification) certifications.add(c.title);
    });

    const projectTitle = projectIdeaFor(item.skill);
    recommendedProjects.push(projectTitle);

    for (let w = 0; w < weeksNeeded && weekCursor <= durationWeeks; w++, weekCursor++) {
      const tasks = [
        {
          title: `Study core concepts of ${item.skill}`,
          type: "learn",
          completed: false,
        },
      ];
      if (relatedCourses[0]) {
        tasks.push({
          title: `Complete course: ${relatedCourses[0].title} (${relatedCourses[0].provider})`,
          type: "learn",
          completed: false,
        });
      }
      if (w === weeksNeeded - 1) {
        tasks.push({ title: `Project: ${projectTitle}`, type: "project", completed: false });
      }
      tasks.push({ title: `Practice ${item.skill} with exercises/quizzes`, type: "practice", completed: false });

      weeks.push({
        weekNumber: weekCursor,
        focus: `${item.skill} (${item.priority} priority)`,
        tasks,
      });
    }
    if (weekCursor > durationWeeks) break;
  }

  // Fill remaining weeks with revision/interview prep if space remains
  while (weekCursor <= durationWeeks) {
    weeks.push({
      weekNumber: weekCursor,
      focus: "Portfolio polish & interview preparation",
      tasks: [
        { title: "Update resume with new skills/projects", type: "practice", completed: false },
        { title: "Mock interview practice session", type: "practice", completed: false },
        { title: "Review and refactor a past project", type: "project", completed: false },
      ],
    });
    weekCursor++;
  }

  return {
    targetCareer: gap.targetCareer,
    durationWeeks,
    weeks,
    certifications: Array.from(certifications),
    recommendedProjects,
    progressPercent: 0,
  };
}

/**
 * Recalculates roadmap progress percentage from task completion state.
 */
function computeProgress(roadmap) {
  let total = 0;
  let completed = 0;
  roadmap.weeks.forEach((w) => {
    w.tasks.forEach((t) => {
      total++;
      if (t.completed) completed++;
    });
  });
  return total ? Math.round((completed / total) * 100) : 0;
}

module.exports = { generateRoadmap, computeProgress };
