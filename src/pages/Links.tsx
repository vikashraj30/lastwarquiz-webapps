/**
 * Links Page
 * Display important links with tracking
 */

import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getLinks, trackLinkClick } from '../services/api';
import type { Link } from '../types';

/**
 * Links page component
 */
const Links: React.FC = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  /**
   * Fetch links
   */
  useEffect(() => {
    const fetchLinks = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getLinks(selectedCategory);
        if (response.success && response.data) {
          setLinks(response.data.links);
        } else {
          setError('Failed to load links');
        }
      } catch (err: any) {
        console.error('Error fetching links:', err);
        setError(err.message || 'Failed to load links');
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [selectedCategory]);

  /**
   * Handle link click
   */
  const handleLinkClick = async (link: Link) => {
    // Track click
    try {
      await trackLinkClick(link._id);
    } catch (error) {
      console.error('Error tracking link click:', error);
    }

    // Open link in new tab
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  /**
   * Get unique categories
   */
  const categories = ['All', ...Array.from(new Set(links.map(l => l.category).filter(Boolean)))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Important Links</h1>
        <p className="text-gray-600">
          Curated resources and useful links for Last War players
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === 'All' ? '' : category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                (category === 'All' && !selectedCategory) || selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" text="Loading links..." />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && links.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🔗</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Links Found</h3>
          <p className="text-gray-600">
            {selectedCategory ? 'No links in this category' : 'No links available at the moment'}
          </p>
        </div>
      )}

      {/* Links Grid */}
      {!loading && !error && links.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map((link) => (
            <Card
              key={link._id}
              hover
              onClick={() => handleLinkClick(link)}
              className="p-6 cursor-pointer"
            >
              {/* Sponsored Badge */}
              {link.isSponsored && (
                <div className="mb-3">
                  <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                    ⭐ Sponsored
                  </span>
                </div>
              )}

              {/* Thumbnail */}
              {link.thumbnail && (
                <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={link.thumbnail}
                    alt={link.title}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center justify-between">
                {link.title}
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </h3>

              {/* Description */}
              {link.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {link.description}
                </p>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                {link.category && (
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {link.category}
                  </span>
                )}
                <span>{link.clicks} clicks</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Links;

