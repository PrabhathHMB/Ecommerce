import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ChatBot from './components/common/ChatBot';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailPage from './pages/OrderDetailPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentCancelPage from './pages/PaymentCancelPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ShoppingInfoPage from './pages/ShoppingInfoPage';
import ReturnsPage from './pages/ReturnsPage';
import FAQPage from './pages/FAQPage';
import Wishlist from './components/wishlist/Wishlist';
import './styles/index.css';

const App: React.FC = () => {
  console.log('App.tsx: rendering');
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <Navbar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:productId" element={<ProductDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/shopping-info" element={<ShoppingInfoPage />} />
                <Route path="/returns" element={<ReturnsPage />} />
                <Route path="/faq" element={<FAQPage />} />

                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrderHistoryPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/wishlist"
                  element={
                    <ProtectedRoute>
                      <Wishlist />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/orders/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderDetailPage />
                    </ProtectedRoute>
                  }
                />

                <Route path="/payment/success" element={<PaymentSuccessPage />} />
                <Route path="/payment/cancel" element={<PaymentCancelPage />} />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminProducts />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminOrders />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminUsers />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
            <ChatBot />
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
