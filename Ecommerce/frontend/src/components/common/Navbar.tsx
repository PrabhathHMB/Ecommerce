import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import '../../styles/navbar.css';

const Navbar: React.FC = () => {
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const { cartItemCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand">
                    <img src="/assets/logo.png" alt="Beauty Fashion" className="navbar-logo" />
                </Link>

                <button
                    className="navbar-toggle"
                    onClick={toggleMenu}
                    aria-label="Toggle navigation"
                >
                    <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
                </button>

                <div className={`navbar-content ${isMenuOpen ? 'active' : ''}`}>
                    <div className="navbar-center">
                        <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
                        <Link to="/products" className="nav-link" onClick={closeMenu}>Products</Link>
                        {isAuthenticated && (
                            <Link to="/orders" className="nav-link" onClick={closeMenu}>Orders</Link>
                        )}
                        <Link to="/wishlist" className="nav-link" aria-label="Wishlist" onClick={closeMenu}>
                            Wishlist
                        </Link>
                    </div>

                    <div className="navbar-right">
                        <Link to="/cart" className="nav-link cart-link" aria-label="Cart" onClick={closeMenu}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
                        </Link>

                        {isAuthenticated ? (
                            <>
                                {isAdmin && (
                                    <Link to="/admin" className="nav-link admin-link" onClick={closeMenu}>
                                        <span className="admin-icon">⚙️ Admin Panel</span>
                                    </Link>
                                )}

                                <div className="user-menu">
                                    <span className="user-name">{user?.firstName}</span>
                                    <button onClick={() => { logout(); closeMenu(); }} className="btn-logout">Logout</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="nav-link" onClick={closeMenu}>Login</Link>
                                <Link to="/signup" className="btn-signup" onClick={closeMenu}>Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
