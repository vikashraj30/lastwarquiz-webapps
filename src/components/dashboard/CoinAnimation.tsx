/**
 * Coin Animation Component
 * Floating "+X coins" animation
 */

import React, { useEffect, useState } from 'react';

interface CoinAnimationProps {
  amount: number;
  onComplete?: () => void;
}

/**
 * Coin animation component
 * @param props - Coin animation props
 */
const CoinAnimation: React.FC<CoinAnimationProps> = ({ amount, onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after animation
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
      <div className="animate-slideUp">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 text-2xl font-bold">
          <span className="text-3xl">🪙</span>
          <span>+{amount}</span>
        </div>
      </div>
    </div>
  );
};

export default CoinAnimation;

