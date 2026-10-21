#!/bin/bash

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "🔍 Checking Node.js version..."
node --version

if [[ $(node --version) != v20* ]] && [[ $(node --version) != v22* ]]; then
    echo ""
    echo "❌ Node.js version is too old: $(node --version)"
    echo "📦 Switching to Node.js 20..."
    nvm use 20 || nvm install 20
    echo "✅ Node.js upgraded to: $(node --version)"
else
    echo "✅ Node.js version is compatible: $(node --version)"
fi

echo ""
echo "🧹 Cleaning up old processes on port 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo ""
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo ""
echo "🚀 Starting Vite dev server..."
echo ""
echo "================================================================"
echo "  Frontend will be available at: http://localhost:3000"
echo "  Backend should be running at:  http://localhost:8080"
echo "================================================================"
echo ""

npm run dev
