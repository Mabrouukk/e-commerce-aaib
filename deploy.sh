#!/bin/bash

echo "🚀 E-Commerce Application Deployment Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

print_status "Docker is running ✓"

# Stop any existing containers
print_status "Stopping existing containers..."
docker compose down 2>/dev/null || true
docker compose -f docker-compose.prod.yml down 2>/dev/null || true

# Clean up old images (optional)
read -p "Do you want to clean up old Docker images? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Cleaning up old images..."
    docker system prune -f
fi

# Build and start services
print_status "Building and starting all services..."
docker compose -f docker-compose.prod.yml up --build -d

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 30

# Check service health
print_status "Checking service health..."

# Check API Gateway
if curl -s http://localhost:3002/graphql > /dev/null; then
    print_status "API Gateway is running ✓"
else
    print_error "API Gateway is not responding"
fi

# Check Frontend
if curl -s http://localhost:3004 > /dev/null; then
    print_status "Frontend is running ✓"
else
    print_error "Frontend is not responding"
fi

# Test GraphQL connection
print_status "Testing GraphQL connection..."
GRAPHQL_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
    -d '{"query":"{ products { _id name price } }"}' \
    http://localhost:3002/graphql)

if echo "$GRAPHQL_RESPONSE" | grep -q "products"; then
    print_status "GraphQL is working ✓"
    echo "Sample products found:"
    echo "$GRAPHQL_RESPONSE" | jq '.data.products[0:3]' 2>/dev/null || echo "$GRAPHQL_RESPONSE"
else
    print_error "GraphQL is not working properly"
    echo "Response: $GRAPHQL_RESPONSE"
fi

# Show running containers
print_status "Running containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo "Frontend: http://localhost:3004"
echo "GraphQL Playground: http://localhost:3002/graphql"
echo "API Gateway: http://localhost:3002"
echo ""
echo "To view logs: docker compose -f docker-compose.prod.yml logs -f"
echo "To stop: docker compose -f docker-compose.prod.yml down"
echo ""

# Open browser (optional)
read -p "Do you want to open the application in your browser? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open > /dev/null; then
        open http://localhost:3004
    elif command -v xdg-open > /dev/null; then
        xdg-open http://localhost:3004
    else
        print_warning "Please open http://localhost:3004 in your browser"
    fi
fi

