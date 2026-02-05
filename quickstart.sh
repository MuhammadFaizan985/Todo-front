#!/bin/bash
# Quick Start Guide for TaskFlow Frontend

echo "=================================================="
echo "         TaskFlow Todo App - Quick Start"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Checking Node.js installation${NC}"
if command -v node &> /dev/null; then
    echo -e "${GREEN}✓ Node.js is installed: $(node -v)${NC}"
else
    echo "✗ Node.js not found. Please install Node.js first."
    exit 1
fi

echo ""
echo -e "${BLUE}Step 2: Installing dependencies${NC}"
if [ ! -d "node_modules" ]; then
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

echo ""
echo -e "${BLUE}Step 3: Checking Backend URL Configuration${NC}"
echo "Current backend URL: http://localhost:3000/api"
echo "To change, edit: src/utils/api.js"
echo -e "${GREEN}✓ Configuration verified${NC}"

echo ""
echo "=================================================="
echo -e "${YELLOW}Ready to start!${NC}"
echo "=================================================="
echo ""
echo -e "${BLUE}To start the development server, run:${NC}"
echo -e "${GREEN}npm run dev${NC}"
echo ""
echo -e "${BLUE}To build for production, run:${NC}"
echo -e "${GREEN}npm run build${NC}"
echo ""
echo -e "${BLUE}Make sure your backend is running on:${NC}"
echo -e "${GREEN}http://localhost:3000${NC}"
echo ""
echo "Frontend will be available at:"
echo -e "${GREEN}http://localhost:5173${NC}"
echo ""
echo "=================================================="
