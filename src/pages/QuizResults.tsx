/**
 * Quiz Results Page
 * Display quiz results with score, review, and actions
 */

import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { getPerformanceMessage, formatTime } from '../utils/formatters';
import type { QuizResult } from '../types';
import appConfig from '../config/appConfig';

/**
 * Quiz results page component
 */
const QuizResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Get result data from navigation state
  const result = location.state?.result as QuizResult | undefined;

  /**
   * Update window size for confetti
   */
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * Show confetti for high scores
   */
  useEffect(() => {
    if (result) {
      const percentage = (result.correctAnswers / result.totalQuestions) * 100;
      if (percentage >= 90) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }
    }
  }, [result]);

  /**
   * Handle retake quiz
   */
  const handleRetake = () => {
    navigate(`/quiz/${id}`);
  };

  /**
   * Handle view leaderboard
   */
  const handleViewLeaderboard = () => {
    navigate('/leaderboard');
  };

  /**
   * Handle back to home
   */
  const handleBackToHome = () => {
    navigate('/');
  };

  /**
   * Handle share results
   */
  const handleShare = () => {
    if (result) {
      const percentage = ((result.correctAnswers / result.totalQuestions) * 100).toFixed(0);
      const shareText = `I scored ${percentage}% on ${appConfig.appName}! 🎉\nCorrect: ${result.correctAnswers}/${result.totalQuestions}\nCoins earned: ${result.coinsEarned} 🪙`;
      
      navigator.clipboard.writeText(shareText);
      alert('Results copied to clipboard!');
    }
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
          <p className="text-gray-600 mb-6">
            Please complete a quiz to see your results
          </p>
          <Button onClick={() => navigate('/quizzes')} variant="primary">
            Browse Quizzes
          </Button>
        </div>
      </div>
    );
  }

  const percentage = (result.correctAnswers / result.totalQuestions) * 100;
  const performanceMessage = getPerformanceMessage(percentage);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {/* Score Summary Card */}
      <Card className="p-8 mb-6 text-center animate-slideUp">
        <div className="text-6xl mb-4 animate-bounce-slow">
          {percentage >= 90 ? '🎉' : percentage >= 70 ? '👏' : percentage >= 50 ? '👍' : '💪'}
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {performanceMessage}
        </h1>
        
        <div className="text-6xl font-bold text-indigo-600 mb-2">
          {percentage.toFixed(0)}%
        </div>
        
        <p className="text-xl text-gray-600 mb-6">
          {result.correctAnswers} out of {result.totalQuestions} correct
        </p>

        {/* Coins Earned */}
        <div className="inline-flex items-center gap-2 bg-yellow-50 px-6 py-3 rounded-full">
          <span className="text-3xl">🪙</span>
          <span className="text-2xl font-bold text-yellow-700">
            +{result.coinsEarned}
          </span>
          <span className="text-sm text-yellow-600">coins earned</span>
        </div>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center">
          <div className="text-green-600 text-3xl mb-2">✓</div>
          <div className="text-2xl font-bold text-gray-900">
            {result.correctAnswers}
          </div>
          <div className="text-sm text-gray-600">Correct</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-red-600 text-3xl mb-2">✗</div>
          <div className="text-2xl font-bold text-gray-900">
            {result.totalQuestions - result.correctAnswers}
          </div>
          <div className="text-sm text-gray-600">Wrong</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-blue-600 text-3xl mb-2">⏱️</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatTime(result.timeSpent)}
          </div>
          <div className="text-sm text-gray-600">Time</div>
        </Card>

        <Card className="p-4 text-center">
          <div className="text-yellow-600 text-3xl mb-2">🪙</div>
          <div className="text-2xl font-bold text-gray-900">
            {result.coinsEarned}
          </div>
          <div className="text-sm text-gray-600">Coins</div>
        </Card>
      </div>

      {/* Question Review */}
      <Card className="p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Question Review
        </h2>

        <div className="space-y-4">
          {result.answers.map((answer, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                answer.isCorrect
                  ? 'border-green-200 bg-green-50'
                  : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start gap-3 mb-2">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                    answer.isCorrect ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-2">
                    Question {index + 1}
                  </p>
                  
                  <div className="mb-2">
                    <span className="text-sm text-gray-600">Your answer: </span>
                    <span className={`font-semibold ${answer.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                      {answer.selectedAnswer}
                    </span>
                  </div>

                  {!answer.isCorrect && (
                    <div className="mb-2">
                      <span className="text-sm text-gray-600">Correct answer: </span>
                      <span className="font-semibold text-green-700">
                        {answer.correctAnswer}
                      </span>
                    </div>
                  )}

                  {answer.explanation && (
                    <details className="mt-2">
                      <summary className="text-sm text-indigo-600 cursor-pointer hover:text-indigo-700">
                        Show explanation
                      </summary>
                      <p className="mt-2 text-sm text-gray-600 pl-4 border-l-2 border-indigo-200">
                        {answer.explanation}
                      </p>
                    </details>
                  )}
                </div>

                <div className="flex-shrink-0 text-2xl">
                  {answer.isCorrect ? '✓' : '✗'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button onClick={handleRetake} variant="primary" fullWidth>
          Retake Quiz
        </Button>
        <Button onClick={handleViewLeaderboard} variant="secondary" fullWidth>
          Leaderboard
        </Button>
        <Button onClick={handleBackToHome} variant="outline" fullWidth>
          Back to Home
        </Button>
        <Button onClick={handleShare} variant="outline" fullWidth>
          Share Results
        </Button>
      </div>

      {/* Level Progress (if available) */}
      {result.userStats && (
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-indigo-600 font-bold text-2xl">
                Level {result.userStats.level}
              </div>
              <div className="text-sm text-gray-600">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-600 font-bold text-2xl">
                {result.userStats.coins.toLocaleString()} 🪙
              </div>
              <div className="text-sm text-gray-600">Total Coins</div>
            </div>
            <div className="text-center">
              <div className="text-purple-600 font-bold text-2xl">
                {result.userStats.totalScore.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Score</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default QuizResults;

