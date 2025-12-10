'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PlayIcon, StarIcon, PlusIcon, InformationCircleIcon, ClockIcon, EyeIcon } from '@heroicons/react/24/solid';
import { formatDuration } from '@/lib/utils';

interface ContentCardEnhancedProps {
  id: number;
  title: string;
  thumbnailUrl: string;
  type: string;
  duration?: number;
  rating?: number;
  year?: number;
  viewCount?: number;
  description?: string;
  genres?: Array<{ genre: { name: string } }>;
  variant?: 'default' | 'poster' | 'wide' | 'minimal' | 'glassmorphic';
}

export default function ContentCardEnhanced({
  id,
  title,
  thumbnailUrl,
  type,
  duration,
  rating,
  year,
  viewCount,
  description,
  genres,
  variant = 'default',
}: ContentCardEnhancedProps) {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="aspect-video bg-gray-800 rounded-lg animate-pulse" />;
  }

  // Default Netflix-style card
  if (variant === 'default') {
    return (
      <div
        className="group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-video rounded-lg overflow-hidden transition-all duration-500 transform group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-netflix-red/30 group-hover:z-10">
          <Image
            src={thumbnailUrl || '/placeholder-thumbnail.jpg'}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Type badge */}
          <div className="absolute top-3 right-3 bg-netflix-red px-2.5 py-1 rounded-md text-xs font-bold shadow-lg">
            {type.toUpperCase()}
          </div>

          {/* Progress bar (if watched) */}
          {/* <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
            <div className="h-full bg-netflix-red" style={{ width: '35%' }} />
          </div> */}

          {/* Hover overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Center play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Link href={`/watch/${id}`}>
                <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-netflix-red group-hover:text-white">
                  <PlayIcon className="h-10 w-10 text-black group-hover:text-white transition-colors" />
                </div>
              </Link>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
              <h3 className="text-white font-bold text-base line-clamp-2 drop-shadow-lg">
                {title}
              </h3>

              {/* Stats row */}
              <div className="flex items-center justify-between text-xs text-white/90">
                <div className="flex items-center space-x-3">
                  {rating && (
                    <span className="flex items-center space-x-1 bg-yellow-500 text-black px-2 py-0.5 rounded font-bold">
                      <StarIcon className="h-3 w-3" />
                      <span>{rating.toFixed(1)}</span>
                    </span>
                  )}
                  {year && <span className="font-medium">{year}</span>}
                  {duration && (
                    <span className="flex items-center space-x-1">
                      <ClockIcon className="h-3 w-3" />
                      <span>{formatDuration(duration)}</span>
                    </span>
                  )}
                </div>

                {viewCount && viewCount > 0 && (
                  <span className="flex items-center space-x-1">
                    <EyeIcon className="h-3 w-3" />
                    <span>{viewCount.toLocaleString()}</span>
                  </span>
                )}
              </div>

              {/* Genre tags */}
              {genres && genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {genres.slice(0, 3).map((g, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded text-xs font-medium"
                    >
                      {g.genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                <Link
                  href={`/watch/${id}`}
                  className="flex-1 bg-white text-black font-semibold px-3 py-2 rounded flex items-center justify-center space-x-2 hover:bg-gray-200 transition text-sm"
                >
                  <PlayIcon className="h-4 w-4" />
                  <span>Play</span>
                </Link>
                <button className="bg-white/20 backdrop-blur-sm p-2 rounded hover:bg-white/30 transition">
                  <PlusIcon className="h-5 w-5" />
                </button>
                <button className="bg-white/20 backdrop-blur-sm p-2 rounded hover:bg-white/30 transition">
                  <InformationCircleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Shimmer effect on hover */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          )}
        </div>
      </div>
    );
  }

  // Poster style (2:3 aspect ratio like movie posters)
  if (variant === 'poster') {
    return (
      <Link href={`/watch/${id}`}>
        <div
          className="group cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden transition-all duration-500 transform group-hover:scale-105 group-hover:shadow-2xl">
            <Image
              src={thumbnailUrl || '/placeholder-thumbnail.jpg'}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />

            {/* Rating badge */}
            {rating && (
              <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded flex items-center space-x-1">
                <StarIcon className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-bold">{rating.toFixed(1)}</span>
              </div>
            )}

            {/* Hover gradient overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-60'
              }`}
            >
              {isHovered && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-netflix-red rounded-full p-4 transform scale-100 group-hover:scale-110 transition-transform">
                    <PlayIcon className="h-12 w-12" />
                  </div>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">{title}</h3>
                <div className="flex items-center space-x-2 text-xs text-gray-300">
                  {year && <span>{year}</span>}
                  {duration && <span>{formatDuration(duration)}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Wide card for list view
  if (variant === 'wide') {
    return (
      <Link href={`/watch/${id}`}>
        <div className="group flex space-x-4 bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 hover:bg-gray-800 transition-all duration-300 border border-transparent hover:border-netflix-red/50">
          {/* Thumbnail */}
          <div className="w-48 h-28 relative flex-shrink-0 rounded-lg overflow-hidden">
            <Image
              src={thumbnailUrl || '/placeholder-thumbnail.jpg'}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
              <PlayIcon className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-netflix-red transition-colors">
                {title}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                {rating && (
                  <span className="flex items-center space-x-1 text-yellow-500">
                    <StarIcon className="h-4 w-4" />
                    <span className="font-bold text-white">{rating.toFixed(1)}</span>
                  </span>
                )}
                {year && <span>{year}</span>}
                {duration && <span>{formatDuration(duration)}</span>}
                {viewCount && viewCount > 0 && (
                  <span className="flex items-center space-x-1">
                    <EyeIcon className="h-4 w-4" />
                    <span>{viewCount.toLocaleString()} views</span>
                  </span>
                )}
              </div>

              {genres && genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {genres.map((g, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-700 rounded text-xs font-medium hover:bg-netflix-red transition-colors"
                    >
                      {g.genre.name}
                    </span>
                  ))}
                </div>
              )}

              {description && (
                <p className="text-gray-400 text-sm line-clamp-2">{description}</p>
              )}
            </div>
          </div>

          {/* Play button */}
          <div className="flex items-center">
            <div className="bg-netflix-red hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition-all transform group-hover:scale-105 flex items-center space-x-2">
              <PlayIcon className="h-5 w-5" />
              <span>Watch</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Minimal card
  if (variant === 'minimal') {
    return (
      <Link href={`/watch/${id}`}>
        <div className="group cursor-pointer">
          <div className="relative aspect-video rounded overflow-hidden">
            <Image
              src={thumbnailUrl || '/placeholder-thumbnail.jpg'}
              alt={title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
              <PlayIcon className="h-16 w-16 text-white opacity-0 group-hover:opacity-100 transition-opacity transform scale-50 group-hover:scale-100 duration-300" />
            </div>
          </div>
          <h3 className="mt-3 font-semibold text-sm group-hover:text-netflix-red transition-colors">
            {title}
          </h3>
        </div>
      </Link>
    );
  }

  // Glassmorphic card
  if (variant === 'glassmorphic') {
    return (
      <div
        className="group cursor-pointer relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-video rounded-2xl overflow-hidden">
          <Image
            src={thumbnailUrl || '/placeholder-thumbnail.jpg'}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Glassmorphic overlay */}
          <div
            className={`absolute inset-0 transition-all duration-500 ${
              isHovered
                ? 'bg-gradient-to-t from-black/90 via-black/50 to-transparent backdrop-blur-sm'
                : 'bg-gradient-to-t from-black/60 to-transparent'
            }`}
          >
            {isHovered && (
              <>
                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 p-6">
                  <Link href={`/watch/${id}`}>
                    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-5 transform transition-all duration-300 hover:scale-110 hover:bg-netflix-red/80">
                      <PlayIcon className="h-10 w-10 text-white drop-shadow-lg" />
                    </div>
                  </Link>

                  <div className="text-center space-y-2">
                    <h3 className="text-white font-bold text-lg drop-shadow-lg line-clamp-2">
                      {title}
                    </h3>
                    {rating && (
                      <div className="flex items-center justify-center space-x-1 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/10 backdrop-blur-md border-t border-white/20">
                  <div className="flex items-center justify-between text-xs text-white/90">
                    <div className="flex items-center space-x-3">
                      {year && <span>{year}</span>}
                      {duration && <span>{formatDuration(duration)}</span>}
                    </div>
                    {genres && genres.length > 0 && (
                      <span className="px-2 py-1 bg-white/20 rounded text-xs">
                        {genres[0].genre.name}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}

            {!isHovered && (
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-semibold text-sm line-clamp-1 drop-shadow-lg">
                  {title}
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
