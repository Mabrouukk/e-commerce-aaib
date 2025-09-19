# 🚀 Production Deployment Guide

## Overview
This guide covers deploying the E-Commerce microservices application to production.

## Architecture
- **Frontend**: React + TypeScript + Vite (Port 3004)
- **API Gateway**: NestJS + GraphQL (Port 3002)
- **User Service**: NestJS + PostgreSQL (Port 3000)
- **Product Service**: NestJS + MongoDB (Port 3001)
- **Orders Service**: NestJS + PostgreSQL (Port 3003)

## Prerequisites
- Docker & Docker Compose
- Node.js 20+
- PostgreSQL 15+
- MongoDB 6+

## Quick Start (Development)
```bash
# Clone and start all services
git clone <repository-url>
cd e-commerce-aaib
docker compose up --build

# Access points:
# Frontend: http://localhost:3004
# GraphQL: http://localhost:3002/graphql
```

## Production Deployment

### 1. Environment Variables
Create `.env` files for each service:

**Frontend (.env.production)**
```env
VITE_API_URL=https://your-domain.com/graphql
VITE_APP_NAME=E-Commerce Store
```

**API Gateway (.env.production)**
```env
NODE_ENV=production
USER_SERVICE_URL=http://user-service:3000
PRODUCT_SERVICE_URL=http://product-service:3001
ORDERS_SERVICE_URL=http://orders-service:3003
JWT_SECRET=your-super-secret-jwt-key
```

### 2. Database Setup
```bash
# PostgreSQL
CREATE DATABASE ecommerce;
CREATE USER ecommerce_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE ecommerce TO ecommerce_user;

# MongoDB
use ecommerce
db.createUser({
  user: "ecommerce_user",
  pwd: "secure_password",
  roles: ["readWrite"]
})
```

### 3. Docker Production Build
```bash
# Build production images
docker compose -f docker-compose.prod.yml build

# Start production services
docker compose -f docker-compose.prod.yml up -d
```

### 4. Nginx Configuration (Optional)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3004;
    }

    location /graphql {
        proxy_pass http://localhost:3002;
    }
}
```

### 5. SSL Certificate (Let's Encrypt)
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com
```

## Monitoring & Logs

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f frontend
```

### Health Checks
```bash
# Frontend
curl http://localhost:3004

# API Gateway
curl http://localhost:3002/graphql

# User Service
curl http://localhost:3000/health

# Product Service
curl http://localhost:3001/health

# Orders Service
curl http://localhost:3003/health
```

## Security Checklist
- [ ] Change default passwords
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Regular security updates
- [ ] Database backups

## Performance Optimization
- [ ] Enable gzip compression
- [ ] Use CDN for static assets
- [ ] Database indexing
- [ ] Redis caching
- [ ] Load balancing

## Backup Strategy
```bash
# PostgreSQL backup
pg_dump -h localhost -U ecommerce_user ecommerce > backup.sql

# MongoDB backup
mongodump --host localhost --db ecommerce --out backup/
```

## Scaling
- **Horizontal**: Add more service instances
- **Vertical**: Increase container resources
- **Database**: Read replicas, sharding
- **Caching**: Redis cluster

## Troubleshooting
1. Check container logs
2. Verify environment variables
3. Test database connections
4. Check network connectivity
5. Monitor resource usage

## Support
For issues and questions, please check the logs and documentation first.
