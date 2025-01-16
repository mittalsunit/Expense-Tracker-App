const express = require("express");
const {
  getLeaderboard,
  downloadExpenses,
} = require("../controllers/premiumController");
const { verifyTokenMiddleware } = require("../utils/jwt");

const router = express.Router();

// Route to fetch the leaderboard
router.get("/leaderboard", verifyTokenMiddleware, getLeaderboard);

router.get("/download-expenses", verifyTokenMiddleware, downloadExpenses);

module.exports = router;
