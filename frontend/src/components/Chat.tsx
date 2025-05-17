import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Image, MapPin, Check } from 'lucide-react';
import { Message, User } from '../types';
import { mockUsers } from '../data/mockData';

interface ChatProps {
  recipientId: string;
  messages: Message[];
  onSendMessage: (content: string, type: Message['type'], metadata?: Message['metadata']) => void;
  onTypingStart: () => void;
  onTypingEnd: () => void;
}

const Chat: React.FC<ChatProps> = ({ 
  recipientId, 
  messages, 
  onSendMessage,
  onTypingStart,
  onTypingEnd 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<number>();
  const recipient = mockUsers.find(user => user.id === recipientId);

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
  }, [messages]);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      onTypingStart();
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      onTypingEnd();
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage, 'text');
      setNewMessage('');
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      onTypingEnd();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // In a real app, this would upload to a server and get a URL
      const reader = new FileReader();
      reader.onload = () => {
        onSendMessage('Sent an image', 'image', { imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        onSendMessage('Shared location', 'location', { latitude, longitude });
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

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-lg shadow-lg">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b">
        <img
          src={recipient.avatar}
          alt={recipient.name}
          className="w-10 h-10 rounded-full object-cover"
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
              {recipient.onlineStatus === 'online' ? 'Online' : 'Last seen ' + new Date(recipient.lastSeen).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ minHeight: 0 }}>
        {messages.map((message, index) => {
          const isOwnMessage = message.senderId !== recipientId;
          const sender = mockUsers.find(user => user.id === message.senderId);

          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] break-words ${
                  isOwnMessage
                    ? 'bg-teal-500 text-white rounded-l-lg rounded-tr-lg'
                    : 'bg-gray-100 text-gray-900 rounded-r-lg rounded-tl-lg'
                } p-3 shadow-sm`}
              >
                {message.type === 'text' && (
                  <p className="text-sm">{message.content}</p>
                )}

                {message.type === 'image' && message.metadata?.imageUrl && (
                  <div className="mb-2">
                    <img 
                      src={message.metadata.imageUrl} 
                      alt="Shared image" 
                      className="rounded-lg max-w-full"
                    />
                  </div>
                )}

                {message.type === 'location' && message.metadata?.latitude && (
                  <div className="flex items-center text-sm">
                    <MapPin size={16} className="mr-1" />
                    <a 
                      href={`https://maps.google.com/?q=${message.metadata.latitude},${message.metadata.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      View shared location
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-end mt-1 space-x-2">
                  <span className="text-xs opacity-75">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                  {renderMessageStatus(message.status)}
                </div>
              </div>
            </div>
          );
        })}
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