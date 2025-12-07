/**
 * Utility Functions for Formatting
 * Date, number, and text formatting helpers
 */

/**
 * Format date to readable string
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param date - Date string or Date object
 * @returns Relative time string
 */
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(dateObj);
};

/**
 * Format number with commas
 * @param num - Number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number | undefined): string => {
  if (num === undefined || num === null) return '0';
  return num.toLocaleString();
};

/**
 * Format time in seconds to MM:SS
 * @param seconds - Time in seconds
 * @returns Formatted time string
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format video duration
 * @param seconds - Duration in seconds
 * @returns Formatted duration string (e.g., "5:32")
 */
export const formatDuration = (seconds: number | undefined): string => {
  if (!seconds) return '0:00';
  return formatTime(seconds);
};

/**
 * Truncate text with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Calculate level from total score
 * @param totalScore - User's total score
 * @returns Current level
 */
export const calculateLevel = (totalScore: number): number => {
  return Math.floor(totalScore / 1000) + 1;
};

/**
 * Calculate XP progress to next level
 * @param totalScore - User's total score
 * @returns Object with current XP, required XP, and progress percentage
 */
export const calculateLevelProgress = (totalScore: number): {
  currentXP: number;
  requiredXP: number;
  progress: number;
} => {
  const currentXP = totalScore % 1000;
  const requiredXP = 1000;
  const progress = (currentXP / requiredXP) * 100;
  
  return { currentXP, requiredXP, progress };
};

/**
 * Get performance message based on score percentage
 * @param percentage - Score percentage (0-100)
 * @returns Performance message with emoji
 */
export const getPerformanceMessage = (percentage: number): string => {
  if (percentage >= 90) return "Excellent! 🎉";
  if (percentage >= 70) return "Great Job! 👏";
  if (percentage >= 50) return "Good Effort! 👍";
  return "Keep Practicing! 💪";
};

/**
 * Get difficulty badge color
 * @param difficulty - Quiz difficulty (level1-level10)
 * @returns Tailwind color classes
 */
export const getDifficultyColor = (difficulty: string): string => {
  const level = parseInt(difficulty.replace('level', ''));
  if (level <= 3) return 'bg-green-100 text-green-800';
  if (level <= 6) return 'bg-yellow-100 text-yellow-800';
  if (level <= 8) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
};

/**
 * Get difficulty display name
 * @param difficulty - Quiz difficulty (level1-level10)
 * @returns Display name
 */
export const getDifficultyName = (difficulty: string): string => {
  const level = parseInt(difficulty.replace('level', ''));
  return `Level ${level}`;
};

/**
 * Get category badge color
 * @param category - Quiz category
 * @returns Tailwind color classes
 */
export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    general: 'bg-blue-100 text-blue-800',
    sports: 'bg-green-100 text-green-800',
    science: 'bg-purple-100 text-purple-800',
    history: 'bg-yellow-100 text-yellow-800',
    entertainment: 'bg-pink-100 text-pink-800',
    technology: 'bg-indigo-100 text-indigo-800',
  };
  
  return colors[category.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

