import React from 'react';
import { mockUsers, mockMessages } from '../data/mockData';

interface ChatListProps {
  onSelectChat: (userId: string) => void;
  selectedUserId: string;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat, selectedUserId }) => {
  // Group messages by user and get latest message for each
  const chats = mockUsers.map(user => {
    const userMessages = mockMessages.filter(
      msg => msg.senderId === user.id || msg.receiverId === user.id
    );
    const lastMessage = userMessages.sort((a, b) => b.timestamp - a.timestamp)[0];
    return { user, lastMessage };
  }).sort((a, b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0));

  return (
    <div className="w-80 border-r h-full overflow-y-auto">
      {chats.map(({ user, lastMessage }) => (
        <div
          key={user.id}
          className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 ${selectedUserId === user.id ? 'bg-gray-200' : ''}`}
          onClick={() => onSelectChat(user.id)}
        >
          <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
          <div className="ml-3 flex-1">
            <div className="flex items-center">
              <span className="font-semibold">{user.name}</span>
              {user.onlineStatus === 'online' && <span className="ml-2 w-2 h-2 bg-green-500 rounded-full" />}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {lastMessage ? lastMessage.content : 'No messages yet'}
            </div>
          </div>
          <div className="text-xs text-gray-400 ml-2">
            {lastMessage ? new Date(lastMessage.timestamp).toLocaleTimeString() : ''}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;