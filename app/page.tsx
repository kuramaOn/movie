'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ContentCarousel from '@/components/ContentCarousel';
import TrendingSection from '@/components/TrendingSection';
import QuickViewModal from '@/components/QuickViewModal';
import RelatedVideos from '@/components/RelatedVideos';

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
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);

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

      {/* Trending Section */}
      <TrendingSection onItemClick={(item) => {
        setSelectedContent(item);
        setShowQuickView(true);
      }} />

      {/* Latest Content Section */}
      {latest.length > 0 && (
        <ContentCarousel 
          title="Latest Releases" 
          items={latest}
          onItemClick={(item) => {
            setSelectedContent(item);
            setShowQuickView(true);
          }}
        />
      )}

      {/* Genre-based Carousels will be added here dynamically */}
      
      {/* Empty State */}
      {!loading && latest.length === 0 && (
        <div className="text-center py-20 px-4 md:px-12">
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

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
        content={selectedContent}
      />
    </div>
  );
}
