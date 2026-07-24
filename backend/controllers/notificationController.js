const Notification = require("../models/Notification");
const { asyncHandler } = require("../middleware/errorHandler");

// @desc    Get notifications for the current user
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(30);
  const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
  res.json({ success: true, notifications, unreadCount });
});

// @desc    Mark a notification (or all) as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (id === "all") {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { $set: { isRead: true } });
    return res.json({ success: true, message: "All notifications marked as read." });
  }
  const notification = await Notification.findOneAndUpdate(
    { _id: id, user: req.user._id },
    { $set: { isRead: true } },
    { new: true }
  );
  res.json({ success: true, notification });
});

module.exports = { getNotifications, markAsRead };
