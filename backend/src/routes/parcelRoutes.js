const express = require('express');
const router = express.Router();
const parcelController = require('../controllers/parcelcontroller');
const auth = require('../middlewares/auth');

// Create parcel request (requires authentication)
router.post('/request', auth, parcelController.createParcelRequest);

// Get user's parcels (requires authentication)
router.get('/myparcels', auth, parcelController.getMyParcels);

// Update parcel request status (requires authentication)
router.patch('/request/:id/status', auth, parcelController.updateParcelStatus);

module.exports = router;