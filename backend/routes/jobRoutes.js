const express = require("express");
const { getJobRecommendations, saveJob, getSavedJobs } = require("../controllers/jobController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/recommendations", getJobRecommendations);
router.post("/save", saveJob);
router.get("/saved", getSavedJobs);

module.exports = router;
