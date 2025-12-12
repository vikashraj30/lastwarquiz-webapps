# Troubleshooting Blank Screen

If you're seeing a blank screen, follow these steps:

## Step 1: Check Browser Console (MOST IMPORTANT)

1. Open `http://147.93.119.227` in your browser
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for **red error messages**

**Common errors and fixes:**

### Error: "Failed to load module script"
**Fix:** Nginx MIME type issue - see Step 3

### Error: "Firebase config error" or "VITE_FIREBASE_API_KEY is undefined"
**Fix:** `.env.local` file missing or not loaded during build
- Create `.env.local` in project directory
- Rebuild: `npm run build`
- Redeploy files

### Error: "Cannot read property" or JavaScript errors
**Fix:** Check the specific error and fix the code

### Error: "404 Not Found" for assets
**Fix:** Files not copied correctly - see Step 2

---

## Step 2: Verify Files Are Deployed

On VPS, run:

```bash
# Check if files exist
ls -la /var/www/last-war-quiz/

# Should show:
# - index.html
# - assets/ directory

# Check index.html content
cat /var/www/last-war-quiz/index.html

# Should show script tag like:
# <script type="module" src="/assets/index-XXXXX.js"></script>
# NOT: <script type="module" src="/src/main.tsx"></script>
```

**If index.html still has `/src/main.tsx`:**
- The build didn't process correctly
- Rebuild: `npm run build`
- Copy files again: `cp -r dist/* /var/www/last-war-quiz/`

---

## Step 3: Fix Nginx MIME Type (If JavaScript not loading)

```bash
# Update Nginx config
cd /var/www/last-war-quiz
sudo cp nginx-config.conf /etc/nginx/sites-available/last-war-quiz

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 4: Check Build Output

On VPS:

```bash
cd /var/www/last-war-quiz

# Check if dist folder exists and has files
ls -la dist/

# If dist doesn't exist or is empty, rebuild:
npm run build

# Check build output
ls -la dist/assets/
```

---

## Step 5: Verify Environment Variables

```bash
# Check if .env.local exists
ls -la .env.local

# Check if it has Firebase config
grep VITE_FIREBASE .env.local

# If missing, create it:
nano .env.local
# Add your Firebase credentials

# Rebuild (env vars are embedded at build time)
npm run build
cp -r dist/* /var/www/last-war-quiz/
```

---

## Step 6: Check Nginx Logs

```bash
# Check error logs
sudo tail -50 /var/log/nginx/error.log

# Check access logs
sudo tail -50 /var/log/nginx/access.log
```

---

## Quick Fix: Complete Rebuild and Deploy

```bash
cd /var/www/last-war-quiz

# 1. Make sure .env.local exists with Firebase credentials
[ -f .env.local ] || nano .env.local

# 2. Clean and rebuild
rm -rf dist node_modules
npm install
npm run build

# 3. Check build output
ls -la dist/

# 4. Copy to web directory
sudo rm -rf /var/www/last-war-quiz/*
sudo cp -r dist/* /var/www/last-war-quiz/

# 5. Set permissions
sudo chown -R www-data:www-data /var/www/last-war-quiz
sudo chmod -R 755 /var/www/last-war-quiz

# 6. Update Nginx config
sudo cp nginx-config.conf /etc/nginx/sites-available/last-war-quiz
sudo nginx -t
sudo systemctl reload nginx

# 7. Test
curl -I http://localhost/
```

---

## Most Common Issues

### Issue 1: index.html references /src/main.tsx instead of built assets
**Cause:** Build didn't process index.html correctly
**Fix:** Rebuild and ensure dist/index.html has correct script tags

### Issue 2: JavaScript files return wrong MIME type
**Cause:** Nginx not configured for JavaScript modules
**Fix:** Update Nginx config with MIME type settings

### Issue 3: Firebase config missing
**Cause:** .env.local not present during build
**Fix:** Create .env.local and rebuild

### Issue 4: Files in wrong location
**Cause:** Files copied to wrong directory
**Fix:** Ensure files are in /var/www/last-war-quiz/ (not subdirectory)

---

## Diagnostic Script

Run the diagnostic script:

```bash
cd /var/www/last-war-quiz
chmod +x check-deployment.sh
./check-deployment.sh
```

This will check all common issues automatically.

---

## Still Not Working?

1. **Share browser console errors** (F12 → Console tab)
2. **Share Nginx error logs:** `sudo tail -50 /var/log/nginx/error.log`
3. **Share build output:** `ls -la dist/` and `cat dist/index.html`

