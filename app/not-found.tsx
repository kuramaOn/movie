import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-9xl font-bold text-netflix-red">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold">Page Not Found</h2>
        <p className="text-gray-400 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-netflix-red hover:bg-red-700 text-white font-semibold px-8 py-3 rounded transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
