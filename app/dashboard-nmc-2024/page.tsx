'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import {
  FilmIcon,
  DocumentTextIcon,
  EyeIcon as EyeIconSolid,
  RssIcon,
} from '@heroicons/react/24/solid';

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
      <div className="min-h-screen bg-netflix-black pt-24 px-4 md:px-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-netflix-light-gray rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-netflix-light-gray rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-netflix-black">
      {/* Admin Header */}
      <header className="bg-black/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            <span className="text-netflix-red">NETWORK CHANEL</span> Dashboard
          </h1>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-netflix-red hover:bg-red-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {[
            { title: 'Total Content', value: stats?.totalContent || 0, icon: FilmIcon, color: 'text-netflix-red' },
            { title: 'Movies', value: stats?.totalMovies || 0, icon: FilmIcon, color: 'text-blue-500' },
            { title: 'Documentaries', value: stats?.totalDocumentaries || 0, icon: DocumentTextIcon, color: 'text-green-500' },
            { title: 'Total Views', value: stats?.totalViews.toLocaleString() || 0, icon: EyeIconSolid, color: 'text-yellow-500' },
            { title: 'Feed Sources', value: stats?.totalFeeds || 0, icon: RssIcon, color: 'text-purple-500' },
          ].map((stat, index) => (
            <div
              key={stat.title}
              className="bg-netflix-gray/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-netflix-red transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`h-12 w-12 ${stat.color}`} />
                <span className="text-3xl font-bold text-white">{stat.value}</span>
              </div>
              <h3 className="text-gray-400 text-sm">{stat.title}</h3>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { href: '/dashboard-nmc-2024/content', icon: FilmIcon, title: 'Content Management', desc: 'Add, edit, or delete movies and documentaries', color: 'text-netflix-red' },
            { href: '/dashboard-nmc-2024/genres', icon: DocumentTextIcon, title: 'Genre Management', desc: 'Manage content genres and categories', color: 'text-green-500' },
            { href: '/dashboard-nmc-2024/feeds', icon: RssIcon, title: 'Feed Import', desc: 'Import content from RSS feeds and APIs', color: 'text-purple-500' },
          ].map((action, index) => (
            <Link
              key={action.title}
              href={action.href}
              className="bg-netflix-gray p-6 rounded-lg hover:bg-netflix-light-gray transition-all duration-300 group animate-fade-in-up"
              style={{ animationDelay: `${(index + 5) * 100}ms` }}
            >
              <action.icon className={`h-12 w-12 ${action.color} mb-4 group-hover:scale-110 transition-transform duration-300`} />
              <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
              <p className="text-gray-400">{action.desc}</p>
            </Link>
          ))}
        </div>

        {/* Recent Uploads */}
        {stats?.recentUploads && stats.recentUploads.length > 0 && (
          <div className="bg-netflix-gray p-6 rounded-lg animate-fade-in-up" style={{ animationDelay: '800ms' }}>
            <h2 className="text-2xl font-bold mb-4">Recent Uploads</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-netflix-light-gray">
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Views</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUploads.map((content, index) => (
                    <tr 
                      key={content.id} 
                      className="border-b border-netflix-light-gray hover:bg-gray-800/50 transition-colors duration-300 animate-fade-in"
                      style={{ animationDelay: `${(index + 10) * 50}ms` }}
                    >
                      <td className="py-3">
                        <Link href={`/watch/${content.id}`} className="hover:text-netflix-red transition">
                          {content.title}
                        </Link>
                      </td>
                      <td className="py-3">
                        <span className="capitalize">{content.type}</span>
                      </td>
                      <td className="py-3">{content.viewCount}</td>
                      <td className="py-3 text-gray-400">
                        {new Date(content.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
