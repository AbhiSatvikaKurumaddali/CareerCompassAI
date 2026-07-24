const User = require("../models/User");
const Profile = require("../models/Profile");
const Progress = require("../models/Progress");
const Notification = require("../models/Notification");
const generateToken = require("../utils/generateToken");
const { asyncHandler } = require("../middleware/errorHandler");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ success: false, message: "An account with this email already exists." });
  }

  const user = await User.create({ name, email, password });

  // Bootstrap related documents so the rest of the app has consistent state
  await Profile.create({ user: user._id });
  await Progress.create({ user: user._id });
  await Notification.create({
    user: user._id,
    title: "Welcome to CareerCompass AI 🎉",
    message: "Complete your profile to unlock personalized career recommendations.",
    type: "info",
  });

  const token = generateToken(user._id);
  res.status(201).json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, theme: user.theme },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid email or password." });
  }

  const token = generateToken(user._id);
  res.json({
    success: true,
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, theme: user.theme },
  });
});

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// @desc    Update theme / basic account settings
// @route   PUT /api/auth/settings
// @access  Private
const updateSettings = asyncHandler(async (req, res) => {
  const { theme, name } = req.body;
  if (theme) req.user.theme = theme;
  if (name) req.user.name = name;
  await req.user.save();
  res.json({ success: true, user: req.user });
});

module.exports = { registerUser, loginUser, getMe, updateSettings };
