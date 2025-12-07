/**
 * Quiz Question Component
 * Display question with image support
 */

import React from 'react';

interface QuizQuestionProps {
  question: string;
  questionNumber: number;
  totalQuestions: number;
  imageUrl?: string;
}

/**
 * Quiz question display component
 * @param props - Quiz question props
 */
const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  imageUrl,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      {/* Question Number Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold">
          {questionNumber}
        </span>
        <span className="text-sm text-gray-500">
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>

      {/* Question Text */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {question}
      </h2>

      {/* Question Image (if provided) */}
      {imageUrl && (
        <div className="mt-4 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt="Question"
            className="w-full h-auto max-h-64 object-contain bg-gray-100"
            onError={(e) => {
              // Hide image if it fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;

