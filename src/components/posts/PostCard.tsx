'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Post, Comment } from '@/lib/types';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { postsAPI } from '@/lib/api';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  Send,
  Image as ImageIcon
} from 'lucide-react';

interface PostCardProps {
  post: Post;
  onUpdate?: (updatedPost: Post) => void;
}

export function PostCard({ post, onUpdate }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentImage, setCommentImage] = useState<File | null>(null);

  const handleLike = async () => {
    try {
      const response = await postsAPI.likePost(post.id);
      setIsLiked(response.liked);
      setLikeCount(response.likeCount);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleShowComments = async () => {
    if (!showComments && comments.length === 0) {
      try {
        const response = await postsAPI.getPost(post.id);
        setComments(response.comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }
    setShowComments(!showComments);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() && !commentImage) return;

    setIsSubmittingComment(true);
    try {
      const formData = new FormData();
      formData.append('content', newComment);
      if (commentImage) {
        formData.append('image', commentImage);
      }

      const response = await postsAPI.createComment(post.id, formData);
      setComments(prev => [...prev, response.comment]);
      setNewComment('');
      setCommentImage(null);
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
      {/* Post Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar src={post.author.avatar} alt={post.author.firstName} />
          <div>
            <h3 className="font-medium text-gray-900">
              {post.author.firstName} {post.author.lastName}
              {post.author.nickname && (
                <span className="text-gray-500 ml-1">({post.author.nickname})</span>
              )}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <MoreHorizontal className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Post Content */}
      <div className="space-y-3">
        <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
        
        {post.image && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={post.image}
              alt="Post image"
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center space-x-6">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
              isLiked 
                ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{likeCount}</span>
          </button>
          
          <button
            onClick={handleShowComments}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">{post.commentCount}</span>
          </button>
          
          <button className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
            <Share className="w-4 h-4" />
            <span className="text-sm">Share</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="pt-4 border-t space-y-4">
          {/* Existing Comments */}
          <div className="space-y-3">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <Avatar src={comment.author.avatar} alt={comment.author.firstName} size="sm" />
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <p className="font-medium text-sm text-gray-900">
                      {comment.author.firstName} {comment.author.lastName}
                    </p>
                    <p className="text-gray-700">{comment.content}</p>
                    {comment.image && (
                      <img
                        src={comment.image}
                        alt="Comment image"
                        className="mt-2 rounded-lg max-h-48 object-cover"
                      />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleSubmitComment} className="flex space-x-3">
            <Avatar size="sm" />
            <div className="flex-1 space-y-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                rows={2}
                disabled={isSubmittingComment}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCommentImage(e.target.files?.[0] || null)}
                      className="hidden"
                      disabled={isSubmittingComment}
                    />
                    <ImageIcon className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                  </label>
                  {commentImage && (
                    <span className="text-sm text-gray-600">
                      {commentImage.name}
                    </span>
                  )}
                </div>
                
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmittingComment || (!newComment.trim() && !commentImage)}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
