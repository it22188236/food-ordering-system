# Food Ordering System

A comprehensive microservice-based food ordering platform built with Node.js, MongoDB, RabbitMQ, and modern web technologies.

## System Architecture

This project follows a microservice architecture with the following services:

- **User Service**: Handles user authentication, profiles, and preferences
- **Restaurant Service**: Manages restaurant details, menus, and availability
- **Order Service**: Processes food orders and tracks order statuses
- **Delivery Service**: Manages delivery logistics and tracks delivery personnel
- **Payment Service**: Handles payment processing and financial transactions
- **Frontend Service**: User interface for customers to interact with the system

## Technology Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Message Broker**: RabbitMQ
- **Containerization**: Docker & Docker Compose
- **Frontend**: React (presumably)

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)
- Git

## Getting Started

### Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/food-ordering-system.git
   cd food-ordering-system
   ```

2. Configure environment files:
   - Create `.env` files in each service directory:
     - `./services/user-service/.env`
     - `./services/restaurant-service/.env`
     - `./services/order-service/.env`
     - `./services/delivery-service/.env`
     - `./services/payment-service/.env`
     - `./frontend-service/.env`

3. Start the system using Docker Compose:
   ```bash
   docker-compose up
   ```

4. Access the services:
   - Frontend: http://localhost:5173
   - User Service: http://localhost:5001
   - Restaurant Service: http://localhost:5011
   - Order Service: http://localhost:5021
   - Delivery Service: http://localhost:5031
   - Payment Service: http://localhost:5041
   - RabbitMQ Management UI: http://localhost:15672 (default credentials: guest/guest)
   - MongoDB: mongodb://localhost:27017

## Service Details

### User Service
- **Port**: 5001
- **Functionality**: User registration, authentication, profile management
- **Dependencies**: MongoDB, RabbitMQ

### Restaurant Service
- **Port**: 5011
- **Functionality**: Restaurant registration, menu management, order acceptance
- **Dependencies**: MongoDB, User Service, RabbitMQ
- **Additional Features**: File uploads for menu items and restaurant images

### Order Service
- **Port**: 5021
- **Functionality**: Order creation, management, and tracking
- **Dependencies**: MongoDB, User Service, Restaurant Service, RabbitMQ

### Delivery Service
- **Port**: 5031
- **Functionality**: Delivery assignment, tracking, and status updates
- **Dependencies**: MongoDB, Order Service, User Service, Restaurant Service, RabbitMQ

### Payment Service
- **Port**: 5041
- **Functionality**: Payment processing, refunds, transaction history
- **Dependencies**: MongoDB, RabbitMQ, User Service, Restaurant Service, Order Service

### RabbitMQ
- **Ports**: 5672 (AMQP), 15672 (Management UI)
- **Functionality**: Message queuing for inter-service communication

### MongoDB
- **Port**: 27017
- **Functionality**: Primary database for all services

## Project Structure

The project follows this structure:
```
food-ordering-system/
├── services/
│   ├── user-service/
│   ├── restaurant-service/
│   ├── order-service/
│   ├── delivery-service/
│   ├── payment-service/
│   └── ... (other services)
├── shared/
│   └── ... (shared code across services)
├── frontend-service/
├── docker-compose.yml
└── README.md
```

## Inter-Service Communication

Services communicate with each other through:
1. **REST APIs**: For direct request-response patterns
2. **RabbitMQ**: For event-driven, asynchronous communication

## Development

### Local Development

For local development without Docker:

1. Set up MongoDB locally or use a cloud instance
2. Set up RabbitMQ locally or use a cloud instance
3. Configure environment variables to point to these services
4. Install dependencies for each service:
   ```bash
   cd services/[service-name]
   npm install
   npm run dev
   ```

### Shared Volume

The project uses a shared volume to facilitate file sharing between services, particularly for uploads in the restaurant service.

## Troubleshooting

### Common Issues

1. **Connection refused to RabbitMQ**
   - Check if RabbitMQ container is running: `docker ps`
   - Verify health check is passing: `docker-compose ps rabbitmq`

2. **MongoDB connection failures**
   - Ensure MongoDB container is running
   - Check connection strings in service `.env` files

3. **Services failing to start**
   - Check logs: `docker-compose logs [service-name]`
   - Verify all required environment variables are set

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## Authors

Madhubhashana G.D.I
Narangoda D.A.S
Chandrasiri G.A.S.D
