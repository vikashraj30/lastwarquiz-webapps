#!/bin/bash

# Fix Deployment - Restore and Deploy Correctly
# This script restores the project and deploys correctly

set -e

echo "🔧 Fixing Deployment..."
echo ""

# Get the directory where script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo "📂 Current directory: $(pwd)"
echo ""

# 1. Restore from Git if needed
if [ ! -f "package.json" ] || [ ! -d "src" ]; then
    echo "📥 Restoring project from Git..."
    git restore .
    git pull origin main
fi

# 2. Make sure .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local not found!"
    echo "Please create it with your Firebase credentials"
    exit 1
fi

# 3. Build the project
echo "🔨 Building project..."
npm run build

# 4. Verify build
if [ ! -f "dist/index.html" ]; then
    echo "❌ Build failed! dist/index.html not found"
    exit 1
fi

# Check if index.html has correct script tag
if grep -q "/src/main.tsx" dist/index.html; then
    echo "❌ Build error: dist/index.html still has development script!"
    exit 1
fi

echo "✅ Build successful!"
echo ""

# 5. Create web directory structure
# We'll serve from the dist folder directly, or copy to a separate web dir
WEB_DIR="/var/www/last-war-quiz-web"

echo "📁 Setting up web directory..."
sudo mkdir -p "$WEB_DIR"

# 6. Copy built files to web directory
echo "📋 Copying built files..."
sudo cp -r dist/* "$WEB_DIR/"

# 7. Set permissions
echo "🔐 Setting permissions..."
sudo chown -R www-data:www-data "$WEB_DIR"
sudo chmod -R 755 "$WEB_DIR"

# 8. Update Nginx config to point to new web directory
echo "⚙️  Updating Nginx config..."
sudo sed -i "s|root /var/www/last-war-quiz;|root $WEB_DIR;|g" /etc/nginx/sites-available/last-war-quiz

# 9. Test and reload Nginx
echo "🔄 Testing Nginx..."
if sudo nginx -t; then
    sudo systemctl reload nginx
    echo "✅ Nginx reloaded"
else
    echo "❌ Nginx config error!"
    exit 1
fi

echo ""
echo "✅ Deployment fixed!"
echo ""
echo "Web files are now in: $WEB_DIR"
echo "Project files remain in: $(pwd)"
echo ""
echo "Verify:"
echo "  cat $WEB_DIR/index.html | grep script"

