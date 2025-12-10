'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  PlayIcon, 
  ArrowPathIcon, 
  BookmarkIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/solid';
import { Content } from '@/types/content';

interface VideoEndScreenProps {
  show: boolean;
  onReplay: () => void;
  onClose: () => void;
  nextVideo?: Content;
  relatedVideos: Content[];
  onSaveToWatchlist?: () => void;
  autoPlayNext?: boolean;
  countdownSeconds?: number;
}

export default function VideoEndScreen({
  show,
  onReplay,
  onClose,
  nextVideo,
  relatedVideos,
  onSaveToWatchlist,
  autoPlayNext = true,
  countdownSeconds = 10,
}: VideoEndScreenProps) {
  const [countdown, setCountdown] = useState(countdownSeconds);
  const [isCountdownActive, setIsCountdownActive] = useState(autoPlayNext);

  useEffect(() => {
    if (show && isCountdownActive && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (show && isCountdownActive && countdown === 0 && nextVideo) {
      // Auto-navigate to next video
      window.location.href = `/watch/${nextVideo.id}`;
    }
  }, [show, countdown, isCountdownActive, nextVideo]);

  useEffect(() => {
    if (show) {
      setCountdown(countdownSeconds);
      setIsCountdownActive(autoPlayNext);
    }
  }, [show, countdownSeconds, autoPlayNext]);

  if (!show) return null;

  const displayedRelatedVideos = relatedVideos.slice(0, 4);

  return (
    <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-sm animate-fade-in">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 bg-gray-800/80 hover:bg-gray-700 rounded-full transition-all duration-300"
        aria-label="Close"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>

      <div className="h-full flex flex-col items-center justify-center p-4 md:p-8">
        {/* Main Content - Next Video Card */}
        {nextVideo && (
          <div className="w-full max-w-4xl mb-8 animate-fade-in-up">
            <div className="text-center mb-4">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {isCountdownActive ? `Next video in ${countdown}s` : 'Up Next'}
              </h2>
              <p className="text-gray-400">Continue watching with</p>
            </div>

            {/* Large Next Video Card */}
            <div className="relative group">
              <Link href={`/watch/${nextVideo.id}`}>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 border-2 border-netflix-red shadow-2xl hover:scale-105 transition-transform duration-300">
                  <Image
                    src={nextVideo.thumbnailUrl || '/placeholder-thumbnail.jpg'}
                    alt={nextVideo.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">{nextVideo.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-300 mb-4">
                        {nextVideo.year && <span>{nextVideo.year}</span>}
                        {nextVideo.duration && <span>{nextVideo.duration} min</span>}
                        {nextVideo.rating && (
                          <span className="flex items-center">
                            ⭐ {nextVideo.rating}
                          </span>
                        )}
                      </div>
                      {nextVideo.description && (
                        <p className="text-gray-300 line-clamp-2 max-w-3xl">
                          {nextVideo.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Play Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-netflix-red/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <PlayIcon className="w-10 h-10 text-white ml-1" />
                    </div>
                  </div>

                  {/* Countdown Circle */}
                  {isCountdownActive && (
                    <div className="absolute top-4 right-4">
                      <div className="relative w-16 h-16">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-gray-700"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-netflix-red"
                            strokeDasharray={`${2 * Math.PI * 28}`}
                            strokeDashoffset={`${2 * Math.PI * 28 * (1 - countdown / countdownSeconds)}`}
                            style={{ transition: 'stroke-dashoffset 1s linear' }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold">{countdown}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Link>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-4 mt-6">
                {isCountdownActive && (
                  <button
                    onClick={() => setIsCountdownActive(false)}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2"
                  >
                    <XMarkIcon className="w-5 h-5" />
                    <span>Cancel</span>
                  </button>
                )}
                
                <Link
                  href={`/watch/${nextVideo.id}`}
                  className="px-8 py-3 bg-netflix-red hover:bg-red-700 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 hover:scale-105"
                >
                  <PlayIcon className="w-5 h-5" />
                  <span>Play Now</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <button
            onClick={onReplay}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 hover:scale-105"
          >
            <ArrowPathIcon className="w-5 h-5" />
            <span>Replay</span>
          </button>

          {onSaveToWatchlist && (
            <button
              onClick={onSaveToWatchlist}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 hover:scale-105"
            >
              <BookmarkIcon className="w-5 h-5" />
              <span>Save to Watchlist</span>
            </button>
          )}

          <Link
            href="/browse"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 hover:scale-105"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
            <span>Browse More</span>
          </Link>
        </div>

        {/* Related Videos Grid */}
        {displayedRelatedVideos.length > 0 && (
          <div className="w-full max-w-6xl animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-center">More Like This</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {displayedRelatedVideos.map((video, index) => (
                <Link
                  key={video.id}
                  href={`/watch/${video.id}`}
                  className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:z-10 animate-fade-in"
                  style={{ animationDelay: `${300 + index * 100}ms` }}
                >
                  <div className="aspect-[2/3] relative">
                    <Image
                      src={video.thumbnailUrl || '/placeholder-thumbnail.jpg'}
                      alt={video.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <PlayIcon className="w-6 h-6 text-white ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h4 className="font-semibold text-sm line-clamp-2 mb-1">{video.title}</h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-300">
                          {video.year && <span>{video.year}</span>}
                          {video.rating && (
                            <span>⭐ {video.rating}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
