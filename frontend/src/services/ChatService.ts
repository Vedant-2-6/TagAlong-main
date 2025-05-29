import { io, Socket } from 'socket.io-client';
import CryptoJS from 'crypto-js';
import { Message, User } from '../types';

class ChatService {
  private socket: Socket | null = null;
  private encryptionKey = 'tagalong-secure-chat-key';
  private offlineQueue: Message[] = [];
  private isConnected = false;
  
  // Connect to socket server with fallback
  connect(userId: string): void {
    try {
      // Load offline queue first before attempting connection
      this.loadOfflineQueue();
      
      // Try to connect with increased timeout
      this.socket = io('http://localhost:5000', {
        query: { userId },
        reconnectionAttempts: 10,     // Increased from 5
        reconnectionDelay: 2000,      // Increased from 1000
        timeout: 10000                // Increased from 5000
      });
      
      this.socket.on('connect', () => {
        console.log('Connected to chat server');
        this.isConnected = true;
        this.processOfflineQueue();
      });
      
      this.socket.on('disconnect', () => {
        console.log('Disconnected from chat server');
        this.isConnected = false;
      });
      
      this.socket.on('connect_error', (error) => {
        console.log('Failed to connect to chat server, using offline mode', error);
        this.isConnected = false;
        
        // Ensure we load any existing messages from localStorage
        this.loadOfflineQueue();
      });
    } catch (error) {
      console.error('Socket initialization error:', error);
      this.isConnected = false;
      
      // Ensure we load any existing messages from localStorage
      this.loadOfflineQueue();
    }
  }
  
  // Process queued messages when connection is restored
  private async processOfflineQueue(): Promise<void> {
    if (!this.isConnected || this.offlineQueue.length === 0) return;
    
    console.log(`Processing ${this.offlineQueue.length} queued messages`);
    
    for (const message of this.offlineQueue) {
      try {
        await this.sendMessageToServer(message);
      } catch (error) {
        console.error('Failed to send queued message:', error);
        break; // Stop processing if we encounter an error
      }
    }
    
    this.offlineQueue = [];
    this.saveOfflineQueue();
  }
  
  // Save offline queue to localStorage
  private saveOfflineQueue(): void {
    localStorage.setItem('tagalong-offline-queue', this.encryptData(this.offlineQueue));
  }
  
  // Load offline queue from localStorage
  private loadOfflineQueue(): void {
    const savedQueue = localStorage.getItem('tagalong-offline-queue');
    if (savedQueue) {
      try {
        this.offlineQueue = this.decryptData(savedQueue);
      } catch (error) {
        console.error('Failed to load offline queue:', error);
        this.offlineQueue = [];
      }
    }
  }
  
