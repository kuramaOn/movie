'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Squares2X2Icon, 
  ListBulletIcon, 
  ViewColumnsIcon,
  FilmIcon,
  FireIcon,
  ClockIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { Content } from '@/types/content';
import ContentCardEnhanced from './ContentCardEnhanced';

interface BrowseLayoutProps {
  content: Content[];
  layout: 'masonry' | 'featured-grid' | 'category-rows' | 'split-view' | 'standard-grid';
}

export default function BrowsePageLayouts({ content, layout }: BrowseLayoutProps) {
  
  // Masonry Grid Layout (Pinterest-style)
  if (layout === 'masonry') {
    return (
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
        {content.map((item) => (
          <div key={item.id} className="break-inside-avoid mb-4">
            <ContentCardEnhanced
              id={item.id}
              title={item.title}
              thumbnailUrl={item.thumbnailUrl || ''}
              type={item.type}
              duration={item.duration}
              rating={item.rating}
              year={item.year}
              viewCount={item.viewCount}
              description={item.description}
              genres={item.genres}
              variant="poster"
            />
          </div>
        ))}
      </div>
    );
  }

  // Featured Grid (First item larger)
  if (layout === 'featured-grid') {
    const [featured, ...rest] = content;

    return (
      <div className="space-y-6">
        {/* Featured Item - Large */}
        {featured && (
          <div className="relative h-[60vh] rounded-xl overflow-hidden group">
            <Image
              src={featured.thumbnailUrl || '/placeholder-thumbnail.jpg'}
              alt={featured.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="bg-netflix-red px-3 py-1 rounded-full text-xs font-bold">
                    FEATURED
                  </span>
                  {featured.rating && (
                    <span className="flex items-center space-x-1 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold">
                      <StarIcon className="h-4 w-4" />
                      <span>{featured.rating.toFixed(1)}</span>
                    </span>
                  )}
                </div>
                <h2 className="text-4xl md:text-6xl font-bold line-clamp-2">
                  {featured.title}
                </h2>
                {featured.description && (
                  <p className="text-lg text-gray-300 max-w-3xl line-clamp-3">
                    {featured.description}
                  </p>
                )}
                <div className="flex items-center space-x-4">
                  <Link
                    href={`/watch/${featured.id}`}
                    className="bg-white text-black font-bold px-8 py-3 rounded-lg hover:bg-gray-200 transition flex items-center space-x-2"
                  >
                    <span>▶</span>
                    <span>Watch Now</span>
                  </Link>
                  <button className="bg-gray-500/70 backdrop-blur text-white font-bold px-8 py-3 rounded-lg hover:bg-gray-500 transition">
                    More Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rest of content - Standard grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {rest.map((item) => (
            <ContentCardEnhanced
              key={item.id}
              id={item.id}
              title={item.title}
              thumbnailUrl={item.thumbnailUrl || ''}
              type={item.type}
              duration={item.duration}
              rating={item.rating}
              year={item.year}
              viewCount={item.viewCount}
              variant="default"
            />
          ))}
        </div>
      </div>
    );
  }

  // Category Rows (Netflix-style horizontal scrolling)
  if (layout === 'category-rows') {
    // Group content by type or genre (simplified version)
    const groupedContent: { [key: string]: Content[] } = {};
    
    content.forEach((item) => {
      const category = item.type || 'Other';
      if (!groupedContent[category]) {
        groupedContent[category] = [];
      }
      groupedContent[category].push(item);
    });

    return (
      <div className="space-y-8">
        {Object.entries(groupedContent).map(([category, items]) => (
          <div key={category}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{category}</h2>
              <Link href={`/browse?type=${category}`} className="text-netflix-red hover:underline">
                View All →
              </Link>
            </div>
            
            {/* Horizontal scroll container */}
            <div className="relative group/row">
              <div className="flex space-x-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex-none w-64 snap-start">
                    <ContentCardEnhanced
                      id={item.id}
                      title={item.title}
                      thumbnailUrl={item.thumbnailUrl || ''}
                      type={item.type}
                      duration={item.duration}
                      rating={item.rating}
                      year={item.year}
                      variant="default"
                    />
                  </div>
                ))}
              </div>
              
              {/* Scroll buttons */}
              <button className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur p-3 rounded-r-lg opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-netflix-red">
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur p-3 rounded-l-lg opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-netflix-red">
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Split View (Trending + Browse)
  if (layout === 'split-view') {
    const trending = content.slice(0, 10);
    const browse = content.slice(10);

    return (
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Trending sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center space-x-2 mb-6">
            <FireIcon className="h-8 w-8 text-netflix-red" />
            <h2 className="text-3xl font-bold">Trending Now</h2>
          </div>

          {/* Top 10 list */}
          <div className="space-y-4">
            {trending.map((item, index) => (
              <Link
                key={item.id}
                href={`/watch/${item.id}`}
                className="flex space-x-4 bg-gray-800/50 backdrop-blur rounded-lg p-4 hover:bg-gray-800 transition-all group"
              >
                {/* Rank number */}
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-netflix-red rounded-lg font-bold text-2xl group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>

                {/* Thumbnail */}
                <div className="w-20 h-20 relative flex-shrink-0 rounded overflow-hidden">
                  <Image
                    src={item.thumbnailUrl || '/placeholder-thumbnail.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold line-clamp-2 group-hover:text-netflix-red transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                    {item.rating && (
                      <span className="flex items-center space-x-1">
                        <StarIcon className="h-3 w-3 text-yellow-500" />
                        <span>{item.rating.toFixed(1)}</span>
                      </span>
                    )}
                    {item.viewCount && (
                      <span>{(item.viewCount / 1000).toFixed(1)}K views</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Browse grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">All Content</h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-gray-800 rounded hover:bg-gray-700 transition">
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button className="p-2 bg-gray-800 rounded hover:bg-gray-700 transition">
                <ListBulletIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {browse.map((item) => (
              <ContentCardEnhanced
                key={item.id}
                id={item.id}
                title={item.title}
                thumbnailUrl={item.thumbnailUrl || ''}
                type={item.type}
                duration={item.duration}
                rating={item.rating}
                year={item.year}
                variant="default"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Standard Grid (Enhanced version) - 16:9 Landscape Cards
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {content.map((item) => (
        <ContentCardEnhanced
          key={item.id}
          id={item.id}
          title={item.title}
          thumbnailUrl={item.thumbnailUrl || ''}
          type={item.type}
          duration={item.duration}
          rating={item.rating}
          year={item.year}
          viewCount={item.viewCount}
          description={item.description}
          genres={item.genres}
          variant="glassmorphic"
        />
      ))}
    </div>
  );
}

// Layout Selector Component
export function LayoutSelector({ 
  currentLayout, 
  onLayoutChange 
}: { 
  currentLayout: string; 
  onLayoutChange: (layout: string) => void;
}) {
  const layouts = [
    { id: 'standard-grid', name: 'Grid', icon: Squares2X2Icon },
    { id: 'masonry', name: 'Masonry', icon: ViewColumnsIcon },
    { id: 'featured-grid', name: 'Featured', icon: StarIcon },
    { id: 'category-rows', name: 'Rows', icon: ListBulletIcon },
    { id: 'split-view', name: 'Split', icon: FilmIcon },
  ];

  return (
    <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
      {layouts.map((layout) => (
        <button
          key={layout.id}
          onClick={() => onLayoutChange(layout.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
            currentLayout === layout.id
              ? 'bg-netflix-red text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          <layout.icon className="h-5 w-5" />
          <span className="text-sm font-medium hidden md:inline">{layout.name}</span>
        </button>
      ))}
    </div>
  );
}
