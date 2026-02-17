# E-Commerce Platform

A full-stack e-commerce web application for selling clothing and fashion items, built with Spring Boot backend and React frontend.

## 🚀 Features

- **User Authentication** - Secure JWT-based authentication with role-based access control
- **Product Management** - Browse, search, and filter products with advanced filtering options
- **Shopping Cart** - Add, update, and remove items with real-time price calculations
- **Checkout & Payment** - Integrated PayHere payment gateway for Sri Lankan market + Cash on Delivery
- **Order Management** - Track orders with status updates and email notifications
- **Admin Panel** - Complete product and order management dashboard
- **Email Notifications** - Automated order confirmation and status update emails
- **Responsive Design** - Mobile-friendly interface
- **Docker Support** - Containerized deployment with Docker Compose

## 🛠️ Technology Stack

### Backend
- **Spring Boot 4.0.1** - Java 17
- **MongoDB** - NoSQL database
- **Spring Security** - JWT authentication
- **Spring Mail** - Email notifications
- **PayHere API** - Payment processing
- **Maven** - Dependency management
- **Lombok** - Reduce boilerplate code

### Frontend
- **React 19** with **TypeScript**
- **Vite** - Fast development and build tool
- **React Router v7** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management
- **Lucide React** - Icon library
- **i18next** - Internationalization

## 📋 Prerequisites

- **Java 17** or higher
- **Node.js 16+** and npm
- **MongoDB** (local or MongoDB Atlas)
- **Maven** (or use included Maven wrapper)
- **Docker & Docker Compose** (optional, for containerized deployment)

## 🔧 Installation & Setup

### Option 1: Local Development

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Configure MongoDB connection in `application.properties`:
```properties
spring.data.mongodb.uri=your_mongodb_connection_string
```

3. Configure email settings (optional):
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
```

4. Run the backend:
```bash
./mvnw spring-boot:run
```

Backend will be available at `http://localhost:5454`

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5454
```

4. Run the frontend:
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

### Option 2: Docker Deployment

1. Ensure Docker and Docker Compose are installed

2. Update MongoDB URI in `docker-compose.yml` if needed

3. Build and run containers:
```bash
docker-compose up --build
```

- Backend: `http://localhost:8080`
- Frontend: `http://localhost:3000`

## 📁 Project Structure

```
Ecommerce/
├── backend/                    # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/example/backend/
│   │       │   ├── config/           # Security, CORS, etc.
│   │       │   ├── controller/       # REST API endpoints
│   │       │   ├── modal/            # Data models
│   │       │   ├── repository/       # MongoDB repositories
│   │       │   ├── service/          # Business logic
│   │       │   └── user/             # User domain
│   │       └── resources/
│   │           └── application.properties
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── api/               # API integration
│   │   ├── components/        # React components
│   │   ├── context/           # Context providers
│   │   ├── hooks/             # Custom hooks
│   │   ├── pages/             # Page components
│   │   ├── styles/            # CSS files
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Utility functions
│   ├── Dockerfile
│   └── package.json
│
└── docker-compose.yml         # Docker orchestration
```

## 🔑 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/signin` - User login

### Products
- `GET /api/products` - Get products with filters
- `GET /api/products/id/:id` - Get product by ID
- `GET /api/products/search` - Search products

### Cart
- `GET /api/cart/` - Get user cart
- `PUT /api/cart/add` - Add item to cart
- `PUT /api/cart_items/:id` - Update cart item
- `DELETE /api/cart_items/:id` - Remove cart item

### Orders
- `POST /api/orders/` - Create order
- `GET /api/orders/user` - Get user order history
- `GET /api/orders/:id` - Get order details

### Admin (Requires Admin Role)
- `GET /api/admin/products/all` - Get all products
- `POST /api/admin/products/` - Create product
- `PUT /api/admin/products/:id/update` - Update product
- `DELETE /api/admin/products/:id/delete` - Delete product
- `GET /api/admin/orders/` - Get all orders
- `PUT /api/admin/orders/:id/placed` - Mark order as placed
- `PUT /api/admin/orders/:id/confirmed` - Confirm order
- `PUT /api/admin/orders/:id/ship` - Ship order
- `PUT /api/admin/orders/:id/deliver` - Deliver order
- `PUT /api/admin/orders/:id/cancel` - Cancel order

## 👤 Default Admin Account

After initial setup, create an admin user through the signup endpoint with role `ADMIN`.

## 🎨 Features in Detail

### User Features
- Browse products by category (Men, Women, Kids)
- Advanced filtering (price, color, size, brand)
- Product search functionality
- Add products to cart with size selection
- Secure checkout process
- Multiple payment options (PayHere, Cash on Delivery)
- Order tracking and history
- Email notifications for order updates

### Admin Features
- Product CRUD operations
- Upload product images
- Manage product inventory
- View all orders
- Update order status
- User management
- Dashboard with statistics

## 🚢 Deployment

### Production Build

#### Backend
```bash
cd backend
./mvnw clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

#### Frontend
```bash
cd frontend
npm run build
```

The build output will be in the `dist/` directory. Serve it with any static file server.

## 🔒 Environment Variables

### Backend
- `SPRING_DATA_MONGODB_URI` - MongoDB connection string
- `SPRING_MAIL_USERNAME` - Email for notifications
- `SPRING_MAIL_PASSWORD` - Email password/app password

### Frontend
- `VITE_API_BASE_URL` - Backend API URL

## 🐛 Troubleshooting

**Backend won't start:**
- Check MongoDB connection string
- Ensure Java 17 is installed
- Verify port 5454 is available

**Frontend can't connect to backend:**
- Verify backend is running
- Check CORS configuration
- Ensure `.env` file has correct API URL

**Payment integration issues:**
- Verify PayHere credentials in backend
- Check return/cancel URLs configuration

## 📝 License

This project is a demonstration e-commerce platform.

## 🤝 Contributing

This is a personal project. For issues or suggestions, please contact the development team.

## 📧 Support

For questions and support, please reach out to the project maintainer.
