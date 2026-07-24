const express = require("express");
const { getProgress, getDashboard } = require("../controllers/progressController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/", getProgress);
router.get("/dashboard", getDashboard);

module.exports = router;
