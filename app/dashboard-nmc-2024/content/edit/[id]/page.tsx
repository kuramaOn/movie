'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/AdminLayout';

interface Genre {
  id: number;
  name: string;
}

export default function EditContent({ params }: { params: { id: string } }) {
  const router = useRouter();
  const contentId = parseInt(params.id);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [genres, setGenres] = useState<Genre[]>([]);
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
    fetchContent();
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

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/content/${contentId}`);
      const data = await response.json();
      
      setFormData({
        title: data.title,
        description: data.description || '',
        type: data.type,
        videoUrl: data.videoUrl,
        thumbnailUrl: data.thumbnailUrl || '',
        year: data.year || new Date().getFullYear(),
        duration: data.duration || 0,
        rating: data.rating || 0,
        cast: data.cast || '',
        genreIds: data.genres?.map((g: any) => g.genreId) || [],
      });
    } catch (error) {
      console.error('Error fetching content:', error);
      alert('Error loading content');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/content/${contentId}`, {
        method: 'PUT',
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
        alert('Content updated successfully!');
        router.push('/dashboard-nmc-2024/content');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating content:', error);
      alert('Error updating content');
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

  if (fetching) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-netflix-red mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading content...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">Edit Content</h1>
          <Link
            href="/dashboard-nmc-2024/content"
            className="bg-netflix-light-gray hover:bg-gray-600 text-white px-6 py-2 rounded transition"
          >
            Back
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-netflix-gray p-6 rounded-lg space-y-6">
          {/* Same form fields as Add Content */}
          <div>
            <label className="block text-sm font-semibold mb-2">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white focus:outline-none focus:border-netflix-red"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white focus:outline-none focus:border-netflix-red"
            />
          </div>

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

          <div>
            <label className="block text-sm font-semibold mb-2">Video URL *</label>
            <input
              type="url"
              required
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white focus:outline-none focus:border-netflix-red"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Thumbnail URL</label>
            <input
              type="url"
              value={formData.thumbnailUrl}
              onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
              className="w-full px-4 py-3 bg-netflix-light-gray border border-gray-600 rounded text-white focus:outline-none focus:border-netflix-red"
            />
          </div>

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
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-netflix-red hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded transition"
            >
              {loading ? 'Updating...' : 'Update Content'}
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
    </AdminLayout>
  );
}
