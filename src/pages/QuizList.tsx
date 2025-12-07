/**
 * Quiz List Page
 * Display all quizzes with filters, search, and pagination
 */

import React, { useState, useEffect, useCallback } from 'react';
import QuizCard from '../components/quiz/QuizCard';
import { QuizCardSkeleton } from '../components/common/LoadingSkeleton';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { getQuizzes, unlockDifficulty } from '../services/api';
import { useUser } from '../contexts/UserContext';
import type { Quiz, QuizFilters } from '../types';
import { sanitizeSearchQuery } from '../utils/validators';
import { getDifficultyName } from '../utils/formatters';
import appConfig from '../config/appConfig';

/**
 * Quiz list page component
 */
const QuizList: React.FC = () => {
  const { userData, refreshUserData } = useUser();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unlockedDifficulties, setUnlockedDifficulties] = useState<string[]>(['level1']);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [unlocking, setUnlocking] = useState<boolean>(false);
  const [filters, setFilters] = useState<QuizFilters>({
    category: '',
    difficulty: '',
    search: '',
    page: 1,
    limit: 12,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 1,
  });

  const difficultyLevels = ['level1', 'level2', 'level3', 'level4', 'level5', 'level6', 'level7', 'level8', 'level9', 'level10'];

  /**
   * Fetch quizzes with current filters
   */
  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {
        page: filters.page,
        limit: filters.limit,
      };

      if (filters.category) params.category = filters.category;
      if (filters.difficulty) params.difficulty = filters.difficulty;
      if (filters.search) params.search = sanitizeSearchQuery(filters.search);

      const response = await getQuizzes(params);

      if (response.success && response.data) {
        setQuizzes(response.data.quizzes);
        setPagination(response.data.pagination);
        if (response.data.unlockedDifficulties) {
          setUnlockedDifficulties(response.data.unlockedDifficulties);
        }
      } else {
        setError('Failed to load quizzes');
      }
    } catch (err: any) {
      console.error('Error fetching quizzes:', err);
      setError(err.message || 'Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * Fetch quizzes on mount and when filters change
   */
  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  /**
   * Handle filter change
   */
  const handleFilterChange = (key: keyof QuizFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to page 1 when filters change
    }));
  };

  /**
   * Handle page change
   */
  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Clear all filters
   */
  const clearFilters = () => {
    setFilters({
      category: '',
      difficulty: '',
      search: '',
      page: 1,
      limit: 12,
    });
  };

  /**
   * Check if any filters are active
   */
  const hasActiveFilters = filters.category || filters.difficulty || filters.search;

  /**
   * Handle unlock difficulty
   */
  const handleUnlockDifficulty = async () => {
    if (!selectedDifficulty) return;

    setUnlocking(true);
    try {
      const response = await unlockDifficulty(selectedDifficulty);
      if (response.success && response.data) {
        setUnlockedDifficulties(response.data.unlockedDifficulties);
        await refreshUserData();
        setUnlockModalOpen(false);
        setSelectedDifficulty('');
      }
    } catch (err: any) {
      alert(err.response?.data?.error?.message || err.message || 'Failed to unlock difficulty');
    } finally {
      setUnlocking(false);
    }
  };

  /**
   * Open unlock modal
   */
  const openUnlockModal = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    setUnlockModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Quizzes</h1>
        <p className="text-gray-600">
          Test your {appConfig.knowledgeText} with our collection of quizzes
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search quizzes..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
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

          {/* Difficulty Filter - Grid of 10 levels */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <div className="grid grid-cols-5 gap-2">
              {difficultyLevels.map((level) => {
                const isUnlocked = unlockedDifficulties.includes(level);
                const isSelected = filters.difficulty === level;
                const levelNum = parseInt(level.replace('level', ''));
                const previousLevel = levelNum > 1 ? `level${levelNum - 1}` : null;
                const canUnlock = previousLevel ? unlockedDifficulties.includes(previousLevel) : true;

                return (
                  <button
                    key={level}
                    onClick={() => {
                      if (isUnlocked) {
                        handleFilterChange('difficulty', isSelected ? '' : level);
                      } else if (canUnlock) {
                        openUnlockModal(level);
                      }
                    }}
                    disabled={!isUnlocked && !canUnlock}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : isUnlocked
                        ? 'bg-white border-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50'
                        : canUnlock
                        ? 'bg-gray-100 border-2 border-gray-300 text-gray-600 hover:bg-gray-200'
                        : 'bg-gray-50 border-2 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                    }`}
                    title={
                      !isUnlocked && !canUnlock
                        ? 'Complete previous level first'
                        : !isUnlocked && canUnlock
                        ? 'Click to unlock with 200 coins'
                        : isSelected
                        ? 'Click to deselect'
                        : 'Click to filter'
                    }
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span>{levelNum}</span>
                      {!isUnlocked && canUnlock && (
                        <span className="text-xs">🔓</span>
                      )}
                      {!isUnlocked && !canUnlock && (
                        <span className="text-xs">🔒</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            {filters.difficulty && (
              <button
                onClick={() => handleFilterChange('difficulty', '')}
                className="mt-2 text-xs text-indigo-600 hover:text-indigo-800"
              >
                Clear difficulty filter
              </button>
            )}
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="mt-4">
            <Button onClick={clearFilters} variant="outline" size="sm">
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600">
        {!loading && (
          <p>
            Showing {quizzes.length} of {pagination.total} quiz{pagination.total !== 1 ? 'zes' : ''}
          </p>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <QuizCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium mb-4">{error}</p>
          <Button onClick={fetchQuizzes} variant="primary">
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && quizzes.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Quizzes Found</h3>
          <p className="text-gray-600 mb-4">
            {hasActiveFilters
              ? 'Try adjusting your filters to find more quizzes'
              : 'No quizzes are available at the moment'}
          </p>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="primary">
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Quiz Grid */}
      {!loading && !error && quizzes.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {/* Previous Button */}
              <Button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                variant="outline"
              >
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                  let pageNum;
                  if (pagination.pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.pages - 2) {
                    pageNum = pagination.pages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        pagination.page === pageNum
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <Button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}

          {/* Page Info */}
          <div className="mt-4 text-center text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages}
          </div>
        </>
      )}

      {/* Unlock Difficulty Modal */}
      <Modal
        isOpen={unlockModalOpen}
        onClose={() => {
          setUnlockModalOpen(false);
          setSelectedDifficulty('');
        }}
        title={`Unlock ${getDifficultyName(selectedDifficulty)}`}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Unlock {getDifficultyName(selectedDifficulty)} for <strong>200 coins</strong>?
          </p>
          <p className="text-sm text-gray-500">
            You currently have <strong>{userData?.coins || 0} coins</strong>
          </p>
          {userData && userData.coins < 200 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                ⚠️ Insufficient coins. You need {200 - userData.coins} more coins to unlock this level.
              </p>
            </div>
          )}
          <div className="flex gap-4">
            <Button
              onClick={() => {
                setUnlockModalOpen(false);
                setSelectedDifficulty('');
              }}
              variant="outline"
              fullWidth
              disabled={Boolean(unlocking)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUnlockDifficulty}
              variant="primary"
              fullWidth
              disabled={Boolean(unlocking || (userData && userData.coins < 200))}
            >
              {unlocking ? 'Unlocking...' : 'Unlock (200 🪙)'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuizList;

