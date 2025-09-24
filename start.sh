#!/bin/sh
set -e

echo "Installing serve globally..."
npm install -g serve

echo "Installing dependencies..."
npm install

echo "Building application..."
npm run build

echo "Starting server..."
serve -s dist -l 3000