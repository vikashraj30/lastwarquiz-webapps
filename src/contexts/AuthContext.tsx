import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { auth } from '../config/firebase';

/**
 * AuthContext interface defining the shape of authentication context
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

/**
 * Create the authentication context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider component that wraps the app and provides auth functionality
 * @param children - Child components that will have access to auth context
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Listen to Firebase auth state changes
   * This keeps the user state synced with Firebase
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // Call backend API to create/get user in database
      if (currentUser) {
        try {
          // Import API function dynamically to avoid circular dependency
          const { getUser } = await import('../services/api');
          await getUser();
          console.log('✅ User synced with backend database');
        } catch (error) {
          console.error('⚠️ Failed to sync user with backend:', error);
          // Don't block login if backend call fails
        }
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  /**
   * Expose getToken function globally for testing
   * This allows easy access to Firebase token from browser console
   */
  useEffect(() => {
    if (user) {
      // Expose function to window for easy console access
      (window as any).getFirebaseToken = async () => {
        try {
          const token = await user.getIdToken();
          console.log('🔑 Firebase Token:', token);
          console.log('📋 Token length:', token.length);
          console.log('📋 Token preview:', token.substring(0, 50) + '...');
          
          // Copy to clipboard
          try {
            await navigator.clipboard.writeText(token);
            console.log('✅ Token copied to clipboard!');
          } catch (clipboardError) {
            console.warn('⚠️ Could not copy to clipboard:', clipboardError);
          }
          
          return token;
        } catch (error) {
          console.error('❌ Error getting token:', error);
          throw error;
        }
      };
      
      console.log('💡 Tip: Run "await getFirebaseToken()" in console to get your Firebase token');
    } else {
      // Remove function if user logs out
      delete (window as any).getFirebaseToken;
    }
  }, [user]);

  /**
   * Login with Google using popup
   * Opens a popup window for Google authentication
   */
  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const provider = new GoogleAuthProvider();
      // Add additional scopes if needed
      provider.addScope('profile');
      provider.addScope('email');
      
      await signInWithPopup(auth, provider);
      // User state will be updated by onAuthStateChanged
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      
      // Handle specific Firebase auth errors with user-friendly messages
      switch (err.code) {
        case 'auth/popup-closed-by-user':
          setError('Sign-in was cancelled. Please try again.');
          break;
        case 'auth/popup-blocked':
          setError('Pop-up was blocked by your browser. Please allow pop-ups and try again.');
          break;
        case 'auth/cancelled-popup-request':
          setError('Sign-in was cancelled.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your internet connection and try again.');
          break;
        case 'auth/account-exists-with-different-credential':
          setError('An account already exists with this email using a different sign-in method.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        default:
          setError('Failed to sign in with Google. Please try again.');
      }
      
      setLoading(false);
      throw err;
    }
  };

  /**
   * Logout the current user
   * Clears the user state and Firebase session
   */
  const logout = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      // User state will be updated by onAuthStateChanged
    } catch (err: any) {
      console.error('Logout Error:', err);
      setError('Failed to logout. Please try again.');
      throw err;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    loginWithGoogle,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use the auth context
 * Must be used within an AuthProvider
 * @returns AuthContext value with user, loading state, and auth functions
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

