# Social Network Frontend Architecture & API Documentation

## Project Overview
A Facebook-like social network built with Next.js frontend and Go backend, featuring followers, profiles, posts, groups, notifications, and real-time chat.

## Tech Stack
- **Frontend**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + useReducer
- **Real-time Communication**: WebSocket API
- **HTTP Client**: Fetch API with custom hooks
- **Authentication**: Session-based with cookies

## Folder Structure
```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   ├── profile/
│   │   └── [userId]/
│   ├── groups/
│   │   ├── [groupId]/
│   │   └── create/
│   ├── chat/
│   └── notifications/
├── components/
│   ├── ui/
│   ├── auth/
│   ├── posts/
│   ├── groups/
│   ├── chat/
│   └── notifications/
├── lib/
│   ├── api/
│   ├── hooks/
│   ├── utils/
│   └── types/
├── context/
└── public/
```

## Core Features & Components

### 1. Authentication System
- Registration form with image upload
- Login/logout functionality
- Session management
- Protected routes

### 2. User Profiles
- Public/private profile toggle
- User information display
- Posts timeline
- Followers/following lists

### 3. Posts System
- Create posts with images/GIFs
- Privacy settings (public, followers, private)
- Comments functionality
- Like/reaction system

### 4. Groups
- Group creation and management
- Member invitations
- Group posts and events
- Event RSVP system

### 5. Real-time Chat
- Private messaging
- Group chat rooms
- Emoji support
- Online status

### 6. Notifications
- Follow requests
- Group invitations
- Event notifications
- Real-time updates

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
```typescript
interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  avatar?: File;
  nickname?: string;
  aboutMe?: string;
}

interface RegisterResponse {
  success: boolean;
  user: User;
  sessionId: string;
}
```

#### POST /api/auth/login
```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user: User;
  sessionId: string;
}
```

#### POST /api/auth/logout
```typescript
interface LogoutResponse {
  success: boolean;
}
```

#### GET /api/auth/session
```typescript
interface SessionResponse {
  authenticated: boolean;
  user?: User;
}
```

### User Management Endpoints

#### GET /api/users/profile/[userId]
```typescript
interface ProfileResponse {
  user: User;
  posts: Post[];
  followers: User[];
  following: User[];
  isFollowing: boolean;
  isPublic: boolean;
}
```

#### PUT /api/users/profile
```typescript
interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  nickname?: string;
  aboutMe?: string;
  avatar?: File;
  isPublic?: boolean;
}
```

#### POST /api/users/follow/[userId]
```typescript
interface FollowResponse {
  success: boolean;
  requestSent: boolean; // true if private profile
}
```

#### DELETE /api/users/follow/[userId]
```typescript
interface UnfollowResponse {
  success: boolean;
}
```

#### GET /api/users/search
```typescript
interface SearchUsersRequest {
  query: string;
  limit?: number;
}

interface SearchUsersResponse {
  users: User[];
}
```

### Posts Endpoints

#### GET /api/posts/feed
```typescript
interface FeedRequest {
  page?: number;
  limit?: number;
}

interface FeedResponse {
  posts: Post[];
  hasMore: boolean;
}
```

#### POST /api/posts
```typescript
interface CreatePostRequest {
  content: string;
  image?: File;
  privacy: 'public' | 'followers' | 'private';
  allowedUsers?: string[]; // for private posts
}

interface CreatePostResponse {
  success: boolean;
  post: Post;
}
```

#### GET /api/posts/[postId]
```typescript
interface PostResponse {
  post: Post;
  comments: Comment[];
}
```

#### POST /api/posts/[postId]/comments
```typescript
interface CreateCommentRequest {
  content: string;
  image?: File;
}

interface CreateCommentResponse {
  success: boolean;
  comment: Comment;
}
```

#### POST /api/posts/[postId]/like
```typescript
interface LikeResponse {
  success: boolean;
  liked: boolean;
  likeCount: number;
}
```

### Groups Endpoints

#### GET /api/groups
```typescript
interface GroupsResponse {
  groups: Group[];
}
```

#### POST /api/groups
```typescript
interface CreateGroupRequest {
  title: string;
  description: string;
}

interface CreateGroupResponse {
  success: boolean;
  group: Group;
}
```

