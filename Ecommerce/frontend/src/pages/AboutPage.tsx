import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
    return (
        <div className="about-page">
            <div className="about-container">
                <section className="about-hero">
                    <h1>About Beauty Fashion</h1>
                    <p className="tagline">Your Premium Destination for Sri Lankan Fashion</p>
                </section>

                <section className="about-content">
                    <div className="about-section">
                        <h2>Our Story</h2>
                        <p>
                            Welcome to Beauty Fashion, Sri Lanka's premier online fashion destination.
                            Since our inception, we've been committed to bringing you the finest
                            selection of traditional and contemporary fashion that celebrates the
                            rich cultural heritage of Sri Lanka while embracing modern design trends.
                        </p>
                        <p>
                            From elegant sarees and traditional batik to modern formal wear and
                            casual island styles, our curated collection represents the best of
                            Sri Lankan craftsmanship and global fashion trends.
                        </p>
                    </div>

                    <div className="about-section">
                        <h2>Our Mission</h2>
                        <p>
                            To make premium Sri Lankan fashion accessible to everyone, everywhere.
                            We believe in celebrating our cultural identity while staying at the
                            forefront of fashion innovation.
                        </p>
                    </div>

                    <div className="about-section">
                        <h2>Why Choose Us?</h2>
                        <div className="features-grid">
                            <div className="feature-card">
                                <span className="feature-icon">✨</span>
                                <h3>Premium Quality</h3>
                                <p>Carefully curated collection of the finest fabrics and designs</p>
                            </div>
                            <div className="feature-card">
                                <span className="feature-icon">🇱🇰</span>
                                <h3>Local Heritage</h3>
                                <p>Celebrating Sri Lankan culture through traditional and fusion fashion</p>
                            </div>
                            <div className="feature-card">
                                <span className="feature-icon">🚚</span>
                                <h3>Island-wide Delivery</h3>
                                <p>Fast and reliable shipping across Sri Lanka</p>
                            </div>
                            <div className="feature-card">
                                <span className="feature-icon">💎</span>
                                <h3>Authentic Products</h3>
                                <p>Genuine materials including Sri Lankan gems and traditional textiles</p>
                            </div>
                        </div>
                    </div>

                    <div className="about-section">
                        <h2>Our Values</h2>
                        <ul className="values-list">
                            <li><strong>Quality First:</strong> We never compromise on the quality of our products</li>
                            <li><strong>Cultural Pride:</strong> Supporting local artisans and traditional crafts</li>
                            <li><strong>Customer Satisfaction:</strong> Your happiness is our success</li>
                            <li><strong>Sustainable Fashion:</strong> Promoting eco-friendly and ethical practices</li>
                        </ul>
                    </div>

                    <div className="about-cta">
                        <h2>Ready to Explore?</h2>
                        <p>Discover our stunning collection of Sri Lankan fashion today!</p>
                        <Link to="/products" className="btn-primary">Shop Now</Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;
