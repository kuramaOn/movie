'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface PreviewVideo {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration?: number;
}

export default function PreviewFeed({ params }: { params: { id: string } }) {
  const router = useRouter();
  const feedId = parseInt(params.id);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [videos, setVideos] = useState<PreviewVideo[]>([]);
  const [selectedVideos, setSelectedVideos] = useState<Set<number>>(new Set());
  const [genres, setGenres] = useState<any[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [defaultType, setDefaultType] = useState('movie');

  const handlePreview = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/feeds/${feedId}/preview`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setVideos(data.videos || []);
        fetchGenres();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error previewing feed:', error);
      alert('Error previewing feed');
    } finally {
      setLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await fetch('/api/admin/genres');
      const data = await response.json();
      setGenres(data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectedVideos.size === videos.length) {
      setSelectedVideos(new Set());
    } else {
      setSelectedVideos(new Set(videos.map((_, index) => index)));
    }
  };

  const toggleVideo = (index: number) => {
    const newSelected = new Set(selectedVideos);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedVideos(newSelected);
  };

  const handleImport = async () => {
    if (selectedVideos.size === 0) {
      alert('Please select at least one video to import');
      return;
    }

    setImporting(true);
    try {
      const selectedItems = Array.from(selectedVideos).map(index => ({
        ...videos[index],
        type: defaultType,
      }));

      const response = await fetch(`/api/admin/feeds/${feedId}/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedItems,
          defaultGenreIds: selectedGenres,
          defaultType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        let message = `Import completed!\n\nImported: ${data.imported}\nErrors: ${data.errors}`;
        
        // Show error details if any
        if (data.errors > 0 && data.errorDetails) {
          message += '\n\n❌ Error Details:\n';
          data.errorDetails.slice(0, 10).forEach((err: any, idx: number) => {
            message += `${idx + 1}. "${err.title}": ${err.error}\n`;
          });
          if (data.errorDetails.length > 10) {
            message += `\n... and ${data.errorDetails.length - 10} more errors`;
          }
        }
        
        alert(message);
        
        if (data.imported > 0) {
          router.push('/dashboard-nmc-2024/feeds');
        }
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error importing:', error);
      alert('Error importing videos');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="pt-24 px-4 md:px-12 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">Preview Feed</h1>
          <Link
            href="/dashboard-nmc-2024/feeds"
            className="bg-netflix-light-gray hover:bg-gray-600 text-white px-6 py-2 rounded transition"
          >
            Back
          </Link>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-20 bg-netflix-gray rounded-lg">
            <p className="text-xl text-gray-400 mb-4">Click preview to fetch videos from feed</p>
            <button
              onClick={handlePreview}
              disabled={loading}
              className="bg-netflix-red hover:bg-red-700 disabled:bg-gray-600 text-white px-8 py-3 rounded transition"
            >
              {loading ? 'Loading...' : 'Preview Feed'}
            </button>
          </div>
        ) : (
          <>
            <div className="bg-netflix-gray p-6 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Found {videos.length} videos</p>
                  <p className="text-sm text-gray-400">Selected: {selectedVideos.size}</p>
                </div>
                <button
                  onClick={handleSelectAll}
                  className="bg-netflix-light-gray hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                >
                  {selectedVideos.size === videos.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Default Type</label>
                  <select
                    value={defaultType}
                    onChange={(e) => setDefaultType(e.target.value)}
                    className="w-full px-4 py-2 bg-netflix-light-gray border border-gray-600 rounded text-white"
                  >
                    <option value="movie">Movie</option>
                    <option value="documentary">Documentary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Default Genres</label>
                  <select
                    multiple
                    value={selectedGenres.map(String)}
                    onChange={(e) => setSelectedGenres(Array.from(e.target.selectedOptions, option => parseInt(option.value)))}
                    className="w-full px-4 py-2 bg-netflix-light-gray border border-gray-600 rounded text-white"
                    size={3}
                  >
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleImport}
                disabled={importing || selectedVideos.size === 0}
                className="w-full bg-netflix-red hover:bg-red-700 disabled:bg-gray-600 text-white font-semibold py-3 rounded transition"
              >
                {importing ? 'Importing...' : `Import Selected (${selectedVideos.size})`}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video, index) => (
                <div
                  key={index}
                  onClick={() => toggleVideo(index)}
                  className={`bg-netflix-gray p-4 rounded-lg cursor-pointer transition ${
                    selectedVideos.has(index) ? 'ring-2 ring-netflix-red' : ''
                  }`}
                >
                  <div className="relative aspect-video bg-netflix-light-gray rounded overflow-hidden mb-3">
                    {video.thumbnailUrl && video.thumbnailUrl.trim() !== '' ? (
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        fill
                        className="object-cover"
                        unoptimized={video.thumbnailUrl.startsWith('http')}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/placeholder-thumbnail.jpg';
                        }}
                      />
                    ) : (
                      <Image
                        src="/placeholder-thumbnail.jpg"
                        alt={video.title}
                        fill
                        className="object-cover opacity-50"
                      />
                    )}
                    {selectedVideos.has(index) && (
                      <div className="absolute inset-0 bg-netflix-red bg-opacity-30 flex items-center justify-center">
                        <div className="bg-netflix-red rounded-full p-2">
                          <svg className="w-8 h-8" fill="white" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold line-clamp-2 mb-2">{video.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2">{video.description}</p>
                  {video.duration && (
                    <p className="text-xs text-gray-500 mt-2">{video.duration} minutes</p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
