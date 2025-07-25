import { User, Post, Group, Conversation, Message } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new APIError(response.status, `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError(500, 'Network error');
  }
}

// Authentication API
export const authAPI = {
  async register(data: FormData) {
    return apiRequest<{ success: boolean; user: User; sessionId: string }>(
      '/api/auth/register',
      {
        method: 'POST',
        body: data,
        headers: {}, // Let browser set content-type for FormData
      }
    );
  },

  async login(email: string, password: string) {
    return apiRequest<{ success: boolean; user: User; sessionId: string }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  },

  async logout() {
    return apiRequest<{ success: boolean }>('/api/auth/logout', {
      method: 'POST',
    });
  },

  async getSession() {
    return apiRequest<{ authenticated: boolean; user?: User }>('/api/auth/session');
  },
};

// Users API
export const usersAPI = {
  async getProfile(userId: string) {
    return apiRequest<{
      user: User;
      posts: Post[];
      followers: User[];
      following: User[];
      isFollowing: boolean;
      isPublic: boolean;
    }>(`/api/users/profile/${userId}`);
  },

  async updateProfile(data: FormData) {
    return apiRequest<{ success: boolean; user: User }>('/api/users/profile', {
      method: 'PUT',
      body: data,
      headers: {},
    });
  },

  async followUser(userId: string) {
    return apiRequest<{ success: boolean; requestSent: boolean }>(
      `/api/users/follow/${userId}`,
      { method: 'POST' }
    );
  },

  async unfollowUser(userId: string) {
    return apiRequest<{ success: boolean }>(`/api/users/follow/${userId}`, {
      method: 'DELETE',
    });
  },

  async searchUsers(query: string, limit = 20) {
    return apiRequest<{ users: User[] }>(`/api/users/search?query=${encodeURIComponent(query)}&limit=${limit}`);
  },
};

// Posts API
export const postsAPI = {
  async getFeed(page = 1, limit = 20) {
    return apiRequest<{ posts: Post[]; hasMore: boolean }>(
      `/api/posts/feed?page=${page}&limit=${limit}`
    );
  },

  async createPost(data: FormData) {
    return apiRequest<{ success: boolean; post: Post }>('/api/posts', {
      method: 'POST',
      body: data,
      headers: {},
    });
  },

  async getPost(postId: string) {
    return apiRequest<{ post: Post; comments: Comment[] }>(`/api/posts/${postId}`);
  },

  async createComment(postId: string, data: FormData) {
    return apiRequest<{ success: boolean; comment: Comment }>(
      `/api/posts/${postId}/comments`,
      {
        method: 'POST',
        body: data,
        headers: {},
      }
    );
  },

  async likePost(postId: string) {
    return apiRequest<{ success: boolean; liked: boolean; likeCount: number }>(
      `/api/posts/${postId}/like`,
      { method: 'POST' }
    );
  },
};

// Groups API
export const groupsAPI = {
  async getGroups() {
    return apiRequest<{ groups: Group[] }>('/api/groups');
  },

  async createGroup(title: string, description: string) {
    return apiRequest<{ success: boolean; group: Group }>('/api/groups', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });
  },

  async getGroup(groupId: string) {
    return apiRequest<{
      group: Group;
      members: User[];
      posts: Post[];
      events: Event[];
      isMember: boolean;
    }>(`/api/groups/${groupId}`);
  },

  async inviteToGroup(groupId: string, userIds: string[]) {
    return apiRequest<{ success: boolean }>(`/api/groups/${groupId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ userIds }),
    });
  },

  async joinGroup(groupId: string) {
    return apiRequest<{ success: boolean; requestSent: boolean }>(
      `/api/groups/${groupId}/join`,
      { method: 'POST' }
    );
  },

  async createEvent(groupId: string, data: { title: string; description: string; dateTime: string }) {
    return apiRequest<{ success: boolean; event: Event }>(
      `/api/groups/${groupId}/events`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  async rsvpEvent(groupId: string, eventId: string, response: 'going' | 'not_going') {
    return apiRequest<{ success: boolean }>(
      `/api/groups/${groupId}/events/${eventId}/rsvp`,
      {
        method: 'POST',
        body: JSON.stringify({ response }),
      }
    );
  },
};

// Chat API
export const chatAPI = {
  async getConversations() {
    return apiRequest<{ conversations: Conversation[] }>('/api/chat/conversations');
  },

  async getMessages(conversationId: string, page = 1, limit = 50) {
    return apiRequest<{ messages: Message[]; hasMore: boolean }>(
      `/api/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`
    );
  },

  async sendMessage(conversationId: string, content: string, type: 'text' | 'emoji' = 'text') {
    return apiRequest<{ success: boolean; message: Message }>(
      `/api/chat/conversations/${conversationId}/messages`,
      {
        method: 'POST',
        body: JSON.stringify({ content, type }),
      }
    );
  },
};

// Notifications API
export const notificationsAPI = {
  async getNotifications() {
    return apiRequest<{ notifications: Notification[]; unreadCount: number }>(
      '/api/notifications'
    );
  },

  async markAsRead(notificationId: string) {
    return apiRequest<{ success: boolean }>(
      `/api/notifications/${notificationId}/read`,
      { method: 'PUT' }
    );
  },

  async respondToFollowRequest(requestId: string, action: 'accept' | 'decline') {
    return apiRequest<{ success: boolean }>(
      `/api/notifications/follow-request/${requestId}/respond`,
      {
        method: 'POST',
        body: JSON.stringify({ action }),
      }
    );
  },
};
