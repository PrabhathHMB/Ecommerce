import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productApi } from '../api/productApi';
import { cartApi } from '../api/cartApi';
import { reviewApi } from '../api/reviewApi';
import { addItemToWishlist } from '../api/wishlistApi';
import { Product } from '../types/product.types';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { formatPrice } from '../utils/currency';
import { resolveImage } from '../utils/image';

import { useToast } from '../context/ToastContext';

const ProductDetailPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const { isAuthenticated } = useAuth();
    const { refreshCart } = useCart();
    const navigate = useNavigate();
    const { success, error, warning } = useToast();
    const [reviews, setReviews] = useState<any[]>([]);
    const [showSizeChart, setShowSizeChart] = useState(false);

    const [selectedImage, setSelectedImage] = useState('');
    const [selectedColor, setSelectedColor] = useState('');

    useEffect(() => {
        if (productId) {
            fetchProduct();
            fetchReviews();
        }
    }, [productId]);

    const fetchProduct = async () => {
        try {
            const data = await productApi.getProductById(productId!);
            setProduct(data);
            setSelectedImage(data.imageUrl);
            setSelectedColor(data.color);
            
            if (data?.sizes && Array.isArray(data.sizes) && data.sizes.length > 0) {
                console.log("Product sizes debug:", data.sizes);
                setSelectedSize(data.sizes[0].name);
            }
        } catch (err) {
            console.error('Failed to fetch product:', err);
            error('Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const data = await reviewApi.getProductReviews(productId!);
            if (Array.isArray(data)) {
                setReviews(data);
            } else {
                console.warn('Received non-array response for reviews:', data);
                setReviews([]);
            }
        } catch (err) {
            console.error('Failed to fetch reviews:', err);
            setReviews([]);
        }
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

    
        if (product?.sizes && product.sizes.length > 0) {
            if (!selectedSize) {
                warning('Please select a size');
                return;
            }

            const sizeObj = product.sizes.find(s => s.name === selectedSize);
            if (sizeObj && quantity > sizeObj.quantity) {
                warning(`Only ${sizeObj.quantity} items available in this size`);
                return;
            }
        }

        setAddingToCart(true);
        try {
            await cartApi.addItemToCart({
                productId: product!.id,
                size: selectedSize || 'One Size',
                color: selectedColor || product!.color,
                quantity,
            });
            await refreshCart();
            success('Added to cart successfully!');
        } catch (err) {
            console.error('Failed to add to cart:', err);
            error('Failed to add to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    const handleAddToWishlist = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            await addItemToWishlist(product!.id);
            success("Added to wishlist!");
        } catch (err) {
            console.error("Error adding to wishlist", err);
            error("Failed to add to wishlist.");
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!product) {
        return <div className="error-page">Product not found</div>;
    }

    
    const hasSizes = product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0;

    const isClothing = (category: any) => {
        let current = category;
        while (current) {
            if (current.name?.toLowerCase() === 'clothing') return true;
            current = current.parentCategory;
        }
        return false;
    };

    const shouldShowSizeChart = product.sizeChart && isClothing(product.category);

    return (
        <div className="product-detail-page">
            {showSizeChart && product.sizeChart && (
                <div className="size-chart-modal" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }} onClick={() => setShowSizeChart(false)}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        maxWidth: '90%',
                        maxHeight: '90%',
                        overflow: 'auto',
                        position: 'relative'
                    }} onClick={e => e.stopPropagation()}>
                        <button style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: 'none',
                            border: 'none',
                            fontSize: '1.5rem',
                            cursor: 'pointer'

                        }} onClick={() => setShowSizeChart(false)}>×</button>
                        <img src={resolveImage(product.sizeChart)} alt="Size Chart" style={{ maxWidth: '100%', height: 'auto' }} />
                    </div>
                </div>
            )}
            <div className="product-detail-container">
                <div className="product-image-section">
                    <img src={resolveImage(selectedImage || product.imageUrl)} alt={product.title} className="main-image" />

                    {/* Image Gallery */}
                    <div className="image-thumbnails" style={{ display: 'flex', gap: '10px', marginTop: '10px', overflowX: 'auto', paddingBottom: '5px' }}>
                        {/* Always show main image as first thumbnail */}
                        <img
                            src={resolveImage(product.imageUrl)}
                            alt="Main"
                            onClick={() => setSelectedImage(product.imageUrl)}
                            style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                cursor: 'pointer',
                                border: selectedImage === product.imageUrl ? '2px solid #6c5ce7' : '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />
                        {/* Additional images */}
                        {product.images && product.images.map((img, idx) => (
                            <img
                                key={idx}
                                src={resolveImage(img)}
                                alt={`Thumbnail ${idx}`}
                                onClick={() => setSelectedImage(img)}
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    objectFit: 'cover',
                                    cursor: 'pointer',
                                    border: selectedImage === img ? '2px solid #6c5ce7' : '1px solid #ddd',
                                    borderRadius: '4px'
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="product-info-section">
                    <h1>{product.title}</h1>
                    <p className="product-brand">{product.brand}</p>

                    <div className="product-rating">
                        <span style={{ color: '#ffd700', fontSize: '1.2rem', marginRight: '5px' }}>
                            {'★'.repeat(Math.round(product.averageRating || 0))}
                            {'☆'.repeat(5 - Math.round(product.averageRating || 0))}
                        </span>
                        <span style={{ fontWeight: 'bold', marginRight: '5px' }}>
                            {product.averageRating ? product.averageRating.toFixed(1) : '0.0'}
                        </span>
                        <span style={{ color: '#666' }}>({product.numRatings} ratings)</span>
                    </div>

                    <div className="product-price-section">
                        <span className="current-price">{formatPrice(product.discountedPrice)}</span>
                        {product.discountPersent > 0 && (
                            <>
                                <span className="original-price">{formatPrice(product.price)}</span>
                                <span className="discount-tag">{product.discountPersent}% OFF</span>
                            </>
                        )}
                    </div>

                    <div className="product-description">
                        <h3>Description</h3>
                        <p>{product.description}</p>
                    </div>

                    <div className="product-details">
                        <div style={{ marginBottom: '10px' }}>
                            <p><strong>Color:</strong> {selectedColor || product.color}</p>

                            
                            {(() => {
                                const allColors = [product.color, ...(product.colors || [])];
                                const uniqueColors = allColors.filter((value, index, self) => self.indexOf(value) === index && value);

                                if (uniqueColors.length <= 1) return null;

                                return (
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '5px', flexWrap: 'wrap' }}>
                                        {uniqueColors.map((col, idx) => (
                                            <span key={idx}
                                                onClick={() => setSelectedColor(col)}
                                                style={{
                                                    padding: '4px 12px',
                                                    backgroundColor: (selectedColor || product.color) === col ? '#e0e0ff' : '#f0f0f0',
                                                    borderRadius: '16px',
                                                    fontSize: '0.9rem',
                                                    border: (selectedColor || product.color) === col ? '2px solid #6c5ce7' : '1px solid #ddd',
                                                    cursor: 'pointer'
                                                }}>
                                                {col}
                                            </span>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>
                        <p>
                            <strong>Available Quantity:</strong>{' '}
                            {(() => {
                                const currentSize = product.sizes?.find(s => s.name === selectedSize);
                                const qty = currentSize ? currentSize.quantity : product.quantity;

                                return qty === 0 ? (
                                    <span style={{ color: 'red', fontWeight: 'bold' }}>Out of Stock</span>
                                ) : (
                                    qty
                                );
                            })()}
                        </p>
                    </div>

                    {hasSizes && (
                        <div className="size-selector">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3>Select Size</h3>
                                {shouldShowSizeChart && (
                                    <button
                                        onClick={() => setShowSizeChart(true)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#6c5ce7',
                                            textDecoration: 'underline',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        Size Chart
                                    </button>
                                )}
                            </div>
                            <div className="size-options">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size.name}
                                        className={`size-btn ${selectedSize === size.name ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size.name)}
                                        style={
                                            size.quantity === 0
                                                ? { textDecoration: 'line-through', color: '#ccc', borderColor: '#e0e0e0' }
                                                : {}
                                        }
                                    >
                                        {size.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="quantity-selector">
                        <h3>Quantity</h3>
                        <div className="quantity-controls">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}>+</button>
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="btn-add-to-cart"
                        disabled={addingToCart || product.quantity === 0}
                    >
                        {addingToCart ? 'Adding...' : product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>

                    <button
                        onClick={handleAddToWishlist}
                        className="btn-wishlist"
                        style={{
                            marginLeft: '10px',
                            padding: '12px 20px',
                            minWidth: '160px',
                            borderRadius: '4px',
                            border: '1px solid #6c5ce7',
                            backgroundColor: '#fff',
                            color: '#6c5ce7',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Add To Wishlist
                    </button>
                </div>
            </div>

            <div className="product-reviews-section" style={{ marginTop: '50px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
                <h2>Customer Reviews</h2>
                {!Array.isArray(reviews) || reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                ) : (
                    <div className="reviews-list">
                        {reviews.map((review: any) => (
                            <div key={review?.id || Math.random()} className="review-item" style={{ borderBottom: '1px solid #ddd', padding: '15px 0' }}>
                                <div className="review-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div className="user-avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {review?.user?.firstName?.charAt(0) || 'U'}
                                    </div>
                                    <div className="user-info">
                                        <h4 style={{ margin: 0 }}>
                                            {review?.user?.firstName || 'Anonymous'} {review?.user?.lastName || ''}
                                        </h4>
                                        <span style={{ fontSize: '0.8rem', color: '#666' }}>
                                            {review?.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                                        </span>
                                    </div>
                                </div>
                                <p className="review-text" style={{ marginTop: '10px', fontSize: '1rem', lineHeight: '1.5' }}>
                                    {review?.review || ''}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
};

export default ProductDetailPage;
