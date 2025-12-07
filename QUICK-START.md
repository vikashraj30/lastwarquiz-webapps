# Quick Start Guide - Last War Quiz Web App

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Backend API running at http://147.93.119.227
- Firebase project configured

### Installation

```bash
# Navigate to web app directory
cd last_war_quiz/web-apps/last-war-quiz

# Install dependencies (already done if you followed Phase 1)
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

---

## 🧪 Testing the App

### 1. Login
- Navigate to http://localhost:5173
- Click "Sign in with Google"
- Authenticate with your Google account
- You'll be redirected to the home dashboard

### 2. Home Dashboard
- ✅ View your stats (coins, level, quizzes completed, etc.)
- ✅ See level progress bar
- ✅ Browse featured quizzes
- ✅ Quick access to other sections
- ✅ Preview of links and videos

### 3. Browse Quizzes
- Click "All Quizzes" or navigate to `/quizzes`
- ✅ Filter by category (General, Sports, Science, etc.)
- ✅ Filter by difficulty (Easy, Medium, Hard)
- ✅ Search by quiz name
- ✅ Click any quiz to start

### 4. Play Quiz
- Click "Start Quiz" on any quiz card
- ✅ See timer counting down (if quiz has time limit)
- ✅ View progress bar (Question X of Y)
- ✅ Select answers by clicking options
- ✅ Navigate between questions
- ✅ Submit quiz when done
- ✅ Exit with confirmation dialog

### 5. View Results
- After submitting quiz:
- ✅ See score with confetti (if 90%+ correct)
- ✅ View detailed stats (correct/wrong/time/coins)
- ✅ Review all questions with explanations
- ✅ Retake quiz, view leaderboard, or return home

### 6. Leaderboard
- Navigate to `/leaderboard`
- ✅ View top 3 podium display
- ✅ See full rankings table
- ✅ Filter by timeframe (daily, weekly, monthly, all-time)
- ✅ Filter by category
- ✅ Your rank is highlighted

### 7. Profile
- Navigate to `/profile`
- ✅ View profile information
- ✅ See detailed stats
- ✅ View level progress
- ✅ Check quiz history
- ✅ Edit display name
- ✅ Logout

### 8. Links Section
- Navigate to `/links`
- ✅ Browse important links
- ✅ Filter by category
- ✅ Click to open in new tab
- ✅ Clicks are tracked

### 9. Videos Section
- Navigate to `/videos`
- ✅ Browse educational videos
- ✅ Filter by category
- ✅ Click to play in modal
- ✅ YouTube videos embedded
- ✅ Views are tracked

---

## 📱 Mobile Testing

### Test Responsiveness
1. Open browser DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Test at these widths:
   - 375px (iPhone SE)
   - 414px (iPhone Pro Max)
   - 768px (iPad)
   - 1024px (iPad Pro)
   - 1280px (Desktop)

### What to Check
- ✅ Navigation menu collapses to hamburger on mobile
- ✅ Grid layouts adapt (1/2/3 columns)
- ✅ Touch targets are at least 44x44px
- ✅ Text is readable (min 16px)
- ✅ Tables scroll horizontally on small screens
- ✅ Modals are full screen on mobile

---

## 🎯 Key Features to Test

### Authentication
- ✅ Login with Google
- ✅ Session persists across refreshes
- ✅ Logout works
- ✅ Protected routes redirect to login

### Quiz Playing
- ✅ Timer works correctly
- ✅ Answers are saved
- ✅ Progress is tracked
- ✅ Submission works
- ✅ Results are accurate

### Data Display
- ✅ User stats update after quiz
- ✅ Coins increase after quiz
- ✅ Level progresses correctly
- ✅ Leaderboard updates

### Navigation
- ✅ All links work
- ✅ Back button works
- ✅ Active route is highlighted
- ✅ Mobile menu works

### Error Handling
- ✅ Shows loading states
- ✅ Shows error messages
- ✅ Shows empty states
- ✅ Retry buttons work

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to server"
**Solution:** Make sure backend is running at http://147.93.119.227

### Issue: "Authentication failed"
**Solution:** Check Firebase configuration in `.env` file

### Issue: "Quiz data not loading"
**Solution:** Check if backend has quiz data seeded

### Issue: "Coin animation not showing"
**Solution:** Clear browser cache and refresh

### Issue: "Images not loading"
**Solution:** Check if image URLs are valid in database

---

## 📊 Performance Testing

### Check Page Load Times
1. Open DevTools Network tab
2. Reload page
3. Check:
   - Initial load < 2 seconds
   - API calls < 500ms
   - Images load progressively

### Check for Memory Leaks
1. Open DevTools Memory tab
2. Take heap snapshot
3. Navigate between pages
4. Take another snapshot
5. Compare - memory should not keep increasing

---

## ✅ Final Checklist

Before considering Phase 3 complete, verify:

### Functionality
- [ ] All pages load without errors
- [ ] All API endpoints work
- [ ] Authentication flow works
- [ ] Quiz playing is smooth
- [ ] Results calculate correctly
- [ ] Leaderboard displays properly
- [ ] Profile updates work
- [ ] Links and videos work

### UI/UX
- [ ] All components render properly
- [ ] Animations are smooth
- [ ] Loading states show
- [ ] Error states display
- [ ] Empty states visible
- [ ] Colors are consistent
- [ ] Typography is readable

### Responsive
- [ ] Mobile (375px) works
- [ ] Tablet (768px) works
- [ ] Desktop (1280px) works
- [ ] Touch targets adequate
- [ ] No horizontal scroll

### Performance
- [ ] No console errors
- [ ] No memory leaks
- [ ] Fast page loads
- [ ] Smooth animations
- [ ] Efficient re-renders

---

## 🎉 Success!

If all checks pass, Phase 3 is complete! 

**Next:** Deploy to production or proceed to Phase 4 (Android App Development)

---

## 📝 Notes

- The app uses local storage for quiz progress
- Clear storage to reset quiz progress: `localStorage.clear()`
- Backend must be running for full functionality
- Firebase authentication required for login

**Happy Testing! 🚀**