  // Disconnect from socket server
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
  }
  
  // Send a message with offline support
  sendMessage(messageData: Omit<Message, 'id' | 'status'>): Promise<Message> {
    const message = {
      ...messageData,
      id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'sent' as const
    };
    
    // Save to local storage immediately
    this.saveMessageLocally(message);
    
    // Try to send to server if connected
    if (this.isConnected && this.socket) {
      return this.sendMessageToServer(message);
    } else {
      // Queue for later if offline
      this.offlineQueue.push(message);
      this.saveOfflineQueue();
      return Promise.resolve(message);
    }
  }
  
  // Send message to server
  private sendMessageToServer(message: Message): Promise<Message> {
    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Socket not connected'));
        return;
      }
      
      // Encrypt message content for storage
      const encryptedContent = this.encryptMessage(message.content);
      const messageWithEncryption = { ...message, content: encryptedContent };
      
      this.socket.emit('send_message', messageWithEncryption, (response: { success: boolean, message?: Message, error?: string }) => {
        if (response.success && response.message) {
          // Decrypt the content before returning to UI
          const decryptedMessage = {
            ...response.message,
            content: this.decryptMessage(response.message.content)
          };
          resolve(decryptedMessage);
        } else {
          reject(new Error(response.error || 'Failed to send message'));
        }
      });
    });
  }
  
  // Save message to local storage
  private saveMessageLocally(message: Message): void {
    const userId1 = message.senderId;
    const userId2 = message.receiverId;
    const chatKey = this.getChatKey(userId1, userId2);
    
    const savedMessages = localStorage.getItem(chatKey);
    let messages: Message[] = [];
    
    if (savedMessages) {
      try {
        messages = this.decryptData(savedMessages);
      } catch (error) {
        console.error('Failed to load saved messages:', error);
      }
    }
    
    messages.push(message);
    localStorage.setItem(chatKey, this.encryptData(messages));
  }
  
  // Get unique key for a chat between two users
  private getChatKey(userId1: string, userId2: string): string {
    // Sort IDs to ensure the same key regardless of order
    const sortedIds = [userId1, userId2].sort();
    return `tagalong-chat-${sortedIds[0]}-${sortedIds[1]}`;
  }
  
  // Listen for new messages
  onNewMessage(callback: (message: Message) => void): void {
    if (!this.socket) return;
    
    this.socket.on('new_message', (message: Message) => {
      // Save message locally
      this.saveMessageLocally({
        ...message,
        content: this.decryptMessage(message.content)
      });
      
      // Decrypt message content before passing to UI
      const decryptedMessage = {
        ...message,
        content: this.decryptMessage(message.content)
      };
      callback(decryptedMessage);
    });
  }
  
  // Get chat history with offline support
  getChatHistory(userId1: string, userId2: string): Promise<Message[]> {
    // First try to get from local storage
    const chatKey = this.getChatKey(userId1, userId2);
    const savedMessages = localStorage.getItem(chatKey);
    let localMessages: Message[] = [];
    
    if (savedMessages) {
      try {
        localMessages = this.decryptData(savedMessages);
      } catch (error) {
        console.error('Failed to load saved messages:', error);
      }
    }
    
    // If connected, also try to get from server and merge
    if (this.isConnected && this.socket) {
      return new Promise((resolve, reject) => {
        this.socket!.emit('get_chat_history', { userId1, userId2 }, (response: { success: boolean, messages?: Message[], error?: string }) => {
          if (response.success && response.messages) {
            // Decrypt all messages
            const serverMessages = response.messages.map(msg => ({
              ...msg,
              content: this.decryptMessage(msg.content)
            }));
            
            // Merge local and server messages, removing duplicates
            const allMessages = this.mergeMessages(localMessages, serverMessages);
            
            // Update local storage with merged messages
            localStorage.setItem(chatKey, this.encryptData(allMessages));
            
            resolve(allMessages);
          } else {
            // If server request fails, just use local messages
            resolve(localMessages);
          }
        });
      });
    }
    
    // If offline, just use local messages
    return Promise.resolve(localMessages);
  }
  
  // Merge messages from local storage and server, removing duplicates
  private mergeMessages(localMessages: Message[], serverMessages: Message[]): Message[] {
    const messageMap = new Map<string, Message>();
    
    // Add all local messages to map
    localMessages.forEach(msg => messageMap.set(msg.id, msg));
    
    // Add server messages, overwriting local ones if they exist
    serverMessages.forEach(msg => messageMap.set(msg.id, msg));
    
    // Convert map back to array and sort by timestamp
    return Array.from(messageMap.values())
      .sort((a, b) => {
        const timeA = typeof a.timestamp === 'string' ? parseInt(a.timestamp) : a.timestamp;
        const timeB = typeof b.timestamp === 'string' ? parseInt(b.timestamp) : b.timestamp;
        return timeA - timeB;
      });
  }
  
  // Get all chats for a user with offline support
  getUserChats(userId: string): Promise<{ user: User, lastMessage: Message }[]> {
    // Try to get from local storage first
    const savedChats = localStorage.getItem(`tagalong-user-chats-${userId}`);
    let localChats: { user: User, lastMessage: Message }[] = [];
    
    if (savedChats) {
      try {
        localChats = this.decryptData(savedChats);
      } catch (error) {
        console.error('Failed to load saved chats:', error);
      }
    }
    
    // If connected, also try to get from server
    if (this.isConnected && this.socket) {
      return new Promise((resolve, reject) => {
        this.socket!.emit('get_user_chats', { userId }, (response: { 
          success: boolean, 
          chats?: { user: User, lastMessage: Message }[], 
          error?: string 
        }) => {
          if (response.success && response.chats) {
            // Decrypt last message content
            const serverChats = response.chats.map(chat => ({
              ...chat,
              lastMessage: {
                ...chat.lastMessage,
                content: this.decryptMessage(chat.lastMessage.content)
              }
            }));
            
            // Merge with local chats
            const mergedChats = this.mergeChats(localChats, serverChats);
            
            // Save to local storage
            localStorage.setItem(`tagalong-user-chats-${userId}`, this.encryptData(mergedChats));
            
            resolve(mergedChats);
          } else {
            // If server request fails, just use local chats
            resolve(localChats);
          }
        });
      });
    }
    
    // If offline, just use local chats
    return Promise.resolve(localChats);
  }
  
  // Merge chats from local storage and server
  private mergeChats(
    localChats: { user: User, lastMessage: Message }[], 
    serverChats: { user: User, lastMessage: Message }[]
  ): { user: User, lastMessage: Message }[] {
    const chatMap = new Map<string, { user: User, lastMessage: Message }>();
    
    // Add all local chats to map
    localChats.forEach(chat => chatMap.set(chat.user._id, chat));
    
    // Add server chats, overwriting local ones if they exist
    serverChats.forEach(chat => {
      const existingChat = chatMap.get(chat.user._id);
      
      if (!existingChat || 
          (typeof chat.lastMessage.timestamp === 'number' && 
           typeof existingChat.lastMessage.timestamp === 'number' && 
           chat.lastMessage.timestamp > existingChat.lastMessage.timestamp)) {
        chatMap.set(chat.user._id, chat);
      }
    });
    
    // Convert map back to array and sort by last message timestamp
    return Array.from(chatMap.values())
      .sort((a, b) => {
        const timeA = typeof a.lastMessage.timestamp === 'string' ? 
          parseInt(a.lastMessage.timestamp) : a.lastMessage.timestamp;
        const timeB = typeof b.lastMessage.timestamp === 'string' ? 
          parseInt(b.lastMessage.timestamp) : b.lastMessage.timestamp;
        return timeB - timeA; // Sort in descending order (newest first)
      });
  }
  
  // Encrypt message
  private encryptMessage(content: string): string {
    return CryptoJS.AES.encrypt(content, this.encryptionKey).toString();
  }
  
  // Decrypt message
  private decryptMessage(encryptedContent: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedContent, this.encryptionKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Failed to decrypt message:', error);
      return '[Encrypted message]';
    }
  }
  
  // Encrypt data
  private encryptData(data: any): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey).toString();
  }
  
  // Decrypt data
  private decryptData(encryptedData: string): any {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
}

export const chatService = new ChatService();
export default chatService;