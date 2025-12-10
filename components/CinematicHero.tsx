'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  PlayIcon, 
  PlusIcon, 
  ShareIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  InformationCircleIcon,
  HeartIcon,
  ChevronDownIcon
} from '@heroicons/react/24/solid';
import { getYouTubeVideoId, detectVideoSource } from '@/lib/utils';

interface CinematicHeroProps {
  content: {
    id: number;
    title: string;
    description: string | null;
    thumbnailUrl: string | null;
    videoUrl: string;
    rating?: any;
    year?: number | null;
    duration?: number | null;
    type: string;
    genres?: Array<{ genre: { name: string; id: number } }>;
  };
}

export default function CinematicHero({ content }: CinematicHeroProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [dominantColor, setDominantColor] = useState<string>('#141414');
  const [isAddedToList, setIsAddedToList] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Extract dominant color from thumbnail
  useEffect(() => {
    if (content.thumbnailUrl) {
      extractDominantColor(content.thumbnailUrl);
    }
  }, [content.thumbnailUrl]);

  // Auto-show video after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const extractDominantColor = async (imageUrl: string) => {
    try {
      // Create a canvas to extract color
      const img = document.createElement('img');
      img.crossOrigin = 'Anonymous';
      img.src = imageUrl;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Sample center area for better color
        const imageData = ctx.getImageData(
          canvas.width / 4, 
          canvas.height / 4, 
          canvas.width / 2, 
          canvas.height / 2
        );
        
        const data = imageData.data;
        let r = 0, g = 0, b = 0;
        
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }
        
        const pixelCount = data.length / 4;
        r = Math.floor(r / pixelCount);
        g = Math.floor(g / pixelCount);
        b = Math.floor(b / pixelCount);
        
        // Darken the color for better contrast
        r = Math.floor(r * 0.3);
        g = Math.floor(g * 0.3);
        b = Math.floor(b * 0.3);
        
        setDominantColor(`rgb(${r}, ${g}, ${b})`);
      };
    } catch (error) {
      console.error('Error extracting color:', error);
    }
  };

  const getEmbedUrl = () => {
    const videoSource = detectVideoSource(content.videoUrl);
    
    if (videoSource === 'youtube') {
      const videoId = getYouTubeVideoId(content.videoUrl);
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&loop=1&playlist=${videoId}&enablejsapi=1`;
      }
    }
    
    return null;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          text: content.description || `Watch ${content.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share canceled');
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const toggleAddToList = () => {
    setIsAddedToList(!isAddedToList);
    // TODO: Implement actual add to list functionality
  };

  const embedUrl = getEmbedUrl();
  
  // Calculate parallax values
  const parallaxOffset = scrollY * 0.5;
  const opacity = Math.max(0, 1 - scrollY / 500);
  const scale = 1 + scrollY / 2000;

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Dynamic color background */}
      <div 
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          background: `linear-gradient(to bottom, ${dominantColor} 0%, #141414 100%)`,
        }}
      />

      {/* Video/Image background with parallax */}
      <div 
        className="absolute inset-0 transition-all duration-300"
        style={{
          transform: `translateY(${parallaxOffset}px) scale(${scale})`,
          opacity: opacity,
        }}
      >
        {showVideo && embedUrl ? (
          <div className="relative w-full h-full">
            <iframe
              ref={videoRef}
              src={embedUrl}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{ border: 'none', transform: 'scale(1.2)' }}
            />
            
            {/* Mute/Unmute button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-24 right-8 z-20 bg-black/50 backdrop-blur-sm hover:bg-black/70 p-3 rounded-full transition-all duration-300 border border-white/20 hover:border-white/40"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <SpeakerXMarkIcon className="h-6 w-6 text-white" />
              ) : (
                <SpeakerWaveIcon className="h-6 w-6 text-white" />
              )}
            </button>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {content.thumbnailUrl && (
              <Image
                src={content.thumbnailUrl}
                alt={content.title}
                fill
                className="object-cover"
                priority
                quality={100}
              />
            )}
          </div>
        )}
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />
      </div>

      {/* Content overlay */}
      <div 
        className="relative h-full flex items-center px-6 md:px-12 lg:px-16 z-10"
        style={{
          transform: `translateY(${-parallaxOffset * 0.3}px)`,
          opacity: opacity,
        }}
      >
        <div className="max-w-4xl space-y-6 animate-fade-in-up">
          {/* Type badge */}
          <div className="flex items-center space-x-3">
            <span className="bg-netflix-red px-4 py-2 rounded-md text-sm font-bold uppercase tracking-wider shadow-lg">
              {content.type}
            </span>
            {content.year && (
              <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-md text-sm font-semibold border border-white/20">
                {content.year}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight drop-shadow-2xl"
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 0 40px rgba(229,9,20,0.3)',
            }}
          >
            {content.title}
          </h1>

          {/* Rating and duration */}
          <div className="flex items-center space-x-4 text-lg">
            {content.rating && (
              <div className="flex items-center space-x-2 bg-yellow-500 text-black px-3 py-1 rounded-full font-bold">
                <span>★</span>
                <span>{typeof content.rating === 'object' && content.rating.toNumber ? content.rating.toNumber().toFixed(1) : Number(content.rating).toFixed(1)}</span>
              </div>
            )}
            {content.duration && (
              <span className="text-gray-300 font-medium">{content.duration} min</span>
            )}
          </div>

          {/* Description */}
          {content.description && (
            <p 
              className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl line-clamp-3"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9)' }}
            >
              {content.description}
            </p>
          )}

          {/* Genres */}
          {content.genres && content.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {content.genres.map((g) => (
                <span
                  key={g.genre.id}
                  className="px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-medium hover:bg-white/20 transition-all duration-300"
                >
                  {g.genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href={`/watch/${content.id}`}
              className="group flex items-center space-x-3 bg-white text-black font-bold px-8 py-4 rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <PlayIcon className="h-7 w-7 group-hover:animate-pulse" />
              <span className="text-lg">Play Now</span>
            </Link>

            <button
              onClick={toggleAddToList}
              className={`group flex items-center space-x-3 font-bold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-xl ${
                isAddedToList
                  ? 'bg-netflix-red text-white'
                  : 'bg-gray-800/80 backdrop-blur-sm text-white border-2 border-white/20 hover:border-white/40'
              }`}
            >
              {isAddedToList ? (
                <HeartIcon className="h-6 w-6 animate-scale-in" />
              ) : (
                <PlusIcon className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
              )}
              <span>{isAddedToList ? 'Added' : 'My List'}</span>
            </button>

            <button
              onClick={handleShare}
              className="group flex items-center space-x-3 bg-gray-800/80 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 border-2 border-white/20 hover:border-white/40 shadow-xl"
            >
              <ShareIcon className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
              <span>Share</span>
            </button>

            <Link
              href={`#details`}
              className="group flex items-center space-x-3 bg-gray-800/50 backdrop-blur-sm text-white font-bold px-6 py-4 rounded-lg hover:bg-gray-700/50 transition-all duration-300 border-2 border-white/20 hover:border-white/40"
            >
              <InformationCircleIcon className="h-6 w-6" />
              <span className="hidden md:inline">More Info</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10"
        style={{ opacity: Math.max(0, 1 - scrollY / 200) }}
      >
        <div className="flex flex-col items-center space-y-2">
          <span className="text-white/70 text-sm font-medium">Scroll to explore</span>
          <ChevronDownIcon className="h-8 w-8 text-white/70" />
        </div>
      </div>

      {/* Floating action buttons (mobile) */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 md:hidden">
        <button
          onClick={toggleAddToList}
          className={`p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
            isAddedToList
              ? 'bg-netflix-red'
              : 'bg-gray-800/90 backdrop-blur-sm border border-white/20'
          }`}
        >
          {isAddedToList ? (
            <HeartIcon className="h-6 w-6 text-white" />
          ) : (
            <PlusIcon className="h-6 w-6 text-white" />
          )}
        </button>
        
        <button
          onClick={handleShare}
          className="p-4 bg-gray-800/90 backdrop-blur-sm rounded-full shadow-2xl border border-white/20 transition-all duration-300 transform hover:scale-110"
        >
          <ShareIcon className="h-6 w-6 text-white" />
        </button>
      </div>
    </div>
  );
}
