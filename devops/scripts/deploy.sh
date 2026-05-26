#!/bin/bash
# Deployment script for AI Telephony Platform
set -e

echo "==> Pulling latest changes..."
git pull origin main

echo "==> Building Docker images..."
docker-compose build --no-cache

echo "==> Starting services..."
docker-compose up -d

echo "==> Running health check..."
sleep 5
curl -f http://localhost:5000/api/health || { echo "Health check failed!"; exit 1; }

echo "==> Deployment complete!"