import { useEffect } from 'react';
import { useChat } from '../context/ChatContext';
import { User } from '../types';

const ChatInitializer: React.FC = () => {
  const { addChatUser } = useChat();
  
  useEffect(() => {
    const savedChat = localStorage.getItem('tagalong-selected-chat');
    if (savedChat) {
      try {
        const chatPartnerInfo = JSON.parse(savedChat);
        const chatPartnerUser = {
          _id: chatPartnerInfo.partnerId,
          id: chatPartnerInfo.partnerId,
          name: chatPartnerInfo.partnerName,
          avatar: chatPartnerInfo.partnerAvatar,
          verificationStatus: chatPartnerInfo.partnerVerificationStatus || 'unverified',
          onlineStatus: chatPartnerInfo.partnerOnlineStatus || 'offline',
          lastSeen: chatPartnerInfo.partnerLastSeen || new Date().toISOString(),
          role: 'user',
          createdAt: new Date().toISOString(),
          email: '',
          phone: '',
          isVerified: false,
          verificationDocuments: [],
          rating: 0,
          reviews: []
        };
        addChatUser(chatPartnerUser);
      } catch (error) {
        console.error('Failed to parse saved chat:', error);
      }
    }
  }, [addChatUser]);
  
  return null; // This component doesn't render anything
};

export default ChatInitializer;