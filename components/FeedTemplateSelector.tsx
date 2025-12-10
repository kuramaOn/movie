'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { FEED_TEMPLATES, FeedTemplate, getAllCategories } from '@/lib/feedTemplates';

interface FeedTemplateSelectorProps {
  onSelectTemplate: (template: FeedTemplate) => void;
  onClose: () => void;
}

export default function FeedTemplateSelector({ onSelectTemplate, onClose }: FeedTemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...getAllCategories()];

  const filteredTemplates = FEED_TEMPLATES.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = 
      searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-netflix-gray rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Feed Templates</h2>
            <p className="text-gray-400 mt-1">Quick setup for popular feed sources</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-netflix-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-netflix-red"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                    selectedCategory === category
                      ? 'bg-netflix-red text-white'
                      : 'bg-netflix-light-gray text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
          {filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  className="text-left p-6 bg-netflix-light-gray rounded-lg hover:bg-gray-700 transition group border border-transparent hover:border-netflix-red"
                >
                  {/* Icon and Name */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{template.icon}</span>
                      <div>
                        <h3 className="font-bold text-white group-hover:text-netflix-red transition">
                          {template.name}
                        </h3>
                        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded">
                          {template.type.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-300 mb-3">
                    {template.description}
                  </p>

                  {/* Info */}
                  <div className="space-y-2 text-xs text-gray-400">
                    <div className="flex items-center justify-between">
                      <span>Auto-Sync:</span>
                      <span className={template.defaultAutoSync ? 'text-green-500' : 'text-gray-500'}>
                        {template.defaultAutoSync ? `Every ${template.defaultSyncInterval}h` : 'Manual'}
                      </span>
                    </div>
                    {template.requiresApiKey && (
                      <div className="flex items-center justify-between">
                        <span>API Key:</span>
                        <span className="text-yellow-500">Required</span>
                      </div>
                    )}
                  </div>

                  {/* Popular Genres */}
                  {template.popularGenres.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {template.popularGenres.slice(0, 3).map((genre, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Hover Indicator */}
                  <div className="mt-4 text-xs text-netflix-red opacity-0 group-hover:opacity-100 transition">
                    Click to use template →
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">No templates found</p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 bg-netflix-light-gray">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
