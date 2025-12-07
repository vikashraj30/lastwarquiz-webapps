/**
 * Quiz Card Component
 * Display quiz information in a card format
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';
import type { Quiz } from '../../types';
import { getDifficultyColor, getDifficultyName, getCategoryColor, truncateText } from '../../utils/formatters';

interface QuizCardProps {
  quiz: Quiz;
}

/**
 * Quiz card component
 * @param props - Quiz card props
 */
const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const navigate = useNavigate();

  /**
   * Handle start quiz button click
   */
  const handleStartQuiz = () => {
    navigate(`/quiz/${quiz._id}`);
  };

  return (
    <Card hover className="p-6 flex flex-col h-full">
      {/* Featured Badge */}
      {quiz.isFeatured && (
        <div className="mb-3">
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
            ⭐ Featured
          </span>
        </div>
      )}

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {quiz.title}
      </h3>

      {/* Description */}
      {quiz.description && (
        <p className="text-sm text-gray-600 mb-4 flex-1">
          {truncateText(quiz.description, 120)}
        </p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`text-xs font-semibold px-2.5 py-1 rounded ${getCategoryColor(quiz.category)}`}>
          {quiz.category}
        </span>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded ${getDifficultyColor(quiz.difficulty)}`}>
          {getDifficultyName(quiz.difficulty)}
        </span>
      </div>

      {/* Info */}
      <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <span>🪙</span>
          <span className="font-bold text-yellow-700">{quiz.rewardCoins}</span>
        </div>
        {quiz.timeLimit > 0 && (
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{Math.floor(quiz.timeLimit / 60)} mins</span>
          </div>
        )}
        {quiz.totalQuestions && (
          <div className="flex items-center gap-1">
            <span>📝</span>
            <span>{quiz.totalQuestions} questions</span>
          </div>
        )}
      </div>

      {/* Start Button */}
      <Button onClick={handleStartQuiz} variant="primary" fullWidth>
        Start Quiz
      </Button>
    </Card>
  );
};

export default QuizCard;

