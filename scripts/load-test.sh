#!/bin/bash

# Simple load testing script
echo "🚀 Starting load tests for Oxyera API..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:8080"
CONCURRENT_USERS=10
TEST_DURATION=30

# Check if server is running
echo "📡 Checking if server is running..."
if ! curl -f "$BASE_URL/health" > /dev/null 2>&1; then
    echo -e "${RED}❌ Server is not running at $BASE_URL${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Server is running${NC}"

# Install artillery if not present
if ! command -v artillery &> /dev/null; then
    echo "📦 Installing Artillery..."
    npm install -g artillery
fi

# Run load tests
echo -e "${YELLOW}🔥 Running load tests...${NC}"
echo "Base URL: $BASE_URL"
echo "Concurrent Users: $CONCURRENT_USERS"
echo "Duration: ${TEST_DURATION}s"
echo ""

artillery quick \
    --count $CONCURRENT_USERS \
    --num $TEST_DURATION \
    "$BASE_URL/health"

echo ""
echo -e "${GREEN}✅ Load tests completed!${NC}"
