# ✅ VPS Deployment - Ready to Deploy!

All deployment files have been created and are ready to use.

---

## 📁 Files Created

1. **`deploy-vps.sh`** - Local build script (optional, for testing builds locally)
2. **`deploy-vps-server.sh`** - Main deployment script (run on VPS)
3. **`nginx-config.conf`** - Nginx configuration file
4. **`VPS-DEPLOYMENT.md`** - Detailed deployment guide
5. **`DEPLOY-QUICK-START.md`** - Quick 5-step deployment guide

---

## 🚀 Next Steps

### **Option 1: Deploy Now (Recommended)**

1. **Make sure your code is in Git:**
   ```bash
   cd last_war_quiz/web-apps/last-war-quiz
   git add .
   git commit -m "Add VPS deployment scripts"
   git push origin main
   ```

2. **SSH into your VPS:**
   ```bash
   ssh root@147.93.119.227
   ```

3. **Follow the Quick Start Guide:**
   - Open: `DEPLOY-QUICK-START.md`
   - Follow the 5 steps
   - Your app will be live in ~10 minutes!

### **Option 2: Test Locally First**

1. **Build locally to test:**
   ```bash
   cd last_war_quiz/web-apps/last-war-quiz
   npm run build
   ```

2. **Check if dist folder is created:**
   ```bash
   ls dist
   ```

3. **If build succeeds, proceed with VPS deployment**

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure:

- [ ] **Git repository is set up** and code is pushed
- [ ] **Firebase credentials** are ready (for .env.local)
- [ ] **VPS has Node.js 18+** installed
- [ ] **VPS has Nginx** installed
- [ ] **SSH access** to VPS works
- [ ] **Backend API** is running on VPS (http://147.93.119.227:5000)

---

## 🔑 Important Notes

### **Environment Variables**

The project uses **`.env.local`** (not `.env`) because Vite prioritizes `.env.local`.

**On VPS, create `.env.local` with:**
```env
VITE_API_URL=http://147.93.119.227
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### **Git Repository**

If you don't have a Git repository yet:

1. **Initialize Git:**
   ```bash
   cd "E:\Last War Survival"
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub repository** and push:
   ```bash
   git remote add origin YOUR_GITHUB_REPO_URL
   git branch -M main
   git push -u origin main
   ```

---

## 📖 Documentation

- **Quick Start:** `DEPLOY-QUICK-START.md` (5 steps, ~10 minutes)
- **Detailed Guide:** `VPS-DEPLOYMENT.md` (comprehensive guide)
- **Troubleshooting:** See both guides for common issues

---

## 🎯 Deployment Commands Summary

**On VPS (after initial setup):**
```bash
cd /var/www/last-war-quiz/web-apps/last-war-quiz
git pull origin main
./deploy-vps-server.sh
```

**That's it!** The script handles everything:
- ✅ Installs dependencies
- ✅ Builds the app
- ✅ Copies to web directory
- ✅ Reloads Nginx

---

## ✅ Ready to Deploy!

Everything is set up. Follow `DEPLOY-QUICK-START.md` to deploy now!

**Questions?** Check `VPS-DEPLOYMENT.md` for detailed instructions.

---

**Good luck with your deployment! 🚀**

