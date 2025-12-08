'use client';

import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  videoUrl: string;
  contentId: number;
}

export default function VideoPlayer({ videoUrl, contentId }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const playerRef = useRef<ReactPlayer>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detect video platform
  const getVideoType = (url: string) => {
    if (!url) return 'unknown';
    
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('vimeo.com')) return 'vimeo';
    if (url.includes('dailymotion.com')) return 'dailymotion';
    if (url.includes('drive.google.com')) return 'googledrive';
    if (url.includes('pornhub.com')) return 'pornhub';
    if (url.includes('xhamster.com')) return 'xhamster';
    if (url.match(/\.(mp4|webm|ogg|mov)(\?|$)/i)) return 'direct';
    
    return 'generic';
  };

  const videoType = getVideoType(videoUrl);

  // Convert URLs to embeddable format
  const getEmbedUrl = (url: string, type: string) => {
    if (type === 'googledrive') {
      const fileId = url.match(/\/d\/([a-zA-Z0-9_-]+)/)?.[1] || 
                     url.match(/[?&]id=([a-zA-Z0-9_-]+)/)?.[1];
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    
    if (type === 'dailymotion') {
      // Extract video ID and convert to embed URL
      const videoId = url.split('/video/')[1]?.split('?')[0];
      if (videoId) {
        return `https://www.dailymotion.com/embed/video/${videoId}`;
      }
    }

    if (type === 'pornhub') {
      const viewkey = new URL(url).searchParams.get('viewkey');
      if (viewkey) {
        return `https://www.pornhub.com/embed/${viewkey}`;
      }
    }

    if (type === 'xhamster') {
      const path = new URL(url).pathname;
      const slug = path.substring(path.lastIndexOf('/') + 1);
      const parts = slug.split('-');
      const videoId = parts[parts.length - 1];
      if (videoId) {
        return `https://xhamster.com/embed/${videoId}`;
      }
    }
    
    return url;
  };

  const embedUrl = getEmbedUrl(videoUrl, videoType);

  // Handle progress
  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setPlayed(state.played);
    // Save progress to localStorage for "Continue Watching"
    localStorage.setItem(`nmc_watch_${contentId}`, state.playedSeconds.toString());
  };

  // Handle duration
  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  // Format time
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = ('0' + date.getUTCSeconds()).slice(-2);
    if (hh) {
      return `${hh}:${('0' + mm).slice(-2)}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  // Seek to position
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    setPlayed(pos);
    playerRef.current?.seekTo(pos);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Auto-hide controls
  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing) {
        setShowControls(false);
      }
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Handle video end
  const handleEnded = () => {
    setPlaying(false);
  };

  // For platforms that need iframe (Dailymotion, Google Drive)
  if (videoType === 'dailymotion' || videoType === 'googledrive' || videoType === 'pornhub' || videoType === 'xhamster') {
    return (
      <div 
        ref={playerContainerRef}
        className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group"
        onMouseMove={resetControlsTimeout}
      >
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Video Player"
        />
      </div>
    );
  }

  // For YouTube, Vimeo, and direct videos - use ReactPlayer
  return (
    <div 
      ref={playerContainerRef}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden group"
      onMouseMove={resetControlsTimeout}
    >
      {/* Video Player */}
      <ReactPlayer
        ref={playerRef}
        url={embedUrl}
        width="100%"
        height="100%"
        playing={playing}
        volume={volume}
        muted={muted}
        playbackRate={playbackRate}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={handleEnded}
        config={{
          youtube: {
            playerVars: { 
              showinfo: 1,
              controls: 0,
              modestbranding: 1,
              rel: 0
            }
          },
          vimeo: {
            playerOptions: {
              controls: false
            }
          }
        }}
      />

      {/* Custom Controls Overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => setPlaying(!playing)}
      >
        {/* Play/Pause Button (Center) */}
        {!playing && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              onClick={() => setPlaying(true)}
              className="w-20 h-20 bg-netflix-red/90 rounded-full flex items-center justify-center hover:bg-red-700 transition-all duration-300 transform hover:scale-110"
            >
              <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </button>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
          {/* Progress Bar */}
          <div 
            className="w-full h-1 bg-gray-600 rounded-full cursor-pointer hover:h-2 transition-all duration-200 group/progress"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-netflix-red rounded-full relative"
              style={{ width: `${played * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-netflix-red rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-4">
              {/* Play/Pause */}
              <button
                onClick={() => setPlaying(!playing)}
                className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
              >
                {playing ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {/* Volume */}
              <div className="flex items-center space-x-2 group/volume">
                <button
                  onClick={() => setMuted(!muted)}
                  className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
                >
                  {muted || volume === 0 ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseFloat(e.target.value));
                    setMuted(false);
                  }}
                  className="w-0 group-hover/volume:w-20 transition-all duration-300 accent-netflix-red"
                />
              </div>

              {/* Time */}
              <div className="text-sm">
                {formatTime(played * duration)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Playback Speed */}
              <select
                value={playbackRate}
                onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                className="px-2 py-1 bg-gray-800/80 text-white text-sm rounded hover:bg-gray-700 transition-colors duration-300 focus:outline-none"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>

              {/* Quality (placeholder for YouTube) */}
              {videoType === 'youtube' && (
                <select className="px-2 py-1 bg-gray-800/80 text-white text-sm rounded hover:bg-gray-700 transition-colors duration-300 focus:outline-none">
                  <option>Auto</option>
                  <option>1080p</option>
                  <option>720p</option>
                  <option>480p</option>
                  <option>360p</option>
                </select>
              )}

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/10 rounded-full transition-all duration-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
