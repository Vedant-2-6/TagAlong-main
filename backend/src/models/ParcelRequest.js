const mongoose = require('mongoose');

const parcelRequestSchema = new mongoose.Schema({
  description: { type: String, required: true },
  weight: { type: Number, required: true },
  category: { type: String, required: true },
  trip: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  carrier: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
});

module.exports = mongoose.model('ParcelRequest', parcelRequestSchema);