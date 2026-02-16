import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/currency';
import './DressCarousel.css';

interface DressSlide {
    id: string; // Changed to string to support MongoDB ObjectIds
    title: string;
    subtitle: string;
    price: string;
    image: string;
    category: string;
}

const DressCarousel: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const [dressSlides, setDressSlides] = useState<DressSlide[]>([]);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                // Fetch high-value or featured products
                const products = await import('../../api/productApi').then(m => m.productApi.getRecentProducts());

                const slides = products.slice(0, 5).map((p) => ({
                    id: p.id, // Use string ID directly
                    title: p.title,
                    subtitle: p.brand || "Premium Collection",
                    price: formatPrice(p.discountedPrice),
                    image: p.imageUrl || '/images/hero-background.png',
                    category: p.category?.name || "Featured"
                }));

                if (slides.length > 0) {
                    setDressSlides(slides);
                } else {
                    // Fallback to static if no products or API fails silently with empty array
                    setDressSlides(STATIC_SLIDES);
                }
            } catch (err) {
                console.error("Failed to load carousel slides", err);
                setDressSlides(STATIC_SLIDES);
            }
        };

        fetchSlides();
    }, []);

    const STATIC_SLIDES: DressSlide[] = [
        {
            id: '1',
            title: "Emerald Evening Gown",
            subtitle: "Formal Collection",
            price: "Rs. 15,999",
            image: "/images/dresses/dress1.jpg",
            category: "Men's Formal"
        },
        {
            id: '2',
            title: "White Casual Dress",
            subtitle: "Casual Collection",
            price: "Rs. 12,499",
            image: "/images/dresses/dress2.jpg",
            category: "Causal"
        },
        {
            id: '3',
            title: "Navy Elegance Dress",
            subtitle: "Party Collection",
            price: "Rs. 10,999",
            image: "/images/dresses/dress3.jpg",
            category: "Party"
        },
        {
            id: '4',
            title: "Casual Summer Dress",
            subtitle: "Women's Casual Collection",
            price: "Rs. 8,999",
            image: "/images/dresses/dress4.jpg",
            category: "Casual"
        },
        {
            id: '5',
            title: "Burgundy Maxi Dress",
            subtitle: "Special Occasion",
            price: "Rs. 14,499",
            image: "/images/dresses/dress5.jpg",
            category: "Special"
        }
    ];

    useEffect(() => {
        if (!isAutoPlaying || dressSlides.length === 0) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % dressSlides.length);
        }, 4000);

        return () => clearInterval(timer);
    }, [isAutoPlaying, dressSlides.length]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 5000);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % dressSlides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 5000);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + dressSlides.length) % dressSlides.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 5000);
    };

    return (
        <section className="dress-carousel-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title-fancy">Featured Dresses</h2>
                    <p className="section-subtitle-fancy">Handpicked collections that define elegance</p>
                </div>

                <div className="dress-carousel">
                    <div className="carousel-track-wrapper">
                        <div
                            className="carousel-track"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {dressSlides.map((slide) => (
                                <div key={slide.id} className="carousel-slide-item">
                                    <div className="slide-image-container">
                                        <img
                                            src={slide.image}
                                            alt={slide.title}
                                            onError={(e) => {
                                                e.currentTarget.src = '/images/hero-background.png';
                                            }}
                                        />
                                        <div className="slide-overlay">
                                            <span className="slide-category">{slide.category}</span>
                                        </div>
                                    </div>
                                    <div className="slide-info">
                                        <span className="slide-subtitle-text">{slide.subtitle}</span>
                                        <h3 className="slide-title-text">{slide.title}</h3>
                                        <p className="slide-price">{slide.price}</p>
                                        <Link to={`/products/${slide.id}`} className="btn-view-details">
                                            View Details
                                            <span className="arrow-icon">→</span>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <button
                        className="carousel-nav carousel-nav-prev"
                        onClick={prevSlide}
                        aria-label="Previous slide"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button
                        className="carousel-nav carousel-nav-next"
                        onClick={nextSlide}
                        aria-label="Next slide"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    {/* Indicators */}
                    <div className="carousel-indicators">
                        {dressSlides.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === currentSlide ? 'active' : ''}`}
                                onClick={() => goToSlide(index)}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Thumbnail Preview */}
                <div className="carousel-thumbnails">
                    {dressSlides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`thumbnail ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                        >
                            <img
                                src={slide.image}
                                alt={slide.title}
                                onError={(e) => {
                                    e.currentTarget.src = '/images/hero-background.png';
                                }}
                            />
                            <div className="thumbnail-overlay">
                                <span>{slide.title}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default DressCarousel;
