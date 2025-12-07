/**
 * Header Component
 * Top navigation bar with logo, links, coins display, and user menu
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import appConfig from '../../config/appConfig';

/**
 * Header component with navigation
 */
const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { userData } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  /**
   * Check if route is active
   */
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  /**
   * Navigation link component
   */
  const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
    const active = isActive(to);
    return (
      <Link
        to={to}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          active
            ? 'bg-indigo-100 text-indigo-700'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      >
        {children}
      </Link>
    );
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">{appConfig.logoInitials}</span>
            </div>
            <span className="hidden sm:block text-xl font-bold text-gray-900">
              {appConfig.appName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/quizzes">Quizzes</NavLink>
            <NavLink to="/leaderboard">Leaderboard</NavLink>
            <NavLink to="/links">Links</NavLink>
            <NavLink to="/videos">Videos</NavLink>
          </nav>

          {/* Right side - Coins & User Menu */}
          <div className="flex items-center gap-4">
            {/* Coins Display */}
            <div className="hidden sm:flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-lg">
              <span className="text-2xl">🪙</span>
              <span className="font-bold text-yellow-700">
                {userData?.coins?.toLocaleString() || 0}
              </span>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-indigo-500"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
                  </div>
                )}
                <svg
                  className="hidden md:block w-4 h-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.displayName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/quizzes">Quizzes</NavLink>
              <NavLink to="/leaderboard">Leaderboard</NavLink>
              <NavLink to="/links">Links</NavLink>
              <NavLink to="/videos">Videos</NavLink>
              <NavLink to="/profile">Profile</NavLink>
              
              {/* Coins Display (mobile) */}
              <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg mt-2">
                <span className="text-2xl">🪙</span>
                <span className="font-bold text-yellow-700">
                  {userData?.coins?.toLocaleString() || 0} Coins
                </span>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

