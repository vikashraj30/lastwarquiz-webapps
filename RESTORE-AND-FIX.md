# Restore Project and Fix Deployment

You accidentally deleted the project files. Here's how to fix it:

## Quick Fix

```bash
cd /var/www
git clone https://github.com/vikashraj30/lastwarquiz-webapps.git last-war-quiz
cd last-war-quiz

# Create .env.local
nano .env.local
# Add your Firebase credentials

# Build
npm install
npm run build

# Create separate web directory
sudo mkdir -p /var/www/last-war-quiz-web
sudo cp -r dist/* /var/www/last-war-quiz-web/
sudo chown -R www-data:www-data /var/www/last-war-quiz-web

# Update Nginx to point to web directory
sudo nano /etc/nginx/sites-available/last-war-quiz
# Change: root /var/www/last-war-quiz;
# To: root /var/www/last-war-quiz-web;

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

## Step-by-Step

### Step 1: Restore Project

```bash
cd /var/www
git clone https://github.com/vikashraj30/lastwarquiz-webapps.git last-war-quiz
cd last-war-quiz
```

### Step 2: Setup Environment

```bash
# Create .env.local
nano .env.local
```

Add:
```env
VITE_API_URL=http://147.93.119.227
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 3: Install and Build

```bash
npm install
npm run build
```

### Step 4: Deploy to Separate Web Directory

```bash
# Create web directory (separate from project)
sudo mkdir -p /var/www/last-war-quiz-web

# Copy built files
sudo cp -r dist/* /var/www/last-war-quiz-web/

# Set permissions
sudo chown -R www-data:www-data /var/www/last-war-quiz-web
sudo chmod -R 755 /var/www/last-war-quiz-web
```

### Step 5: Update Nginx Config

```bash
sudo nano /etc/nginx/sites-available/last-war-quiz
```

Change this line:
```nginx
root /var/www/last-war-quiz;
```

To:
```nginx
root /var/www/last-war-quiz-web;
```

### Step 6: Reload Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Step 7: Verify

```bash
# Check web directory
ls -la /var/www/last-war-quiz-web/

# Check index.html
cat /var/www/last-war-quiz-web/index.html | grep script
# Should show: /assets/index-XXXXX.js
```

## Directory Structure After Fix

```
/var/www/
├── last-war-quiz/          # Project code (Git repo)
│   ├── src/
│   ├── package.json
│   ├── dist/               # Build output
│   └── ...
└── last-war-quiz-web/      # Web files (served by Nginx)
    ├── index.html
    └── assets/
```

This way:
- Project code stays in `/var/www/last-war-quiz/`
- Web files are in `/var/www/last-war-quiz-web/`
- No risk of deleting project files when updating web files

