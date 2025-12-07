/**
 * Videos Page
 * Display educational videos with player modal
 */

import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getVideos, trackVideoView } from '../services/api';
import type { Video } from '../types';
import { formatDuration } from '../utils/formatters';
import { isYouTubeUrl, extractYouTubeId } from '../utils/validators';

/**
 * Videos page component
 */
const Videos: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  /**
   * Fetch videos
   */
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getVideos(selectedCategory);
        if (response.success && response.data) {
          setVideos(response.data.videos);
        } else {
          setError('Failed to load videos');
        }
      } catch (err: any) {
        console.error('Error fetching videos:', err);
        setError(err.message || 'Failed to load videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [selectedCategory]);

  /**
   * Handle video click
   */
  const handleVideoClick = async (video: Video) => {
    // Track view
    try {
      await trackVideoView(video._id);
      // Update local view count
      setVideos((prev) =>
        prev.map((v) => (v._id === video._id ? { ...v, views: v.views + 1 } : v))
      );
    } catch (error) {
      console.error('Error tracking video view:', error);
    }

    setSelectedVideo(video);
  };

  /**
   * Get unique categories
   */
  const categories = ['All', ...Array.from(new Set(videos.map(v => v.category).filter(Boolean)))];

  /**
   * Render video player
   */
  const renderVideoPlayer = (video: Video) => {
    if (isYouTubeUrl(video.videoUrl)) {
      const videoId = extractYouTubeId(video.videoUrl);
      if (videoId) {
        return (
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }
    }

    // Direct video URL
    return (
      <video
        className="w-full rounded-lg"
        controls
        src={video.videoUrl}
      >
        Your browser does not support the video tag.
      </video>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Educational Videos</h1>
        <p className="text-gray-600">
          Learn from curated video content about Last War
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
          <LoadingSpinner size="lg" text="Loading videos..." />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && videos.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📹</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Videos Found</h3>
          <p className="text-gray-600">
            {selectedCategory ? 'No videos in this category' : 'No videos available at the moment'}
          </p>
        </div>
      )}

      {/* Videos Grid */}
      {!loading && !error && videos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card
              key={video._id}
              hover
              onClick={() => handleVideoClick(video)}
              className="cursor-pointer overflow-hidden"
            >
              {/* Thumbnail */}
              <div className="relative bg-gray-900">
                {video.thumbnail ? (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Video';
                    }}
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
                    <span className="text-white text-6xl">▶️</span>
                  </div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-opacity hover:bg-opacity-40">
                  <div className="w-16 h-16 rounded-full bg-white bg-opacity-90 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-indigo-600 ml-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                </div>

                {/* Duration Badge */}
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(video.duration)}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                  {video.title}
                </h3>

                {video.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {video.description}
                  </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  {video.category && (
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {video.category}
                    </span>
                  )}
                  <span>{video.views.toLocaleString()} views</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Video Player Modal */}
      {selectedVideo && (
        <Modal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          size="xl"
        >
          <div className="space-y-4">
            {renderVideoPlayer(selectedVideo)}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedVideo.title}
              </h2>
              {selectedVideo.description && (
                <p className="text-gray-600 mb-4">{selectedVideo.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {selectedVideo.category && (
                  <span className="bg-gray-100 px-3 py-1 rounded">
                    {selectedVideo.category}
                  </span>
                )}
                <span>{selectedVideo.views.toLocaleString()} views</span>
                {selectedVideo.duration && (
                  <span>{formatDuration(selectedVideo.duration)}</span>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Videos;

