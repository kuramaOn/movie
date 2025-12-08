'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SyncLog {
  id: number;
  status: string;
  itemsFound: number;
  itemsImported: number;
  errorMessage: string | null;
  syncedAt: string;
}

export default function FeedLogs({ params }: { params: { id: string } }) {
  const feedId = parseInt(params.id);
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`/api/admin/feeds/${feedId}/logs`);
      const data = await response.json();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 px-4 md:px-12 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold">Sync Logs</h1>
          <Link
            href="/admin/feeds"
            className="bg-netflix-light-gray hover:bg-gray-600 text-white px-6 py-2 rounded transition"
          >
            Back
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-netflix-gray rounded skeleton"></div>
            ))}
          </div>
        ) : logs.length > 0 ? (
          <div className="bg-netflix-gray rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-netflix-light-gray">
                  <tr>
                    <th className="text-left p-4">Date</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-left p-4">Found</th>
                    <th className="text-left p-4">Imported</th>
                    <th className="text-left p-4">Error</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-t border-netflix-light-gray">
                      <td className="p-4 text-sm">
                        {new Date(log.syncedAt).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded text-sm ${
                          log.status === 'success' ? 'bg-green-600' : 'bg-red-600'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="p-4">{log.itemsFound}</td>
                      <td className="p-4">{log.itemsImported}</td>
                      <td className="p-4 text-sm text-gray-400">
                        {log.errorMessage ? (
                          <span className="text-red-400">{log.errorMessage}</span>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-netflix-gray rounded-lg">
            <p className="text-xl text-gray-400">No sync logs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