#### GET /api/groups/[groupId]
```typescript
interface GroupResponse {
  group: Group;
  members: User[];
  posts: Post[];
  events: Event[];
  isMember: boolean;
}
```

#### POST /api/groups/[groupId]/invite
```typescript
interface InviteToGroupRequest {
  userIds: string[];
}

interface InviteToGroupResponse {
  success: boolean;
}
```

#### POST /api/groups/[groupId]/join
```typescript
interface JoinGroupResponse {
  success: boolean;
  requestSent: boolean;
}
```

#### POST /api/groups/[groupId]/events
```typescript
interface CreateEventRequest {
  title: string;
  description: string;
  dateTime: string;
}

interface CreateEventResponse {
  success: boolean;
  event: Event;
}
```

#### POST /api/groups/[groupId]/events/[eventId]/rsvp
```typescript
interface RSVPRequest {
  response: 'going' | 'not_going';
}

interface RSVPResponse {
  success: boolean;
}
```

### Chat Endpoints

#### GET /api/chat/conversations
```typescript
interface ConversationsResponse {
  conversations: Conversation[];
}
```

#### GET /api/chat/conversations/[conversationId]/messages
```typescript
interface MessagesRequest {
  page?: number;
  limit?: number;
}

interface MessagesResponse {
  messages: Message[];
  hasMore: boolean;
}
```

#### POST /api/chat/conversations/[conversationId]/messages
```typescript
interface SendMessageRequest {
  content: string;
  type: 'text' | 'emoji';
}

interface SendMessageResponse {
  success: boolean;
  message: Message;
}
```

### Notifications Endpoints

#### GET /api/notifications
```typescript
interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}
```

#### PUT /api/notifications/[notificationId]/read
```typescript
interface MarkReadResponse {
  success: boolean;
}
```

#### POST /api/notifications/follow-request/[requestId]/respond
```typescript
interface FollowRequestResponse {
  action: 'accept' | 'decline';
}

interface FollowRequestResponseResult {
  success: boolean;
}
```

## TypeScript Interfaces

### Core Types
```typescript
interface User {
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

interface Post {
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

interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: User;
  content: string;
  image?: string;
  createdAt: string;
}

interface Group {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creator: User;
  memberCount: number;
  createdAt: string;
}

interface Event {
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

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  content: string;
  type: 'text' | 'emoji';
  createdAt: string;
}

interface Conversation {
  id: string;
  type: 'private' | 'group';
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: string;
}

interface Notification {
  id: string;
  userId: string;
  type: 'follow_request' | 'group_invitation' | 'event_created' | 'post_liked';
  title: string;
  message: string;
  data: any;
  isRead: boolean;
  createdAt: string;
}
```

## WebSocket Events

### Connection
- **Connect**: `/ws` with session authentication
- **Disconnect**: Automatic cleanup

### Chat Events
```typescript
// Client to Server
interface SendMessageEvent {
  type: 'send_message';
  conversationId: string;
  content: string;
  messageType: 'text' | 'emoji';
}

// Server to Client
interface MessageReceivedEvent {
  type: 'message_received';
  message: Message;
}

interface UserOnlineEvent {
  type: 'user_online';
  userId: string;
}

interface UserOfflineEvent {
  type: 'user_offline';
  userId: string;
}
```

### Notification Events
```typescript
// Server to Client
interface NotificationEvent {
  type: 'notification';
  notification: Notification;
}
```

## Custom Hooks

### Authentication
- `useAuth()` - Authentication state and methods
- `useProtectedRoute()` - Route protection

### Data Fetching
- `usePosts()` - Posts feed with pagination
- `useProfile(userId)` - User profile data
- `useGroups()` - Groups listing
- `useNotifications()` - Notifications with real-time updates

### Real-time Features
- `useWebSocket()` - WebSocket connection management
- `useChat(conversationId)` - Chat functionality
- `useOnlineUsers()` - Online status tracking

## State Management

### Auth Context
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
}
```

### Notification Context
```typescript
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}
```

## Error Handling
- Global error boundary
- API error responses
- Form validation errors
- Network connection issues
- WebSocket reconnection logic

## Performance Optimizations
- Image lazy loading
- Virtual scrolling for long lists
- Infinite scroll pagination
- WebSocket connection pooling
- Debounced search inputs
- Optimistic UI updates

This documentation will guide the backend development to ensure seamless integration between frontend and backend systems.