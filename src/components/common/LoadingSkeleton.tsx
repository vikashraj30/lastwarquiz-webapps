/**
 * Loading Skeleton Component
 * Skeleton loaders for better UX while loading content
 */

import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'text' | 'card' | 'avatar' | 'image';
  count?: number;
  className?: string;
}

/**
 * Loading skeleton component
 * @param props - Loading skeleton props
 */
const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text',
  count = 1,
  className = '',
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const variants = {
    text: `${baseClasses} h-4 w-full`,
    card: `${baseClasses} h-48 w-full`,
    avatar: `${baseClasses} h-12 w-12 rounded-full`,
    image: `${baseClasses} h-32 w-full`,
  };
  
  const skeletonClass = `${variants[variant]} ${className}`;
  
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={skeletonClass} />
      ))}
    </>
  );
};

/**
 * Quiz Card Skeleton
 */
export const QuizCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-gray-200 rounded w-20" />
        <div className="h-6 bg-gray-200 rounded w-20" />
      </div>
      <div className="h-10 bg-gray-200 rounded w-full" />
    </div>
  );
};

/**
 * Leaderboard Row Skeleton
 */
export const LeaderboardRowSkeleton: React.FC = () => {
  return (
    <div className="flex items-center gap-4 py-3 px-4 animate-pulse">
      <div className="h-8 w-8 bg-gray-200 rounded" />
      <div className="h-10 w-10 bg-gray-200 rounded-full" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-1/4" />
      </div>
      <div className="h-6 bg-gray-200 rounded w-20" />
    </div>
  );
};

export default LoadingSkeleton;

