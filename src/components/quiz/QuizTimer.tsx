/**
 * Quiz Timer Component
 * Circular countdown timer with color changes
 */

import React, { useEffect, useState } from 'react';

interface QuizTimerProps {
  timeLimit: number; // Time limit in seconds
  onTimeUp: () => void;
  isPaused?: boolean;
}

/**
 * Quiz timer component with circular progress
 * @param props - Quiz timer props
 */
const QuizTimer: React.FC<QuizTimerProps> = ({
  timeLimit,
  onTimeUp,
  isPaused = false,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);

  /**
   * Countdown timer
   */
  useEffect(() => {
    if (isPaused || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeRemaining, onTimeUp]);

  /**
   * Calculate progress percentage
   */
  const progress = (timeRemaining / timeLimit) * 100;

  /**
   * Get color based on remaining time
   */
  const getColor = () => {
    if (progress > 50) return 'text-green-600';
    if (progress > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  /**
   * Get stroke color based on remaining time
   */
  const getStrokeColor = () => {
    if (progress > 50) return '#10b981'; // green
    if (progress > 25) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  /**
   * Format time as MM:SS
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Circle properties
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      {/* Circular Timer */}
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke={getStrokeColor()}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        {/* Time display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${getColor()}`}>
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>

      {/* Warning text */}
      {timeRemaining <= 30 && timeRemaining > 0 && (
        <p className="mt-2 text-sm text-red-600 font-medium animate-pulse">
          Hurry up!
        </p>
      )}
    </div>
  );
};

export default QuizTimer;

