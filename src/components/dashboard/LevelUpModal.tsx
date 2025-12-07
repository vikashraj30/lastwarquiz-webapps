/**
 * Level Up Modal Component
 * Celebration modal when user levels up
 */

import React from 'react';
import Confetti from 'react-confetti';
import Modal from '../common/Modal';
import Button from '../common/Button';

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  newLevel: number;
  windowSize?: { width: number; height: number };
}

/**
 * Level up modal component
 * @param props - Level up modal props
 */
const LevelUpModal: React.FC<LevelUpModalProps> = ({
  isOpen,
  onClose,
  newLevel,
  windowSize = { width: window.innerWidth, height: window.innerHeight },
}) => {
  return (
    <>
      {/* Confetti */}
      {isOpen && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          colors={['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']}
        />
      )}

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <div className="text-center py-8">
          {/* Level Badge */}
          <div className="mb-6 animate-bounce-slow">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-6xl font-bold shadow-2xl">
              {newLevel}
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Level Up!
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            You've reached Level {newLevel}! 🎉
          </p>

          {/* Rewards */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Rewards Unlocked:</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-center gap-2 text-yellow-700">
                <span className="text-2xl">🪙</span>
                <span className="font-semibold">+100 Bonus Coins</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-indigo-700">
                <span className="text-2xl">⭐</span>
                <span className="font-semibold">New Achievement Badge</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-purple-700">
                <span className="text-2xl">🎁</span>
                <span className="font-semibold">Special Perks Unlocked</span>
              </div>
            </div>
          </div>

          {/* Motivational Message */}
          <p className="text-gray-600 mb-6 italic">
            "Keep up the great work! Your knowledge is growing stronger every day."
          </p>

          {/* Continue Button */}
          <Button onClick={onClose} variant="primary" size="lg" fullWidth>
            Continue Playing
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default LevelUpModal;

