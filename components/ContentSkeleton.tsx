'use client';

interface ContentSkeletonProps {
  count?: number;
  view?: 'grid' | 'list';
}

export default function ContentSkeleton({ count = 5, view = 'grid' }: ContentSkeletonProps) {
  if (view === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex space-x-4 bg-gray-800 rounded-lg p-4 animate-pulse">
            <div className="w-32 h-48 bg-gray-700 rounded flex-shrink-0"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              <div className="flex space-x-2 mt-4">
                <div className="h-8 bg-gray-700 rounded w-20"></div>
                <div className="h-8 bg-gray-700 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[2/3] bg-gray-700 rounded-lg mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-700 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}
