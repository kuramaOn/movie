export default function LoadingSkeleton() {
  return (
    <div className="space-y-12 px-4 md:px-12">
      {[1, 2, 3, 4].map((row) => (
        <div key={row} className="space-y-4">
          <div className="h-8 w-48 skeleton rounded"></div>
          <div className="flex space-x-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((card) => (
              <div key={card} className="flex-shrink-0 w-64 md:w-80">
                <div className="aspect-video skeleton rounded"></div>
                <div className="mt-2 space-y-2">
                  <div className="h-4 skeleton rounded"></div>
                  <div className="h-3 w-2/3 skeleton rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
