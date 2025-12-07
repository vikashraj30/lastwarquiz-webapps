#!/bin/bash

# Last War Quiz - VPS Deployment Script
# This script builds and deploys the web app to VPS

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo "Please copy .env.example to .env and fill in your values"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Error: Node.js is not installed!${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ Error: npm is not installed!${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}🔨 Building for production...${NC}"
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Error: Build failed! dist folder not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully!${NC}"
echo -e "${YELLOW}📁 Build output is in the 'dist' folder${NC}"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Commit and push your code to Git:"
echo "   git add ."
echo "   git commit -m 'Deploy web app to production'"
echo "   git push origin main"
echo ""
echo "2. SSH into your VPS and run:"
echo "   cd /var/www/last-war-quiz/web-apps/last-war-quiz"
echo "   git pull origin main"
echo "   ./deploy-vps-server.sh"
echo ""
echo -e "${GREEN}✅ Local build complete!${NC}"

