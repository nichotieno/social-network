'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { postsAPI } from '@/lib/api';
import { Post } from '@/lib/types';
import { 
  Image as ImageIcon, 
  Globe, 
  Users, 
  Lock,
  X
} from 'lucide-react';

interface CreatePostProps {
  onPostCreated?: (post: Post) => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [privacy, setPrivacy] = useState<'public' | 'followers' | 'private'>('public');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivacyDropdown, setShowPrivacyDropdown] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('privacy', privacy);
      if (image) {
        formData.append('image', image);
      }

      const response = await postsAPI.createPost(formData);
      onPostCreated?.(response.post);
      
      // Reset form
      setContent('');
      setImage(null);
      setPrivacy('public');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const privacyOptions = [
    { value: 'public', label: 'Public', icon: Globe, description: 'Anyone can see this post' },
    { value: 'followers', label: 'Followers', icon: Users, description: 'Only your followers can see this post' },
    { value: 'private', label: 'Private', icon: Lock, description: 'Only specific people can see this post' },
  ];

  const selectedPrivacy = privacyOptions.find(option => option.value === privacy);

  if (!user) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <Avatar src={user.avatar} alt={user.firstName} />
          <div>
            <h3 className="font-medium text-gray-900">
              {user.firstName} {user.lastName}
            </h3>
            
            {/* Privacy Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
              >
                {selectedPrivacy && <selectedPrivacy.icon className="w-3 h-3" />}
                <span>{selectedPrivacy?.label}</span>
              </button>

              {showPrivacyDropdown && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border z-10">
                  {privacyOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setPrivacy(option.value as any);
                        setShowPrivacyDropdown(false);
                      }}
                      className="w-full flex items-start space-x-3 px-4 py-3 hover:bg-gray-50 text-left"
                    >
                      <option.icon className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm text-gray-900">{option.label}</p>
                        <p className="text-xs text-gray-500">{option.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Input */}
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={3}
          disabled={isSubmitting}
        />

        {/* Image Preview */}
        {image && (
          <div className="relative">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => setImage(null)}
              className="absolute top-2 right-2 p-1 bg-gray-900 bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="hidden"
                disabled={isSubmitting}
              />
              <div className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ImageIcon className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">Photo/Video</span>
              </div>
            </label>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || (!content.trim() && !image)}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </form>
    </div>
  );
}
