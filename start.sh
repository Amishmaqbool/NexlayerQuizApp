#!/bin/sh
set -e

echo "=== Starting Nexlayer Quiz App Deployment ==="

echo "Step 1: Installing serve globally..."
npm install -g serve
echo "✅ Serve installed successfully"

echo "Step 2: Cleaning npm cache..."
npm cache clean --force
echo "✅ Cache cleaned"

echo "Step 3: Installing dependencies with npm ci..."
npm ci --only=production --no-audit --no-fund
echo "✅ Dependencies installed successfully"

echo "Step 4: Building application..."
npm run build
echo "✅ Build completed successfully"

echo "Step 5: Starting server on port 3000..."
echo "🚀 Application will be available shortly..."
serve -s dist -p 3000