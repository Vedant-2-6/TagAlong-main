const User = require('../models/User');

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
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // Find user and update email
    const user = await User.findById(req.user._id || req.user.id || req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.email = email;
    await user.save(); // This ensures pre-save hooks run
    res.json({ user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update email' });
  }
};

// Update user phone
exports.updatePhone = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone is required' });

    // Find user and update phone
    const user = await User.findById(req.user._id || req.user.id || req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.phone = phone;
    await user.save();
    res.json({ user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update phone' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ error: 'Both old and new passwords are required' });

    // Explicitly select password field
    const user = await User.findById(req.user._id || req.user.id || req.user.userId).select('+password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return res.status(400).json({ error: 'Old password is incorrect' });

    user.password = newPassword;
    await user.save(); // This will hash the new password if you have a pre-save hook
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to change password' });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password is required' });
    // Explicitly select password field
    const user = await User.findById(req.user._id || req.user.id || req.user.userId).select('+password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect password' });

    await User.findByIdAndDelete(user._id);
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete account' });
  }
};