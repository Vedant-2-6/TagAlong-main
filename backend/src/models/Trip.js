const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., car, bike, truck
  model: { type: String },
  registrationNumber: { type: String },
  verified: { type: Boolean, default: false }
}, { _id: false });

const tripSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  departureDate: { type: Date, required: true },
  arrivalDate: { type: Date },
  transport: { type: String, enum: ['car', 'bike', 'bus', 'train', 'flight', 'other'], required: true },
  vehicle: vehicleSchema, // Nested vehicle details
  capacityWeight: { type: Number, required: true }, // in kg
  capacityVolume: { type: Number, required: true }, // in m³
  acceptsFragile: { type: Boolean, default: false },
  acceptedCategories: [{ type: String }],
  price: { type: Number, required: true },
  identificationPhoto: { type: String },
  verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  description: { type: String },
  images: [{ type: String }],
  trackingInfo: [{
    location: { type: String },
    timestamp: { type: Date, default: Date.now },
    status: { type: String }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trip', tripSchema);