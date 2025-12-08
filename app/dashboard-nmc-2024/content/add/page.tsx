'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SparklesIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface Genre {
  id: number;
  name: string;
}

export default function AddContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [genres, setGenres] = useState<Genre[]>([]);
  const [autoFilled, setAutoFilled] = useState({
    title: false,
    description: false,
    thumbnailUrl: false,
    duration: false,
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'movie',
    videoUrl: '',
    thumbnailUrl: '',
    year: new Date().getFullYear(),
    duration: 0,
    rating: 0,
    cast: '',
    genreIds: [] as number[],
  });

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    try {
      const response = await fetch('/api/admin/genres');
      const data = await response.json();
      setGenres(data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  // Auto-extract metadata when video URL changes
  const handleVideoUrlChange = async (url: string) => {
    setFormData({ ...formData, videoUrl: url });

    // Only auto-extract if URL is complete (has http/https)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      await extractMetadata(url);
    }
  };

  // Extract metadata from URL
  const extractMetadata = async (url: string) => {
    setIsExtracting(true);

    try {
      const response = await fetch('/api/admin/extract-metadata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url })
      });

      const data = await response.json();

      if (response.ok) {
        // Update form with extracted data
        const updates: any = {};
        const filledFields: any = {};

        if (data.title && !formData.title) {
          updates.title = data.title;
          filledFields.title = true;
        }
        if (data.description && !formData.description) {
          updates.description = data.description;
          filledFields.description = true;
        }
        if (data.thumbnail_url && !formData.thumbnailUrl) {
          updates.thumbnailUrl = data.thumbnail_url;
          filledFields.thumbnailUrl = true;
        }
        if (data.duration && !formData.duration) {
          updates.duration = data.duration;
          filledFields.duration = true;
        }

        setFormData(prev => ({ ...prev, ...updates }));
        setAutoFilled(prev => ({ ...prev, ...filledFields }));

        // Show success toast
        setToastMessage('✨ Metadata extracted successfully!');
        setToastType('success');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Extraction error:', error);
      setToastMessage('Could not auto-extract. Please fill manually.');
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsExtracting(false);
    }
  };

  // Manual refresh button
  const handleRefreshMetadata = () => {
    if (formData.videoUrl) {
      extractMetadata(formData.videoUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          duration: parseInt(formData.duration.toString()) || null,
          year: parseInt(formData.year.toString()) || null,
          rating: parseFloat(formData.rating.toString()) || null,
        }),
      });

      if (response.ok) {
        alert('Content added successfully!');
        router.push('/dashboard-nmc-2024/content');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error adding content:', error);
      alert('Error adding content');
    } finally {
      setLoading(false);
    }
  };

  const handleGenreToggle = (genreId: number) => {
    setFormData((prev) => ({
      ...prev,
      genreIds: prev.genreIds.includes(genreId)
        ? prev.genreIds.filter((id) => id !== genreId)
        : [...prev.genreIds, genreId],
    }));
  };

  return (
    <div className="pt-24 px-4 md:px-12 min-h-screen">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-20 right-4 z-50 flex items-center space-x-3 px-6 py-4 rounded-lg border backdrop-blur-md shadow-lg animate-slide-in-right ${
          toastType === 'success' 
            ? 'border-green-500/50 bg-green-500/10' 
            : 'border-red-500/50 bg-red-500/10'
        }`}>
          <span className="text-white font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between animate-fade-in-down">
          <h1 className="text-3xl md:text-4xl font-bold">Add Content</h1>
          <Link
            href="/dashboard-nmc-2024/content"
            className="bg-netflix-light-gray hover:bg-gray-600 text-white px-6 py-2 rounded transition"
          >
            Back
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-netflix-gray p-6 rounded-lg space-y-6">
          {/* Title (Auto-filled) */}
          <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <label className="block text-sm font-semibold mb-2">
              Title * {autoFilled.title && <span className="text-green-500 text-xs">✓ Auto-filled</span>}
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter movie or documentary title"
              className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white focus:outline-none focus:border-netflix-red transition-all duration-300"
            />
          </div>

          {/* Description (Auto-filled) */}
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <label className="block text-sm font-semibold mb-2">
              Description {autoFilled.description && <span className="text-green-500 text-xs">✓ Auto-filled</span>}
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
              className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white focus:outline-none focus:border-netflix-red transition-all duration-300"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-semibold mb-2">Type *</label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white focus:outline-none focus:border-netflix-red"
            >
              <option value="movie">Movie</option>
              <option value="documentary">Documentary</option>
            </select>
          </div>

          {/* Video URL with Auto-Extract */}
          <div className="animate-fade-in-up">
            <label className="block text-sm font-semibold mb-2">Video URL *</label>
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  type="url"
                  required
                  value={formData.videoUrl}
                  onChange={(e) => handleVideoUrlChange(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                  className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white focus:outline-none focus:border-netflix-red transition-all duration-300"
                />
                {isExtracting && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <ArrowPathIcon className="w-5 h-5 text-netflix-red animate-spin" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleRefreshMetadata}
                disabled={!formData.videoUrl || isExtracting}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                title="Auto-generate metadata"
              >
                <SparklesIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Auto-Fill</span>
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              ✨ Paste YouTube, Vimeo, or Dailymotion URL. Metadata will auto-extract!
            </p>
          </div>

          {/* Thumbnail URL (Auto-filled) */}
          <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <label className="block text-sm font-semibold mb-2">
              Thumbnail URL {autoFilled.thumbnailUrl && <span className="text-green-500 text-xs">✓ Auto-filled</span>}
            </label>
            <input
              type="url"
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              placeholder="https://example.com/thumbnail.jpg"
              className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white focus:outline-none focus:border-netflix-red transition-all duration-300"
            />
            
            {/* Thumbnail Preview */}
            {formData.thumbnailUrl && (
              <div className="mt-3 animate-fade-in">
                <img
                  src={formData.thumbnailUrl}
                  alt="Thumbnail preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Year, Duration, Rating */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Year</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                min="1900"
                max="2100"
                className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white focus:outline-none focus:border-netflix-red"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                min="0"
                className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white focus:outline-none focus:border-netflix-red"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Rating (0-10)</label>
              <input
                type="number"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                min="0"
                max="10"
                step="0.1"
                className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white focus:outline-none focus:border-netflix-red"
              />
            </div>
          </div>

          {/* Cast */}
          <div>
            <label className="block text-sm font-semibold mb-2">Cast</label>
            <input
              type="text"
              value={formData.cast}
              onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
              placeholder="Actor 1, Actor 2, Actor 3"
              className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white focus:outline-none focus:border-netflix-red"
            />
          </div>

          {/* Genres */}
          <div>
            <label className="block text-sm font-semibold mb-2">Genres</label>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  type="button"
                  onClick={() => handleGenreToggle(genre.id)}
                  className={`px-4 py-2 rounded transition ${
                    formData.genreIds.includes(genre.id)
                      ? 'bg-netflix-red text-white'
                      : 'bg-netflix-light-gray text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
            {genres.length === 0 && (
              <p className="text-sm text-gray-400">
                No genres available. <Link href="/dashboard-nmc-2024/genres" className="text-netflix-red hover:underline">Create genres first</Link>
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-netflix-red hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded transition"
            >
              {loading ? 'Adding...' : 'Add Content'}
            </button>
            <Link
              href="/dashboard-nmc-2024/content"
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
