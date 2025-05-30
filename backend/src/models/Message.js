const mongoose = require('mongoose');
const { encrypt, decrypt } = require('../utils/encryption');

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

// Pre-save hook to encrypt message content before saving to database
messageSchema.pre('save', function(next) {
  // Only encrypt if content is modified and not already encrypted
  if (this.isModified('content') && !this.content.includes(':')) {
    this.content = encrypt(this.content);
  }
  next();
});

// Create a compound index for efficient querying of conversations
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });

// Add a method to decrypt content
messageSchema.methods.decryptContent = function() {
  if (this.content && this.content.includes(':')) {
    return decrypt(this.content);
  }
  return this.content; // Return as is if not encrypted
};

// Virtual property for decrypted content
messageSchema.virtual('decryptedContent').get(function() {
  return this.decryptContent();
});

module.exports = mongoose.model('Message', messageSchema);