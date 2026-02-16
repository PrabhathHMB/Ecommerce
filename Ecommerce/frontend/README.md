# E-Commerce Frontend

A modern, full-featured e-commerce frontend built with React and TypeScript for a dress-selling online store.

## Features

✅ **User Authentication** - Secure login and signup with JWT tokens  
✅ **Product Catalog** - Browse products with advanced filtering and search  
✅ **Shopping Cart** - Add, update, and remove items from cart  
✅ **Checkout** - Complete checkout with shipping address  
✅ **PayHere Payment** - Secure payment processing for Sri Lankan market  
✅ **Order Management** - View order history and track orders  
✅ **Admin Panel** - Complete product and order management (admin users only)  
✅ **Responsive Design** - Mobile-friendly interface  

## Technology Stack

- **React 18** with **TypeScript**
- **Vite** for fast development
- **React Router v6** for navigation
- **Axios** for API requests
- **Context API** for state management
- **Vanilla CSS** for styling

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running on `http://localhost:5454`

## Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

## Configuration

Update the `.env` file with your backend API URL:

```env
VITE_API_BASE_URL=http://localhost:5454
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── api/                # API integration layer
│   ├── components/         # Reusable components
│   │   ├── common/        # Common UI components
│   │   ├── product/       # Product-related components
│   │   ├── cart/          # Cart components
│   │   ├── order/         # Order components
│   │   └── admin/         # Admin panel components
│   ├── context/           # React Context providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page components
│   │   └── admin/         # Admin pages
│   ├── styles/            # CSS stylesheets
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.tsx            # Main app component
│   └── main.tsx           # Application entry point
├── .env                   # Environment variables
├── package.json           # Dependencies
└── vite.config.ts         # Vite configuration
```

## Available Routes

### Public Routes
- `/` - Homepage
- `/login` - User login
- `/signup` - User registration
- `/products` - Product listing
- `/products/:id` - Product details

### Protected Routes (Requires Authentication)
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/orders` - Order history
- `/orders/:id` - Order details

### Admin Routes (Requires Admin Role)
- `/admin` - Admin dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management

## API Integration

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login

### Products
- `GET /api/products` - Get products with filters
- `GET /api/products/id/:id` - Get product by ID
- `GET /api/products/search` - Search products

### Cart
- `GET /api/cart/` - Get user's cart
- `PUT /api/cart/add` - Add item to cart
- `PUT /api/cart_items/:id` - Update cart item
- `DELETE /api/cart_items/:id` - Remove cart item

### Orders
- `POST /api/orders/` - Create order
- `GET /api/orders/user` - Get order history
- `GET /api/orders/:id` - Get order details

### Payment
- `POST /api/payments/:orderId` - Initiate PayHere payment

### Admin
- `GET /api/admin/products/all` - Get all products
- `POST /api/admin/products/` - Create product
- `PUT /api/admin/products/:id/update` - Update product
- `DELETE /api/admin/products/:id/delete` - Delete product
- `GET /api/admin/orders/` - Get all orders
- `PUT /api/admin/orders/:id/confirmed` - Confirm order
- `PUT /api/admin/orders/:id/ship` - Ship order
- `PUT /api/admin/orders/:id/deliver` - Deliver order
- `PUT /api/admin/orders/:id/cancel` - Cancel order

## Features in Detail

### User Authentication
- JWT token-based authentication
- Automatic token refresh
- Protected routes with role-based access control
- Secure password handling

### Product Browsing
- Advanced filtering (price, color, size, category)
- Product search functionality
- Pagination support
- Product detail view with image gallery

### Shopping Cart
- Add products with size selection
- Update quantities
- Remove items
- Real-time price calculations
- Persistent cart across sessions

### Checkout & Payment
- Shipping address form
- PayHere payment gateway integration
- Secure payment processing
- Order confirmation

### Admin Panel
- Product CRUD operations
- Order management with status updates
- Dashboard with statistics
- Role-based access control

## Development

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Context API for global state
- Modular CSS with BEM-like naming

### State Management
- AuthContext for user authentication
- CartContext for cart state
- Custom hooks for shared logic

## Troubleshooting

### Common Issues

**Backend Connection Error**
- Ensure backend is running on `http://localhost:5454`
- Check CORS configuration on backend
- Verify `.env` file configuration

**Authentication Issues**
- Clear browser localStorage
- Check JWT token expiration
- Verify backend authentication endpoints

**Payment Integration**
- Ensure PayHere credentials are configured in backend
- Check PayHere sandbox/production mode
- Verify return/cancel URLs match

## License

This project is part of a dress-selling e-commerce platform.

## Support

For issues and questions, please contact the development team.
