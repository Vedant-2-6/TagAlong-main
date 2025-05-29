import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message, User } from '../types';
import { useAuth } from './AuthContext';
import chatService from '../services/ChatService';
import { useCallback } from 'react';

interface ChatContextType {
  messages: Record<string, Message[]>;
  activeChat: string | null;
  setActiveChat: (userId: string) => void;
  sendMessage: (content: string, type: Message['type'], metadata?: Message['metadata']) => void;
  typingStatus: Record<string, boolean>;
  setTyping: (userId: string, isTyping: boolean) => void;
  chatUsers: User[];
  addChatUser: (user: User) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [typingStatus, setTypingStatus] = useState<Record<string, boolean>>({});
  const [chatUsers, setChatUsers] = useState<User[]>([]);

  // Initialize chat service
  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.id || currentUser._id;
      chatService.connect(userId);
      
      // Load saved messages and chat users
      loadMessages();
      loadChatUsers();
      
      return () => {
        chatService.disconnect();
      };
    }
  }, [currentUser]);

  // Set up message listener
  useEffect(() => {
    if (!currentUser) return;
    
    chatService.onNewMessage((message) => {
      setMessages(prev => {
        const chatId = message.senderId === currentUser.id || message.senderId === currentUser._id
          ? message.receiverId
          : message.senderId;
        
        const updatedMessages = { ...prev };
        
        if (!updatedMessages[chatId]) {
          updatedMessages[chatId] = [];
        }
        
        // Check if message already exists
        const exists = updatedMessages[chatId].some(msg => msg.id === message.id);
        if (!exists) {
          updatedMessages[chatId] = [...updatedMessages[chatId], message];
        }
        
        return updatedMessages;
      });
    });
  }, [currentUser]);

  // Load messages from local storage
  const loadMessages = async () => {
    if (!currentUser) return;
    
    const userId = currentUser.id || currentUser._id;
    
    try {
      // Get all chat partners
      const userChats = await chatService.getUserChats(userId);
      
      // Load messages for each chat partner
      const allMessages: Record<string, Message[]> = {};
      
      for (const chat of userChats) {
        const partnerId = chat.user._id;
        const chatHistory = await chatService.getChatHistory(userId, partnerId);
        allMessages[partnerId] = chatHistory;
      }
      
      setMessages(allMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  // Load chat users from local storage
  const loadChatUsers = async () => {
    if (!currentUser) return;
    
    const userId = currentUser.id || currentUser._id;
    
    try {
      const userChats = await chatService.getUserChats(userId);
      setChatUsers(userChats.map(chat => chat.user));
    } catch (error) {
      console.error('Failed to load chat users:', error);
    }
  };

  // Add a new chat user
  const addChatUser = (user: User) => {
    setChatUsers(prev => {
      // Check if user already exists
      const exists = prev.some(u => (u.id === user.id) || (u._id === user._id));
      if (exists) return prev;
      
      return [...prev, user];
    });
  };

  // Send a message
  const sendMessage = async (content: string, type: Message['type'] = 'text', metadata?: Message['metadata']) => {
    if (!activeChat || !currentUser) return;

    const currentUserId = currentUser.id || currentUser._id;
    
    try {
      const newMessage = await chatService.sendMessage({
        senderId: currentUserId,
        receiverId: activeChat,
        content,
        type,
        metadata,
        createdAt: new Date().toISOString(),
        timestamp: Date.now()
      });
      
      // Update local state
      setMessages(prev => {
        const updatedMessages = { ...prev };
        if (!updatedMessages[activeChat]) {
          updatedMessages[activeChat] = [];
        }
        updatedMessages[activeChat] = [...updatedMessages[activeChat], newMessage];
        return updatedMessages;
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Set typing status
  const setTyping = useCallback((userId: string, isTyping: boolean) => {
    setTypingStatus(prev => {
      // Only update if the value is actually changing
      if (prev[userId] === isTyping) return prev;
      return { ...prev, [userId]: isTyping };
    });
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        activeChat,
        setActiveChat,
        sendMessage,
        typingStatus,
        setTyping,
        chatUsers,
        addChatUser
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};