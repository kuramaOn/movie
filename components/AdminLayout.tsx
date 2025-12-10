'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  HomeIcon,
  FilmIcon,
  RssIcon,
  TagIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard-nmc-2024', icon: HomeIcon },
    { name: 'Content', href: '/dashboard-nmc-2024/content', icon: FilmIcon },
    { name: 'Feeds', href: '/dashboard-nmc-2024/feeds', icon: RssIcon },
    { name: 'Genres', href: '/dashboard-nmc-2024/genres', icon: TagIcon },
    { name: 'Settings', href: '/dashboard-nmc-2024/settings', icon: Cog6ToothIcon },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard-nmc-2024') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      sessionStorage.removeItem('nmc_admin_auth');
      router.push('/dashboard-nmc-2024');
      router.refresh();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard-nmc-2024/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Breadcrumb generation
  const generateBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];
    let currentPath = '';

    for (let i = 0; i < paths.length; i++) {
      currentPath += `/${paths[i]}`;
      const name = paths[i]
        .replace(/-/g, ' ')
        .replace(/nmc \d+/g, '')
        .replace(/\d+/g, '')
        .trim();
      
      if (name && name !== 'dashboard') {
        breadcrumbs.push({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          href: currentPath,
          current: i === paths.length - 1,
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white p-2 hover:bg-gray-700 rounded-lg transition"
        >
          {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
        <span className="text-lg font-bold text-netflix-red">NMC Admin</span>
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="text-white p-2 hover:bg-gray-700 rounded-lg transition"
        >
          <MagnifyingGlassIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-800 border-r border-gray-700 transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-700">
            <Link href="/dashboard-nmc-2024" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-netflix-red rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              {sidebarOpen && (
                <div>
                  <h1 className="text-white font-bold text-lg">NMC Admin</h1>
                  <p className="text-gray-400 text-xs">Management Panel</p>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                    active
                      ? 'bg-netflix-red text-white'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                  title={!sidebarOpen ? item.name : ''}
                >
                  <Icon className={`h-6 w-6 flex-shrink-0 ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                  {sidebarOpen && <span className="font-medium">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-3 border-t border-gray-700 space-y-1">
            <Link
              href="/"
              className="flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition"
              title={!sidebarOpen ? 'View Site' : ''}
            >
              <HomeIcon className="h-6 w-6 flex-shrink-0" />
              {sidebarOpen && <span>View Site</span>}
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-400 hover:bg-red-600 hover:text-white transition"
              title={!sidebarOpen ? 'Logout' : ''}
            >
              <ArrowLeftOnRectangleIcon className="h-6 w-6 flex-shrink-0" />
              {sidebarOpen && <span>Logout</span>}
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex w-full items-center justify-center px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'
        }`}
      >
        {/* Top Bar */}
        <header className="bg-gray-800 border-b border-gray-700 px-4 lg:px-8 py-4 mt-14 lg:mt-0">
          <div className="flex items-center justify-between">
            {/* Breadcrumbs */}
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/dashboard-nmc-2024" className="text-gray-400 hover:text-white transition">
                    <HomeIcon className="h-5 w-5" />
                  </Link>
                </li>
                {breadcrumbs.map((crumb, index) => (
                  <li key={crumb.href} className="flex items-center space-x-2">
                    <ChevronRightIcon className="h-4 w-4 text-gray-600" />
                    <Link
                      href={crumb.href}
                      className={`text-sm ${
                        crumb.current
                          ? 'text-white font-medium'
                          : 'text-gray-400 hover:text-white'
                      } transition`}
                    >
                      {crumb.name}
                    </Link>
                  </li>
                ))}
              </ol>
            </nav>

            {/* Search */}
            <div className="hidden lg:block">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search content, feeds..."
                  className="w-64 px-4 py-2 pl-10 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red transition"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </form>
            </div>
          </div>

          {/* Mobile Search */}
          {searchOpen && (
            <div className="lg:hidden mt-4">
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-netflix-red"
                  autoFocus
                />
              </form>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
