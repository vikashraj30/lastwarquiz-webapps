/**
 * Home Dashboard Page
 * Comprehensive dashboard with all features
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import StatsCard from '../components/dashboard/StatsCard';
import LevelProgress from '../components/dashboard/LevelProgress';
import QuizCard from '../components/quiz/QuizCard';
import { QuizCardSkeleton } from '../components/common/LoadingSkeleton';
import { getFeaturedQuizzes, getLinks, getVideos } from '../services/api';
import type { Quiz, Link, Video } from '../types';
import { truncateText } from '../utils/formatters';
import appConfig from '../config/appConfig';

/**
 * Home dashboard page
 */
const Home: React.FC = () => {
  const { user } = useAuth();
  const { userData, userStats } = useUser();
  const navigate = useNavigate();

  const [featuredQuizzes, setFeaturedQuizzes] = useState<Quiz[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch dashboard data
   */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [quizzesRes, linksRes, videosRes] = await Promise.all([
          getFeaturedQuizzes(),
          getLinks(),
          getVideos(),
        ]);

        if (quizzesRes.success && quizzesRes.data) {
          setFeaturedQuizzes(quizzesRes.data.quizzes.slice(0, 3));
        }

        if (linksRes.success && linksRes.data) {
          setLinks(linksRes.data.links.slice(0, 5));
        }

        if (videosRes.success && videosRes.data) {
          setVideos(videosRes.data.videos.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <Card className="p-8 mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-indigo-600 text-3xl font-bold shadow-lg">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
              </div>
            )}
          </div>

          {/* Welcome Text */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {userData?.displayName || user?.displayName || 'Player'}! 👋
            </h1>
            <p className="text-indigo-100 text-lg">
              Ready to test your {appConfig.knowledgeText}?
            </p>
          </div>

          {/* Level Badge */}
          <div className="flex-shrink-0">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center min-w-[120px]">
              <div className="text-4xl mb-2">⭐</div>
              <div className="text-2xl font-bold">Level {userData?.level || 1}</div>
              <div className="text-sm text-indigo-100">Current Level</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          icon="📝"
          value={userStats?.totalQuizzesAttempted || 0}
          label="Quizzes Completed"
          color="indigo"
        />
        <StatsCard
          icon="📊"
          value={`${userStats?.averageScore?.toFixed(0) || 0}%`}
          label="Average Score"
          color="green"
        />
        <StatsCard
          icon="🔥"
          value={userStats?.currentStreak || 0}
          label="Current Streak"
          color="yellow"
        />
        <StatsCard
          icon="🏆"
          value={`#${userStats?.rank || 'N/A'}`}
          label="Global Rank"
          color="purple"
        />
      </div>

      {/* Level Progress */}
      {userData && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Progress</h2>
          <LevelProgress totalScore={userData.totalScore} showDetails />
        </Card>
      )}

      {/* Featured Quizzes */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Featured Quizzes</h2>
          <Button onClick={() => navigate('/quizzes')} variant="outline" size="sm">
            View All
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <QuizCardSkeleton key={i} />
            ))}
          </div>
        ) : featuredQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredQuizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No featured quizzes available</p>
          </Card>
        )}
      </div>

      {/* Quick Access Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card
          hover
          onClick={() => navigate('/quizzes')}
          className="p-6 text-center cursor-pointer"
        >
          <div className="text-5xl mb-3">📝</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">All Quizzes</h3>
          <p className="text-gray-600 text-sm mb-4">
            Browse and play all available quizzes
          </p>
          <Button variant="primary" size="sm" fullWidth>
            Start Playing
          </Button>
        </Card>

        <Card
          hover
          onClick={() => navigate('/leaderboard')}
          className="p-6 text-center cursor-pointer"
        >
          <div className="text-5xl mb-3">🏆</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Leaderboard</h3>
          <p className="text-gray-600 text-sm mb-4">
            See where you rank among players
          </p>
          <Button variant="secondary" size="sm" fullWidth>
            View Rankings
          </Button>
        </Card>

        <Card
          hover
          onClick={() => navigate('/profile')}
          className="p-6 text-center cursor-pointer"
        >
          <div className="text-5xl mb-3">👤</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">My Profile</h3>
          <p className="text-gray-600 text-sm mb-4">
            View your stats and achievements
          </p>
          <Button variant="outline" size="sm" fullWidth>
            Go to Profile
          </Button>
        </Card>
      </div>

      {/* Important Links Section */}
      {links.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Important Links</h2>
            <Button onClick={() => navigate('/links')} variant="outline" size="sm">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {links.map((link) => (
              <Card
                key={link._id}
                hover
                onClick={() => window.open(link.url, '_blank')}
                className="p-4 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🔗</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1">{link.title}</h4>
                    {link.description && (
                      <p className="text-sm text-gray-600">
                        {truncateText(link.description, 80)}
                      </p>
                    )}
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 flex-shrink-0"
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
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Videos Section */}
      {videos.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Educational Videos</h2>
            <Button onClick={() => navigate('/videos')} variant="outline" size="sm">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card
                key={video._id}
                hover
                onClick={() => navigate('/videos')}
                className="cursor-pointer overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative bg-gray-900">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Video';
                      }}
                    />
                  ) : (
                    <div className="w-full h-40 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
                      <span className="text-white text-5xl">▶️</span>
                    </div>
                  )}

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="w-12 h-12 rounded-full bg-white bg-opacity-90 flex items-center justify-center">
                      <svg className="w-6 h-6 text-indigo-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h4 className="font-bold text-gray-900 mb-1 line-clamp-2">
                    {video.title}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {video.views.toLocaleString()} views
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
