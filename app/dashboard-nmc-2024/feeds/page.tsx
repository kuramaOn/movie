'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusIcon, TrashIcon, ArrowPathIcon, EyeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import AdminLayout from '@/components/AdminLayout';

interface Feed {
  id: number;
  name: string;
  url: string;
  type: string;
  autoSync: boolean;
  syncInterval: number;
  lastSynced: string | null;
}

export default function FeedManagement() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<number | null>(null);

  useEffect(() => {
    fetchFeeds();
  }, []);

  const fetchFeeds = async () => {
    try {
      const response = await fetch('/api/admin/feeds');
      const data = await response.json();
      setFeeds(data);
    } catch (error) {
      console.error('Error fetching feeds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (id: number) => {
    setSyncing(id);
    try {
      const response = await fetch(`/api/admin/feeds/${id}/sync`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Sync completed! Found: ${data.itemsFound}, Imported: ${data.itemsImported}`);
        fetchFeeds();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error syncing feed:', error);
      alert('Error syncing feed');
    } finally {
      setSyncing(null);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await fetch(`/api/admin/feeds/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Feed deleted successfully!');
        fetchFeeds();
      } else {
        alert('Failed to delete feed');
      }
    } catch (error) {
      console.error('Error deleting feed:', error);
      alert('Error deleting feed');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">Feed Management</h1>
          <Link
            href="/dashboard-nmc-2024/feeds/add"
            className="flex items-center space-x-2 bg-netflix-red hover:bg-red-700 text-white px-6 py-2 rounded transition"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Feed</span>
          </Link>
        </div>

        {/* Feeds Table */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-netflix-gray rounded skeleton"></div>
            ))}
          </div>
        ) : feeds.length > 0 ? (
          <div className="bg-netflix-gray rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-netflix-light-gray">
                  <tr>
                    <th className="text-left p-4">Name</th>
                    <th className="text-left p-4">Type</th>
                    <th className="text-left p-4">Auto-Sync</th>
                    <th className="text-left p-4">Last Synced</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {feeds.map((feed) => (
                    <tr key={feed.id} className="border-t border-netflix-light-gray hover:bg-netflix-light-gray transition">
                      <td className="p-4 font-semibold">{feed.name}</td>
                      <td className="p-4">
                        <span className="capitalize bg-netflix-light-gray px-3 py-1 rounded text-sm">
                          {feed.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded text-sm ${feed.autoSync ? 'bg-green-600' : 'bg-gray-600'}`}>
                          {feed.autoSync ? `Every ${feed.syncInterval}h` : 'Manual'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-400">
                        {feed.lastSynced
                          ? new Date(feed.lastSynced).toLocaleString()
                          : 'Never'}
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <Link
                            href={`/dashboard-nmc-2024/feeds/preview/${feed.id}`}
                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition"
                            title="Preview"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleSync(feed.id)}
                            disabled={syncing === feed.id}
                            className="p-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded transition"
                            title="Sync Now"
                          >
                            <ArrowPathIcon className={`h-4 w-4 ${syncing === feed.id ? 'animate-spin' : ''}`} />
                          </button>
                          <Link
                            href={`/dashboard-nmc-2024/feeds/logs/${feed.id}`}
                            className="p-2 bg-purple-600 hover:bg-purple-700 rounded transition"
                            title="View Logs"
                          >
                            <DocumentTextIcon className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(feed.id, feed.name)}
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
            <p className="text-xl text-gray-400">No feeds found</p>
            <Link
              href="/dashboard-nmc-2024/feeds/add"
              className="inline-block mt-4 bg-netflix-red hover:bg-red-700 text-white px-6 py-2 rounded transition"
            >
              Add Your First Feed
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
