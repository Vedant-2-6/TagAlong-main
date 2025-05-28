const ParcelRequest = require('../models/ParcelRequest');
const Trip = require('../models/Trip');

// Get all parcel requests for the current user
exports.getMyParcels = async (req, res) => {
  try {
    const parcels = await ParcelRequest.find({ 
      $or: [
        { sender: req.user._id },
        { carrier: req.user._id }
      ]
    })
    .populate('trip')
    .populate('carrier')
    .populate('sender');
    
    res.json(parcels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new parcel request
exports.createParcelRequest = async (req, res) => {
  try {
    const { description, weight, category, trip } = req.body;
    const tripDetails = await Trip.findById(trip).populate('user');
    if (!tripDetails) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    const carrier = tripDetails.user;

    const newRequest = new ParcelRequest({
      description,
      weight,
      category,
      trip, 
      carrier,
      sender: req.user._id,
      status: 'pending'
    });

    const savedRequest = await newRequest.save();
    const populatedRequest = await savedRequest.populate('trip carrier');
    res.status(201).json(populatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};