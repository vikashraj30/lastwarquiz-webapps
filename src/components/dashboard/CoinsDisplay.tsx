/**
 * Coins Display Component
 * Animated coin counter for header
 */

import React, { useEffect, useState } from 'react';

interface CoinsDisplayProps {
  coins: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Coins display component with animation
 * @param props - Coins display props
 */
const CoinsDisplay: React.FC<CoinsDisplayProps> = ({
  coins,
  showLabel = false,
  size = 'md',
}) => {
  const [displayCoins, setDisplayCoins] = useState(coins);

  /**
   * Animate coin counter
   */
  useEffect(() => {
    if (displayCoins === coins) return;

    const difference = coins - displayCoins;
    const steps = 20;
    const increment = difference / steps;
    const duration = 1000; // 1 second
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep === steps) {
        setDisplayCoins(coins);
        clearInterval(interval);
      } else {
        setDisplayCoins((prev) => Math.round(prev + increment));
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [coins, displayCoins]);

  // Size classes
  const sizeClasses = {
    sm: {
      container: 'px-2 py-1',
      emoji: 'text-lg',
      number: 'text-sm',
      label: 'text-xs',
    },
    md: {
      container: 'px-3 py-1.5',
      emoji: 'text-2xl',
      number: 'text-base',
      label: 'text-sm',
    },
    lg: {
      container: 'px-4 py-2',
      emoji: 'text-3xl',
      number: 'text-xl',
      label: 'text-base',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className={`inline-flex items-center gap-2 bg-yellow-50 rounded-lg ${classes.container}`}>
      <span className={classes.emoji}>🪙</span>
      <span className={`font-bold text-yellow-700 ${classes.number}`}>
        {displayCoins.toLocaleString()}
      </span>
      {showLabel && (
        <span className={`text-yellow-600 ${classes.label}`}>coins</span>
      )}
    </div>
  );
};

export default CoinsDisplay;

