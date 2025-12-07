#!/bin/bash

# Last War Quiz - VPS Server Deployment Script
# Run this script ON THE VPS after pulling latest code

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Last War Quiz - VPS Deployment${NC}"
echo ""

# Check if running as root or with sudo
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}❌ Please don't run as root. Use a regular user with sudo privileges.${NC}"
    exit 1
fi

# Get the directory where script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${YELLOW}📂 Current directory: $(pwd)${NC}"
echo ""

# Check if .env.local file exists (Vite uses .env.local)
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local file not found.${NC}"
    if [ -f .env.example ]; then
        echo -e "${YELLOW}Creating .env.local from .env.example...${NC}"
        cp .env.example .env.local
        echo -e "${RED}⚠️  Please edit .env.local file with your production values!${NC}"
        echo "   nano .env.local"
        exit 1
    else
        echo -e "${RED}❌ Error: .env.local not found and no .env.example to copy!${NC}"
        echo -e "${YELLOW}Please create .env.local with your Firebase credentials${NC}"
        exit 1
    fi
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is not installed!${NC}"
    echo "Install Node.js: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"
echo -e "${GREEN}✅ npm version: $(npm --version)${NC}"
echo ""

# Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install --production=false

# Build the application
echo -e "${YELLOW}🔨 Building for production...${NC}"
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Error: Build failed! dist folder not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo ""

# Copy dist to web directory
WEB_DIR="/var/www/last-war-quiz"
echo -e "${YELLOW}📁 Copying files to web directory...${NC}"

# Create web directory if it doesn't exist
sudo mkdir -p "$WEB_DIR"

# Copy dist contents to web directory
sudo cp -r dist/* "$WEB_DIR/"

# Set proper permissions
sudo chown -R www-data:www-data "$WEB_DIR"
sudo chmod -R 755 "$WEB_DIR"

echo -e "${GREEN}✅ Files copied to $WEB_DIR${NC}"
echo ""

# Test Nginx configuration
echo -e "${YELLOW}🔍 Testing Nginx configuration...${NC}"
if sudo nginx -t 2>/dev/null; then
    echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
    
    # Reload Nginx
    echo -e "${YELLOW}🔄 Reloading Nginx...${NC}"
    sudo systemctl reload nginx
    echo -e "${GREEN}✅ Nginx reloaded${NC}"
else
    echo -e "${RED}❌ Nginx configuration has errors!${NC}"
    echo "Run: sudo nginx -t"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${BLUE}Your web app should now be live at:${NC}"
echo "   http://147.93.119.227"
echo "   (or your domain if configured)"
echo ""
echo -e "${YELLOW}To check Nginx status:${NC}"
echo "   sudo systemctl status nginx"
echo ""
echo -e "${YELLOW}To view Nginx logs:${NC}"
echo "   sudo tail -f /var/log/nginx/error.log"

