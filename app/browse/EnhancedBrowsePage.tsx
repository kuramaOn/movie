'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ContentSkeleton from '@/components/ContentSkeleton';
import ViewToggle from '@/components/ViewToggle';
import QuickViewModal from '@/components/QuickViewModal';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Content } from '@/types/content';

interface Genre {
  id: number;
  name: string;
  slug: string;
}

export default function EnhancedBrowsePage() {
  const [content, setContent] = useState<Content[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'rating'>('latest');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showQuickView, setShowQuickView] = useState(false);
  
  // Infinite scroll
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useInfiniteScroll({
    onLoadMore: () => setPage((prev) => prev + 1),
    hasMore,
    loading,
  });

  useEffect(() => {
    fetchGenres();
    fetchContent(true);
  }, [searchQuery, selectedGenre, sortBy]);

  useEffect(() => {
    if (page > 1) {
      fetchContent(false);
    }
  }, [page]);

  const fetchGenres = async () => {
    try {
      const response = await fetch('/api/genres');
      const data = await response.json();
      setGenres(data);
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  };

  const fetchContent = async (reset: boolean) => {
    try {
      if (reset) {
        setLoading(true);
        setPage(1);
      }

      const params = new URLSearchParams({
        page: reset ? '1' : page.toString(),
        limit: '20',
        ...(searchQuery && { search: searchQuery }),
        ...(selectedGenre && { genre: selectedGenre }),
        ...(sortBy && { sort: sortBy }),
      });

      const response = await fetch(`/api/content?${params}`);
      const data = await response.json();

      if (reset) {
        setContent(data);
      } else {
        setContent((prev) => [...prev, ...data]);
      }

      setHasMore(data.length === 20);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickView = (item: Content) => {
    setSelectedContent(item);
    setShowQuickView(true);
  };

  const filteredContent = content;

  return (
    <div className="pt-24 pb-12 px-4 md:px-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6">Browse</h1>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
            />
          </div>

          {/* Genre Filter */}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red cursor-pointer"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.slug}>
                {genre.name}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red cursor-pointer"
          >
            <option value="latest">Latest</option>
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rated</option>
          </select>

          {/* View Toggle */}
          <ViewToggle view={view} onViewChange={setView} />
        </div>
      </div>

      {/* Content Grid/List */}
      {loading && page === 1 ? (
        <ContentSkeleton count={20} view={view} />
      ) : filteredContent.length > 0 ? (
        <>
          {view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredContent.map((item) => (
                <div
                  key={item.id}
                  className="group cursor-pointer"
                  onClick={() => handleQuickView(item)}
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden transition-transform group-hover:scale-105 shadow-lg hover:shadow-netflix-red/30">
                    <Image
                      src={item.thumbnailUrl || '/placeholder-thumbnail.jpg'}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                          {item.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-300">
                          {item.year && <span>{item.year}</span>}
                          {item.rating && (
                            <span className="flex items-center">
                              ⭐ {item.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContent.map((item) => (
                <div
                  key={item.id}
                  className="flex space-x-4 bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors cursor-pointer"
                  onClick={() => handleQuickView(item)}
                >
                  <div className="w-32 h-48 relative flex-shrink-0 rounded overflow-hidden">
                    <Image
                      src={item.thumbnailUrl || '/placeholder-thumbnail.jpg'}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <div className="flex items-center space-x-3 text-sm text-gray-300 mb-3">
                      {item.year && <span>{item.year}</span>}
                      {item.duration && <span>{item.duration} min</span>}
                      {item.rating && (
                        <span className="flex items-center">
                          ⭐ {item.rating.toFixed(1)}
                        </span>
                      )}
                      {item.viewCount && item.viewCount > 0 && (
                        <span>{item.viewCount.toLocaleString()} views</span>
                      )}
                    </div>
                    {item.genres && item.genres.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.genres.map((g) => (
                          <span
                            key={g.genre.id}
                            className="px-2 py-1 bg-gray-700 rounded text-xs"
                          >
                            {g.genre.name}
                          </span>
                        ))}
                      </div>
                    )}
                    {item.description && (
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <Link
                      href={`/watch/${item.id}`}
                      className="inline-block mt-3 px-4 py-2 bg-netflix-red hover:bg-red-700 rounded transition-colors text-sm font-semibold"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Watch Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Infinite Scroll Trigger */}
          {hasMore && (
            <div ref={loadMoreRef} className="py-8 text-center">
              {loading && <ContentSkeleton count={5} view={view} />}
            </div>
          )}

          {!hasMore && filteredContent.length > 0 && (
            <div className="text-center py-8 text-gray-400">
              No more content to load
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">No content found</h2>
          <p className="text-gray-400">
            Try adjusting your filters or search query
          </p>
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
