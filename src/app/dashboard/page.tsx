'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { CreatePost } from '@/components/posts/CreatePost';
import { PostCard } from '@/components/posts/PostCard';
import { useAuth } from '@/context/AuthContext';
import { Post } from '@/lib/types';
import { postsAPI } from '@/lib/api';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      loadFeed();
    }
  }, [isAuthenticated]);

  const loadFeed = async (pageNum = 1) => {
    try {
      setIsLoading(true);
      const response = await postsAPI.getFeed(pageNum);
      
      if (pageNum === 1) {
        setPosts(response.posts);
      } else {
        setPosts(prev => [...prev, ...response.posts]);
      }
      
      setHasMore(response.hasMore);
      setPage(pageNum);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      loadFeed(page + 1);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Please log in</h2>
          <p className="text-gray-600 mt-2">You need to be logged in to view the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Create Post */}
        <div className="mb-8">
          <CreatePost onPostCreated={handlePostCreated} />
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onUpdate={handlePostUpdate}
            />
          ))}
          
          {isLoading && posts.length === 0 && (
            <div className="text-center py-8">
              <div className="animate-pulse">
                <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {posts.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-600">No posts to show. Start following people or create your first post!</p>
            </div>
          )}
          
          {hasMore && posts.length > 0 && (
            <div className="text-center py-4">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
