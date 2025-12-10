'use client';

import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
} from '@heroicons/react/24/solid';
import { RectangleStackIcon } from '@heroicons/react/24/outline';
import { convertToEmbeddableUrl, getVideoSourceInfo, isDirectVideoFile } from '@/lib/videoUrlConverter';
import VideoEndScreen from './VideoEndScreen';

interface EnhancedVideoPlayerProps {
  url: string;
  title?: string;
  onEnded?: () => void;
  nextVideoUrl?: string;
  autoPlay?: boolean;
  nextVideo?: any;
  relatedVideos?: any[];
}

export default function EnhancedVideoPlayer({
  url,
  title,
  onEnded,
  nextVideoUrl,
  autoPlay = false,
  nextVideo,
  relatedVideos = [],
}: EnhancedVideoPlayerProps) {
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get video source info
  const videoSource = getVideoSourceInfo(url);
  const embeddableUrl = videoSource.embedUrl;
  const useIframe = videoSource.requiresIframe;

  const [playing, setPlaying] = useState(autoPlay);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [quality, setQuality] = useState('auto');
  const [showSettings, setShowSettings] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [showEndScreen, setShowEndScreen] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          setPlaying((prev) => !prev);
          break;
        case 'arrowleft':
          e.preventDefault();
          seekBy(-10);
          break;
        case 'arrowright':
          e.preventDefault();
          seekBy(10);
          break;
        case 'arrowup':
          e.preventDefault();
          setVolume((prev) => Math.min(prev + 0.1, 1));
          break;
        case 'arrowdown':
          e.preventDefault();
          setVolume((prev) => Math.max(prev - 0.1, 0));
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          setMuted((prev) => !prev);
          break;
        case 't':
          e.preventDefault();
          setIsTheaterMode((prev) => !prev);
          break;
        case 'p':
          e.preventDefault();
          togglePiP();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Auto-hide controls
  useEffect(() => {
    if (showControls && playing) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, playing]);

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const seekBy = (seconds: number) => {
    const player = playerRef.current;
    if (player) {
      const currentTime = player.getCurrentTime();
      player.seekTo(currentTime + seconds, 'seconds');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const togglePiP = async () => {
    const videoElement = playerRef.current?.getInternalPlayer() as HTMLVideoElement;
    if (videoElement) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
          setIsPiP(false);
        } else {
          await videoElement.requestPictureInPicture();
          setIsPiP(true);
        }
      } catch (error) {
        console.error('PiP error:', error);
      }
    }
  };

  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    setPlayed(state.played);
    // Reset end screen if user seeks back
    if (hasEnded && state.played < 0.95) {
      setHasEnded(false);
      setShowEndScreen(false);
    }
  };

  const handleVideoEnded = () => {
    setHasEnded(true);
    setShowEndScreen(true);
    setPlaying(false);
    if (onEnded) {
      onEnded();
    }
  };

  const handleReplay = () => {
    setShowEndScreen(false);
    setHasEnded(false);
    setPlayed(0);
    playerRef.current?.seekTo(0);
    setPlaying(true);
  };

  const handleCloseEndScreen = () => {
    setShowEndScreen(false);
  };

  const handleSaveToWatchlist = () => {
    // TODO: Implement watchlist functionality
    alert('Saved to Watchlist! (Feature coming soon)');
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setPlayed(newValue);
    playerRef.current?.seekTo(newValue, 'fraction');
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Render iframe embed for external platforms
  if (useIframe) {
    return (
      <div
        ref={containerRef}
        className={`relative bg-black ${isTheaterMode ? 'w-full' : 'w-full max-w-7xl mx-auto'}`}
      >
        <div className="relative aspect-video">
          <iframe
            ref={iframeRef}
            src={embeddableUrl}
            className="w-full h-full"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            sandbox="allow-same-origin allow-scripts allow-presentation"
            title={title || 'Video Player'}
            style={{ pointerEvents: 'auto' }}
          />
          {/* Transparent overlay to prevent external link clicks while allowing video controls */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ 
              background: 'transparent',
              zIndex: 1
            }}
          />
        </div>
        
        {/* Source Info */}
        <div className="mt-4 p-4 bg-gray-900 rounded-lg text-sm">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-400">Source:</span>
              <span className="ml-2 font-semibold text-white">{videoSource.platform}</span>
            </div>
            <a
              href={videoSource.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-netflix-red hover:text-red-400 transition-colors flex items-center space-x-1"
            >
              <span>View Original</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          <p className="mt-2 text-gray-400 text-xs">
            This video is embedded from {videoSource.platform}. All controls are provided by the source platform.
          </p>
        </div>
      </div>
    );
  }

  // Render custom player for direct video files
  return (
    <div
      ref={containerRef}
      className={`relative bg-black ${isTheaterMode ? 'w-full' : 'w-full max-w-7xl mx-auto'}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      {/* Video Player */}
      <div className="relative aspect-video">
        <ReactPlayer
          ref={playerRef}
          url={embeddableUrl}
          playing={playing}
          volume={volume}
          muted={muted}
          playbackRate={playbackRate}
          width="100%"
          height="100%"
          onProgress={handleProgress}
          onDuration={setDuration}
          onEnded={handleVideoEnded}
          onBuffer={() => setBuffering(true)}
          onBufferEnd={() => setBuffering(false)}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload',
                disablePictureInPicture: false,
              },
            },
          }}
        />

        {/* Buffering Indicator */}
        {buffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Center Play/Pause Button */}
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={() => setPlaying(!playing)}
        >
          {!playing && !buffering && (
            <div className="w-20 h-20 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/50 transition-all hover:scale-110">
              <PlayIcon className="w-12 h-12 text-white ml-1" />
            </div>
          )}
        </div>

        {/* Controls Overlay */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress Bar */}
          <div className="px-4 pt-4">
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={played}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-600 hover:[&::-webkit-slider-thumb]:scale-150 [&::-webkit-slider-thumb]:transition-transform"
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between px-4 pb-4 pt-2">
            {/* Left Controls */}
            <div className="flex items-center space-x-4">
              {/* Play/Pause */}
              <button
                onClick={() => setPlaying(!playing)}
                className="hover:scale-110 transition-transform"
              >
                {playing ? (
                  <PauseIcon className="w-8 h-8" />
                ) : (
                  <PlayIcon className="w-8 h-8" />
                )}
              </button>

              {/* Rewind */}
              <button
                onClick={() => seekBy(-10)}
                className="hover:scale-110 transition-transform"
              >
                <ArrowUturnLeftIcon className="w-6 h-6" />
              </button>

              {/* Forward */}
              <button
                onClick={() => seekBy(10)}
                className="hover:scale-110 transition-transform"
              >
                <ArrowUturnRightIcon className="w-6 h-6" />
              </button>

              {/* Volume */}
              <div className="flex items-center space-x-2 group">
                <button
                  onClick={() => setMuted(!muted)}
                  className="hover:scale-110 transition-transform"
                >
                  {muted || volume === 0 ? (
                    <SpeakerXMarkIcon className="w-6 h-6" />
                  ) : (
                    <SpeakerWaveIcon className="w-6 h-6" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    const newVolume = parseFloat(e.target.value);
                    setVolume(newVolume);
                    setMuted(newVolume === 0);
                  }}
                  className="w-0 group-hover:w-20 transition-all duration-300 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
              </div>

              {/* Time */}
              <div className="text-sm">
                {formatTime(played * duration)} / {formatTime(duration)}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-4">
              {/* Playback Speed */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="text-sm font-medium hover:text-gray-300 transition-colors"
                >
                  {playbackRate}x
                </button>
                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                    {playbackRates.map((rate) => (
                      <button
                        key={rate}
                        onClick={() => {
                          setPlaybackRate(rate);
                          setShowSettings(false);
                        }}
                        className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-800 ${
                          playbackRate === rate ? 'text-red-600' : ''
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theater Mode */}
              <button
                onClick={() => setIsTheaterMode(!isTheaterMode)}
                className="hover:scale-110 transition-transform"
                title="Theater Mode (T)"
              >
                <RectangleStackIcon className="w-6 h-6" />
              </button>

              {/* Picture-in-Picture */}
              <button
                onClick={togglePiP}
                className="hover:scale-110 transition-transform"
                title="Picture-in-Picture (P)"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z"/>
                </svg>
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="hover:scale-110 transition-transform"
                title="Fullscreen (F)"
              >
                {isFullscreen ? (
                  <ArrowsPointingInIcon className="w-6 h-6" />
                ) : (
                  <ArrowsPointingOutIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Video End Screen */}
        {showEndScreen && (
          <VideoEndScreen
            show={showEndScreen}
            onReplay={handleReplay}
            onClose={handleCloseEndScreen}
            nextVideo={nextVideo}
            relatedVideos={relatedVideos}
            onSaveToWatchlist={handleSaveToWatchlist}
            autoPlayNext={true}
            countdownSeconds={10}
          />
        )}
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="mt-4 p-4 bg-gray-900 rounded-lg text-sm text-gray-400">
        <p className="font-semibold mb-2">Keyboard Shortcuts:</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div><kbd className="px-2 py-1 bg-gray-800 rounded">Space</kbd> Play/Pause</div>
          <div><kbd className="px-2 py-1 bg-gray-800 rounded">←/→</kbd> Seek ±10s</div>
          <div><kbd className="px-2 py-1 bg-gray-800 rounded">↑/↓</kbd> Volume</div>
          <div><kbd className="px-2 py-1 bg-gray-800 rounded">F</kbd> Fullscreen</div>
          <div><kbd className="px-2 py-1 bg-gray-800 rounded">M</kbd> Mute</div>
          <div><kbd className="px-2 py-1 bg-gray-800 rounded">T</kbd> Theater</div>
          <div><kbd className="px-2 py-1 bg-gray-800 rounded">P</kbd> PiP</div>
          <div><kbd className="px-2 py-1 bg-gray-800 rounded">K</kbd> Play/Pause</div>
        </div>
      </div>
    </div>
  );
}
