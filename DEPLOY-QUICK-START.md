# 🚀 Quick VPS Deployment Guide

Deploy your Last War Quiz web app to VPS in 5 minutes!

---

## 📋 Prerequisites Checklist

- [ ] VPS server accessible (147.93.119.227)
- [ ] SSH access to VPS
- [ ] Git repository with your code
- [ ] Firebase credentials ready

---

## ⚡ Quick Deployment (5 Steps)

### **Step 1: Prepare Code Locally** (2 min)

```bash
# Navigate to web app
cd last_war_quiz/web-apps/last-war-quiz

# Make sure you have .env.local with production values
# VITE_API_URL should be: http://147.93.119.227

# Commit and push to Git
git add .
git commit -m "Deploy web app to VPS"
git push origin main
```

---

### **Step 2: Initial VPS Setup** (One-time, 10 min)

**SSH into VPS:**
```bash
ssh root@147.93.119.227
# or
ssh appuser@147.93.119.227
```

**Install Node.js (if needed):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Create directory and clone:**
```bash
sudo mkdir -p /var/www/last-war-quiz
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone YOUR_REPO_URL last-war-quiz
cd last-war-quiz/web-apps/last-war-quiz
```

**Create production .env.local:**
```bash
nano .env.local
# Add your production Firebase credentials
# Make sure VITE_API_URL=http://147.93.119.227
```

**Make script executable:**
```bash
chmod +x deploy-vps-server.sh
```

---

### **Step 3: Configure Nginx** (One-time, 5 min)

```bash
# Copy Nginx config
sudo cp nginx-config.conf /etc/nginx/sites-available/last-war-quiz

# Edit if needed (update server_name if you have domain)
sudo nano /etc/nginx/sites-available/last-war-quiz

# Enable site
sudo ln -s /etc/nginx/sites-available/last-war-quiz /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

---

### **Step 4: Deploy!** (2 min)

```bash
cd /var/www/last-war-quiz/web-apps/last-war-quiz
./deploy-vps-server.sh
```

**Done!** 🎉 Your app should be live at `http://147.93.119.227`

---

### **Step 5: Future Updates** (1 min each time)

**On VPS:**
```bash
cd /var/www/last-war-quiz/web-apps/last-war-quiz
git pull origin main
./deploy-vps-server.sh
```

---

## 🔧 Troubleshooting

**Build fails?**
```bash
rm -rf node_modules package-lock.json
npm install
./deploy-vps-server.sh
```

**Nginx 404?**
```bash
sudo nginx -t
sudo systemctl reload nginx
ls -la /var/www/last-war-quiz  # Check if files exist
```

**Permission errors?**
```bash
sudo chown -R www-data:www-data /var/www/last-war-quiz
sudo chmod -R 755 /var/www/last-war-quiz
```

---

## ✅ Verify Deployment

1. Open browser: `http://147.93.119.227`
2. Should see login page
3. Test Google Sign-In
4. Check all pages load

---

**That's it! Your web app is live! 🚀**

