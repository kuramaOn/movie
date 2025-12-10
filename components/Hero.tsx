'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlayIcon, InformationCircleIcon } from '@heroicons/react/24/solid';

interface HeroProps {
  content: {
    id: number;
    title: string;
    description: string | null;
    thumbnailUrl: string | null;
    rating: any;
    year: number | null;
  };
}

export default function Hero({ content }: HeroProps) {
  const [loaded, setLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeout(() => setLoaded(true), 100);
  }, []);

  if (!mounted) {
    return (
      <div className="relative h-[80vh] w-full opacity-0">
        <div className="absolute inset-0 bg-netflix-black" />
      </div>
    );
  }

  return (
    <div className={`relative w-full transition-all duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* 16:9 Landscape Banner Container */}
      <div className="relative w-full aspect-video max-h-[85vh]">
        {/* Background image */}
        <div className="absolute inset-0">
          {content.thumbnailUrl ? (
            <Image
              src={content.thumbnailUrl}
              alt={content.title}
              fill
              className="object-cover animate-scale-in"
              priority
            />
          ) : (
            <div className="w-full h-full bg-netflix-light-gray" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center px-4 md:px-12">
          <div className="max-w-2xl space-y-4 md:space-y-6 animate-fade-in-up">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">{content.title}</h1>
            
            <div className="flex items-center space-x-4 text-sm md:text-base">
              {content.rating && (
                <span className="flex items-center space-x-1 px-3 py-1 bg-netflix-red rounded text-sm font-semibold">
                  <span className="text-yellow-500">★</span>
                  <span>{typeof content.rating === 'object' ? content.rating.toNumber() : content.rating}</span>
                </span>
              )}
              {content.year && <span className="text-gray-300">{content.year}</span>}
            </div>

            {content.description && (
              <p className="text-sm md:text-base text-gray-300 line-clamp-2 md:line-clamp-3 leading-relaxed">
                {content.description}
              </p>
            )}

            <div className="flex space-x-4 pt-2">
              <Link
                href={`/watch/${content.id}`}
                className="group flex items-center space-x-2 bg-white text-black font-semibold px-6 py-2.5 md:px-8 md:py-3 rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <PlayIcon className="h-5 w-5 md:h-6 md:w-6 group-hover:animate-pulse" />
                <span>Play Now</span>
              </Link>
              <Link
                href={`/watch/${content.id}`}
                className="flex items-center space-x-2 bg-gray-800/80 backdrop-blur-sm text-white font-semibold px-6 py-2.5 md:px-8 md:py-3 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 border border-gray-700 hover:border-gray-600"
              >
                <InformationCircleIcon className="h-5 w-5 md:h-6 md:w-6" />
                <span>More Info</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/70 rounded-full animate-float" />
          </div>
        </div>
      </div>
    </div>
  );
}
