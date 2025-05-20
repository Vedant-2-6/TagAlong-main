const User = require('../models/User');

// Example feature flag
const isFeatureEnabled = process.env.FEATURE_FLAG_UPDATE_EMAIL === 'true';

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Ensure avatar is a full URL
    if (user.avatar && !user.avatar.startsWith('http')) {
      user.avatar = `${req.protocol}://${req.get('host')}/uploads/avatars/${user.avatar}`;
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // Update user's avatar in DB
    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id || req.user.id || req.user.userId, // Support both _id and id
      { avatar: avatarUrl },
      { new: true }
    ).select('-password'); // Exclude password

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ avatarUrl, user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
};

// Update user email
exports.updateEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user.userId, { email }, { new: true }).select('-password');
    res.json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update email' });
  }
};

// Update user phone
exports.updatePhone = async (req, res) => {
  try {
    const { phone } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.user.userId, { phone }, { new: true }).select('-password');
    res.json({ user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update phone' });
  }
};

// Change user password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Both old and new passwords are required' });
    }
    // Use correct user ID property
    const user = await User.findById(req.user.userId).select('+password');
    if (!user || !(await user.comparePassword(oldPassword))) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }
    // Hash the new password before saving
    const bcrypt = require('bcryptjs');
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to change password' });
  }
};
// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    // Use the same userId property as in other methods
    const user = await User.findById(req.user.userId).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: 'Password is incorrect' });
    }
    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
};
