/**
 * Validation Utilities
 * Input validation and sanitization helpers
 */

/**
 * Validate display name
 * @param name - Display name to validate
 * @returns Object with isValid boolean and error message
 */
export const validateDisplayName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Display name is required' };
  }
  
  if (name.length < 2) {
    return { isValid: false, error: 'Display name must be at least 2 characters' };
  }
  
  if (name.length > 50) {
    return { isValid: false, error: 'Display name must be less than 50 characters' };
  }
  
  // Allow letters, numbers, spaces, and common punctuation
  const validNameRegex = /^[a-zA-Z0-9\s\-_.]+$/;
  if (!validNameRegex.test(name)) {
    return { isValid: false, error: 'Display name contains invalid characters' };
  }
  
  return { isValid: true };
};

/**
 * Validate URL
 * @param url - URL to validate
 * @returns Boolean indicating if URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize search query
 * @param query - Search query to sanitize
 * @returns Sanitized query string
 */
export const sanitizeSearchQuery = (query: string): string => {
  return query.trim().replace(/[<>]/g, '');
};

/**
 * Check if video URL is YouTube
 * @param url - Video URL
 * @returns Boolean indicating if URL is YouTube
 */
export const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

/**
 * Extract YouTube video ID from URL
 * @param url - YouTube URL
 * @returns Video ID or null
 */
export const extractYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Validate quiz answers before submission
 * @param answers - Array of answers
 * @param totalQuestions - Total number of questions
 * @returns Object with isValid boolean and error message
 */
export const validateQuizAnswers = (
  answers: Array<{ questionIndex: number; selectedAnswer: string }>,
  totalQuestions: number
): { isValid: boolean; error?: string } => {
  if (answers.length === 0) {
    return { isValid: false, error: 'No answers provided' };
  }
  
  if (answers.length !== totalQuestions) {
    return { isValid: false, error: 'Please answer all questions' };
  }
  
  // Check for duplicate question indices
  const indices = answers.map(a => a.questionIndex);
  const uniqueIndices = new Set(indices);
  if (uniqueIndices.size !== indices.length) {
    return { isValid: false, error: 'Duplicate answers detected' };
  }
  
  return { isValid: true };
};

