/**
 * API Service
 * Handles all backend API calls with Firebase token authentication
 */

import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { auth } from '../config/firebase';

/**
 * Get API base URL from environment variable
 * Defaults to localhost for development
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Create axios instance with base configuration
 */
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor - Add Firebase token to all requests
 */
api.interceptors.request.use(
  async (config) => {
    try {
      // Get current user from Firebase
      const user = auth.currentUser;
      
      if (user) {
        // Get Firebase ID token
        const token = await user.getIdToken();
        
        // Add token to Authorization header
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting Firebase token:', error);
      // Continue without token - backend will return 401
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle errors globally
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // Handle 401 Unauthorized - token might be expired
    if (error.response?.status === 401) {
      // Try to refresh token
      const user = auth.currentUser;
      if (user) {
        try {
          // Force token refresh
          await user.getIdToken(true);
          // Retry the original request
          if (error.config) {
            const token = await user.getIdToken();
            error.config.headers.Authorization = `Bearer ${token}`;
            return api.request(error.config);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }
    }
    
    // Return error for other cases
    return Promise.reject(error);
  }
);

/**
 * API Response type
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
  };
  message?: string;
}

/**
 * User API Functions
 */

/**
 * Get current user from backend
 * Creates user in database if doesn't exist
 */
export const getUser = async () => {
  const response = await api.get<ApiResponse<UserData>>('/api/v1/users/me');
  return response.data;
};

/**
 * Update user profile
 */
export const updateProfile = async (displayName: string) => {
  const response = await api.put<ApiResponse<{ displayName: string }>>('/api/v1/users/profile', {
    displayName,
  });
  return response.data;
};

/**
 * Add coins to user account
 */
export const addCoins = async (amount: number, reason?: string) => {
  const response = await api.post<ApiResponse<{ coins: number; added: number }>>('/api/v1/users/coins', {
    amount,
    reason,
  });
  return response.data;
};

/**
 * Get user statistics
 */
export const getUserStats = async () => {
  const response = await api.get<ApiResponse<UserStats>>('/api/v1/users/stats');
  return response.data;
};

/**
 * Purchase premium subscription
 */
export const purchasePremium = async (durationMonths: number = 1) => {
  const response = await api.post<ApiResponse<{ isPremium: boolean; premiumExpiryDate: Date }>>('/api/v1/users/premium', {
    durationMonths,
  });
  return response.data;
};

/**
 * Unlock difficulty level with coins (200 coins)
 */
export const unlockDifficulty = async (difficulty: string) => {
  const response = await api.post<ApiResponse<{ unlockedDifficulties: string[]; coins: number; coinsSpent: number }>>('/api/v1/users/unlock-difficulty', {
    difficulty,
  });
  return response.data;
};

/**
 * Get all active difficulty levels (public endpoint)
 * Note: Uses api instance but auth is optional (interceptor handles no user gracefully)
 */
export const getDifficultyLevels = async () => {
  const response = await api.get<ApiResponse<{ difficultyLevels: DifficultyLevel[]; count: number }>>(
    '/api/v1/difficulty-levels'
  );
  return response.data;
};

/**
 * Quiz API Functions
 */

/**
 * Get all quizzes with optional filters
 */
export const getQuizzes = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  difficulty?: string;
  featured?: boolean;
}) => {
  const response = await api.get<ApiResponse<{ quizzes: Quiz[]; pagination: Pagination; unlockedDifficulties?: string[] }>>('/api/v1/quizzes', {
    params,
  });
  return response.data;
};

/**
 * Get quiz by ID (without correct answers)
 */
export const getQuizById = async (quizId: string) => {
  const response = await api.get<ApiResponse<QuizDetails>>(`/api/v1/quizzes/${quizId}`);
  return response.data;
};

/**
 * Submit quiz answers and get results
 */
export const submitQuiz = async (quizId: string, answers: Answer[], timeSpent: number) => {
  const response = await api.post<ApiResponse<QuizResult>>(`/api/v1/quizzes/${quizId}/submit`, {
    answers,
    timeSpent,
  });
  return response.data;
};

/**
 * Get featured quizzes
 */
export const getFeaturedQuizzes = async () => {
  const response = await api.get<ApiResponse<{ quizzes: Quiz[]; count: number }>>('/api/v1/quizzes/featured');
  return response.data;
};

/**
 * Get quizzes by category
 */
export const getQuizzesByCategory = async (category: string, params?: { page?: number; limit?: number }) => {
  const response = await api.get<ApiResponse<{ quizzes: Quiz[]; category: string; pagination: Pagination }>>(
    `/api/v1/quizzes/category/${category}`,
    { params }
  );
  return response.data;
};

/**
 * Score API Functions
 */

/**
 * Get user's quiz history
 */
export const getUserScores = async (params?: { page?: number; limit?: number }) => {
  const response = await api.get<ApiResponse<{ scores: Score[]; pagination: Pagination }>>('/api/v1/scores/my-scores', {
    params,
  });
  return response.data;
};

/**
 * Get global leaderboard
 */
export const getLeaderboard = async (params?: { timeframe?: string; category?: string; limit?: number }) => {
  const response = await api.get<ApiResponse<LeaderboardData>>('/api/v1/scores/leaderboard', {
    params,
  });
  return response.data;
};

/**
 * Get quiz-specific leaderboard
 */
export const getQuizLeaderboard = async (quizId: string, limit?: number) => {
  const response = await api.get<ApiResponse<{ quizId: string; leaderboard: QuizLeaderboardEntry[] }>>(
    `/api/v1/scores/quiz/${quizId}/leaderboard`,
    { params: { limit } }
  );
  return response.data;
};

/**
 * Link API Functions
 */

/**
 * Get all active links
 */
export const getLinks = async (category?: string) => {
  const response = await api.get<ApiResponse<{ links: Link[]; count: number }>>('/api/v1/links', {
    params: { category },
  });
  return response.data;
};

/**
 * Get link by ID
 */
export const getLinkById = async (linkId: string) => {
  const response = await api.get<ApiResponse<{ link: Link }>>(`/api/v1/links/${linkId}`);
  return response.data;
};

/**
 * Track link click
 */
export const trackLinkClick = async (linkId: string) => {
  const response = await api.post<ApiResponse<{ clicks: number }>>(`/api/v1/links/${linkId}/click`);
  return response.data;
};

/**
 * Video API Functions
 */

/**
 * Get all active videos
 */
export const getVideos = async (category?: string) => {
  const response = await api.get<ApiResponse<{ videos: Video[]; count: number }>>('/api/v1/videos', {
    params: { category },
  });
  return response.data;
};

/**
 * Get video by ID
 */
export const getVideoById = async (videoId: string) => {
  const response = await api.get<ApiResponse<{ video: Video }>>(`/api/v1/videos/${videoId}`);
  return response.data;
};

/**
 * Track video view
 */
export const trackVideoView = async (videoId: string) => {
  const response = await api.post<ApiResponse<{ views: number }>>(`/api/v1/videos/${videoId}/view`);
  return response.data;
};

/**
 * Type Definitions
 */

export interface DifficultyLevel {
  levelNumber: number;
  name: string;
  displayName: string;
  order: number;
}

export interface UserData {
  id: string;
  firebaseUid: string;
  email: string;
  displayName?: string;
  coins: number;
  level: number;
  totalScore: number;
  unlockedDifficulties: string[];
  isPremium: boolean;
  premiumExpiryDate?: Date;
  appPackage: string;
}

export interface UserStats {
  totalQuizzesAttempted: number;
  averageScore: number;
  totalCorrectAnswers: number;
  totalQuestionsAnswered: number;
  accuracy: number;
  totalCoinsEarned: number;
  currentStreak: number;
  rank: number;
  level: number;
  totalScore: number;
}

export interface Quiz {
  _id: string;
  title: string;
  description?: string;
  category: string;
  difficulty: string; // Dynamic difficulty level
  rewardCoins: number;
  timeLimit: number;
  isFeatured: boolean;
  totalQuestions?: number;
}

export interface QuizDetails extends Quiz {
  questions: {
    question: string;
    options: string[];
  }[];
}

export interface Answer {
  questionIndex: number;
  selectedAnswer: string;
}

export interface QuizResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  coinsEarned: number;
  timeSpent: number;
  answers: {
    questionIndex: number;
    selectedAnswer: string;
    isCorrect: boolean;
    correctAnswer: string;
    explanation?: string;
  }[];
  userStats: {
    coins: number;
    level: number;
    totalScore: number;
  };
}

export interface Score {
  _id: string;
  userId: string;
  quizId: {
    _id: string;
    title: string;
    category: string;
    difficulty: string;
    rewardCoins: number;
  };
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  coinsEarned: number;
  createdAt: string;
}

export interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  timeframe: string;
  category: string;
  currentUserRank: number | null;
  currentUserStats: LeaderboardEntry | null;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  email: string;
  totalScore: number;
  quizzesCompleted: number;
  averageScore: number;
  accuracy: number;
}

export interface QuizLeaderboardEntry {
  rank: number;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  createdAt: string;
  user: {
    displayName: string;
    email: string;
  };
}

export interface Link {
  _id: string;
  title: string;
  url: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  order: number;
  isSponsored: boolean;
  clicks: number;
}

export interface Video {
  _id: string;
  title: string;
  videoUrl: string;
  thumbnail?: string;
  description?: string;
  category?: string;
  duration?: number;
  views: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// Export axios instance for custom requests if needed
export default api;

