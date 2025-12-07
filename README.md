# Last War Quiz - Web App

## 🚀 Setup Instructions

### 1. Add Firebase Configuration

Before running the app, you need to add your Firebase credentials:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **Last War Quiz**
3. Go to **Project Settings** (gear icon) → **Your Apps** → **Web App**
4. Copy your Firebase configuration values

5. Create a `.env.local` file in this directory (`web-apps/last-war-quiz/`)
6. Add your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

**IMPORTANT:** Replace the placeholder values with your actual Firebase configuration!

### 2. Run the Development Server

```powershell
npm run dev
```

The app will open at: http://localhost:5173

### 3. Test Authentication

1. Click "Sign in with Google"
2. Select your Google account
3. You should be redirected to the Home page
4. Your profile information should be displayed
5. Try logging out and back in
6. Close browser and reopen - you should still be logged in (session persistence)

## 🎯 Features Implemented

- ✅ Google Sign-In authentication
- ✅ Session persistence (stay logged in)
- ✅ Protected routes
- ✅ User profile display
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design

## 📱 Technologies Used

- **React 18** with TypeScript
- **Vite** for fast development
- **Firebase Authentication** (Google Sign-In only)
- **React Router v6** for navigation
- **Tailwind CSS** for styling
- **Axios** for future API calls

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── config/
│   └── firebase.ts          # Firebase configuration
├── contexts/
│   └── AuthContext.tsx      # Authentication context
├── pages/
│   ├── Login.tsx           # Login page with Google Sign-In
│   └── Home.tsx            # Home page (placeholder)
├── App.tsx                 # Main app with routing
├── main.tsx               # Entry point
└── index.css              # Tailwind CSS imports
```

## 🐛 Troubleshooting

### Firebase Not Working
- Make sure `.env.local` exists and has correct values
- Check that all variables start with `VITE_` prefix
- Restart dev server after changing `.env.local`

### Google Sign-In Not Working
- Verify your domain is authorized in Firebase Console
- Check browser console for errors
- Make sure pop-ups are not blocked

### Session Not Persisting
- Check if browser is in incognito/private mode
- Verify localStorage is enabled in browser
- Clear browser cache and try again

## 📝 Next Steps

- **Phase 2:** Backend API development
- **Phase 3:** Quiz features (questions, scoring, leaderboards)
- **Phase 4:** Android app development
- **Phase 5:** Admin panel
- **Phase 6:** Ad integration

## 🎮 Current Status

This is **Phase 1: Authentication** - a working authentication system with Google Sign-In.

Quiz features will be added in Phase 3!
