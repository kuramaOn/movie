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

export default function HomePage() {
  const [featured, setFeatured] = useState<Content | null>(null);
  const [latest, setLatest] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const [featuredRes, latestRes] = await Promise.all([
        fetch('/api/featured'),
        fetch('/api/latest'),
      ]);
      
      const featuredData = await featuredRes.json();
      const latestData = await latestRes.json();
      
      setFeatured(featuredData);
      setLatest(latestData);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      {featured && (
        <div className="relative h-[80vh] mb-8">
          <Image
            src={featured.thumbnailUrl || '/placeholder-thumbnail.jpg'}
            alt={featured.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-netflix-black/60 to-transparent">
            <div className="absolute bottom-0 left-0 right-0 px-4 md:px-12 pb-20">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-up">
                {featured.title}
              </h1>
              {featured.description && (
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl mb-6 line-clamp-3 animate-fade-in-up">
                  {featured.description}
                </p>
              )}
              <div className="flex space-x-4 animate-fade-in-up">
                <Link
                  href={`/watch/${featured.id}`}
                  className="bg-white text-black font-semibold px-8 py-3 rounded hover:bg-gray-200 transition"
                >
                  ▶ Play
                </Link>
                <Link
                  href={`/watch/${featured.id}`}
                  className="bg-gray-500/70 text-white font-semibold px-8 py-3 rounded hover:bg-gray-500 transition"
                >
                  ⓘ More Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Latest Content Section */}
      <div className="px-4 md:px-12 pb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Latest Content</h2>
        
        {loading ? (
          <div className="flex space-x-4 overflow-x-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="min-w-[200px] h-[300px] bg-netflix-gray rounded skeleton animate-pulse"></div>
            ))}
          </div>
        ) : latest.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {latest.map((item) => (
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
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Network Chanel</h1>
            <p className="text-gray-400 text-lg md:text-xl">
              Your streaming platform
            </p>
            <Link
              href="/browse"
              className="inline-block mt-6 bg-netflix-red hover:bg-red-700 text-white font-semibold px-8 py-3 rounded transition"
            >
              Browse Content
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
