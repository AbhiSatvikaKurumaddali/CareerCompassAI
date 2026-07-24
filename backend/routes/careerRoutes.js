const express = require("express");
const { getCareerRecommendations, getCareerCatalog } = require("../controllers/careerController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/recommendations", getCareerRecommendations);
router.get("/catalog", getCareerCatalog);

module.exports = router;
