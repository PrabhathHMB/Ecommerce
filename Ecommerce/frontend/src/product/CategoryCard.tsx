import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryCard.css';

interface CategoryCardProps {
    name: string;
    image: string;
    category: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, image, category }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/products?category=${encodeURIComponent(category)}`);
    };

    return (
        <div className="category-card" onClick={handleClick}>
            <div className="category-image-wrapper">
                <img src={image} alt={name} className="category-image" />
                <div className="category-overlay">
                    <h3 className="category-name">{name}</h3>
                    <p className="category-cta">Shop Now →</p>
                </div>
            </div>
        </div>
    );
};

export default CategoryCard;
