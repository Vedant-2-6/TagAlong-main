const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['text', 'image', 'location'], 
    default: 'text' 
  },
  metadata: { 
    type: Object, 
    default: null 
  },
  status: { 
    type: String, 
    enum: ['sent', 'delivered', 'read'], 
    default: 'sent' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  timestamp: { 
    type: Number, 
    default: () => Date.now() 
  }
});

// Create a compound index for efficient querying of conversations
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);