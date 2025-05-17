import { Listing, Parcel, User, Review, Message, Notification } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
    isVerified: true,
    rating: 4.8,
    reviews: []
  },
  {
    id: 'user2',
    name: 'Samantha Lee',
    email: 'sam@example.com',
    phone: '+1 (555) 987-6543',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=600',
    isVerified: true,
    rating: 4.9,
    reviews: []
  },
  {
    id: 'user3',
    name: 'Michael Chen',
    email: 'michael@example.com',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600',
    isVerified: false,
    rating: 4.5,
    reviews: []
  }
];

export const mockListings: Listing[] = [
  {
    id: 'listing1',
    userId: 'user1',
    source: 'New York',
    destination: 'Boston',
    departureDate: '2025-07-10T09:00:00Z',
    arrivalDate: '2025-07-10T14:00:00Z',
    capacity: {
      weight: 25,
      volume: 3
    },
    acceptsFragile: true,
    price: 45,
    vehicle: 'SUV - Toyota RAV4',
    description: 'Traveling from NYC to Boston, have space in my trunk for small to medium packages.',
    status: 'active'
  },
  {
    id: 'listing2',
    userId: 'user2',
    source: 'Los Angeles',
    destination: 'San Francisco',
    departureDate: '2025-07-12T08:00:00Z',
    arrivalDate: '2025-07-12T15:00:00Z',
    capacity: {
      weight: 50,
      volume: 5
    },
    acceptsFragile: false,
    price: 60,
    vehicle: 'Pickup Truck - Ford F-150',
    description: 'Weekly trip to San Francisco. Large space available for bulky items.',
    status: 'active'
  },
  {
    id: 'listing3',
    userId: 'user3',
    source: 'Chicago',
    destination: 'Detroit',
    departureDate: '2025-07-15T10:00:00Z',
    arrivalDate: '2025-07-15T14:30:00Z',
    capacity: {
      weight: 15,
      volume: 2
    },
    acceptsFragile: true,
    price: 35,
    vehicle: 'Sedan - Honda Accord',
    description: 'Going to Detroit for work, can take a small package with me.',
    status: 'active'
  }
];

export const mockParcels: Parcel[] = [
  {
    id: 'parcel1',
    senderId: 'user3',
    carrierId: 'user1',
    source: 'New York',
    destination: 'Boston',
    weight: 5,
    dimensions: {
      length: 30,
      width: 20,
      height: 15
    },
    isFragile: true,
    requiresDeliveryBy: '2025-07-10T17:00:00Z',
    status: 'accepted',
    createdAt: '2025-07-05T12:00:00Z'
  },
  {
    id: 'parcel2',
    senderId: 'user2',
    carrierId: 'user3',
    source: 'Chicago',
    destination: 'Detroit',
    weight: 8,
    dimensions: {
      length: 40,
      width: 30,
      height: 25
    },
    isFragile: false,
    requiresDeliveryBy: '2025-07-15T18:00:00Z',
    status: 'pending',
    createdAt: '2025-07-10T09:30:00Z'
  }
];

export const mockReviews: Review[] = [
  {
    id: 'review1',
    rating: 5,
    comment: 'Great service! Package arrived safely and on time.',
    createdAt: '2025-06-28T16:30:00Z',
    authorId: 'user3',
    targetId: 'user1'
  },
  {
    id: 'review2',
    rating: 4,
    comment: 'Good communication and reliable delivery.',
    createdAt: '2025-06-20T14:15:00Z',
    authorId: 'user1',
    targetId: 'user2'
  }
];

export const mockMessages: Message[] = [
  {
    id: 'msg1',
    senderId: 'user3',
    receiverId: 'user1',
    content: 'Hi, I saw you\'re traveling to Boston tomorrow. Is there still space for my package?',
    createdAt: '2025-07-08T09:15:00Z',
    read: true
  },
  {
    id: 'msg2',
    senderId: 'user1',
    receiverId: 'user3',
    content: 'Yes, I still have space! What are the dimensions and weight?',
    createdAt: '2025-07-08T09:25:00Z',
    read: true
  },
  {
    id: 'msg3',
    senderId: 'user3',
    receiverId: 'user1',
    content: 'It\'s about 5kg and 30x20x15cm. It\'s a gift for my sister, so it\'s somewhat fragile.',
    createdAt: '2025-07-08T09:30:00Z',
    read: true
  },
  {
    id: 'msg4',
    senderId: 'user1',
    receiverId: 'user3',
    content: 'No problem, I can handle fragile items. Where would you like to meet for pickup?',
    createdAt: '2025-07-08T09:35:00Z',
    read: false
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    userId: 'user1',
    type: 'message',
    title: 'New message',
    content: 'You have a new message from Michael Chen',
    read: false,
    createdAt: '2025-07-08T09:30:00Z',
    actionUrl: '/messages/user3'
  },
  {
    id: 'notif2',
    userId: 'user1',
    type: 'request',
    title: 'Delivery Request',
    content: 'Michael Chen has requested to book space in your Boston trip',
    read: true,
    createdAt: '2025-07-07T15:45:00Z',
    actionUrl: '/requests/parcel1'
  },
  {
    id: 'notif3',
    userId: 'user3',
    type: 'status_update',
    title: 'Request Accepted',
    content: 'Alex Johnson has accepted your delivery request',
    read: false,
    createdAt: '2025-07-07T16:30:00Z',
    actionUrl: '/parcels/parcel1'
  }
];

// Add reviews to users
mockUsers[0].reviews = mockReviews.filter(review => review.targetId === 'user1');
mockUsers[1].reviews = mockReviews.filter(review => review.targetId === 'user2');