#!/bin/bash

# Network Chanel - Quick Installation Script
# This script automates the setup process

echo "🎬 Network Chanel - Installation Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node -v)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm found: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local with your database credentials"
    echo ""
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate Prisma client"
    exit 1
fi

echo "✅ Prisma client generated"
echo ""

# Ask about database setup
echo "🗄️  Database Setup"
echo "Do you want to push the database schema now? (y/n)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]
then
    echo "Pushing database schema..."
    npx prisma db push
    
    if [ $? -eq 0 ]; then
        echo "✅ Database schema created"
    else
        echo "❌ Failed to push database schema"
        echo "Please check your DATABASE_URL in .env.local"
        exit 1
    fi
else
    echo "⏭️  Skipping database setup"
    echo "Run 'npx prisma db push' when ready"
fi

echo ""
echo "🎉 Installation Complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local with your database credentials (if not done)"
echo "2. Run: npx prisma db push (if not done)"
echo "3. Run: npm run dev"
echo "4. Open: http://localhost:3000"
echo "5. Visit: http://localhost:3000/admin to add content"
echo ""
echo "📚 Documentation:"
echo "- README.md - Main documentation"
echo "- SETUP_GUIDE.md - Setup instructions"
echo "- API_DOCUMENTATION.md - API reference"
echo ""
echo "Happy streaming! 🍿"
