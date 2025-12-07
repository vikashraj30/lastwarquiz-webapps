/**
 * Level Progress Component
 * Display level with progress bar
 */

import React from 'react';
import { calculateLevel, calculateLevelProgress } from '../../utils/formatters';

interface LevelProgressProps {
  totalScore: number;
  showDetails?: boolean;
}

/**
 * Level progress component
 * @param props - Level progress props
 */
const LevelProgress: React.FC<LevelProgressProps> = ({
  totalScore,
  showDetails = true,
}) => {
  const level = calculateLevel(totalScore);
  const { currentXP, requiredXP, progress } = calculateLevelProgress(totalScore);

  return (
    <div className="space-y-2">
      {/* Level Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <span className="text-xl font-bold text-purple-600">
            Level {level}
          </span>
        </div>
        {showDetails && (
          <span className="text-sm text-gray-600">
            {currentXP} / {requiredXP} XP
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          >
            {/* Shine effect */}
            <div className="h-full w-full rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
          </div>
        </div>
        
        {/* Progress Percentage */}
        {progress > 10 && (
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow">
            {progress.toFixed(0)}%
          </span>
        )}
      </div>

      {/* XP to Next Level */}
      {showDetails && (
        <p className="text-xs text-gray-500 text-center">
          {requiredXP - currentXP} XP to Level {level + 1}
        </p>
      )}
    </div>
  );
};

export default LevelProgress;

