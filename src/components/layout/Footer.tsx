/**
 * Footer Component
 * Bottom footer with copyright and links
 */

import React from 'react';
import { Link } from 'react-router-dom';
import appConfig from '../../config/appConfig';

/**
 * Footer component
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">{appConfig.logoInitials}</span>
              </div>
              <span className="text-lg font-bold text-gray-900">{appConfig.appName}</span>
            </div>
            <p className="text-sm text-gray-600">
              {appConfig.appDescription}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/quizzes" className="text-sm text-gray-600 hover:text-indigo-600">
                  All Quizzes
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-sm text-gray-600 hover:text-indigo-600">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/links" className="text-sm text-gray-600 hover:text-indigo-600">
                  Important Links
                </Link>
              </li>
              <li>
                <Link to="/videos" className="text-sm text-gray-600 hover:text-indigo-600">
                  Videos
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-gray-600 hover:text-indigo-600">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            © {currentYear} {appConfig.appName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

