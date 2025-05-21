const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const authenticate = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/aadhaar/' }); // temp storage

// OCR Aadhaar
router.post('/ocr/aadhaar', upload.single('aadhaar'), tripController.aadhaarOcr);

// OTP endpoints
router.post('/otp/send', tripController.sendOtp);
router.post('/otp/verify', tripController.verifyOtp);

// Trip creation (protected)
router.post('/trips', authenticate, tripController.createTrip);

module.exports = router;