import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { Product } from '../types/product.types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MainCarousel from '../components/home/MainCarousel';
import DressCarousel from '../components/home/DressCarousel';
import { formatPrice } from '../utils/currency';

const HomePage: React.FC = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const products = await productApi.getRecentProducts();
            console.log('Fetched Featured Products:', products);
            if (Array.isArray(products)) {
                setFeaturedProducts(products.slice(0, 8));
            } else {
                console.error("Expected array but got:", products);
                setFeaturedProducts([]);
            }
        } catch (error) {
            console.error('Failed to fetch featured products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-page">

            {/* Main Carousel - Full Width */}
            <div className="hero-main" style={{ width: '100%', overflow: 'hidden', marginBottom: '40px' }}>
                <MainCarousel />
            </div>



            <DressCarousel />

            <section className="featured-section">
                <div className="container">
                    <h2 className="section-title">Featured Products</h2>

                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="product-grid">
                            {featuredProducts.map((product) => (
                                <Link key={product.id} to={`/products/${product.id}`} className="product-card">
                                    <div className="product-image">
                                        <img src={product.imageUrl || '/placeholder-dress.jpg'} alt={product.title} />
                                        {product.discountPersent > 0 && (
                                            <span className="discount-badge">-{product.discountPersent}%</span>
                                        )}
                                    </div>
                                    <div className="product-info">
                                        <h3>{product.title}</h3>
                                        <p className="product-brand">{product.brand}</p>
                                        <div className="product-price">
                                            <span className="current-price">{formatPrice(product.discountedPrice)}</span>
                                            {product.discountPersent > 0 && (
                                                <span className="original-price">{formatPrice(product.price)}</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="view-all-container">
                        <Link to="/products" className="btn-view-all">View All Products</Link>
                    </div>
                </div>
            </section>

            <section className="benefits-section">
                <div className="container">
                    <div className="benefits-grid">
                        <div className="benefit-item">
                            <h3>🚚 Free Delivery</h3>
                            <p>Free shipping on orders over Rs. 10,000</p>
                        </div>
                        <div className="benefit-item">
                            <h3>💳 Secure Payment</h3>
                            <p>Pay securely with PayHere</p>
                        </div>
                        <div className="benefit-item">
                            <h3>🔄 Easy Returns</h3>
                            <p>14-day return policy</p>
                        </div>
                        <div className="benefit-item">
                            <h3>⭐ Quality Guarantee</h3>
                            <p>Premium quality dresses</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
