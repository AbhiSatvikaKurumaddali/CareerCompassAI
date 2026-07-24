const express = require("express");
const { getQuestions, submitAnswers, getInterviewHistory } = require("../controllers/interviewController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/questions", getQuestions);
router.post("/submit", submitAnswers);
router.get("/history", getInterviewHistory);

module.exports = router;
