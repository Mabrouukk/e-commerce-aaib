# E-Commerce Nexus - Microservices Platform

A modern, containerized e-commerce platform built with Nest.js, TypeScript, and microservices architecture. This project demonstrates advanced backend engineering concepts including polyglot persistence, GraphQL API design, and distributed system communication.

## 🏗️ Architecture Overview

The platform consists of four main components:

- **User Service** (Port 3000): Handles user authentication, registration, and JWT token management
- **Product Service** (Port 3001): Manages product catalog with flexible schema using MongoDB
- **Orders Service** (Port 3003): Orchestrates order creation and management with inter-service communication
- **API Gateway** (Port 3002): Provides a unified GraphQL API that aggregates data from all services

## 🛠️ Technology Stack

| Component | Technology | Database | Purpose |
|-----------|------------|----------|---------|
| User Service | Nest.js + TypeScript | PostgreSQL + TypeORM | User management & authentication |
| Product Service | Nest.js + TypeScript | MongoDB + Mongoose | Product catalog management |
| Orders Service | Nest.js + TypeScript | PostgreSQL + TypeORM | Order processing & business logic |
| API Gateway | Nest.js + TypeScript | N/A | GraphQL API aggregation |

## 🚀 Quick Start

### Prerequisites

- Docker Desktop installed and running
- Git

### Running the Application

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-commerce-aaib
   ```

2. **Start the entire application stack**
   ```bash
   docker-compose up --build
   ```

3. **Access the services**
   - **GraphQL Playground**: http://localhost:3002/graphql
   - **User Service API**: http://localhost:3000
   - **Product Service API**: http://localhost:3001
   - **Orders Service API**: http://localhost:3003

### Development Mode

To run services individually for development:

```bash
# User Service
cd user-service
npm install
npm run start:dev

# Product Service
cd product-service
npm install
npm run start:dev

# Orders Service
cd orders-service
npm install
npm run start:dev

# API Gateway
cd api-gateway
npm install
npm run start:dev
```

## 📊 Database Configuration

### PostgreSQL (User & Orders Services)
- **Host**: localhost:5432
- **Database**: ecommerce
- **Username**: postgres
- **Password**: postgres123

### MongoDB (Product Service)
- **Host**: localhost:27017
- **Database**: ecommerce
- **Username**: admin
- **Password**: admin123

## 🔧 Environment Variables

The application uses the following environment variables:

### User Service
- `DATABASE_HOST`: PostgreSQL host (default: localhost)
- `DATABASE_PORT`: PostgreSQL port (default: 5432)
- `DATABASE_USERNAME`: Database username (default: postgres)
- `DATABASE_PASSWORD`: Database password (default: postgres123)
- `DATABASE_NAME`: Database name (default: ecommerce)
- `JWT_SECRET`: JWT signing secret

### Product Service
- `MONGODB_URI`: MongoDB connection string

### Orders Service
- `DATABASE_HOST`: PostgreSQL host
- `USER_SERVICE_URL`: User service endpoint
- `PRODUCT_SERVICE_URL`: Product service endpoint

### API Gateway
- `USER_SERVICE_URL`: User service endpoint
- `PRODUCT_SERVICE_URL`: Product service endpoint
- `ORDERS_SERVICE_URL`: Orders service endpoint

## 🧪 Testing the API

### GraphQL Queries

**Get All Orders:**
```graphql
query {
  orders {
    id
    userId
    total
    status
    items {
      id
      productId
      quantity
      price
    }
    createdAt
  }
}
```

**Get Order by ID:**
```graphql
query {
  order(id: 1) {
    id
    userId
    total
    status
    items {
      id
      productId
      quantity
      price
    }
    createdAt
  }
}
```

**Create Order:**
```graphql
mutation {
  createOrder(createOrderInput: {
    userId: 16
    items: [
      {
        productId: "68b81c1405caf25f8e0bd8ab"
        quantity: 2
      }
    ]
  }) {
    id
    userId
    total
    status
    items {
      id
      productId
      quantity
      price
    }
    createdAt
  }
}
```

### REST API Endpoints

**User Service:**
- `GET /users` - Get all users
- `POST /users` - Create user
- `GET /users/:id` - Get user by ID
- `POST /auth/login` - User login

**Product Service:**
- `GET /products` - Get all products
- `POST /products` - Create product
- `GET /products/:id` - Get product by ID

**Orders Service:**
- `GET /orders` - Get all orders
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create order

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Rebuild specific service
docker-compose up --build user-service
```

## 📁 Project Structure

```
e-commerce-aaib/
├── user-service/          # User authentication service
├── product-service/       # Product catalog service
├── orders-service/        # Order management service
├── api-gateway/          # GraphQL API gateway
├── docker-compose.yml    # Container orchestration
└── README.md            # This file
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Environment variable configuration
- Container security best practices
- Input validation with class-validator

## 🚀 Production Considerations

- Update JWT secrets and database passwords
- Configure proper logging
- Set up monitoring and health checks
- Implement rate limiting
- Use managed database services
- Configure proper CORS policies

## 📚 Learning Outcomes

This project demonstrates:

- **Microservices Architecture**: Service decomposition and communication
- **Polyglot Persistence**: Using different databases for different use cases
- **API Design**: REST vs GraphQL trade-offs
- **Containerization**: Docker and Docker Compose
- **Inter-service Communication**: Synchronous HTTP calls
- **Authentication**: JWT implementation
- **TypeScript**: Static typing and modern JavaScript features
- **Nest.js**: Enterprise-grade Node.js framework

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of a mentorship program and is for educational purposes.
