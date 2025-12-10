'use client';

import { useState } from 'react';
import { 
  FunnelIcon, 
  XMarkIcon,
  StarIcon,
  ClockIcon,
  CalendarIcon,
  FireIcon,
  EyeIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface FilterOptions {
  genres: string[];
  year: { min: number; max: number };
  rating: number;
  duration: { min: number; max: number };
  sortBy: string;
  type: string[];
}

interface AdvancedFilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  availableGenres?: Array<{ id: number; name: string; slug: string }>;
}

export default function AdvancedFilterSidebar({
  isOpen,
  onClose,
  onApplyFilters,
  availableGenres = [],
}: AdvancedFilterSidebarProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState({ min: 2000, max: new Date().getFullYear() });
  const [minRating, setMinRating] = useState(0);
  const [durationRange, setDurationRange] = useState({ min: 0, max: 300 });
  const [sortBy, setSortBy] = useState('latest');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const currentYear = new Date().getFullYear();

  const handleGenreToggle = (slug: string) => {
    setSelectedGenres((prev) =>
      prev.includes(slug) ? prev.filter((g) => g !== slug) : [...prev, slug]
    );
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleApply = () => {
    onApplyFilters({
      genres: selectedGenres,
      year: yearRange,
      rating: minRating,
      duration: durationRange,
      sortBy,
      type: selectedTypes,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedGenres([]);
    setYearRange({ min: 2000, max: currentYear });
    setMinRating(0);
    setDurationRange({ min: 0, max: 300 });
    setSortBy('latest');
    setSelectedTypes([]);
  };

  const contentTypes = [
    { value: 'movie', label: 'Movies', icon: '🎬' },
    { value: 'series', label: 'TV Series', icon: '📺' },
    { value: 'documentary', label: 'Documentaries', icon: '🎥' },
    { value: 'short', label: 'Shorts', icon: '⏱️' },
  ];

  const sortOptions = [
    { value: 'latest', label: 'Latest Releases', icon: CalendarIcon },
    { value: 'popular', label: 'Most Popular', icon: FireIcon },
    { value: 'rating', label: 'Highest Rated', icon: StarIcon },
    { value: 'views', label: 'Most Viewed', icon: EyeIcon },
    { value: 'duration', label: 'Duration', icon: ClockIcon },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-gray-900 z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="bg-netflix-red p-2 rounded-lg">
                <FunnelIcon className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Filters</h2>
                <p className="text-sm text-gray-400">Refine your search</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Filters Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-custom">
            
            {/* Content Type */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <AdjustmentsHorizontalIcon className="h-5 w-5 text-netflix-red" />
                <span>Content Type</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {contentTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => handleTypeToggle(type.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedTypes.includes(type.value)
                        ? 'border-netflix-red bg-netflix-red/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </section>

            {/* Sort By */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <span>Sort By</span>
              </h3>
              <div className="space-y-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSortBy(option.value)}
                    className={`w-full p-4 rounded-lg border transition-all flex items-center space-x-3 ${
                      sortBy === option.value
                        ? 'border-netflix-red bg-netflix-red/10 shadow-lg shadow-netflix-red/20'
                        : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800'
                    }`}
                  >
                    <option.icon className="h-5 w-5" />
                    <span className="font-medium">{option.label}</span>
                    {sortBy === option.value && (
                      <div className="ml-auto w-2 h-2 bg-netflix-red rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Genres */}
            {availableGenres.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-lg font-bold">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {availableGenres.map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() => handleGenreToggle(genre.slug)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedGenres.includes(genre.slug)
                          ? 'bg-netflix-red text-white shadow-lg shadow-netflix-red/30'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Rating */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <StarIcon className="h-5 w-5 text-yellow-500" />
                <span>Minimum Rating</span>
              </h3>
              <div className="space-y-4">
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(rating)}
                      className="transition-transform hover:scale-110"
                    >
                      {rating <= minRating ? (
                        <StarIconSolid className="h-8 w-8 text-yellow-500" />
                      ) : (
                        <StarIcon className="h-8 w-8 text-gray-600" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-yellow-500">
                    {minRating > 0 ? `${minRating}.0+` : 'Any'}
                  </span>
                </div>
              </div>
            </section>

            {/* Year Range */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-netflix-red" />
                <span>Release Year</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">From</label>
                  <input
                    type="range"
                    min="1980"
                    max={currentYear}
                    value={yearRange.min}
                    onChange={(e) =>
                      setYearRange((prev) => ({ ...prev, min: parseInt(e.target.value) }))
                    }
                    className="w-full accent-netflix-red"
                  />
                  <div className="text-center mt-2 text-lg font-bold">{yearRange.min}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">To</label>
                  <input
                    type="range"
                    min={yearRange.min}
                    max={currentYear}
                    value={yearRange.max}
                    onChange={(e) =>
                      setYearRange((prev) => ({ ...prev, max: parseInt(e.target.value) }))
                    }
                    className="w-full accent-netflix-red"
                  />
                  <div className="text-center mt-2 text-lg font-bold">{yearRange.max}</div>
                </div>
              </div>
            </section>

            {/* Duration */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-netflix-red" />
                <span>Duration (minutes)</span>
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Min</label>
                    <input
                      type="number"
                      value={durationRange.min}
                      onChange={(e) =>
                        setDurationRange((prev) => ({ ...prev, min: parseInt(e.target.value) || 0 }))
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-netflix-red"
                      min="0"
                      max="300"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Max</label>
                    <input
                      type="number"
                      value={durationRange.max}
                      onChange={(e) =>
                        setDurationRange((prev) => ({ ...prev, max: parseInt(e.target.value) || 300 }))
                      }
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-netflix-red"
                      min={durationRange.min}
                      max="500"
                    />
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-gray-800 space-y-3">
            <button
              onClick={handleApply}
              className="w-full bg-netflix-red hover:bg-red-700 text-white font-bold py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-netflix-red/30"
            >
              Apply Filters
            </button>
            <button
              onClick={handleReset}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-lg transition-all"
            >
              Reset All
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Filter Button Component
export function FilterButton({ onClick, activeFiltersCount = 0 }: { onClick: () => void; activeFiltersCount?: number }) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-3 rounded-lg transition-all group"
    >
      <FunnelIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
      <span className="font-medium">Filters</span>
      {activeFiltersCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-netflix-red text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
          {activeFiltersCount}
        </span>
      )}
    </button>
  );
}
