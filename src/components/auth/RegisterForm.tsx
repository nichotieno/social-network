'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

export function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nickname: '',
    aboutMe: '',
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('firstName', formData.firstName);
      data.append('lastName', formData.lastName);
      data.append('dateOfBirth', formData.dateOfBirth);
      if (formData.nickname) data.append('nickname', formData.nickname);
      if (formData.aboutMe) data.append('aboutMe', formData.aboutMe);
      if (avatar) data.append('avatar', avatar);

      await register(data);
      router.push('/dashboard');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          name="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
        
        <Input
          name="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <Input
        type="email"
        name="email"
        label="Email"
        value={formData.email}
        onChange={handleChange}
        required
        disabled={isLoading}
      />

      <Input
        type="date"
        name="dateOfBirth"
        label="Date of Birth"
        value={formData.dateOfBirth}
        onChange={handleChange}
        required
        disabled={isLoading}
      />

      <Input
        name="nickname"
        label="Nickname (Optional)"
        value={formData.nickname}
        onChange={handleChange}
        disabled={isLoading}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
        
        <Input
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          disabled={isLoading}
        />
      </div>

      <Textarea
        name="aboutMe"
        label="About Me (Optional)"
        value={formData.aboutMe}
        onChange={handleChange}
        rows={3}
        disabled={isLoading}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Avatar (Optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
}
