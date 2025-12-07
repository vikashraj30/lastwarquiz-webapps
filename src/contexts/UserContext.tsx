/**
 * UserContext
 * Manages user data from backend API (coins, level, stats, etc.)
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getUser, getUserStats, type UserData, type UserStats } from '../services/api';

/**
 * UserContext interface
 */
interface UserContextType {
  userData: UserData | null;
  userStats: UserStats | null;
  loading: boolean;
  error: string | null;
  refreshUserData: () => Promise<void>;
  refreshUserStats: () => Promise<void>;
}

/**
 * Create the user context
 */
const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * UserProvider component
 * Fetches and manages user data from backend
 */
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch user data from backend
   */
  const fetchUserData = async () => {
    if (!user) {
      setUserData(null);
      setUserStats(null);
      setLoading(false);
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // Fetch user data (creates user in DB if doesn't exist)
      const userResponse = await getUser();
      if (userResponse.success && userResponse.data) {
        setUserData(userResponse.data);
      }

      // Fetch user stats
      const statsResponse = await getUserStats();
      if (statsResponse.success && statsResponse.data) {
        setUserStats(statsResponse.data);
      }
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      // Only set error if it's a real error, not just backend not running
      const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to fetch user data';
      // Don't show error if backend is just not running (network error)
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error')) {
        console.warn('⚠️ Backend server may not be running. App will continue without backend data.');
        setError(null); // Don't show error for network issues
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh user data
   */
  const refreshUserData = async () => {
    await fetchUserData();
  };

  /**
   * Refresh user stats only
   */
  const refreshUserStats = async () => {
    if (!user) return;

    try {
      const statsResponse = await getUserStats();
      if (statsResponse.success && statsResponse.data) {
        setUserStats(statsResponse.data);
      }
    } catch (err: any) {
      console.error('Error fetching user stats:', err);
    }
  };

  /**
   * Fetch user data when user logs in
   */
  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      // Clear data when user logs out
      setUserData(null);
      setUserStats(null);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // fetchUserData is stable, no need to include in deps

  const value: UserContextType = {
    userData,
    userStats,
    loading,
    error,
    refreshUserData,
    refreshUserStats,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

/**
 * Custom hook to use the user context
 * Must be used within a UserProvider
 */
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

