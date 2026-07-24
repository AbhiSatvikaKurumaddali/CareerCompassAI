/**
 * Seed script — populates the Skill, CareerPath, and Course collections
 * from the JSON datasets so they're queryable via the DB too (the agents
 * themselves read directly from JSON for speed/simplicity, but keeping the
 * DB in sync is useful for admin views, search, and future extensions).
 *
 * Run with: npm run seed
 */
require("dotenv").config();
const connectDB = require("../config/db");
const mongoose = require("mongoose");
const Skill = require("../models/Skill");
const CareerPath = require("../models/CareerPath");
const Course = require("../models/Course");

const skillsData = require("./skills.json");
const careersData = require("./careers.json");
const coursesData = require("./courses.json");

async function seed() {
  await connectDB();

  console.log("Clearing existing catalog data...");
  await Promise.all([Skill.deleteMany({}), CareerPath.deleteMany({}), Course.deleteMany({})]);

  console.log("Seeding skills...");
  await Skill.insertMany(skillsData);

  console.log("Seeding career paths...");
  await CareerPath.insertMany(
    careersData.map((c) => ({
      title: c.title,
      description: c.description,
      requiredSkills: c.requiredSkills,
      salaryRange: c.salaryRange,
      growthOutlook: c.growthOutlook,
      relatedInterests: c.relatedInterests,
      industry: c.industry,
    }))
  );

  console.log("Seeding courses...");
  await Course.insertMany(coursesData);

  console.log("✅ Seed complete.");
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
