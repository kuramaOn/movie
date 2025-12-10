'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FilmIcon, PlayCircleIcon } from '@heroicons/react/24/outline';

interface LayoutSwitcherProps {
  contentId: number;
}

export default function LayoutSwitcher({ contentId }: LayoutSwitcherProps) {
  const pathname = usePathname();
  const isCinematic = pathname?.includes('/cinematic');

  return (
    <div className="fixed top-20 right-6 z-40 flex items-center space-x-2 bg-gray-900/80 backdrop-blur-sm rounded-lg p-2 border border-white/10 shadow-xl">
      <Link
        href={`/watch/${contentId}`}
        className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 ${
          !isCinematic
            ? 'bg-netflix-red text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
      >
        <PlayCircleIcon className="h-5 w-5" />
        <span className="text-sm font-medium hidden sm:inline">Classic</span>
      </Link>
      
      <Link
        href={`/watch/${contentId}/cinematic`}
        className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-300 ${
          isCinematic
            ? 'bg-netflix-red text-white'
            : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
      >
        <FilmIcon className="h-5 w-5" />
        <span className="text-sm font-medium hidden sm:inline">Cinematic</span>
      </Link>
    </div>
  );
}
