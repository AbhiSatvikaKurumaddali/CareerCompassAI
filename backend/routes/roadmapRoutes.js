const express = require("express");
const { createRoadmap, getActiveRoadmap, getRoadmapHistory, toggleTask } = require("../controllers/roadmapController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/generate", createRoadmap);
router.get("/", getActiveRoadmap);
router.get("/history", getRoadmapHistory);
router.patch("/:roadmapId/task/:taskId", toggleTask);

module.exports = router;
