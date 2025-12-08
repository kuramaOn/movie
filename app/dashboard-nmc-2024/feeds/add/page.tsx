'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddFeed() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    type: 'rss',
    apiKey: '',
    autoSync: false,
    syncInterval: 24,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/feeds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Feed added successfully!');
        router.push('/dashboard-nmc-2024/feeds');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding feed:', error);
      alert('Error adding feed');
    } finally {
      setLoading(false);
    }
  };

  const requiresApiKey = ['youtube_channel', 'youtube_playlist', 'vimeo'].includes(formData.type);

  return (
    <div className="pt-24 px-4 md:px-12 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">Add Feed Source</h1>
          <Link
            href="/dashboard-nmc-2024/feeds"
            className="bg-netflix-light-gray hover:bg-gray-600 text-white px-6 py-2 rounded transition"
          >
            Back
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-netflix-gray p-6 rounded-lg space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">Feed Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My Video Feed"
              className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white focus:outline-none focus:border-netflix-red"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold mb-2">Feed Type *</label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white focus:outline-none focus:border-netflix-red"
            >
              <option value="rss">RSS Feed</option>
              <option value="json_api">JSON API</option>
              <option value="youtube_channel">YouTube Channel</option>
              <option value="youtube_playlist">YouTube Playlist</option>
              <option value="vimeo">Vimeo</option>
            </select>
          </div>

          {/* URL */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              {formData.type === 'youtube_channel' ? 'Channel ID *' : 
               formData.type === 'youtube_playlist' ? 'Playlist ID *' :
               formData.type === 'vimeo' ? 'User ID *' : 'Feed URL *'}
            </label>
            <input
              type="text"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder={
                formData.type === 'youtube_channel' ? 'UCxxxxxxxxxxxxxxxxx' :
                formData.type === 'youtube_playlist' ? 'PLxxxxxxxxxxxxxxxxx' :
                formData.type === 'vimeo' ? 'user123456' :
                'https://...'
              }
              className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white focus:outline-none focus:border-netflix-red"
            />
          </div>

          {/* API Key */}
          {requiresApiKey && (
            <div>
              <label className="block text-sm font-semibold mb-2">
                {formData.type.includes('youtube') ? 'YouTube API Key *' : 'Vimeo Access Token *'}
              </label>
              <input
                type="text"
                required
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="Enter API key or access token"
                className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white focus:outline-none focus:border-netflix-red"
              />
              <p className="text-xs text-gray-400 mt-1">
                {formData.type.includes('youtube') 
                  ? 'Get your API key from Google Cloud Console'
                  : 'Get your access token from Vimeo Developer Portal'}
              </p>
            </div>
          )}

          {/* Auto-Sync */}
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autoSync}
                onChange={(e) => setFormData({ ...formData, autoSync: e.target.checked })}
                className="w-5 h-5 rounded bg-netflix-light-gray border-gray-600 text-netflix-red focus:ring-netflix-red"
              />
              <span className="text-sm font-semibold">Enable Auto-Sync</span>
            </label>
          </div>

          {/* Sync Interval */}
          {formData.autoSync && (
            <div>
              <label className="block text-sm font-semibold mb-2">Sync Interval (hours)</label>
              <input
                type="number"
                value={formData.syncInterval}
                onChange={(e) => setFormData({ ...formData, syncInterval: parseInt(e.target.value) })}
                min="1"
                max="168"
                className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white focus:outline-none focus:border-netflix-red"
              />
              <p className="text-xs text-gray-400 mt-1">
                How often to automatically check for new content
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-netflix-red hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded transition"
            >
              {loading ? 'Adding...' : 'Add Feed'}
            </button>
            <Link
              href="/dashboard-nmc-2024/feeds"
              className="px-6 py-3 bg-netflix-light-gray hover:bg-gray-600 text-white rounded transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
