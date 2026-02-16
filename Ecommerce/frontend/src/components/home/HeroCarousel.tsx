import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Slide {
    title: string;
    subtitle: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    backgroundColor: string;
}

const HeroCarousel: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides: Slide[] = [
        {
            title: "Elegant Sri Lankan Fashion",
            subtitle: "Welcome to Beauty Fashion",
            description: "Discover the finest collection of traditional and contemporary fashion",
            buttonText: "Shop Now",
            buttonLink: "/products",
            backgroundColor: "url('/images/carousel/banner-1.jpg')"
        },
        {
            title: "Traditional Meets Modern",
            subtitle: "Exclusive Collection",
            description: "Beautiful sarees, batik, and fusion wear celebrating Sri Lankan heritage",
            buttonText: "Explore Collection",
            buttonLink: "/products?category=Women",
            backgroundColor: "url('/images/carousel/banner-2.jpg')"
        },
        {
            title: "Premium Quality Guaranteed",
            subtitle: "Authentic Sri Lankan Craftsmanship",
            description: "From traditional textiles to modern styles, experience the best",
            buttonText: "View Products",
            buttonLink: "/products",
            backgroundColor: "url('/images/carousel/banner-3.jpg')"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer);
    }, [slides.length]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="hero-carousel">
            <div className="carousel-container">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{
                            background: slide.backgroundColor,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    >
                        <div className="carousel-content">
                            <div className="slide-text">
                                <p className="slide-subtitle fade-in-up">{slide.subtitle}</p>
                                <h1 className="slide-title fade-in-up-delay-1">{slide.title}</h1>
                                <p className="slide-description fade-in-up-delay-2">{slide.description}</p>
                                <Link
                                    to={slide.buttonLink}
                                    className="btn-hero fade-in-up-delay-3"
                                >
                                    {slide.buttonText}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Navigation Arrows */}
                <button className="carousel-arrow carousel-arrow-left" onClick={prevSlide}>
                    &#10094;
                </button>
                <button className="carousel-arrow carousel-arrow-right" onClick={nextSlide}>
                    &#10095;
                </button>

                {/* Navigation Dots */}
                <div className="carousel-dots">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HeroCarousel;
