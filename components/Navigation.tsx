'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navigation() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (!mounted) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <span className="text-netflix-red text-2xl font-bold">NETWORK CHANEL</span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      scrolled ? 'bg-black/95 backdrop-blur-sm shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <span className="text-netflix-red text-2xl font-bold transform transition-all duration-300 group-hover:scale-110 group-hover:text-red-500">
              NETWORK CHANEL
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-white hover:text-netflix-red transition-all duration-300 hover:scale-110 transform ${isActive('/') ? 'font-semibold' : ''}`}
            >
              Home
            </Link>
            <Link 
              href="/browse" 
              className={`text-white hover:text-netflix-red transition-all duration-300 hover:scale-110 transform ${isActive('/browse') ? 'font-semibold' : ''}`}
            >
              Browse
            </Link>
            <Link 
              href="/browse?type=movie" 
              className="text-white hover:text-netflix-red transition-all duration-300 hover:scale-110 transform"
            >
              Movies
            </Link>
            <Link 
              href="/browse?type=documentary" 
              className="text-white hover:text-netflix-red transition-all duration-300 hover:scale-110 transform"
            >
              Documentaries
            </Link>
            
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-white hover:text-netflix-red transition-all duration-300 hover:scale-110 transform"
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-netflix-red transition-colors duration-300"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Search Bar (Animated Dropdown) */}
        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
          searchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, documentaries..."
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red transition-all duration-300"
                autoFocus
              />
            </form>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Slide Down Animation) */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
        mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 py-4 space-y-3 bg-black/95">
          <Link 
            href="/" 
            className="block text-white hover:text-netflix-red transition-colors duration-300 py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            href="/browse" 
            className="block text-white hover:text-netflix-red transition-colors duration-300 py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Browse
          </Link>
          <Link 
            href="/browse?type=movie" 
            className="block text-white hover:text-netflix-red transition-colors duration-300 py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Movies
          </Link>
          <Link 
            href="/browse?type=documentary" 
            className="block text-white hover:text-netflix-red transition-colors duration-300 py-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Documentaries
          </Link>
        </div>
      </div>
    </nav>
  );
}
