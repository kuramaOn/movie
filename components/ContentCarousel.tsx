'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Content } from '@/types/content';

interface ContentCarouselProps {
  title: string;
  items: Content[];
  onItemClick?: (item: Content) => void;
}

export default function ContentCarousel({ title, items, onItemClick }: ContentCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = useState<HTMLDivElement | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`carousel-${title}`);
    if (container) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="mb-8 group">
      <h2 className="text-2xl font-bold mb-4 px-4 md:px-12">{title}</h2>
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:from-black/90"
          aria-label="Scroll left"
        >
          <ChevronLeftIcon className="w-8 h-8" />
        </button>

        {/* Content Container */}
        <div
          id={`carousel-${title}`}
          className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 md:px-12 scroll-smooth"
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="min-w-[280px] md:min-w-[350px] group/item cursor-pointer"
              onClick={() => onItemClick && onItemClick(item)}
            >
              <Link href={`/watch/${item.id}`} className="block">
                <div className="relative aspect-video rounded-lg overflow-hidden transition-transform group-hover/item:scale-105 shadow-lg hover:shadow-netflix-red/20">
                  <Image
                    src={item.thumbnailUrl || '/placeholder-thumbnail.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 280px, 350px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity">
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
              </Link>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:from-black/90"
          aria-label="Scroll right"
        >
          <ChevronRightIcon className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
