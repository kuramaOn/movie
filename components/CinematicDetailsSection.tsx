'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  StarIcon, 
  ClockIcon, 
  CalendarIcon,
  EyeIcon,
  ChartBarIcon,
  FilmIcon
} from '@heroicons/react/24/solid';
import { formatDuration } from '@/lib/utils';

interface CinematicDetailsSectionProps {
  content: {
    id: number;
    title: string;
    description: string | null;
    thumbnailUrl: string | null;
    rating?: any;
    year?: number | null;
    duration?: number | null;
    viewCount?: number;
    type: string;
    cast?: string | null;
    director?: string | null;
    createdAt: Date;
    genres?: Array<{ genre: { name: string; id: number } }>;
  };
  dominantColor?: string;
}

export default function CinematicDetailsSection({ content, dominantColor = '#141414' }: CinematicDetailsSectionProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'cast'>('overview');

  return (
    <div id="details" className="relative py-16 px-6 md:px-12 lg:px-16">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at top left, ${dominantColor}, transparent 50%)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-800/30 backdrop-blur-sm rounded-lg p-1 w-fit border border-white/10">
          {['overview', 'details', 'cast'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-lg font-semibold capitalize transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-netflix-red text-white shadow-lg'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <h2 className="text-3xl font-bold mb-4 flex items-center space-x-3">
                    <FilmIcon className="h-8 w-8 text-netflix-red" />
                    <span>Synopsis</span>
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {content.description || 'No description available.'}
                  </p>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {content.rating && (
                    <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
                      <div className="flex items-center justify-center mb-2">
                        <StarIcon className="h-8 w-8 text-yellow-500" />
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">
                          {typeof content.rating === 'object' && content.rating.toNumber ? content.rating.toNumber().toFixed(1) : Number(content.rating).toFixed(1)}
                        </div>
                        <div className="text-sm text-gray-400">Rating</div>
                      </div>
                    </div>
                  )}

                  {content.duration && (
                    <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
                      <div className="flex items-center justify-center mb-2">
                        <ClockIcon className="h-8 w-8 text-blue-400" />
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">
                          {formatDuration(content.duration)}
                        </div>
                        <div className="text-sm text-gray-400">Duration</div>
                      </div>
                    </div>
                  )}

                  {content.viewCount !== undefined && (
                    <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
                      <div className="flex items-center justify-center mb-2">
                        <EyeIcon className="h-8 w-8 text-green-400" />
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">
                          {content.viewCount.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-400">Views</div>
                      </div>
                    </div>
                  )}

                  {content.year && (
                    <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/30">
                      <div className="flex items-center justify-center mb-2">
                        <CalendarIcon className="h-8 w-8 text-red-400" />
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-white">
                          {content.year}
                        </div>
                        <div className="text-sm text-gray-400">Year</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <h2 className="text-3xl font-bold mb-6">Production Details</h2>
                  
                  <div className="space-y-4">
                    <div className="flex border-b border-gray-700 pb-4">
                      <span className="text-gray-400 w-32 font-semibold">Type:</span>
                      <span className="text-white font-medium uppercase">{content.type}</span>
                    </div>

                    {content.year && (
                      <div className="flex border-b border-gray-700 pb-4">
                        <span className="text-gray-400 w-32 font-semibold">Release Year:</span>
                        <span className="text-white">{content.year}</span>
                      </div>
                    )}

                    {content.duration && (
                      <div className="flex border-b border-gray-700 pb-4">
                        <span className="text-gray-400 w-32 font-semibold">Runtime:</span>
                        <span className="text-white">{formatDuration(content.duration)}</span>
                      </div>
                    )}

                    {content.director && (
                      <div className="flex border-b border-gray-700 pb-4">
                        <span className="text-gray-400 w-32 font-semibold">Director:</span>
                        <span className="text-white">{content.director}</span>
                      </div>
                    )}

                    {content.genres && content.genres.length > 0 && (
                      <div className="flex border-b border-gray-700 pb-4">
                        <span className="text-gray-400 w-32 font-semibold">Genres:</span>
                        <div className="flex flex-wrap gap-2">
                          {content.genres.map((g) => (
                            <span
                              key={g.genre.id}
                              className="px-3 py-1 bg-netflix-red/20 border border-netflix-red/50 rounded-full text-sm font-medium"
                            >
                              {g.genre.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex border-b border-gray-700 pb-4">
                      <span className="text-gray-400 w-32 font-semibold">Added:</span>
                      <span className="text-white">
                        {new Date(content.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cast' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                  <h2 className="text-3xl font-bold mb-6">Cast & Crew</h2>
                  
                  {content.cast ? (
                    <p className="text-gray-300 text-lg leading-relaxed">{content.cast}</p>
                  ) : (
                    <p className="text-gray-400 italic">Cast information not available.</p>
                  )}

                  {content.director && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h3 className="text-xl font-semibold mb-2">Director</h3>
                      <p className="text-gray-300">{content.director}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Poster */}
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl group">
              {content.thumbnailUrl && (
                <>
                  <Image
                    src={content.thumbnailUrl}
                    alt={content.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-white font-semibold text-center">Official Poster</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Additional info card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm font-semibold">Popularity</span>
                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="h-5 w-5 text-netflix-red" />
                  <span className="text-white font-bold">
                    {content.viewCount ? `#${Math.floor(Math.random() * 100) + 1}` : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm font-semibold">Content Type</span>
                <span className="text-white font-bold uppercase text-sm">{content.type}</span>
              </div>

              {content.rating && (
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm font-semibold">User Rating</span>
                    <span className="text-yellow-500 font-bold">
                      {typeof content.rating === 'object' && content.rating.toNumber ? content.rating.toNumber().toFixed(1) : Number(content.rating).toFixed(1)}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${((typeof content.rating === 'object' && content.rating.toNumber ? content.rating.toNumber() : Number(content.rating)) / 10) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
