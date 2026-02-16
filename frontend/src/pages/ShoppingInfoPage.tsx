import React from 'react';
import { ShoppingBag, Truck, CreditCard, Shield, Clock, MapPin } from 'lucide-react';

const ShoppingInfoPage: React.FC = () => {
    return (
        <div className="info-page">
            <div className="info-hero">
                <ShoppingBag size={60} strokeWidth={1.5} />
                <h1>Shopping Information</h1>
                <p>Everything you need to know about shopping at Beauty Fashion</p>
            </div>

            <div className="info-container">
                <div className="info-grid">
                    <div className="info-card">
                        <div className="info-icon">
                            <Truck size={40} />
                        </div>
                        <h2>Shipping & Delivery</h2>
                        <div className="info-content">
                            <h3>Delivery Options</h3>
                            <ul>
                                <li><strong>Standard Delivery:</strong> 3-5 business days (Free for orders above Rs. 5,000)</li>
                                <li><strong>Express Delivery:</strong> 1-2 business days (Rs. 500)</li>
                                <li><strong>Same Day Delivery:</strong> Available in Colombo area (Rs. 800)</li>
                            </ul>

                            <h3>Coverage Area</h3>
                            <p>We deliver island-wide across all major cities and towns in Sri Lanka including Colombo, Kandy, Galle, Jaffna, Trincomalee, and more.</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-icon">
                            <CreditCard size={40} />
                        </div>
                        <h2>Payment Methods</h2>
                        <div className="info-content">
                            <h3>Accepted Payment Options</h3>
                            <ul>
                                <li><strong>Credit/Debit Cards:</strong> Visa, Mastercard, American Express</li>
                                <li><strong>Online Banking:</strong> All major Sri Lankan banks</li>
                                <li><strong>Digital Wallets:</strong> PayPal, PayHere</li>
                                <li><strong>Cash on Delivery:</strong> Available for orders under Rs. 50,000</li>
                            </ul>

                            <h3>Secure Payments</h3>
                            <p>All transactions are encrypted with 256-bit SSL security to ensure your payment information is protected.</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-icon">
                            <Shield size={40} />
                        </div>
                        <h2>Security & Privacy</h2>
                        <div className="info-content">
                            <h3>Your Data is Safe</h3>
                            <ul>
                                <li>We never share your personal information with third parties</li>
                                <li>All data is encrypted and stored securely</li>
                                <li>Compliant with international data protection standards</li>
                                <li>Secure checkout process with verified payment gateways</li>
                            </ul>

                            <h3>Authenticity Guaranteed</h3>
                            <p>Every product sold on Beauty Fashion is 100% authentic and comes with a certificate of authenticity for premium items.</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-icon">
                            <Clock size={40} />
                        </div>
                        <h2>Order Processing</h2>
                        <div className="info-content">
                            <h3>Processing Time</h3>
                            <ul>
                                <li><strong>In-Stock Items:</strong> Orders placed before 2 PM are processed the same day</li>
                                <li><strong>Custom Orders:</strong> 5-7 business days for tailored items</li>
                                <li><strong>Pre-Order Items:</strong> As specified on product page</li>
                            </ul>

                            <h3>Order Tracking</h3>
                            <p>Track your order in real-time through your account dashboard. You'll receive SMS and email updates at every step.</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-icon">
                            <MapPin size={40} />
                        </div>
                        <h2>Pickup Options</h2>
                        <div className="info-content">
                            <h3>Store Pickup Available</h3>
                            <p>Prefer to pick up your order? Visit our store locations:</p>
                            <ul>
                                <li><strong>Colombo Showroom:</strong> No. 123, Galle Road, Colombo 03</li>
                                <li><strong>Kandy Branch:</strong> 45/2, Dalada Veediya, Kandy</li>
                            </ul>
                            <p className="pickup-note">Orders ready for pickup within 24 hours. No additional charges!</p>
                        </div>
                    </div>

                    <div className="info-card highlight-card">
                        <h2>💝 Special Offers</h2>
                        <div className="info-content">
                            <ul>
                                <li>Free shipping on orders above Rs. 5,000</li>
                                <li>Gift wrapping available (Rs. 200)</li>
                                <li>Birthday month 10% discount for registered members</li>
                                <li>Loyalty points on every purchase</li>
                                <li>Refer a friend and get Rs. 500 credit</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="info-footer-cta">
                    <h2>Ready to Shop?</h2>
                    <p>Explore our collection and enjoy a seamless shopping experience!</p>
                    <a href="/products" className="btn-primary">Start Shopping</a>
                </div>
            </div>
        </div>
    );
};

export default ShoppingInfoPage;
