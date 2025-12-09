'use client';

import { Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => onViewChange('grid')}
        className={`p-2 rounded-lg transition-colors ${
          view === 'grid'
            ? 'bg-netflix-red text-white'
            : 'text-gray-400 hover:text-white'
        }`}
        aria-label="Grid view"
      >
        <Squares2X2Icon className="w-5 h-5" />
      </button>
      <button
        onClick={() => onViewChange('list')}
        className={`p-2 rounded-lg transition-colors ${
          view === 'list'
            ? 'bg-netflix-red text-white'
            : 'text-gray-400 hover:text-white'
        }`}
        aria-label="List view"
      >
        <ListBulletIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
