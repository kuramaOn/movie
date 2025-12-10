'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import {
  FilmIcon,
  DocumentTextIcon,
  EyeIcon as EyeIconSolid,
  RssIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/solid';
import AdminLayout from '@/components/AdminLayout';

interface Stats {
  totalContent: number;
  totalMovies: number;
  totalDocumentaries: number;
  totalViews: number;
  totalFeeds: number;
  recentUploads: any[];
}

export default function AdminLogin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const auth = sessionStorage.getItem('nmc_admin_auth');
    if (auth === 'authenticated') {
      setAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    // Check password (use environment variable)
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'NetworkChanel2024!';
    
    if (password === correctPassword) {
      sessionStorage.setItem('nmc_admin_auth', 'authenticated');
      setAuthenticated(true);
      setLoading(false);
    } else {
      setError('Incorrect password. Please try again.');
      setLoading(false);
      setPassword('');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('nmc_admin_auth');
    setAuthenticated(false);
  };

  // Login Screen
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Animated Logo */}
          <div className="text-center mb-8 animate-fade-in-down">
            <ShieldCheckIcon className="w-20 h-20 text-netflix-red mx-auto mb-4 animate-pulse" />
            <h1 className="text-4xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-gray-400">Network Chanel Dashboard</p>
          </div>

          {/* Login Form */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700 animate-fade-in-up">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent transition-all duration-300"
                    placeholder="Enter admin password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg animate-shake">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-netflix-red hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Authenticating...
                  </span>
                ) : (
                  'Access Dashboard'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Authorized personnel only. All access is logged.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Dashboard (After Login)
  return <AdminDashboard onLogout={handleLogout} />;
}

// Separate Admin Dashboard Component
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="h-8 bg-gray-700 rounded w-64 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-32 bg-gray-800 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Welcome back! Here's what's happening with your platform.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { title: 'Total Content', value: stats?.totalContent || 0, icon: FilmIcon, color: 'bg-red-500/20 text-red-500' },
            { title: 'Movies', value: stats?.totalMovies || 0, icon: FilmIcon, color: 'bg-blue-500/20 text-blue-500' },
            { title: 'Documentaries', value: stats?.totalDocumentaries || 0, icon: DocumentTextIcon, color: 'bg-green-500/20 text-green-500' },
            { title: 'Total Views', value: stats?.totalViews.toLocaleString() || 0, icon: EyeIconSolid, color: 'bg-yellow-500/20 text-yellow-500' },
            { title: 'Feed Sources', value: stats?.totalFeeds || 0, icon: RssIcon, color: 'bg-purple-500/20 text-purple-500' },
          ].map((stat, index) => (
            <div
              key={stat.title}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-netflix-red transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color.split(' ')[0]}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color.split(' ')[1]}`} />
                </div>
                <span className="text-3xl font-bold text-white">{stat.value}</span>
              </div>
              <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { href: '/dashboard-nmc-2024/content', icon: FilmIcon, title: 'Manage Content', desc: 'Add or edit videos', color: 'bg-red-500/20 text-red-500' },
              { href: '/dashboard-nmc-2024/feeds', icon: RssIcon, title: 'Import Feeds', desc: 'Sync from sources', color: 'bg-purple-500/20 text-purple-500' },
              { href: '/dashboard-nmc-2024/genres', icon: DocumentTextIcon, title: 'Manage Genres', desc: 'Edit categories', color: 'bg-green-500/20 text-green-500' },
            ].map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-netflix-red transition-all duration-300 group"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${action.color.split(' ')[0]} group-hover:scale-110 transition-transform`}>
                  <action.icon className={`h-6 w-6 ${action.color.split(' ')[1]}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{action.title}</h3>
                <p className="text-sm text-gray-400">{action.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {stats?.recentUploads && stats.recentUploads.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Recent Uploads</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="text-left p-4 text-gray-300 font-semibold">Title</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Type</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Views</th>
                    <th className="text-left p-4 text-gray-300 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUploads.slice(0, 5).map((content) => (
                    <tr 
                      key={content.id} 
                      className="border-t border-gray-700 hover:bg-gray-750 transition"
                    >
                      <td className="p-4">
                        <Link href={`/watch/${content.id}`} className="text-white hover:text-netflix-red transition font-medium">
                          {content.title}
                        </Link>
                      </td>
                      <td className="p-4">
                        <span className="capitalize px-3 py-1 bg-gray-700 rounded text-sm text-gray-300">
                          {content.type}
                        </span>
                      </td>
                      <td className="p-4 text-white">{content.viewCount}</td>
                      <td className="p-4 text-gray-400">
                        {new Date(content.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
