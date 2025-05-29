import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image, MapPin, Check } from 'lucide-react';
import { Message, User } from '../types';
import { useChat } from '../context/ChatContext.js';
import { useAuth } from '../context/AuthContext';

interface ChatProps {
  recipientId: string;
}

const Chat: React.FC<ChatProps> = ({ recipientId }) => {
  const { currentUser } = useAuth();
  const { 
    messages, 
    setActiveChat, 
    sendMessage, 
    typingStatus, 
    setTyping,
    chatUsers
  } = useChat();
  
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Find recipient from chat users
  const recipient = chatUsers.find(user => 
    (user.id === recipientId) || (user._id === recipientId)
  );

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
    setActiveChat(recipientId);
    
    return () => {
      // Clean up typing status when component unmounts
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setTyping(recipientId, false);
    };
  }, [recipientId, setActiveChat]); // Remove setTyping from dependency array

  if (!recipient) {
    return (
      <div className="flex items-center justify-center h-full text-red-500 font-semibold">
        Recipient not found.
      </div>
    );
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages[recipientId]]);

  const handleTyping = () => {
    setTyping(recipientId, true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setTyping(recipientId, false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage, 'text');
      setNewMessage('');
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      setTyping(recipientId, false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // In a real app, this would upload to a server and get a URL
      const reader = new FileReader();
      reader.onload = () => {
        sendMessage('Sent an image', 'image', { imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        sendMessage('Shared location', 'location', { latitude, longitude });
      });
    }
  };

  const renderMessageStatus = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check size={16} className="text-gray-400" />;
      case 'delivered':
        return (
          <div className="flex">
            <Check size={16} className="text-gray-400" />
            <Check size={16} className="text-gray-400 -ml-1" />
          </div>
        );
      case 'read':
        return (
          <div className="flex">
            <Check size={16} className="text-blue-500" />
            <Check size={16} className="text-blue-500 -ml-1" />
          </div>
        );
      default:
        return null;
    }
  };

  const chatMessages = messages[recipientId] || [];
  const isTyping = typingStatus[recipientId];

  function renderMessageContent(message: Message): React.ReactNode {
    switch (message.type) {
      case 'text':
        return (
          <div className="message-bubble">
            <p>{message.content}</p>
            <div className="message-meta">
              <span className="message-time">
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {message.senderId === currentUser?._id && renderMessageStatus(message.status)}
            </div>
          </div>
        );
      
      case 'image':
        return (
          <div className="message-bubble">
            {message.metadata?.imageUrl && (
              <img 
                src={message.metadata.imageUrl} 
                alt="Shared image" 
                className="rounded-lg max-w-[200px] max-h-[200px] object-cover mb-2" 
              />
            )}
            <p>{message.content}</p>
            <div className="message-meta">
              <span className="message-time">
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {message.senderId === currentUser?._id && renderMessageStatus(message.status)}
            </div>
          </div>
        );
      
      case 'location':
        return (
          <div className="message-bubble">
            {message.metadata?.latitude && message.metadata?.longitude && (
              <div className="bg-gray-100 p-2 rounded-lg mb-2 flex items-center">
                <MapPin size={16} className="text-red-500 mr-2" />
                <span className="text-sm">
                  Location: {message.metadata.latitude.toFixed(6)}, {message.metadata.longitude.toFixed(6)}
                </span>
              </div>
            )}
            <p>{message.content}</p>
            <div className="message-meta">
              <span className="message-time">
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {message.senderId === currentUser?._id && renderMessageStatus(message.status)}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="message-bubble">
            <p>{message.content}</p>
            <div className="message-meta">
              <span className="message-time">
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              {message.senderId === currentUser?._id && renderMessageStatus(message.status)}
            </div>
          </div>
        );
    }
  }

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-lg shadow-lg pt-10">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b ">
        <img
          src={recipient.avatar}
          alt={recipient.name}
          className="w-10 h-10 rounded-full object-cover "
        />
        <div className="ml-3 flex-1">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-gray-900">{recipient.name}</h3>
            {recipient.verificationStatus === 'verified' && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                Verified ✓
              </span>
            )}
          </div>
          <div className="flex items-center text-sm">
            <span className={`w-2 h-2 rounded-full mr-2 ${
              recipient.onlineStatus === 'online' ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            <span className="text-gray-500">
              {recipient.onlineStatus === 'online' ? 'Online' : 'Last seen ' + new Date(recipient.lastSeen || Date.now()).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      // In the Chat component, update the messages rendering section
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!messages[recipientId] || messages[recipientId].length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No messages yet.</p>
            <p className="text-sm mt-2">Send a message to start the conversation!</p>
          </div>
        ) : (
         
          messages[recipientId].map((message) => (
            <div key={message.id} className={`message ${message.senderId === currentUser?._id ? 'sent' : 'received'}`}>
              {renderMessageContent(message)}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      {isTyping && (
        <div className="px-4 py-2 text-sm text-gray-500 flex items-center">
          <span className="animate-pulse mr-2">...</span>
          {recipient.name} is typing
        </div>
      )}

      {/* Footer / Message Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-4 border-t bg-white sticky bottom-0"
        style={{ zIndex: 10 }}
      >
        <label className="cursor-pointer">
          <Paperclip size={20} className="text-gray-400" />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
        <button
          type="button"
          onClick={handleShareLocation}
          className="p-2 rounded-full hover:bg-gray-100"
          title="Share location"
        >
          <MapPin size={20} className="text-gray-400" />
        </button>
        <input
          type="text"
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400"
          placeholder="Type your message..."
          value={newMessage}
          onChange={e => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
        />
        <button
          type="submit"
          className="bg-teal-500 hover:bg-teal-600 text-white rounded-full p-2 transition"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default Chat;