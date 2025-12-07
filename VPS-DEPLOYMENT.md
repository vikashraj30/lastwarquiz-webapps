# VPS Deployment Guide - Last War Quiz Web App

This guide will help you deploy the Last War Quiz web app to your VPS server using Git.

**VPS IP:** 147.93.119.227

---

## 📋 Prerequisites

- ✅ VPS server set up (Ubuntu 22.04)
- ✅ SSH access to VPS
- ✅ Git repository with your code
- ✅ Nginx installed on VPS
- ✅ Node.js installed on VPS (for building)

---

## 🚀 Quick Deployment Steps

### Step 1: Prepare Local Environment (One-time setup)

1. **Create `.env` file** (if not exists):
   ```bash
   cd last_war_quiz/web-apps/last-war-quiz
   cp .env.example .env
   ```

2. **Edit `.env` file** with your production values:
   ```env
   VITE_API_URL=http://147.93.119.227
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   # ... etc
   ```

3. **Commit and push to Git:**
   ```bash
   git add .
   git commit -m "Prepare for VPS deployment"
   git push origin main
   ```

---

### Step 2: Initial VPS Setup (One-time)

**SSH into your VPS:**
```bash
ssh root@147.93.119.227
# or
ssh appuser@147.93.119.227
```

**Install Node.js (if not installed):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Create web directory:**
```bash
sudo mkdir -p /var/www/last-war-quiz
sudo chown -R $USER:$USER /var/www/last-war-quiz
```

**Clone repository:**
```bash
cd /var/www
git clone YOUR_REPO_URL last-war-quiz
cd last-war-quiz/web-apps/last-war-quiz
```

**Create `.env` file on VPS:**
```bash
cp .env.example .env
nano .env
# Fill in your production values
```

**Make deployment script executable:**
```bash
chmod +x deploy-vps-server.sh
```

---

### Step 3: Configure Nginx (One-time)

**Create Nginx configuration:**
```bash
sudo nano /etc/nginx/sites-available/last-war-quiz
```

**Add this configuration:**
```nginx
server {
    listen 80;
    server_name 147.93.119.227;  # Replace with domain if you have one
    
    root /var/www/last-war-quiz;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Main location - SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy (optional - if you want to serve API through same domain)
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/last-war-quiz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

### Step 4: Deploy (Every time you update)

**On VPS:**
```bash
cd /var/www/last-war-quiz/web-apps/last-war-quiz
git pull origin main
./deploy-vps-server.sh
```

That's it! The script will:
1. ✅ Install dependencies
2. ✅ Build the app
3. ✅ Copy files to web directory
4. ✅ Reload Nginx

---

## 🔄 Regular Deployment Workflow

### On Your Local Machine:
```bash
# 1. Make changes to code
# 2. Test locally
npm run dev

# 3. Commit and push
git add .
git commit -m "Your commit message"
git push origin main
```

### On VPS:
```bash
# 1. SSH into VPS
ssh appuser@147.93.119.227

# 2. Navigate to project
cd /var/www/last-war-quiz/web-apps/last-war-quiz

# 3. Pull latest code
git pull origin main

# 4. Deploy
./deploy-vps-server.sh
```

---

## 🔧 Troubleshooting

### Issue: Build fails
```bash
# Check Node.js version
node --version  # Should be 18.x or higher

# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Nginx 404 errors
```bash
# Check if files are in correct location
ls -la /var/www/last-war-quiz

# Check Nginx configuration
sudo nginx -t

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Issue: Permission errors
```bash
# Fix ownership
sudo chown -R www-data:www-data /var/www/last-war-quiz
sudo chmod -R 755 /var/www/last-war-quiz
```

### Issue: Environment variables not working
- Remember: Vite embeds env vars at **build time**
- After changing `.env`, you must rebuild:
  ```bash
  ./deploy-vps-server.sh
  ```

---

## 🔒 SSL/HTTPS Setup (Optional but Recommended)

If you have a domain name:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts and choose option 2 (redirect HTTP to HTTPS)
```

---

## 📊 Verify Deployment

1. **Check Nginx status:**
   ```bash
   sudo systemctl status nginx
   ```

2. **Test in browser:**
   - Open: `http://147.93.119.227`
   - Should see login page

3. **Check logs:**
   ```bash
   sudo tail -f /var/log/nginx/access.log
   sudo tail -f /var/log/nginx/error.log
   ```

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Deploy | `./deploy-vps-server.sh` |
| Pull latest code | `git pull origin main` |
| Check Nginx | `sudo nginx -t` |
| Reload Nginx | `sudo systemctl reload nginx` |
| View logs | `sudo tail -f /var/log/nginx/error.log` |
| Check status | `sudo systemctl status nginx` |

---

## ✅ Deployment Checklist

- [ ] Node.js installed on VPS
- [ ] Git repository cloned
- [ ] `.env` file created with production values
- [ ] Nginx configured
- [ ] Nginx site enabled
- [ ] Deployment script executable
- [ ] First deployment successful
- [ ] Web app accessible in browser
- [ ] SSL configured (if using domain)

---

**Your web app is now live! 🎉**

