/**
 * Quiz Options Component
 * Answer selection with hover and selected states
 */

import React from 'react';

interface QuizOptionsProps {
  options: string[];
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  disabled?: boolean;
}

/**
 * Quiz options component
 * @param props - Quiz options props
 */
const QuizOptions: React.FC<QuizOptionsProps> = ({
  options,
  selectedAnswer,
  onSelectAnswer,
  disabled = false,
}) => {
  /**
   * Option letters
   */
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const isSelected = selectedAnswer === option;
        const letter = letters[index];

        return (
          <button
            key={index}
            onClick={() => !disabled && onSelectAnswer(option)}
            disabled={disabled}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
              isSelected
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
            } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-4">
              {/* Option Letter */}
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  isSelected
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {letter}
              </div>

              {/* Option Text */}
              <span className={`flex-1 ${isSelected ? 'font-semibold text-indigo-900' : 'text-gray-700'}`}>
                {option}
              </span>

              {/* Selected Indicator */}
              {isSelected && (
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default QuizOptions;

