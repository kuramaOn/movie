'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';
import FeedTemplateSelector from '@/components/FeedTemplateSelector';
import { FeedTemplate } from '@/lib/feedTemplates';
import { MagnifyingGlassIcon, RssIcon, GlobeAltIcon, CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface DiscoveredFeed {
  url: string;
  title: string;
  type: string;
}

export default function AddFeed() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Enter URL, 2: Choose Feed, 3: Configure
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [discoveredFeeds, setDiscoveredFeeds] = useState<DiscoveredFeed[]>([]);
  const [selectedFeed, setSelectedFeed] = useState<DiscoveredFeed | null>(null);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    autoSync: true,
    syncInterval: 24,
    apiKey: '',
  });

  // Step 1: Discover feeds from website
  const handleDiscoverFeeds = async () => {
    if (!websiteUrl) return;

    setIsDiscovering(true);

    try {
      const response = await fetch('/api/admin/discover-feeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: websiteUrl }),
      });

      const data = await response.json();

      if (response.ok && data.feeds.length > 0) {
        setDiscoveredFeeds(data.feeds);
        setStep(2);
      } else {
        alert('No RSS feeds found on this website. You can try entering the RSS feed URL directly.');
        // Allow manual entry
        setDiscoveredFeeds([{
          url: websiteUrl,
          title: 'Manual Feed URL',
          type: 'rss',
        }]);
        setStep(2);
      }
    } catch (error) {
      console.error('Discovery error:', error);
      alert('Error discovering feeds. Please enter RSS feed URL directly.');
      setDiscoveredFeeds([{
        url: websiteUrl,
        title: 'Manual Feed URL',
        type: 'rss',
      }]);
      setStep(2);
    } finally {
      setIsDiscovering(false);
    }
  };

  // Handle template selection
  const handleSelectTemplate = (template: FeedTemplate) => {
    setShowTemplateSelector(false);
    setSelectedFeed({
      url: template.urlPlaceholder,
      title: template.name,
      type: template.type,
    });
    setFormData({
      name: template.name,
      autoSync: template.defaultAutoSync,
      syncInterval: template.defaultSyncInterval,
      apiKey: '',
    });
    setStep(3);
  };

  // Step 2: Select feed and configure
  const handleSelectFeed = (feed: DiscoveredFeed) => {
    setSelectedFeed(feed);
    setFormData({
      ...formData,
      name: feed.title,
    });
    setStep(3);
  };

  // Step 3: Save feed source
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/feeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          url: selectedFeed?.url,
          type: selectedFeed?.type,
          autoSync: formData.autoSync,
          syncInterval: formData.syncInterval,
          apiKey: formData.apiKey || undefined,
        }),
      });

      if (response.ok) {
        alert('Feed source added successfully!');
        router.push('/dashboard-nmc-2024/feeds');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to add feed source');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setWebsiteUrl('');
    setDiscoveredFeeds([]);
    setSelectedFeed(null);
    setFormData({
      name: '',
      autoSync: true,
      syncInterval: 24,
      apiKey: '',
    });
  };

  return (
    <AdminLayout>
      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <FeedTemplateSelector
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">Add Feed Source</h1>
          <Link
            href="/dashboard-nmc-2024/feeds"
            className="bg-netflix-light-gray hover:bg-gray-600 text-white px-6 py-2 rounded transition"
          >
            Back
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <StepIndicator number={1} active={step === 1} completed={step > 1} label="Enter URL" />
            <div className={`w-16 h-0.5 ${step > 1 ? 'bg-netflix-red' : 'bg-gray-700'}`} />
            <StepIndicator number={2} active={step === 2} completed={step > 2} label="Choose Feed" />
            <div className={`w-16 h-0.5 ${step > 2 ? 'bg-netflix-red' : 'bg-gray-700'}`} />
            <StepIndicator number={3} active={step === 3} completed={false} label="Configure" />
          </div>
        </div>

        {/* Step 1: Enter Website URL */}
        {step === 1 && (
          <div className="bg-netflix-gray p-8 rounded-lg space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <GlobeAltIcon className="w-16 h-16 text-netflix-red mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Discover RSS Feeds</h2>
              <p className="text-gray-400">Enter any website URL and we'll discover RSS feeds automatically</p>
            </div>

            {/* Quick Templates Button */}
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <SparklesIcon className="w-8 h-8 text-purple-400" />
                  <div>
                    <h3 className="font-bold text-lg">Use a Template</h3>
                    <p className="text-sm text-gray-400">Quick setup for PornHub, XVideos, YouTube, and more!</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowTemplateSelector(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                  <SparklesIcon className="w-5 h-5" />
                  <span>Browse Templates</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-netflix-gray text-gray-400">OR ENTER URL MANUALLY</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Website or Feed URL
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com or https://example.com/feed"
                  className="flex-1 px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-netflix-red"
                  onKeyPress={(e) => e.key === 'Enter' && handleDiscoverFeeds()}
                />
                <button
                  onClick={handleDiscoverFeeds}
                  disabled={!websiteUrl || isDiscovering}
                  className="px-6 py-3 bg-netflix-red hover:bg-red-700 text-white rounded transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isDiscovering ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                      <span>Discovering...</span>
                    </>
                  ) : (
                    <>
                      <MagnifyingGlassIcon className="w-5 h-5" />
                      <span>Discover Feeds</span>
                    </>
                  )}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Examples: https://techcrunch.com, https://www.youtube.com/@channelname
              </p>
            </div>

            {/* Supported Sources */}
            <div className="bg-netflix-light-gray rounded-lg p-4 border border-gray-700">
              <h3 className="font-semibold mb-3">Supported Sources:</h3>
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <RssIcon className="w-4 h-4 text-netflix-red" />
                  <span>RSS/Atom Feeds</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RssIcon className="w-4 h-4 text-netflix-red" />
                  <span>JSON Feeds</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RssIcon className="w-4 h-4 text-netflix-red" />
                  <span>WordPress Blogs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RssIcon className="w-4 h-4 text-netflix-red" />
                  <span>News Sites</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Choose Discovered Feed */}
        {step === 2 && (
          <div className="bg-netflix-gray p-8 rounded-lg space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <RssIcon className="w-16 h-16 text-netflix-red mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                {discoveredFeeds.length} Feed{discoveredFeeds.length !== 1 ? 's' : ''} Found
              </h2>
              <p className="text-gray-400">Select which feed you want to import</p>
            </div>

            <div className="space-y-3">
              {discoveredFeeds.map((feed, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectFeed(feed)}
                  className="w-full p-4 bg-netflix-light-gray hover:bg-gray-700 border border-gray-700 hover:border-netflix-red rounded-lg text-left transition-all duration-300 transform hover:scale-102 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold group-hover:text-netflix-red transition-colors">
                        {feed.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1 break-all">{feed.url}</p>
                      <span className="inline-block mt-2 px-2 py-1 bg-netflix-red/20 text-netflix-red text-xs rounded">
                        {feed.type.toUpperCase().replace('_', ' ')}
                      </span>
                    </div>
                    <svg className="w-6 h-6 text-gray-600 group-hover:text-netflix-red transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full py-3 bg-netflix-light-gray hover:bg-gray-700 rounded transition-colors duration-300"
            >
              ← Back to URL Entry
            </button>
          </div>
        )}

        {/* Step 3: Configure Feed */}
        {step === 3 && selectedFeed && (
          <form onSubmit={handleSubmit} className="bg-netflix-gray p-8 rounded-lg space-y-6 animate-fade-in">
            <div className="text-center mb-8">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Configure Feed</h2>
              <p className="text-gray-400">Set up how this feed should be imported</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Feed Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-netflix-red"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Feed URL *
              </label>
              <input
                type="url"
                value={selectedFeed.url}
                onChange={(e) => setSelectedFeed({ ...selectedFeed, url: e.target.value })}
                className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-netflix-red"
                placeholder="Enter or edit feed URL"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                You can edit the URL if needed
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Feed Type
              </label>
              <input
                type="text"
                value={selectedFeed.type.toUpperCase().replace('_', ' ')}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded text-gray-500 cursor-not-allowed"
                disabled
              />
            </div>

            {/* API Key Field (if needed) */}
            {(selectedFeed.type === 'youtube_channel' || 
              selectedFeed.type === 'youtube_playlist' || 
              selectedFeed.type === 'vimeo') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  API Key {selectedFeed.type.includes('youtube') ? '(YouTube Data API v3)' : '(Vimeo Access Token)'} *
                </label>
                <input
                  type="text"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-netflix-red"
                  placeholder={selectedFeed.type.includes('youtube') ? 'AIzaSy...' : 'Enter Vimeo access token'}
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  {selectedFeed.type.includes('youtube') 
                    ? 'Get your API key from Google Cloud Console'
                    : 'Get your access token from Vimeo Developer settings'}
                </p>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="auto_sync"
                checked={formData.autoSync}
                onChange={(e) => setFormData({ ...formData, autoSync: e.target.checked })}
                className="w-5 h-5 accent-netflix-red"
              />
              <label htmlFor="auto_sync" className="text-sm font-semibold">
                Enable automatic sync
              </label>
            </div>

            {formData.autoSync && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sync Interval (hours)
                </label>
                <select
                  value={formData.syncInterval}
                  onChange={(e) => setFormData({ ...formData, syncInterval: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white focus:outline-none focus:border-netflix-red"
                >
                  <option value={1}>Every hour</option>
                  <option value={6}>Every 6 hours</option>
                  <option value={12}>Every 12 hours</option>
                  <option value={24}>Every 24 hours</option>
                  <option value={168}>Every week</option>
                </select>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 py-3 bg-netflix-light-gray hover:bg-gray-700 rounded transition-colors duration-300"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-netflix-red hover:bg-red-700 disabled:bg-gray-600 font-semibold rounded transition"
              >
                {loading ? 'Adding...' : 'Add Feed Source'}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}

function StepIndicator({ number, active, completed, label }: { number: number; active: boolean; completed: boolean; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
        completed ? 'bg-netflix-red' :
        active ? 'bg-netflix-red ring-4 ring-netflix-red/30' :
        'bg-gray-800 text-gray-500'
      }`}>
        {completed ? '✓' : number}
      </div>
      <span className={`mt-2 text-xs ${active || completed ? 'text-white' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  );
}
