'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { 
  Home, 
  Users, 
  MessageCircle, 
  Bell, 
  Search,
  LogOut,
  Settings
} from 'lucide-react';

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="text-xl font-bold text-primary-600">
            Social Network
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users, groups..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Home className="w-5 h-5 text-gray-600" />
            </Link>
            
            <Link
              href="/groups"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Users className="w-5 h-5 text-gray-600" />
            </Link>
            
            <Link
              href="/chat"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-gray-600" />
            </Link>
            
            <Link
              href="/notifications"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {/* Notification badge would go here */}
            </Link>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Avatar src={user.avatar} alt={user.firstName} size="sm" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                  <Link
                    href={`/profile/${user.id}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    View Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="inline w-4 h-4 mr-2" />
                    Settings
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="inline w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
