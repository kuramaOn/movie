'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Content {
  id: number;
  title: string;
  description: string;
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

interface RelatedVideosProps {
  currentContentId: number;
  genres?: Array<{ genre: { id: number; name: string } }>;
}

export default function RelatedVideos({ currentContentId, genres }: RelatedVideosProps) {
  const [relatedContent, setRelatedContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedContent();
  }, [currentContentId]);

  const fetchRelatedContent = async () => {
    try {
      // Fetch content with similar genres or from same category
      const response = await fetch(`/api/content/${currentContentId}/suggestions`);
      const data = await response.json();
      setRelatedContent(data.slice(0, 8)); // Limit to 8 items
    } catch (error) {
      console.error('Error fetching related content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Related Videos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[2/3] bg-gray-700 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedContent.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Related Videos</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {relatedContent.map((item) => (
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
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-semibold text-sm line-clamp-2">{item.title}</h3>
                  <div className="flex items-center space-x-2 text-xs text-gray-300 mt-1">
                    {item.year && <span>{item.year}</span>}
                    {item.duration && <span>{item.duration} min</span>}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
