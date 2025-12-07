#!/bin/bash

# Fix Nginx Server Name Conflict
# This script removes the default Nginx site that conflicts with our config

echo "🔧 Fixing Nginx server name conflict..."

# Remove default site if it exists
if [ -f /etc/nginx/sites-enabled/default ]; then
    echo "Removing default Nginx site..."
    rm /etc/nginx/sites-enabled/default
    echo "✅ Default site removed"
fi

# Test Nginx configuration
echo "Testing Nginx configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    echo "Reloading Nginx..."
    systemctl reload nginx
    echo "✅ Nginx reloaded successfully"
else
    echo "❌ Nginx configuration has errors"
    exit 1
fi

echo ""
echo "✅ Conflict resolved! You can now deploy your app."

