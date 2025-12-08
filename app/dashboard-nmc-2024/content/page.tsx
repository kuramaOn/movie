'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlusIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface Content {
  id: number;
  title: string;
  type: string;
  thumbnailUrl: string | null;
  viewCount: number;
  genres: Array<{ genre: { name: string } }>;
}

export default function ContentManagement() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await fetch('/api/admin/content');
      const data = await response.json();
      setContents(data.content || []);
    } catch (error) {
      console.error('Error fetching contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const response = await fetch(`/api/admin/content/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Content deleted successfully!');
        fetchContents();
      } else {
        alert('Failed to delete content');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Error deleting content');
    }
  };

  const filteredContents = contents.filter((content) =>
    content.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-24 px-4 md:px-12 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">Content Management</h1>
          <Link
            href="/dashboard-nmc-2024/content/add"
            className="flex items-center space-x-2 bg-netflix-red hover:bg-red-700 text-white px-6 py-2 rounded transition"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Content</span>
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search content..."
            className="w-full pl-10 pr-4 py-3 bg-netflix-gray border border-netflix-light-gray rounded text-white placeholder-gray-400 focus:outline-none focus:border-netflix-red"
          />
        </div>

        {/* Content Table */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-netflix-gray rounded skeleton"></div>
            ))}
          </div>
        ) : filteredContents.length > 0 ? (
          <div className="bg-netflix-gray rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-netflix-light-gray">
                  <tr>
                    <th className="text-left p-4">Thumbnail</th>
                    <th className="text-left p-4">Title</th>
                    <th className="text-left p-4">Type</th>
                    <th className="text-left p-4">Genres</th>
                    <th className="text-left p-4">Views</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredContents.map((content) => (
                    <tr key={content.id} className="border-t border-netflix-light-gray hover:bg-netflix-light-gray transition">
                      <td className="p-4">
                        <div className="relative w-24 h-14 bg-netflix-light-gray rounded overflow-hidden">
                          {content.thumbnailUrl ? (
                            <Image
                              src={content.thumbnailUrl}
                              alt={content.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                              No Image
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-semibold">{content.title}</td>
                      <td className="p-4">
                        <span className="capitalize bg-netflix-light-gray px-3 py-1 rounded text-sm">
                          {content.type}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-400">
                        {content.genres.map((g) => g.genre.name).join(', ') || 'None'}
                      </td>
                      <td className="p-4">{content.viewCount}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Link
                            href={`/dashboard-nmc-2024/content/edit/${content.id}`}
                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(content.id, content.title)}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded transition"
                            title="Delete"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-netflix-gray rounded-lg">
            <p className="text-xl text-gray-400">No content found</p>
            <Link
              href="/dashboard-nmc-2024/content/add"
              className="inline-block mt-4 bg-netflix-red hover:bg-red-700 text-white px-6 py-2 rounded transition"
            >
              Add Your First Content
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
