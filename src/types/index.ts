/**
 * Type Definitions
 * Centralized TypeScript interfaces and types for the application
 */

// Re-export types from API service
export type {
  UserData,
  UserStats,
  Quiz,
  QuizDetails,
  Answer,
  QuizResult,
  Score,
  LeaderboardData,
  LeaderboardEntry,
  QuizLeaderboardEntry,
  Link,
  Video,
  Pagination,
  ApiResponse,
} from '../services/api';

/**
 * Component Props Types
 */

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  fullWidth?: boolean;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

/**
 * Quiz State Types
 */

import type { Answer } from '../services/api';

export interface QuizState {
  quizId: string;
  currentQuestionIndex: number;
  answers: Answer[];
  timeRemaining: number;
  startTime: number;
}

/**
 * Filter Types
 */

export interface QuizFilters {
  category?: string;
  difficulty?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface LeaderboardFilters {
  timeframe?: 'daily' | 'weekly' | 'monthly' | 'all-time';
  category?: string;
}

