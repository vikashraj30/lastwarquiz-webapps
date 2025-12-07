/**
 * Card Component
 * Reusable card container with optional hover effects
 */

import React from 'react';
import type { CardProps } from '../../types';

/**
 * Card component for content containers
 * @param props - Card props
 */
const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hover = false,
}) => {
  // Base styles
  const baseStyles = 'bg-white rounded-xl shadow-md';
  
  // Hover styles
  const hoverStyles = hover
    ? 'transition-all duration-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer'
    : '';
  
  // Click styles
  const clickStyles = onClick ? 'cursor-pointer' : '';
  
  // Combine all styles
  const cardClasses = `${baseStyles} ${hoverStyles} ${clickStyles} ${className}`;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;

