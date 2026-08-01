# Food Delivery Backend

A modern Node.js and Express backend for a food delivery application with authentication, restaurant management, menu handling, cart operations, orders, payments, reviews, and user addresses. The project is built with Prisma ORM and PostgreSQL, and includes role-based access control for customers, owners, and administrators.

<img src="Relational_Schema.png" alt="Relational schema" />

## Overview

This backend powers the core business logic for a food ordering platform. It exposes a clean REST API for:

- User registration, login, password reset, and profile management
- Restaurant and menu item management
- Customer cart and address handling
- Review submissions for restaurants
- Order creation, tracking, and cancellation
- Payment status management

## Features

- JWT-based authentication and authorization
- Password hashing with bcrypt
- Email-based password reset flow
- Rate limiting and request validation
- Prisma-managed relational data model
- Role-based access for admins and restaurant owners
- Modular controller, service, route, and middleware structure

## Tech Stack

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT
- bcryptjs
- nodemailer
- express-validator
- express-rate-limit

## Project Structure

```text
src/
  config/          # Prisma client and environment configuration
  controllers/     # Request handlers
  middleware/      # Auth, role, and validation middleware
  routes/          # API route definitions
  services/        # Business logic
  utils/           # JWT, password, email, and error helpers
prisma/
  schema.prisma    # Database schema and enums
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/ahmedharidy2004/Food-Delivery-Backend.git
   cd Food-Delivery-Backend
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Configure environment variables

   Create a `.env` file in the project root with the following variables:

   ```env
   PORT=8000
   DATABASE_URL=postgresql://username:password@localhost:5432/food_delivery
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   EMAIL_HOST=sandbox.smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USERNAME=your_email_username
   EMAIL_PASSWORD=your_email_password
   ```

4. Create and apply the database schema

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. Start the server
   ```bash
   npm start
   ```

The server will run on the port defined in your `.env` file, or on port `3000` by default.

## Available Scripts

```bash
npm start      # Start the development server with auto-reload
npm test       # Run the app directly with tsx
```

## API Overview

### Authentication

- `POST /auth/signup`
- `POST /auth/login`
- `PATCH /auth/updatePassword`
- `POST /auth/forgetPassword`
- `PATCH /auth/resetPassword/:token`

### Core Resources

- `GET /restaurants`
- `GET /menuItems`
- `GET /cart`
- `GET /addresses`
- `GET /reviews/:restaurantId`
- `POST /orders`
- `GET /payments/:id`

## Database Model

The Prisma schema includes the following main models:

- User
- Restaurant
- Category
- MenuItem
- Address
- Cart and CartItem
- Review
- Order and OrderItem
- Payment

## License

This project is licensed under the MIT License.
