import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/ChatService';
import { User } from '../types';

interface ChatListProps {
  onSelectChat: (userId: string) => void;
  selectedUserId: string;
}

interface ChatPreview {
  user: User;
  lastMessage: {
    content: string;
    timestamp: string;
    createdAt: string;
  };
  unreadCount?: number;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat, selectedUserId }) => {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
  }, []);

  useEffect(() => {
    const fetchChats = async () => {
      if (!currentUser?._id) return;
      
      try {
        setLoading(true);
        const userChats = await chatService.getUserChats(currentUser._id);
        setChats(userChats);
      } catch (error) {
        console.error('Failed to fetch chats:', error);
        // Try to load from localStorage as fallback
        const savedChats = localStorage.getItem(`tagalong-user-chats-${currentUser._id}`);
        if (savedChats) {
          try {
            const decryptedChats = JSON.parse(savedChats);
            setChats(decryptedChats);
          } catch (e) {
            console.error('Failed to parse saved chats:', e);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchChats();
    
    // Set up real-time updates for new messages
    if (currentUser?._id) {
      chatService.connect(currentUser._id);
      
      chatService.onNewMessage(() => {
        // Refresh the chat list when a new message arrives
        fetchChats();
      });
    }
    
    return () => {
      chatService.disconnect();
    };
  }, [currentUser]);

  if (loading) {
    return (
      <div className="w-80 border-r h-full overflow-y-auto pt-10 flex items-center justify-center">
        <p className="text-gray-500">Loading conversations...</p>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="w-80 border-r h-full overflow-y-auto pt-10 flex items-center justify-center">
        <p className="text-gray-500">No conversations yet</p>
      </div>
    );
  }

  // In the return statement of ChatList component
  return (
    <div className="w-1/3 border-r border-gray-200 overflow-y-auto p-4 bg-white">
      <h2 className="text-xl font-semibold mb-4">Conversations</h2>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : chats.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No conversations yet.</p>
          <p className="text-sm mt-2">Start a chat by selecting a user or sending a message.</p>
        </div>
      ) : (
        
        <div className="space-y-2">
          {chats.map((chat) => (
            <div 
              key={chat.user._id} 
              className={`chat-preview p-3 rounded-lg cursor-pointer ${chat.user._id === selectedUserId ? 'bg-teal-50 border-l-4 border-teal-500' : 'hover:bg-gray-50'}`}
              onClick={() => onSelectChat(chat.user._id)}
            >
              {/* Chat preview content */}
              <div className="flex items-center">
                <img src={chat.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.user.name)}&background=0D8ABC&color=fff`} alt={chat.user.name} className="w-10 h-10 rounded-full mr-3" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{chat.user.name}</h3>
                    <span className="text-xs text-gray-500">{new Date(chat.lastMessage.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;