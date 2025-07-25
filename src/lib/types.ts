export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  avatar?: string;
  aboutMe?: string;
  dateOfBirth: string;
  isPublic: boolean;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  author: User;
  content: string;
  image?: string;
  privacy: 'public' | 'followers' | 'private';
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  content: string;
  image?: string;
  createdAt: string;
}

export interface Group {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creator: User;
  memberCount: number;
  createdAt: string;
}

export interface Event {
  id: string;
  groupId: string;
  title: string;
  description: string;
  dateTime: string;
  creatorId: string;
  creator: User;
  rsvpCounts: {
    going: number;
    notGoing: number;
  };
  userRSVP?: 'going' | 'not_going';
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  content: string;
  type: 'text' | 'emoji';
  createdAt: string;
}

export interface Conversation {
  id: string;
  type: 'private' | 'group';
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'follow_request' | 'group_invitation' | 'event_created' | 'post_liked';
  title: string;
  message: string;
  data: any;
  isRead: boolean;
  createdAt: string;
}
