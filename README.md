# Sneaker API - Express.js

A comprehensive Express.js REST API for managing sneaker e-commerce operations including products, users, orders, cart management, and more.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [API Routes](#api-routes)
- [Docker Setup](#docker-setup)
- [Technologies Used](#technologies-used)

## 🎯 Project Overview

This is a full-featured e-commerce API built with Express.js and Sequelize ORM. It provides endpoints for:

- User authentication & authorization
- Product management (with images, colors, sizes)
- Shopping cart operations
- Order management
- Product reviews & ratings
- Wishlist & favorites
- Coupon management
- Category & brand management

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **PostgreSQL** database (local or remote)
- **Docker** & **Docker Compose** (for containerized deployment)
- **Git**

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd SneakerApiExpress-Js
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

The project supports multiple environment profiles:

#### For Development:

```bash
cp .env.dev .env
# Then edit .env with your development database credentials
```

#### For Production:

```bash
nano .env.production
# Add your production database and credentials
```

## 🔧 Environment Setup

### Development Environment (.env.dev)

```env
PORT=3001
DB_HOST=your_dev_db_host
DB_USER=your_dev_db_user
DB_PASSWORD=your_dev_db_password
DB_NAME=your_dev_db_name
DB_PORT=5432
DB_SSL=true
JWT_ACCESS_SECRET=your_dev_access_secret
JWT_ACCESS_EXPIRED_IN="15m"
JWT_REFRESH_SECRET=your_dev_refresh_secret
JWT_REFRESH_EXPIRED_IN="7d"
BCRYPT_SALT_ROUNDS=10
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=development
```

### Production Environment (.env.production)

Update with production values:

- Production database credentials
- Production JWT secrets
- Production Cloudinary account

## ▶️ Running the Project

### Development Mode (Recommended for Development)

```bash
npm run dev
```

- Uses `.env.dev` configuration
- Runs with **nodemon** (auto-restart on file changes)
- Server starts on `http://localhost:3001`

### Production Mode

```bash
npm start
```

- Uses `.env.production` configuration
- Runs standard Node.js
- Server starts on `http://localhost:3001`

## 📁 Project Structure

```
src/
├── config/              # Configuration files
│   ├── cloudinary.js
│   └── SequelizeORM.js
├── controllers/         # Route handlers
├── middlewares/         # Express middlewares
│   └── request/         # Validation schemas
├── models/              # Database models
├── routes/              # API endpoints
├── services/            # Business logic
└── utils/               # Helper utilities
tests/                   # Jest tests
public/uploads/          # File uploads
```

## 🛠️ Available Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start with auto-reload (development) |
| `npm start`        | Start production server              |
| `npm test`         | Run tests                            |
| `npm run lint`     | Check linting                        |
| `npm run lint:fix` | Fix linting issues                   |
| `npm run format`   | Format code with Prettier            |

## 🔌 API Routes

### Authentication

- `POST /v1/api/auth/register` - Register user
- `POST /v1/api/auth/login` - Login user
- `POST /v1/api/auth/refresh-token` - Refresh token

### Products

- `GET /v1/api/products` - Get all products
- `GET /v1/api/products/:id` - Get product
- `POST /v1/api/products` - Create (admin)
- `PATCH /v1/api/products/:id` - Update (admin)
- `DELETE /v1/api/products/:id` - Delete (admin)

### Cart

- `GET /v1/api/cart` - Get cart
- `POST /v1/api/cart/add` - Add item
- `PATCH /v1/api/cart/update` - Update quantity
- `DELETE /v1/api/cart/:productId` - Remove item
- `DELETE /v1/api/cart/clear` - Clear cart

### Orders

- `GET /v1/api/orders` - Get orders
- `POST /v1/api/orders/checkout` - Create order
- `GET /v1/api/orders/:id` - Get order details
- `PATCH /v1/api/orders/:id` - Update status (admin)

### Other Endpoints

- `/v1/api/reviews` - Product reviews
- `/v1/api/wishlist` - Wishlist management
- `/v1/api/favorites` - Favorites management
- `/v1/api/coupons` - Coupon management
- `/v1/api/users` - User management

## 🐳 Docker Setup

### Option 1: Docker Compose (Recommended)

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Option 2: Manual Docker

```bash
# Build image
docker build -t sneaker-api .

# Run container
docker run -p 3001:3001 --env-file .env.production sneaker-api
```

## 🔐 Database Setup

1. Ensure PostgreSQL is running
2. Create database if needed:
   ```sql
   CREATE DATABASE neondb;
   ```
3. Update credentials in `.env.dev` or `.env.production`
4. Sequelize auto-creates tables on first connection

## 📚 Technologies Used

- **Express.js** - Web framework
- **Sequelize** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image hosting
- **Multer** - File uploads
- **Jest** - Testing
- **Docker** - Containerization

## 🚨 Troubleshooting

### Port Already in Use

```bash
lsof -ti:3001 | xargs kill -9
```

### Database Connection Error

- Verify database credentials in `.env`
- Ensure PostgreSQL is running
- Check network connectivity

### Dependencies Error

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

ISC

---

**Happy Coding! 🎉**
