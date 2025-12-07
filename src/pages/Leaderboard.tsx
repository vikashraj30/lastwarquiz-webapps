/**
 * Leaderboard Page
 * Display rankings with filters and top 3 podium
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { LeaderboardRowSkeleton } from '../components/common/LoadingSkeleton';
import { getLeaderboard } from '../services/api';
import type { LeaderboardData, LeaderboardEntry } from '../types';

/**
 * Leaderboard page component
 */
const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('weekly');
  const [category, setCategory] = useState<string>('');

  /**
   * Fetch leaderboard data
   */
  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = { timeframe };
      if (category) params.category = category;

      const response = await getLeaderboard(params);

      if (response.success && response.data) {
        setLeaderboardData(response.data);
      } else {
        setError('Failed to load leaderboard');
      }
    } catch (err: any) {
      console.error('Error fetching leaderboard:', err);
      setError(err.message || 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  }, [timeframe, category]);

  /**
   * Fetch leaderboard on mount and when filters change
   */
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  /**
   * Get medal emoji for top 3
   */
  const getMedalEmoji = (rank: number): string => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '';
  };

  /**
   * Get medal color for top 3
   */
  const getMedalColor = (rank: number): string => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return '';
  };

  /**
   * Check if entry is current user
   */
  const isCurrentUser = (entry: LeaderboardEntry): boolean => {
    return entry.userId === user?.uid;
  };

  const top3 = leaderboardData?.leaderboard.slice(0, 3) || [];
  const rest = leaderboardData?.leaderboard.slice(3) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          🏆 Leaderboard
        </h1>
        <p className="text-gray-600">
          Compete with players worldwide and climb to the top!
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Timeframe Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeframe
            </label>
            <div className="flex flex-wrap gap-2">
              {(['daily', 'weekly', 'monthly', 'all-time'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    timeframe === tf
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tf === 'all-time' ? 'All Time' : tf.charAt(0).toUpperCase() + tf.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="general">General</option>
              <option value="sports">Sports</option>
              <option value="science">Science</option>
              <option value="history">History</option>
              <option value="entertainment">Entertainment</option>
              <option value="technology">Technology</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <LeaderboardRowSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium mb-4">{error}</p>
          <Button onClick={fetchLeaderboard} variant="primary">
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && leaderboardData && leaderboardData.leaderboard.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Rankings Yet</h3>
          <p className="text-gray-600">Be the first to complete a quiz!</p>
        </div>
      )}

      {/* Leaderboard Content */}
      {!loading && !error && leaderboardData && leaderboardData.leaderboard.length > 0 && (
        <>
          {/* Top 3 Podium */}
          {top3.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Rank 2 (left) */}
              {top3[1] && (
                <Card className="p-6 text-center mt-8">
                  <div className="text-4xl mb-3">{getMedalEmoji(2)}</div>
                  <div className="text-6xl font-bold text-gray-400 mb-2">#2</div>
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white text-2xl font-bold">
                    {top3[1].displayName.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{top3[1].displayName}</h3>
                  <p className="text-2xl font-bold text-indigo-600 mb-2">
                    {top3[1].totalScore.toLocaleString()}
                  </p>
                  <div className="text-sm text-gray-600">
                    {top3[1].quizzesCompleted} quizzes • {top3[1].accuracy.toFixed(0)}% accuracy
                  </div>
                </Card>
              )}

              {/* Rank 1 (center, elevated) */}
              {top3[0] && (
                <Card className={`p-6 text-center bg-gradient-to-br ${getMedalColor(1)} text-white`}>
                  <div className="text-5xl mb-3">{getMedalEmoji(1)}</div>
                  <div className="text-6xl font-bold mb-2">#1</div>
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-white flex items-center justify-center text-yellow-600 text-3xl font-bold shadow-lg">
                    {top3[0].displayName.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="font-bold text-xl mb-1">{top3[0].displayName}</h3>
                  <p className="text-3xl font-bold mb-2">
                    {top3[0].totalScore.toLocaleString()}
                  </p>
                  <div className="text-sm opacity-90">
                    {top3[0].quizzesCompleted} quizzes • {top3[0].accuracy.toFixed(0)}% accuracy
                  </div>
                </Card>
              )}

              {/* Rank 3 (right) */}
              {top3[2] && (
                <Card className="p-6 text-center mt-8">
                  <div className="text-4xl mb-3">{getMedalEmoji(3)}</div>
                  <div className="text-6xl font-bold text-orange-400 mb-2">#3</div>
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-bold">
                    {top3[2].displayName.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{top3[2].displayName}</h3>
                  <p className="text-2xl font-bold text-indigo-600 mb-2">
                    {top3[2].totalScore.toLocaleString()}
                  </p>
                  <div className="text-sm text-gray-600">
                    {top3[2].quizzesCompleted} quizzes • {top3[2].accuracy.toFixed(0)}% accuracy
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Rest of Leaderboard (Rank 4+) */}
          {rest.length > 0 && (
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Full Rankings</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Rank</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Player</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Score</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Quizzes</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rest.map((entry) => (
                      <tr
                        key={entry.userId}
                        className={`border-b border-gray-100 ${
                          isCurrentUser(entry) ? 'bg-yellow-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <span className="font-bold text-gray-700">#{entry.rank}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                              {entry.displayName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {entry.displayName}
                                {isCurrentUser(entry) && (
                                  <span className="ml-2 text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                                    You
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-indigo-600">
                            {entry.totalScore.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {entry.quizzesCompleted}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {entry.accuracy.toFixed(0)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Your Rank Card (Sticky on mobile) */}
          {leaderboardData.currentUserRank && leaderboardData.currentUserStats && (
            <Card className="p-4 sticky bottom-4 shadow-lg md:relative md:bottom-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    {leaderboardData.currentUserStats.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Your Rank</div>
                    <div className="text-sm text-gray-600">
                      #{leaderboardData.currentUserRank} • {leaderboardData.currentUserStats.totalScore.toLocaleString()} points
                    </div>
                  </div>
                </div>
                {leaderboardData.currentUserRank > 1 && (
                  <div className="text-right">
                    <div className="text-xs text-gray-600">Beat rank #{leaderboardData.currentUserRank - 1}</div>
                    <div className="text-sm font-medium text-indigo-600">to move up!</div>
                  </div>
                )}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Leaderboard;

