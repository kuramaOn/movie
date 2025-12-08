'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import ContentCard from './ContentCard';

interface Content {
  id: number;
  title: string;
  thumbnailUrl: string | null;
  type: string;
  duration: number | null;
  rating: any;
  year: number | null;
}

interface ContentRowProps {
  title: string;
  contents: Content[];
}

export default function ContentRow({ title, contents }: ContentRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = scrollContainerRef.current?.parentElement;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (contents.length === 0) return null;

  // Show without animation on server/initial render
  if (!mounted) {
    return (
      <div className="space-y-4 mb-12">
        <h2 className="text-xl md:text-2xl font-bold px-4 md:px-12">{title}</h2>
        <div className="relative group">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide space-x-4 px-4 md:px-12 pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {contents.slice(0, 6).map((content) => (
              <div key={content.id} className="flex-shrink-0 w-64 md:w-80">
                <ContentCard
                  id={content.id}
                  title={content.title}
                  thumbnailUrl={content.thumbnailUrl || '/placeholder-thumbnail.jpg'}
                  type={content.type}
                  duration={content.duration || undefined}
                  rating={content.rating ? (typeof content.rating === 'object' ? content.rating.toNumber() : Number(content.rating)) : undefined}
                  year={content.year || undefined}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 mb-12 transition-all duration-700 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}>
      <h2 className="text-xl md:text-2xl font-bold px-4 md:px-12 hover:text-netflix-red transition-colors duration-300">{title}</h2>
      
      <div className="relative group">
        {/* Left scroll button */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 backdrop-blur-sm hover:bg-netflix-red p-3 rounded-r opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
        >
          <ChevronLeftIcon className="h-8 w-8" />
        </button>

        {/* Content container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide space-x-4 px-4 md:px-12 pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {contents.map((content, index) => (
            <div 
              key={content.id} 
              className="flex-shrink-0 w-64 md:w-80 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ContentCard
                id={content.id}
                title={content.title}
                thumbnailUrl={content.thumbnailUrl || '/placeholder-thumbnail.jpg'}
                type={content.type}
                duration={content.duration || undefined}
                rating={content.rating ? (typeof content.rating === 'object' ? content.rating.toNumber() : Number(content.rating)) : undefined}
                year={content.year || undefined}
              />
            </div>
          ))}
        </div>

        {/* Right scroll button */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 backdrop-blur-sm hover:bg-netflix-red p-3 rounded-l opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
        >
          <ChevronRightIcon className="h-8 w-8" />
        </button>
      </div>
    </div>
  );
}
