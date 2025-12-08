export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-netflix-red mx-auto"></div>
        <p className="text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
