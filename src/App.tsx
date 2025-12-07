import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import QuizList from './pages/QuizList';
import QuizPlay from './pages/QuizPlay';
import QuizResults from './pages/QuizResults';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Links from './pages/Links';
import Videos from './pages/Videos';
import appConfig from './config/appConfig';

/**
 * Loading Spinner Component
 * Displayed while checking authentication state
 */
const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="text-center">
        {/* Animated Spinner */}
        <div className="inline-block">
          <svg
            className="animate-spin h-16 w-16 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        <h2 className="mt-4 text-2xl font-bold text-white">{appConfig.appName}</h2>
        <p className="mt-2 text-indigo-100">Loading...</p>
      </div>
      </div>
  );
};

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

/**
 * Public Route Component (for Login page)
 * Redirects to home if user is already authenticated
 */
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

/**
 * Main App Component
 * Sets up routing and authentication context
 */
const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <Routes>
            {/* Root route - redirects to home or login based on auth state */}
          <Route
            path="/"
            element={
              <RootRedirect />
            }
          />

          {/* Login route - only accessible when not logged in */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

            {/* Protected routes - require authentication */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

            <Route
              path="/quizzes"
              element={
                <ProtectedRoute>
                  <QuizList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/quiz/:id"
              element={
                <ProtectedRoute>
                  <QuizPlay />
                </ProtectedRoute>
              }
            />

            <Route
              path="/quiz/:id/results"
              element={
                <ProtectedRoute>
                  <QuizResults />
                </ProtectedRoute>
              }
            />

            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/links"
              element={
                <ProtectedRoute>
                  <Links />
                </ProtectedRoute>
              }
            />

            <Route
              path="/videos"
              element={
                <ProtectedRoute>
                  <Videos />
                </ProtectedRoute>
              }
            />

          {/* Catch-all route - redirects to home or login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
};

/**
 * Root Redirect Component
 * Redirects to appropriate page based on authentication state
 */
const RootRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return <Navigate to={user ? "/home" : "/login"} replace />;
};

export default App;
