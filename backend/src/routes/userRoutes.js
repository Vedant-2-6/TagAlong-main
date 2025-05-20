const path = require('path');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middlewares/auth');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/avatars'));
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    // Use userId from JWT payload
    const userId = req.user.userId;
    cb(null, `${userId}.${ext}`);
  }
});
const upload = multer({ storage });

// Avatar upload endpoint
router.post('/avatar', authenticate, upload.single('avatar'), userController.uploadAvatar);

// User CRUD endpoints
router.post('/', userController.createUser);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);

// Update email
router.patch('/update-email', authenticate, userController.updateEmail);

// Update phone
router.patch('/update-phone', authenticate, userController.updatePhone);

// Change password
router.put('/change-password', authenticate, userController.changePassword);

// Delete account
router.delete('/delete-account', authenticate, userController.deleteAccount);

module.exports = router;