const express = require("express");
const { runResumeReview, getResumeHistory } = require("../controllers/resumeController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/review", runResumeReview);
router.get("/history", getResumeHistory);

module.exports = router;
