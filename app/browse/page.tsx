'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Content {
  id: number;
  title: string;
  description: string;
  type: string;
  videoUrl: string;
  thumbnailUrl: string;
  year: number;
  duration: number;
  rating: number;
  genres: Array<{
    genre: {
      id: number;
      name: string;
    };
  }>;
}

export default function BrowsePage() {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchContent();
  }, [filter]);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? `?type=${filter}` : '';
      const response = await fetch(`/api/content${params}`);
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 px-4 md:px-12 min-h-screen">
      <div className="animate-fade-in-down mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Browse</h1>
        
        {/* Filter Tabs */}
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded transition ${
              filter === 'all' ? 'bg-netflix-red text-white' : 'bg-netflix-gray text-gray-400 hover:bg-netflix-light-gray'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('movie')}
            className={`px-4 py-2 rounded transition ${
              filter === 'movie' ? 'bg-netflix-red text-white' : 'bg-netflix-gray text-gray-400 hover:bg-netflix-light-gray'
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => setFilter('documentary')}
            className={`px-4 py-2 rounded transition ${
              filter === 'documentary' ? 'bg-netflix-red text-white' : 'bg-netflix-gray text-gray-400 hover:bg-netflix-light-gray'
            }`}
          >
            Documentaries
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-64 bg-netflix-gray rounded skeleton animate-pulse"></div>
          ))}
        </div>
      ) : content.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {content.map((item) => (
            <Link
              key={item.id}
              href={`/watch/${item.id}`}
              className="group relative overflow-hidden rounded-lg transition-transform hover:scale-105"
            >
              <div className="aspect-[2/3] relative">
                <Image
                  src={item.thumbnailUrl || '/placeholder-thumbnail.jpg'}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
                    {item.year && (
                      <p className="text-xs text-gray-300 mt-1">{item.year}</p>
                    )}
                    {item.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.genres.slice(0, 2).map((g) => (
                          <span
                            key={g.genre.id}
                            className="text-xs bg-netflix-red/80 px-2 py-1 rounded"
                          >
                            {g.genre.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400">No content available</p>
          <p className="text-gray-500 mt-2">Content will be added soon</p>
        </div>
      )}
    </div>
  );
}
