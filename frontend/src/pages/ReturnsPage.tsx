import React from 'react';
import { RotateCcw, CheckCircle, XCircle, AlertCircle, Package } from 'lucide-react';

const ReturnsPage: React.FC = () => {
    return (
        <div className="info-page">
            <div className="info-hero returns-hero">
                <RotateCcw size={60} strokeWidth={1.5} />
                <h1>Returns & Exchanges</h1>
                <p>We want you to love your purchase! Easy returns within 14 days.</p>
            </div>

            <div className="info-container">
                <div className="returns-summary">
                    <div className="summary-card">
                        <CheckCircle size={48} className="icon-success" />
                        <h3>14 Day Returns</h3>
                        <p>Return any item within 14 days of delivery</p>
                    </div>
                    <div className="summary-card">
                        <Package size={48} className="icon-info" />
                        <h3>Free Returns</h3>
                        <p>No charges for return pickup</p>
                    </div>
                    <div className="summary-card">
                        <RotateCcw size={48} className="icon-primary" />
                        <h3>Easy Process</h3>
                        <p>Simple 3-step return procedure</p>
                    </div>
                </div>

                <div className="info-section">
                    <h2>Return Policy</h2>
                    <div className="policy-content">
                        <p className="lead-text">
                            We stand behind the quality of our products. If you're not completely satisfied
                            with your purchase, we're here to help with returns and exchanges.
                        </p>

                        <div className="eligibility-section">
                            <div className="eligible-box">
                                <h3><CheckCircle className="inline-icon success" /> Eligible for Return</h3>
                                <ul>
                                    <li>Items in original condition with tags attached</li>
                                    <li>Unworn and unwashed garments</li>
                                    <li>Original packaging intact</li>
                                    <li>Returned within 14 days of delivery</li>
                                    <li>Receipt or proof of purchase included</li>
                                </ul>
                            </div>

                            <div className="ineligible-box">
                                <h3><XCircle className="inline-icon error" /> Not Eligible for Return</h3>
                                <ul>
                                    <li>Worn, washed, or altered items</li>
                                    <li>Items without original tags</li>
                                    <li>Undergarments and swimwear (for hygiene reasons)</li>
                                    <li>Customized or personalized products</li>
                                    <li>Sale or clearance items (unless defective)</li>
                                    <li>Items purchased over 14 days ago</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="info-section">
                    <h2>How to Return an Item</h2>
                    <div className="steps-container">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3>Initiate Return</h3>
                            <p>Log in to your account, go to Order History, and select the item you want to return. Click "Return Item" and choose a reason.</p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3>Pack Your Item</h3>
                            <p>Carefully pack the item in its original packaging with all tags attached. Include the return slip printed from your account.</p>
                        </div>

                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3>Schedule Pickup</h3>
                            <p>Our courier partner will collect the package from your address. You'll receive a confirmation once the return is processed.</p>
                        </div>
                    </div>
                </div>

                <div className="info-section">
                    <h2>Refund Information</h2>
                    <div className="refund-info-grid">
                        <div className="refund-card">
                            <h3>Processing Time</h3>
                            <p>Returns are processed within <strong>5-7 business days</strong> after we receive your item.</p>
                        </div>

                        <div className="refund-card">
                            <h3>Refund Method</h3>
                            <p>Refunds are issued to your <strong>original payment method</strong>. Bank transfers may take 3-5 days.</p>
                        </div>

                        <div className="refund-card">
                            <h3>Partial Refunds</h3>
                            <p>Items returned in less than perfect condition may receive a <strong>partial refund</strong> at our discretion.</p>
                        </div>

                        <div className="refund-card">
                            <h3>Shipping Costs</h3>
                            <p>Original shipping fees are <strong>non-refundable</strong> unless the return is due to our error.</p>
                        </div>
                    </div>
                </div>

                <div className="info-section">
                    <h2>Exchanges</h2>
                    <div className="exchange-content">
                        <p>
                            Want to exchange for a different size or color? We've made it simple!
                            Follow the return process above and place a new order for the item you want.
                            This ensures you get your preferred item as quickly as possible.
                        </p>
                        <div className="exchange-note">
                            <AlertCircle className="inline-icon" />
                            <p><strong>Pro Tip:</strong> To guarantee availability, place your new order before returning the original item.</p>
                        </div>
                    </div>
                </div>

                <div className="info-section">
                    <h2>Damaged or Defective Items</h2>
                    <div className="damage-content">
                        <p>
                            If you receive a damaged or defective item, please contact us immediately at
                            <strong> support@beautyfashion.lk</strong> or call <strong>+94 11 234 5678</strong>.
                        </p>
                        <ul>
                            <li>Take clear photos of the defect or damage</li>
                            <li>Include your order number in the email</li>
                            <li>We'll arrange a free replacement or full refund</li>
                            <li>Priority processing for defective items</li>
                        </ul>
                    </div>
                </div>

                <div className="info-footer-cta">
                    <h2>Need Help?</h2>
                    <p>Our customer service team is here to assist you with any questions about returns or exchanges.</p>
                    <a href="/contact" className="btn-primary">Contact Us</a>
                </div>
            </div>
        </div>
    );
};

export default ReturnsPage;
