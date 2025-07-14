
# Deployment script for Oxyera Challenge
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' 

echo -e "${BLUE}🚀 Oxyera Deployment Script${NC}"
echo "================================"

# Environment configuration
ENVIRONMENT=${1:-"staging"}
echo -e "${YELLOW}📍 Deploying to: $ENVIRONMENT${NC}"

echo -e "${BLUE}🔍 Running pre-deployment checks...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Pre-deployment checks passed${NC}"

# Build and deploy
echo -e "${BLUE}🔨 Building and deploying services...${NC}"

# Build Docker images
echo "Building backend..."
docker build -t oxyera-backend:$ENVIRONMENT ./backend/

echo "Building frontend..."
docker build -t oxyera-frontend:$ENVIRONMENT ./frontend/

# Deploy using docker-compose
echo -e "${BLUE}🚀 Starting services...${NC}"
docker-compose up -d

# Health checks
echo -e "${BLUE}🏥 Running health checks...${NC}"
sleep 10

# Check backend health
if curl -f http://localhost:8080/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
    exit 1
fi

# Check frontend health
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is healthy${NC}"
else
    echo -e "${RED}❌ Frontend health check failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}📱 Frontend: http://localhost:3000${NC}"
echo -e "${BLUE}🔧 Backend: http://localhost:8080${NC}"
echo ""
