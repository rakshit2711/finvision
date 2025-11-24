#!/bin/bash

# FinVision AI - Quick Start Script (Unix/Mac)

echo "========================================"
echo "   FinVision AI - Backend Setup"
echo "========================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "✓ .env file created. Please update it with your database credentials."
    echo ""
    
    echo "IMPORTANT: Update the following in .env:"
    echo "1. DATABASE_URL - Your PostgreSQL connection string"
    echo "2. JWT_SECRET - A secure random string"
    echo ""
    
    read -p "Press Enter to continue after updating .env, or 'q' to quit: " continue
    if [ "$continue" = "q" ]; then
        exit 0
    fi
fi

echo ""
echo "Step 1: Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "✗ Failed to install dependencies"
    exit 1
fi
echo "✓ Dependencies installed"
echo ""

echo "Step 2: Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "✗ Failed to generate Prisma Client"
    exit 1
fi
echo "✓ Prisma Client generated"
echo ""

echo "Step 3: Running database migrations..."
echo "This will create the necessary tables in your database."
echo ""

npx prisma migrate dev --name init

if [ $? -ne 0 ]; then
    echo ""
    echo "✗ Failed to run migrations. Please check your DATABASE_URL in .env"
    echo ""
    echo "Common issues:"
    echo "- PostgreSQL is not running"
    echo "- Invalid database credentials"
    echo "- Database does not exist (create it first)"
    echo ""
    exit 1
fi
echo "✓ Database migrations completed"
echo ""

echo "========================================"
echo "         Setup Complete! 🎉"
echo "========================================"
echo ""

echo "Next steps:"
echo "1. Run: npm run dev"
echo "2. Open: http://localhost:3000"
echo "3. Create an account at /signup"
echo ""

echo "Optional commands:"
echo "- npx prisma studio (View database in browser)"
echo "- npm run dev (Start development server)"
echo ""

read -p "Would you like to start the development server now? (y/n): " startDev
if [ "$startDev" = "y" ] || [ "$startDev" = "Y" ]; then
    echo ""
    echo "Starting development server..."
    echo ""
    npm run dev
fi
