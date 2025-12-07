/**
 * Quiz Play Page
 * Main quiz playing interface with timer and questions
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizOptions from '../components/quiz/QuizOptions';
import QuizTimer from '../components/quiz/QuizTimer';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import { getQuizById, submitQuiz } from '../services/api';
import type { QuizDetails, Answer, QuizResult } from '../types';

/**
 * Quiz play page component
 */
const QuizPlay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<QuizDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [startTime] = useState(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  /**
   * Fetch quiz data
   */
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) {
        setError('Quiz ID is missing');
        setLoading(false);
        return;
      }

      try {
        const response = await getQuizById(id);
        if (response.success && response.data) {
          setQuiz(response.data);
          // Load saved progress from localStorage
          const savedProgress = localStorage.getItem(`quiz_progress_${id}`);
          if (savedProgress) {
            const { answers: savedAnswers, questionIndex } = JSON.parse(savedProgress);
            setAnswers(savedAnswers);
            setCurrentQuestionIndex(questionIndex);
          }
        } else {
          setError('Failed to load quiz');
        }
      } catch (err: any) {
        console.error('Error fetching quiz:', err);
        setError(err.message || 'Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  /**
   * Save progress to localStorage
   */
  useEffect(() => {
    if (quiz && answers.length > 0) {
      localStorage.setItem(
        `quiz_progress_${id}`,
        JSON.stringify({ answers, questionIndex: currentQuestionIndex })
      );
    }
  }, [answers, currentQuestionIndex, id, quiz]);

  /**
   * Handle answer selection
   */
  const handleSelectAnswer = useCallback((selectedAnswer: string) => {
    setAnswers((prev) => {
      const existing = prev.findIndex((a) => a.questionIndex === currentQuestionIndex);
      if (existing >= 0) {
        // Update existing answer
        const updated = [...prev];
        updated[existing] = { questionIndex: currentQuestionIndex, selectedAnswer };
        return updated;
      } else {
        // Add new answer
        return [...prev, { questionIndex: currentQuestionIndex, selectedAnswer }];
      }
    });
  }, [currentQuestionIndex]);

  /**
   * Handle next question
   */
  const handleNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  /**
   * Handle previous question
   */
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  /**
   * Handle quiz submission
   */
  const handleSubmit = async () => {
    if (!quiz || !id) return;

    // Check if all questions are answered
    if (answers.length < quiz.questions.length) {
      alert('Please answer all questions before submitting');
      return;
    }

    setSubmitting(true);

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      const response = await submitQuiz(id, answers, timeSpent);

      if (response.success && response.data) {
        // Clear saved progress
        localStorage.removeItem(`quiz_progress_${id}`);
        // Navigate to results page with data
        navigate(`/quiz/${id}/results`, { state: { result: response.data } });
      } else {
        setError('Failed to submit quiz');
      }
    } catch (err: any) {
      console.error('Error submitting quiz:', err);
      setError(err.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle time up
   */
  const handleTimeUp = () => {
    alert('Time is up! Submitting your answers...');
    handleSubmit();
  };

  /**
   * Handle exit confirmation
   */
  const handleExit = () => {
    navigate('/quizzes');
  };

  /**
   * Get current answer
   */
  const currentAnswer = answers.find((a) => a.questionIndex === currentQuestionIndex);

  /**
   * Calculate progress percentage
   */
  const progressPercentage = quiz
    ? ((currentQuestionIndex + 1) / quiz.questions.length) * 100
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="xl" text="Loading quiz..." />
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error || 'Quiz not found'}</p>
          <Button onClick={() => navigate('/quizzes')} variant="primary">
            Back to Quizzes
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Quiz Header */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
          <Button onClick={() => setShowExitConfirm(true)} variant="ghost" size="sm">
            Exit
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>
              {currentQuestionIndex + 1} / {quiz.questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Timer */}
        {quiz.timeLimit > 0 && (
          <div className="flex justify-center">
            <QuizTimer
              timeLimit={quiz.timeLimit}
              onTimeUp={handleTimeUp}
              isPaused={submitting}
            />
          </div>
        )}
      </div>

      {/* Question */}
      <QuizQuestion
        question={currentQuestion.question}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={quiz.questions.length}
      />

      {/* Options */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select your answer:</h3>
        <QuizOptions
          options={currentQuestion.options}
          selectedAnswer={currentAnswer?.selectedAnswer || null}
          onSelectAnswer={handleSelectAnswer}
          disabled={submitting}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0 || submitting}
          variant="outline"
        >
          Previous
        </Button>

        {isLastQuestion ? (
          <Button
            onClick={handleSubmit}
            disabled={!currentAnswer || submitting}
            variant="primary"
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            disabled={!currentAnswer || submitting}
            variant="primary"
          >
            Next Question
          </Button>
        )}
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {quiz.questions.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuestionIndex(index)}
            disabled={submitting}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentQuestionIndex
                ? 'bg-indigo-600 w-8'
                : answers.some((a) => a.questionIndex === index)
                ? 'bg-green-500'
                : 'bg-gray-300'
            }`}
            title={`Question ${index + 1}`}
          />
        ))}
      </div>

      {/* Exit Confirmation Modal */}
      <Modal
        isOpen={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        title="Exit Quiz?"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to exit? Your progress will be saved and you can continue later.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => setShowExitConfirm(false)} variant="outline" fullWidth>
            Cancel
          </Button>
          <Button onClick={handleExit} variant="danger" fullWidth>
            Exit Quiz
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default QuizPlay;

