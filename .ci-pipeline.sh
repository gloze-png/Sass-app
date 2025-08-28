#!/bin/bash
set -e

echo " Step 1: Running tests..."
docker build -t my-next-app-test --target test .
docker run --rm my-next-app-test npm test

echo " Tests passed!"

echo " Step 0: Running tests locally before build..."
npm test

echo " Step 2: Building Next.js app..."
docker build -t my-next-app .


echo " Step 3: Stopping old container (if any)..."
docker stop my-next-app-container || true
docker rm my-next-app-container || true

echo " Step 4: Running new container..."
docker run -d -p 3000:3000 --name my-next-app-container my-next-app

echo " App is running at http://localhost:3000"
