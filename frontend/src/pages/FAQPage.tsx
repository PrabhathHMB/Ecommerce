import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const FAQPage: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const faqs: FAQItem[] = [
        {
            category: 'Orders',
            question: 'How do I place an order?',
            answer: 'Browse our products, add items to your cart, and proceed to checkout. You\'ll need to create an account or log in. Fill in your shipping details, choose a payment method, and confirm your order. You\'ll receive an order confirmation email immediately.'
        },
        {
            category: 'Orders',
            question: 'Can I modify or cancel my order?',
            answer: 'Orders can be modified or cancelled within 2 hours of placement. After that, the order enters processing and cannot be changed. Please contact our customer service immediately if you need to make changes.'
        },
        {
            category: 'Orders',
            question: 'How can I track my order?',
            answer: 'Once your order ships, you\'ll receive a tracking number via email and SMS. You can also track your order by logging into your account and visiting the Order History page. Real-time updates are available 24/7.'
        },
        {
            category: 'Shipping',
            question: 'What are your shipping charges?',
            answer: 'Standard shipping is FREE for orders above Rs. 5,000. For orders below that, standard shipping costs Rs. 300. Express delivery (1-2 days) costs Rs. 500, and same-day delivery in Colombo is Rs. 800.'
        },
        {
            category: 'Shipping',
            question: 'How long does delivery take?',
            answer: 'Standard delivery takes 3-5 business days. Express delivery arrives in 1-2 business days. Same-day delivery is available for orders placed before 12 PM in the Colombo area. Delivery times may vary during festive seasons.'
        },
        {
            category: 'Shipping',
            question: 'Do you deliver internationally?',
            answer: 'Currently, we only deliver within Sri Lanka to all major cities and towns. We\'re working on expanding our international shipping and will announce when it becomes available. Sign up for our newsletter to stay updated!'
        },
        {
            category: 'Payment',
            question: 'What payment methods do you accept?',
            answer: 'We accept Visa, Mastercard, American Express credit/debit cards, online banking from all major Sri Lankan banks, PayPal, PayHere wallet, and Cash on Delivery for orders under Rs. 50,000.'
        },
        {
            category: 'Payment',
            question: 'Is it safe to use my credit card on your site?',
            answer: 'Absolutely! We use 256-bit SSL encryption and PCI DSS compliant payment gateways. Your card information is never stored on our servers and goes directly to the payment processor. All transactions are secure and protected.'
        },
        {
            category: 'Payment',
            question: 'Do you offer Cash on Delivery?',
            answer: 'Yes! Cash on Delivery is available for orders under Rs. 50,000. A small COD fee of Rs. 100 applies. Please have the exact amount ready when our courier arrives for smooth delivery.'
        },
        {
            category: 'Returns',
            question: 'What is your return policy?',
            answer: 'We offer a 14-day return policy for most items. Products must be in original condition with tags attached, unworn and unwashed. Simply log into your account, go to Order History, and initiate a return. We\'ll arrange free pickup from your location.'
        },
        {
            category: 'Returns',
            question: 'How long does it take to get my refund?',
            answer: 'Refunds are processed within 5-7 business days after we receive your returned item. The refund is issued to your original payment method. Bank transfers may take an additional 3-5 business days to reflect in your account.'
        },
        {
            category: 'Returns',
            question: 'Can I exchange an item for a different size?',
            answer: 'We recommend placing a new order for the correct size and returning the original item. This ensures you get your preferred size quickly without waiting for the return to process. You can also contact our support team for assistance.'
        },
        {
            category: 'Products',
            question: 'Are your products authentic?',
            answer: '100% yes! All products sold on Beauty Fashion are authentic and sourced directly from authorized dealers and local artisans. Premium items come with a certificate of authenticity. We have a zero-tolerance policy for counterfeit products.'
        },
        {
            category: 'Products',
            question: 'How do I know what size to order?',
            answer: 'Each product page has a detailed size chart. Click "Size Guide" to see measurements. If you\'re between sizes, we recommend ordering the larger size. You can also contact our customer service for personalized sizing advice based on your measurements.'
        },
        {
            category: 'Products',
            question: 'Do you offer custom tailoring?',
            answer: 'Yes! We offer custom tailoring for select items including sarees, formal wear, and traditional attire. Custom orders take 5-7 business days. Contact us with your measurements and requirements for a personalized quote.'
        },
        {
            category: 'Account',
            question: 'Why should I create an account?',
            answer: 'Creating an account lets you track orders, save your favorite items to a wishlist, store multiple addresses, get personalized recommendations, earn loyalty points, and receive exclusive member-only offers and early access to sales!'
        },
        {
            category: 'Account',
            question: 'I forgot my password. What should I do?',
            answer: 'Click "Forgot Password" on the login page and enter your email address. We\'ll send you a password reset link. If you don\'t receive it within a few minutes, check your spam folder or contact customer support.'
        },
        {
            category: 'Account',
            question: 'How do I earn and use loyalty points?',
            answer: 'You earn 1 point for every Rs. 100 spent. Points can be redeemed for discounts on future purchases (100 points = Rs. 100 off). Points expire after 12 months. Check your account dashboard to see your current points balance.'
        }
    ];

    const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];

    const filteredFAQs = faqs.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="faq-page">
            <div className="info-hero faq-hero">
                <HelpCircle size={60} strokeWidth={1.5} />
                <h1>Frequently Asked Questions</h1>
                <p>Find answers to common questions about shopping with Beauty Fashion</p>
            </div>

            <div className="faq-container">
                <div className="faq-search-section">
                    <div className="search-wrapper">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="faq-search-input"
                        />
                    </div>

                    <div className="faq-categories">
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="faq-list">
                    {filteredFAQs.length > 0 ? (
                        filteredFAQs.map((faq, index) => (
                            <div key={index} className="faq-item">
                                <button
                                    className={`faq-question ${activeIndex === index ? 'active' : ''}`}
                                    onClick={() => toggleFAQ(index)}
                                >
                                    <span className="category-tag">{faq.category}</span>
                                    <span className="question-text">{faq.question}</span>
                                    <span className="faq-icon">
                                        {activeIndex === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </span>
                                </button>
                                {activeIndex === index && (
                                    <div className="faq-answer">
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            <HelpCircle size={48} />
                            <p>No matching questions found. Try a different search term or browse all categories.</p>
                        </div>
                    )}
                </div>

                <div className="faq-contact-section">
                    <h2>Still Have Questions?</h2>
                    <p>Can't find the answer you're looking for? Our customer support team is here to help!</p>
                    <div className="contact-options">
                        <a href="/contact" className="btn-primary">Contact Support</a>
                        <a href="tel:+94112345678" className="btn-secondary">Call Us: +94 786465739</a>
                    </div>
                    <p className="support-hours">Customer Support: Monday - Saturday, 9:00 AM - 6:00 PM</p>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
