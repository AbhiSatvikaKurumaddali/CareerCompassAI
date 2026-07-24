const express = require("express");
const { getProfile, updateProfile, uploadResume, runProfileAnalysis } = require("../controllers/profileController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(protect);

router.get("/", getProfile);
router.put("/", updateProfile);
router.post("/resume", upload.single("resume"), uploadResume);
router.post("/analyze", runProfileAnalysis);

module.exports = router;
