#!/bin/bash

# Tourism Diary - Quick Start Script
# This script sets up and runs the complete application

echo "🌍 Tourism Diary - Full Stack Setup"
echo "===================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Setup Backend
echo "📦 Setting up backend..."
cd tourism-diary-backend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "  Backend dependencies already installed"
fi
echo "✅ Backend setup complete"
echo ""

# Setup Frontend
echo "📦 Setting up frontend..."
cd ../tourism-diary-frontend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "  Frontend dependencies already installed"
fi
echo "✅ Frontend setup complete"
echo ""

echo "===================================="
echo "🚀 Ready to start!"
echo ""
echo "To run the application:"
echo ""
echo "Terminal 1 - Backend Server:"
echo "  cd tourism-diary-backend"
echo "  npm start"
echo ""
echo "Terminal 2 - Frontend Development:"
echo "  cd tourism-diary-frontend"
echo "  npm run dev"
echo ""
echo "The app will be available at http://localhost:3000"
echo "API will be running on http://localhost:5000"
echo ""
echo "Happy travels! ✈️"
