const express = require("express");
const { signup, login } = require("../controllers/authController");
const {
  forgotPassword,
  resetPassword,
  getUserProfile
} = require("../controllers/authController");
const { verifyTokenMiddleware } = require('../utils/jwt');

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:id", resetPassword);
router.get('/profile', verifyTokenMiddleware, getUserProfile);

module.exports = router;
