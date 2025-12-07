/**
 * Profile Page
 * User profile with stats, history, and settings
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getUserScores, updateProfile } from '../services/api';
import { formatDate, formatRelativeTime, calculateLevel, calculateLevelProgress } from '../utils/formatters';
import { validateDisplayName } from '../utils/validators';
import type { Score } from '../types';

/**
 * Profile page component
 */
const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { userData, userStats, loading: userLoading, refreshUserData } = useUser();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [quizHistory, setQuizHistory] = useState<Score[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  /**
   * Load quiz history
   */
  const loadQuizHistory = async () => {
    if (quizHistory.length > 0) {
      setShowHistory(true);
      return;
    }

    setHistoryLoading(true);
    try {
      const response = await getUserScores({ limit: 10 });
      if (response.success && response.data) {
        setQuizHistory(response.data.scores);
        setShowHistory(true);
      }
    } catch (error) {
      console.error('Error loading quiz history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  /**
   * Handle save display name
   */
  const handleSaveDisplayName = async () => {
    const validation = validateDisplayName(displayName);
    if (!validation.isValid) {
      alert(validation.error);
      return;
    }

    setSaving(true);
    try {
      const response = await updateProfile(displayName);
      if (response.success) {
        await refreshUserData();
        setEditMode(false);
        alert('Display name updated successfully!');
      } else {
        alert('Failed to update display name');
      }
    } catch (error: any) {
      console.error('Error updating display name:', error);
      alert(error.message || 'Failed to update display name');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  /**
   * Calculate level info
   */
  const level = userData ? calculateLevel(userData.totalScore) : 1;
  const levelProgress = userData ? calculateLevelProgress(userData.totalScore) : { currentXP: 0, requiredXP: 1000, progress: 0 };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <Card className="p-8 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-indigo-500"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            {editMode ? (
              <div className="mb-4">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="text-2xl font-bold border-b-2 border-indigo-500 focus:outline-none"
                  placeholder="Enter display name"
                />
              </div>
            ) : (
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {userData?.displayName || user?.displayName || 'User'}
              </h1>
            )}
            <p className="text-gray-600 mb-2">{user?.email}</p>
            <p className="text-sm text-gray-500">
              Member since {formatDate(user?.metadata.creationTime)}
            </p>

            {/* Edit/Save Buttons */}
            <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
              {editMode ? (
                <>
                  <Button onClick={handleSaveDisplayName} variant="primary" size="sm" disabled={saving}>
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button onClick={() => setEditMode(false)} variant="outline" size="sm">
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditMode(true)} variant="outline" size="sm">
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Premium Status */}
          {userData?.isPremium && (
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg text-center">
                <div className="text-2xl mb-1">⭐</div>
                <div className="font-bold text-sm">Premium</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-6 text-center">
          <div className="text-yellow-600 text-3xl mb-2">🪙</div>
          <div className="text-3xl font-bold text-gray-900">
            {userData?.coins?.toLocaleString() || 0}
          </div>
          <div className="text-sm text-gray-600">Coins</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-purple-600 text-3xl mb-2">⭐</div>
          <div className="text-3xl font-bold text-gray-900">
            {level}
          </div>
          <div className="text-sm text-gray-600">Level</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-blue-600 text-3xl mb-2">📝</div>
          <div className="text-3xl font-bold text-gray-900">
            {userStats?.totalQuizzesAttempted || 0}
          </div>
          <div className="text-sm text-gray-600">Quizzes</div>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-green-600 text-3xl mb-2">📊</div>
          <div className="text-3xl font-bold text-gray-900">
            {userStats?.averageScore?.toFixed(0) || 0}%
          </div>
          <div className="text-sm text-gray-600">Avg Score</div>
        </Card>
      </div>

      {/* Level Progress */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Level Progress</h2>
        <div className="flex items-center gap-4 mb-2">
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${levelProgress.progress}%` }}
              />
            </div>
          </div>
          <div className="flex-shrink-0 text-sm font-medium text-gray-700">
            Level {level}
          </div>
        </div>
        <p className="text-sm text-gray-600 text-center">
          {levelProgress.currentXP} / {levelProgress.requiredXP} XP to next level
        </p>
      </Card>

      {/* Detailed Stats */}
      {userStats && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Total Score</span>
              <span className="font-bold text-gray-900">{userData?.totalScore?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Accuracy</span>
              <span className="font-bold text-gray-900">{userStats.accuracy?.toFixed(1) || 0}%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Total Coins Earned</span>
              <span className="font-bold text-yellow-700">{userStats.totalCoinsEarned?.toLocaleString() || 0} 🪙</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Current Streak</span>
              <span className="font-bold text-orange-600">{userStats.currentStreak || 0} 🔥</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Global Rank</span>
              <span className="font-bold text-indigo-600">#{userStats.rank || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Quizzes Completed</span>
              <span className="font-bold text-gray-900">{userStats.totalQuizzesAttempted || 0}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Quiz History */}
      <Card className="p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Quiz History</h2>
          <Button onClick={loadQuizHistory} variant="outline" size="sm" disabled={historyLoading}>
            {historyLoading ? 'Loading...' : showHistory ? 'Refresh' : 'View History'}
          </Button>
        </div>

        {showHistory && quizHistory.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-2 text-sm font-semibold text-gray-700">Quiz</th>
                  <th className="text-left py-2 px-2 text-sm font-semibold text-gray-700">Score</th>
                  <th className="text-left py-2 px-2 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-left py-2 px-2 text-sm font-semibold text-gray-700">Coins</th>
                </tr>
              </thead>
              <tbody>
                {quizHistory.map((score) => (
                  <tr key={score._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <div className="font-medium text-gray-900">{score.quizId.title}</div>
                      <div className="text-xs text-gray-500">{score.quizId.category}</div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-bold text-indigo-600">
                        {score.correctAnswers}/{score.totalQuestions}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-600">
                      {formatRelativeTime(score.createdAt)}
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-bold text-yellow-700">+{score.coinsEarned} 🪙</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showHistory && quizHistory.length === 0 && (
          <p className="text-center text-gray-600 py-8">
            No quiz history yet. Start taking quizzes to see your history!
          </p>
        )}
      </Card>

      {/* Settings */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Settings</h2>
        <div className="space-y-3">
          <Button onClick={() => setShowLogoutConfirm(true)} variant="danger" fullWidth>
            Logout
          </Button>
        </div>
      </Card>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title="Logout"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to logout?
        </p>
        <div className="flex gap-4">
          <Button onClick={() => setShowLogoutConfirm(false)} variant="outline" fullWidth>
            Cancel
          </Button>
          <Button onClick={handleLogout} variant="danger" fullWidth>
            Logout
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;

