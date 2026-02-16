import React, { useState } from 'react';

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement actual form submission to backend
        console.log('Contact form submitted:', formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

    return (
        <div className="contact-page">
            <div className="contact-container">
                <section className="contact-hero">
                    <h1>Contact Us</h1>
                    <p>We'd love to hear from you! Get in touch with our team.</p>
                </section>

                <div className="contact-content">
                    <div className="contact-info">
                        <h2>Get In Touch</h2>

                        <div className="info-item">
                            <span className="info-icon">📍</span>
                            <div>
                                <h3>Our Location</h3>
                                <p>123 Galle Road,<br />Colombo 03,<br />Sri Lanka</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <span className="info-icon">📞</span>
                            <div>
                                <h3>Phone</h3>
                                <p>+94 11 234 5678</p>
                                <p>+94 77 123 4567</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <span className="info-icon">✉️</span>
                            <div>
                                <h3>Email</h3>
                                <p>info@beautyfashion.lk</p>
                                <p>support@beautyfashion.lk</p>
                            </div>
                        </div>

                        <div className="info-item">
                            <span className="info-icon">🕒</span>
                            <div>
                                <h3>Business Hours</h3>
                                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                                <p>Saturday: 10:00 AM - 4:00 PM</p>
                                <p>Sunday: Closed</p>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-section">
                        <h2>Send Us a Message</h2>

                        {submitted && (
                            <div className="success-message">
                                ✅ Thank you for your message! We'll get back to you soon.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label htmlFor="name">Your Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email Address *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Subject *</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    placeholder="What is this regarding?"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Message *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows={6}
                                    placeholder="Tell us more about your inquiry..."
                                />
                            </div>

                            <button type="submit" className="btn-primary">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
