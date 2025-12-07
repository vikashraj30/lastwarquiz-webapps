import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

/**
 * Firebase configuration object
 * Uses environment variables from .env.local file (prefixed with VITE_)
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase config is properly loaded
if (!firebaseConfig.apiKey) {
  console.error('❌ FIREBASE CONFIG ERROR: .env.local file is missing!');
  console.error('📝 Please create .env.local file with your Firebase credentials');
  console.error('📍 Location: E:\\Last War Survival\\last_war_quiz\\web-apps\\last-war-quiz\\.env.local');
  console.error('📖 See README.md for instructions');
}

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Set persistence to LOCAL (user stays logged in even after closing browser)
setPersistence(auth, browserLocalPersistence);

