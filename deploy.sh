#!/bin/bash

# 🚀 Mangaka.ai Production Deployment Script

set -e

echo "🎌 Deploying Mangaka.ai to Production..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
FRONTEND_DIR="client"
BACKEND_DIR="server"
AI_SERVICE_DIR="ai-service"

echo -e "${BLUE}📋 Pre-deployment Checklist${NC}"

# Check if all required environment variables are set
check_env_vars() {
    local required_vars=(
        "MONGODB_URI"
        "JWT_SECRET"
        "OPENAI_API_KEY"
        "STRIPE_SECRET_KEY"
        "SENDGRID_API_KEY"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo -e "${RED}❌ Missing required environment variable: $var${NC}"
            exit 1
        else
            echo -e "${GREEN}✅ $var is set${NC}"
        fi
    done
}

# Build frontend
build_frontend() {
    echo -e "${YELLOW}🏗️  Building frontend...${NC}"
    cd $FRONTEND_DIR
    
    # Install dependencies
    npm ci --production
    
    # Build for production
    npm run build
    
    # Verify build
    if [ ! -d "build" ]; then
        echo -e "${RED}❌ Frontend build failed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Frontend built successfully${NC}"
    cd ..
}

# Prepare backend
prepare_backend() {
    echo -e "${YELLOW}⚙️  Preparing backend...${NC}"
    cd $BACKEND_DIR
    
    # Install production dependencies
    npm ci --production
    
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
    cd ..
}

# Setup AI service
setup_ai_service() {
    echo -e "${YELLOW}🤖 Setting up AI service...${NC}"
    cd $AI_SERVICE_DIR
    
    # Create virtual environment if it doesn't exist
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Install Python dependencies
    pip install -r requirements.txt
    
    echo -e "${GREEN}✅ AI service configured${NC}"
    cd ..
}

# Database migration
run_database_migration() {
    echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
    node scripts/setup-db.js
    echo -e "${GREEN}✅ Database migration completed${NC}"
}

# Deploy to Vercel
deploy_to_vercel() {
    echo -e "${YELLOW}🚀 Deploying to Vercel...${NC}"
    
    # Install Vercel CLI if not present
    if ! command -v vercel &> /dev/null; then
        npm install -g vercel
    fi
    
    # Deploy
    vercel --prod
    
    echo -e "${GREEN}✅ Deployed to Vercel${NC}"
}

# Deploy to Railway (Backend + AI Service)
deploy_to_railway() {
    echo -e "${YELLOW}🚂 Deploying backend to Railway...${NC}"
    
    # Install Railway CLI if not present
    if ! command -v railway &> /dev/null; then
        npm install -g @railway/cli
    fi
    
    # Deploy
    railway up
    
    echo -e "${GREEN}✅ Deployed to Railway${NC}"
}

# Health check
health_check() {
    echo -e "${YELLOW}🏥 Running health checks...${NC}"
    
    # Wait for deployment to be ready
    sleep 30
    
    # Check frontend
    if curl -f -s "https://mangaka.ai" > /dev/null; then
        echo -e "${GREEN}✅ Frontend is responding${NC}"
    else
        echo -e "${RED}❌ Frontend health check failed${NC}"
    fi
    
    # Check backend API
    if curl -f -s "https://api.mangaka.ai/api/health" > /dev/null; then
        echo -e "${GREEN}✅ Backend API is responding${NC}"
    else
        echo -e "${RED}❌ Backend API health check failed${NC}"
    fi
}

# Cleanup
cleanup() {
    echo -e "${YELLOW}🧹 Cleaning up...${NC}"
    
    # Remove temporary files
    rm -rf temp/*
    rm -rf client/build/.cache
    
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Main deployment flow
main() {
    echo -e "${BLUE}🎌 Starting Mangaka.ai Production Deployment${NC}"
    
    # Run all deployment steps
    check_env_vars
    build_frontend
    prepare_backend
    setup_ai_service
    run_database_migration
    
    # Deploy based on environment
    if [ "$DEPLOY_TARGET" = "vercel" ]; then
        deploy_to_vercel
    elif [ "$DEPLOY_TARGET" = "railway" ]; then
        deploy_to_railway
    else
        echo -e "${YELLOW}⚠️  No deployment target specified. Skipping deployment.${NC}"
        echo -e "${BLUE}💡 Set DEPLOY_TARGET=vercel or DEPLOY_TARGET=railway${NC}"
    fi
    
    health_check
    cleanup
    
    echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
    echo -e "${BLUE}🌐 Your manga translation service is now live!${NC}"
}

# Error handling
trap 'echo -e "${RED}❌ Deployment failed. Check the logs above.${NC}"; exit 1' ERR

# Run main function
main "$@"