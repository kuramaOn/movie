'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  PlayIcon, 
  InformationCircleIcon, 
  PlusIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  StarIcon
} from '@heroicons/react/24/solid';
import { Content } from '@/types/content';

interface HeroSectionEnhancedProps {
  content: Content | Content[];
  variant?: 'classic' | 'slider' | 'split' | 'video-background' | 'minimal';
}

export default function HeroSectionEnhanced({ 
  content, 
  variant = 'classic' 
}: HeroSectionEnhancedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const items = Array.isArray(content) ? content : [content];
  const currentItem = items[currentIndex];

  // Auto-advance slider
  useEffect(() => {
    if (!isAutoPlaying || items.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, items.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setIsAutoPlaying(false);
  };

  // Classic Netflix-style hero
  if (variant === 'classic') {
    return (
      <div className="relative h-[90vh] mb-8">
        <Image
          src={currentItem.thumbnailUrl || '/placeholder-thumbnail.jpg'}
          alt={currentItem.title}
          fill
          className="object-cover"
          priority
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center px-4 md:px-12">
          <div className="max-w-2xl space-y-6 animate-fade-in-up">
            {/* Badge */}
            <div className="flex items-center space-x-3">
              <span className="bg-netflix-red px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                {currentItem.type?.toUpperCase() || 'FEATURED'}
              </span>
              {currentItem.rating && (
                <span className="flex items-center space-x-1 bg-yellow-500 text-black px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  <StarIcon className="h-4 w-4" />
                  <span>{currentItem.rating.toFixed(1)}</span>
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-black drop-shadow-2xl leading-tight">
              {currentItem.title}
            </h1>

            {/* Meta info */}
            <div className="flex items-center space-x-4 text-lg font-medium text-gray-300">
              {currentItem.year && <span>{currentItem.year}</span>}
              {currentItem.duration && <span>{currentItem.duration} min</span>}
              {currentItem.viewCount && (
                <span>{(currentItem.viewCount / 1000000).toFixed(1)}M views</span>
              )}
            </div>

            {/* Description */}
            {currentItem.description && (
              <p className="text-lg md:text-xl text-gray-200 max-w-xl line-clamp-3 drop-shadow-lg">
                {currentItem.description}
              </p>
            )}

            {/* Genre tags */}
            {currentItem.genres && currentItem.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentItem.genres.slice(0, 4).map((g, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium"
                  >
                    {g.genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href={`/watch/${currentItem.id}`}
                className="bg-white text-black font-bold px-8 py-4 rounded-lg hover:bg-gray-200 transition-all transform hover:scale-105 flex items-center space-x-2 shadow-2xl"
              >
                <PlayIcon className="h-6 w-6" />
                <span>Play Now</span>
              </Link>
              <Link
                href={`/watch/${currentItem.id}`}
                className="bg-gray-500/70 backdrop-blur text-white font-bold px-8 py-4 rounded-lg hover:bg-gray-500 transition-all flex items-center space-x-2 shadow-2xl"
              >
                <InformationCircleIcon className="h-6 w-6" />
                <span>More Info</span>
              </Link>
              <button className="bg-black/50 backdrop-blur text-white font-bold px-6 py-4 rounded-lg hover:bg-black/70 transition-all shadow-2xl">
                <PlusIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Age rating badge */}
        <div className="absolute top-24 right-8 bg-gray-800/90 backdrop-blur px-4 py-2 rounded border-l-4 border-netflix-red">
          <span className="text-sm font-bold">18+</span>
        </div>
      </div>
    );
  }

  // Slider with multiple items
  if (variant === 'slider') {
    return (
      <div className="relative h-[90vh] mb-8 overflow-hidden">
        {/* Slider container */}
        <div 
          className="flex transition-transform duration-700 ease-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={item.id} className="min-w-full h-full relative">
              <Image
                src={item.thumbnailUrl || '/placeholder-thumbnail.jpg'}
                alt={item.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
              
              <div className="absolute inset-0 flex items-center px-4 md:px-12">
                <div className="max-w-2xl space-y-6">
                  <span className="bg-netflix-red px-4 py-1.5 rounded text-sm font-bold inline-block">
                    {item.type?.toUpperCase() || 'FEATURED'}
                  </span>
                  <h1 className="text-5xl md:text-7xl font-black">
                    {item.title}
                  </h1>
                  {item.description && (
                    <p className="text-lg text-gray-200 line-clamp-3">
                      {item.description}
                    </p>
                  )}
                  <div className="flex gap-4">
                    <Link
                      href={`/watch/${item.id}`}
                      className="bg-white text-black font-bold px-8 py-4 rounded hover:bg-gray-200 transition flex items-center space-x-2"
                    >
                      <PlayIcon className="h-6 w-6" />
                      <span>Play</span>
                    </Link>
                    <button className="bg-gray-500/70 backdrop-blur text-white font-bold px-8 py-4 rounded hover:bg-gray-500 transition">
                      More Info
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur hover:bg-black/70 p-4 rounded-full transition-all hover:scale-110"
            >
              <ChevronLeftIcon className="h-8 w-8" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur hover:bg-black/70 p-4 rounded-full transition-all hover:scale-110"
            >
              <ChevronRightIcon className="h-8 w-8" />
            </button>
          </>
        )}

        {/* Dots indicator */}
        {items.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-12 bg-netflix-red'
                    : 'w-2 bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Split screen design
  if (variant === 'split') {
    return (
      <div className="relative h-[90vh] mb-8 grid md:grid-cols-2 gap-0">
        {/* Left side - Image */}
        <div className="relative h-full">
          <Image
            src={currentItem.thumbnailUrl || '/placeholder-thumbnail.jpg'}
            alt={currentItem.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-netflix-black" />
        </div>

        {/* Right side - Content */}
        <div className="relative h-full flex items-center bg-netflix-black px-8 md:px-16">
          <div className="space-y-6 max-w-xl">
            <div className="inline-flex items-center space-x-3 bg-netflix-red px-4 py-2 rounded-full">
              <span className="text-sm font-bold">FEATURED PICK</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-black leading-tight">
              {currentItem.title}
            </h1>

            {currentItem.rating && (
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-6 w-6 ${
                        i < Math.floor(currentItem.rating!)
                          ? 'text-yellow-500'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-2xl font-bold">{currentItem.rating.toFixed(1)}</span>
              </div>
            )}

            {currentItem.description && (
              <p className="text-xl text-gray-300 leading-relaxed">
                {currentItem.description}
              </p>
            )}

            <div className="flex items-center space-x-6 text-lg text-gray-400">
              {currentItem.year && <span>{currentItem.year}</span>}
              {currentItem.duration && <span>{currentItem.duration} min</span>}
            </div>

            <div className="flex flex-col space-y-3">
              <Link
                href={`/watch/${currentItem.id}`}
                className="bg-netflix-red text-white font-bold px-10 py-5 rounded-lg hover:bg-red-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-3 text-lg"
              >
                <PlayIcon className="h-7 w-7" />
                <span>Watch Now</span>
              </Link>
              <button className="border-2 border-white text-white font-bold px-10 py-5 rounded-lg hover:bg-white hover:text-black transition-all flex items-center justify-center space-x-3 text-lg">
                <PlusIcon className="h-7 w-7" />
                <span>Add to Watchlist</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Minimal/Elegant design
  if (variant === 'minimal') {
    return (
      <div className="relative h-[85vh] mb-12">
        <Image
          src={currentItem.thumbnailUrl || '/placeholder-thumbnail.jpg'}
          alt={currentItem.title}
          fill
          className="object-cover"
          priority
        />
        
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-8 max-w-4xl px-4">
            <h1 className="text-7xl md:text-9xl font-black tracking-tight">
              {currentItem.title}
            </h1>
            
            {currentItem.description && (
              <p className="text-2xl text-gray-200 max-w-2xl mx-auto">
                {currentItem.description}
              </p>
            )}

            <div className="flex items-center justify-center space-x-6 text-lg text-gray-300">
              {currentItem.year && <span>{currentItem.year}</span>}
              <span>•</span>
              {currentItem.duration && <span>{currentItem.duration} min</span>}
              {currentItem.rating && (
                <>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <StarIcon className="h-5 w-5 text-yellow-500" />
                    <span>{currentItem.rating.toFixed(1)}</span>
                  </span>
                </>
              )}
            </div>

            <div className="pt-4">
              <Link
                href={`/watch/${currentItem.id}`}
                className="inline-flex items-center space-x-3 bg-white text-black font-bold px-12 py-5 rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 text-lg"
              >
                <PlayIcon className="h-7 w-7" />
                <span>Play</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Video background (placeholder - would need video URL)
  if (variant === 'video-background') {
    return (
      <div className="relative h-[90vh] mb-8 overflow-hidden">
        {/* Background image (in real app, this would be a video) */}
        <Image
          src={currentItem.thumbnailUrl || '/placeholder-thumbnail.jpg'}
          alt={currentItem.title}
          fill
          className="object-cover scale-110 animate-slow-zoom"
          priority
        />
        
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-netflix-black via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-12 pb-20 space-y-6">
          <h1 className="text-5xl md:text-7xl font-black drop-shadow-2xl">
            {currentItem.title}
          </h1>
          
          {currentItem.description && (
            <p className="text-xl text-gray-200 max-w-3xl line-clamp-2 drop-shadow-lg">
              {currentItem.description}
            </p>
          )}

          <div className="flex items-center space-x-4">
            <Link
              href={`/watch/${currentItem.id}`}
              className="bg-white text-black font-bold px-8 py-4 rounded hover:bg-gray-200 transition flex items-center space-x-2"
            >
              <PlayIcon className="h-6 w-6" />
              <span>Play</span>
            </Link>
            <button className="bg-gray-500/70 backdrop-blur text-white font-bold px-8 py-4 rounded hover:bg-gray-500 transition flex items-center space-x-2">
              <InformationCircleIcon className="h-6 w-6" />
              <span>More Info</span>
            </button>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="ml-auto bg-black/50 backdrop-blur p-4 rounded-full hover:bg-black/70 transition"
            >
              {isMuted ? (
                <SpeakerXMarkIcon className="h-6 w-6" />
              ) : (
                <SpeakerWaveIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
