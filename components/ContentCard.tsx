'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlayIcon, StarIcon } from '@heroicons/react/24/solid';
import { formatDuration } from '@/lib/utils';

interface ContentCardProps {
  id: number;
  title: string;
  thumbnailUrl: string;
  type: string;
  duration?: number;
  rating?: number;
  year?: number;
}

export default function ContentCard({
  id,
  title,
  thumbnailUrl,
  type,
  duration,
  rating,
  year,
}: ContentCardProps) {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render simple version during SSR
  if (!mounted) {
    return (
      <Link href={`/watch/${id}`}>
        <div className="content-card relative group cursor-pointer">
          <div className="relative aspect-video bg-netflix-light-gray rounded-lg overflow-hidden">
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-netflix-light-gray">
                <PlayIcon className="h-16 w-16 text-gray-600" />
              </div>
            )}
            <div className="absolute top-2 right-2 bg-netflix-red px-2 py-1 rounded text-xs font-semibold shadow-lg">
              {type.toUpperCase()}
            </div>
          </div>
          <div className="mt-2 space-y-1">
            <h3 className="font-semibold text-sm md:text-base line-clamp-2">
              {title}
            </h3>
            <div className="flex items-center space-x-3 text-xs text-gray-400">
              {year && <span>{year}</span>}
              {duration && <span>{formatDuration(duration)}</span>}
              {rating && (
                <div className="flex items-center space-x-1">
                  <StarIcon className="h-4 w-4 text-yellow-500" />
                  <span>{rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/watch/${id}`}>
      <div 
        className="content-card relative group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-video bg-netflix-light-gray rounded-lg overflow-hidden transition-all duration-500 transform group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-netflix-red/20">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-netflix-light-gray">
              <PlayIcon className="h-16 w-16 text-gray-600" />
            </div>
          )}
          
          {/* Hover overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-netflix-red/90 rounded-full p-4 transform transition-all duration-300 group-hover:scale-110">
                <PlayIcon className="h-12 w-12 text-white" />
              </div>
            </div>
            
            {/* Bottom info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
              <h3 className="text-white font-semibold text-sm line-clamp-2 animate-fade-in-up">
                {title}
              </h3>
              <div className="flex items-center space-x-2 text-xs text-gray-300 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                {rating && (
                  <span className="flex items-center space-x-1 px-2 py-0.5 bg-netflix-red rounded">
                    <StarIcon className="h-3 w-3 text-yellow-500" />
                    <span>{rating}</span>
                  </span>
                )}
                {year && <span>{year}</span>}
                {duration && <span>{formatDuration(duration)}</span>}
              </div>
            </div>
          </div>
          
          {/* Type badge */}
          <div className="absolute top-2 right-2 bg-netflix-red px-2 py-1 rounded text-xs font-semibold shadow-lg">
            {type.toUpperCase()}
          </div>

          {/* Shimmer Effect on Hover */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-slide-in-right" />
          )}
        </div>
        
        <div className="mt-2 space-y-1">
          <h3 className="font-semibold text-sm md:text-base line-clamp-2 group-hover:text-netflix-red transition-colors duration-300">
            {title}
          </h3>
          
          <div className="flex items-center space-x-3 text-xs text-gray-400">
            {year && <span>{year}</span>}
            {duration && <span>{formatDuration(duration)}</span>}
            {rating && (
              <div className="flex items-center space-x-1">
                <StarIcon className="h-4 w-4 text-yellow-500" />
                <span>{rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
