#!/bin/bash

# Deployment Check Script
# Run this on VPS to diagnose blank screen issues

echo "🔍 Checking Deployment..."
echo ""

# Check if files exist
echo "1. Checking files:"
[ -f /var/www/last-war-quiz/index.html ] && echo "✅ index.html exists" || echo "❌ index.html MISSING"
[ -d /var/www/last-war-quiz/assets ] && echo "✅ assets directory exists" || echo "❌ assets directory MISSING"

if [ -d /var/www/last-war-quiz/assets ]; then
    JS_COUNT=$(find /var/www/last-war-quiz/assets -name "*.js" | wc -l)
    CSS_COUNT=$(find /var/www/last-war-quiz/assets -name "*.css" | wc -l)
    echo "   JavaScript files: $JS_COUNT"
    echo "   CSS files: $CSS_COUNT"
fi

echo ""
echo "2. Checking index.html content:"
if [ -f /var/www/last-war-quiz/index.html ]; then
    echo "   First 20 lines of index.html:"
    head -20 /var/www/last-war-quiz/index.html
    echo ""
    if grep -q "src=\"/src/main.tsx\"" /var/www/last-war-quiz/index.html; then
        echo "   ⚠️  WARNING: index.html still references /src/main.tsx (development mode)"
        echo "   This should be replaced with built assets during build!"
    fi
    if grep -q "assets/index-" /var/www/last-war-quiz/index.html; then
        echo "   ✅ index.html references built assets (correct)"
    fi
fi

echo ""
echo "3. Checking Nginx:"
nginx -t 2>&1 | grep -q "successful" && echo "✅ Nginx config OK" || echo "❌ Nginx config has errors"
systemctl is-active nginx > /dev/null && echo "✅ Nginx is running" || echo "❌ Nginx not running"

echo ""
echo "4. Checking file permissions:"
ls -la /var/www/last-war-quiz/index.html 2>/dev/null | head -1

echo ""
echo "5. Testing HTTP response:"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/)
echo "   HTTP Status: $HTTP_CODE"
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Server responding"
else
    echo "   ❌ Server not responding correctly"
fi

echo ""
echo "6. Checking JavaScript MIME type:"
if [ -f /var/www/last-war-quiz/assets/*.js ]; then
    JS_FILE=$(find /var/www/last-war-quiz/assets -name "*.js" | head -1)
    MIME_TYPE=$(curl -s -I "http://localhost${JS_FILE#/var/www/last-war-quiz}" | grep -i "content-type" | head -1)
    echo "   $MIME_TYPE"
fi

echo ""
echo "=== Check Complete ==="

