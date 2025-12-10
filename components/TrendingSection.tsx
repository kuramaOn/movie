'use client';

import { useEffect, useState } from 'react';
import ContentCarousel from './ContentCarousel';
import { Content } from '@/types/content';

interface TrendingSectionProps {
  onItemClick?: (item: Content) => void;
}

export default function TrendingSection({ onItemClick }: TrendingSectionProps) {
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('week');
  const [trendingContent, setTrendingContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingContent();
  }, [timeFilter]);

  const fetchTrendingContent = async () => {
    try {
      const response = await fetch(`/api/trending?period=${timeFilter}`);
      const data = await response.json();
      setTrendingContent(data);
    } catch (error) {
      console.error('Error fetching trending content:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4 px-4 md:px-12">
        <h2 className="text-2xl font-bold">Trending Now</h2>
        <div className="flex space-x-2">
          {(['today', 'week', 'month'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimeFilter(period)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeFilter === period
                  ? 'bg-netflix-red text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {period === 'today' ? 'Today' : period === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>
      
      {loading ? (
        <div className="px-4 md:px-12">
          <div className="flex space-x-4 overflow-x-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="min-w-[200px] md:min-w-[250px] h-[375px] bg-gray-700 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      ) : (
        <ContentCarousel title="" items={trendingContent} onItemClick={onItemClick} />
      )}
    </div>
  );
}
