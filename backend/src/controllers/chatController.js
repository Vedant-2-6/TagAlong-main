const Message = require('../models/Message');
const User = require('../models/User');

// Get chat history between two users
exports.getChatHistory = async (req, res) => {
  try {
    const { userId1, userId2 } = req.query;
    
    if (!userId1 || !userId2) {
      return res.status(400).json({ error: 'Both user IDs are required' });
    }
    
    // Find messages where either user is sender and the other is receiver
    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    }).sort({ timestamp: 1 });
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

// Get all chats for a user
exports.getUserChats = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // Find all unique users this user has chatted with
    const sentMessages = await Message.find({ senderId: userId })
      .distinct('receiverId');
      
    const receivedMessages = await Message.find({ receiverId: userId })
      .distinct('senderId');
    
    // Combine and remove duplicates
    const chatPartnerIds = [...new Set([...sentMessages, ...receivedMessages])];
    
    // Get the latest message for each chat
    const chats = [];
    
    for (const partnerId of chatPartnerIds) {
      // Get partner user details
      const partner = await User.findById(partnerId).select('name avatar verificationStatus');
      
      if (!partner) continue;
      
      // Get the latest message
      const latestMessage = await Message.findOne({
        $or: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId }
        ]
      }).sort({ timestamp: -1 });
      
      // Count unread messages
      const unreadCount = await Message.countDocuments({
        senderId: partnerId,
        receiverId: userId,
        status: { $ne: 'read' }
      });
      
      chats.push({
        user: {
          _id: partner._id,
          name: partner.name,
          avatar: partner.avatar,
          verificationStatus: partner.verificationStatus
        },
        lastMessage: {
          content: latestMessage.content,
          timestamp: latestMessage.timestamp,
          createdAt: latestMessage.createdAt
        },
        unreadCount
      });
    }
    
    // Sort by latest message
    chats.sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp);
    
    res.json(chats);
  } catch (error) {
    console.error('Error fetching user chats:', error);
    res.status(500).json({ error: 'Failed to fetch user chats' });
  }
};