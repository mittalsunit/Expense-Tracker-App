const bcrypt = require("bcryptjs");
const { ForgotPassword, User } = require("../models");
const { generateToken } = require("../utils/jwt");
const { sendResetEmail } = require("../utils/email");
const { v4: uuidv4 } = require("uuid");

// Signup Function
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Login Function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Forgot Password Function
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetRequest = await ForgotPassword.create({
      userId: user.id,
      id: uuidv4(),
    });

    const resetLink = `http://127.0.0.1:5000/auth/reset-password/${resetRequest.id}`;
    await sendResetEmail(email, resetLink);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Reset Password Function
exports.resetPassword = async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  try {
    const resetRequest = await ForgotPassword.findOne({ where: { id } });

    if (!resetRequest || !resetRequest.is_active)
      return res.status(400).json({ message: "Invalid or expired reset link" });

    const user = await User.findByPk(resetRequest.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    resetRequest.is_active = false;
    await resetRequest.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Check User Details
exports.getUserProfile = async (req, res) => {
  const { id } = req.user; // Extract user ID from the verified token (via middleware)

  try {
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'isPremium'], // Select only necessary fields
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile', error });
  }
};
