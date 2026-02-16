import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/product.types';
import { formatPrice } from '../../utils/currency';
import { resolveImage } from '../../utils/image';
import './ProductCard.css';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

    return (
        <Link to={`/products/${product.id}`} className="product-card">
            <div className="product-image">
                <img src={resolveImage(product.imageUrl)} alt={product.title} />
                {product.discountPersent > 0 && (
                    <span className="discount-badge">-{product.discountPersent}%</span>
                )}
            </div>

            <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-brand">{product.brand}</p>

                <div className="product-price">
                    <span className="current-price">{formatPrice(product.discountedPrice)}</span>
                    {product.discountPersent > 0 && (
                        <span className="original-price">{formatPrice(product.price)}</span>
                    )}
                </div>

                <div className="product-rating">
                    <span>⭐ {(product.averageRating || 0).toFixed(2)}</span>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
