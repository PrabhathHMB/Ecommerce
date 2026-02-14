import React, { useState } from 'react';
import './ReviewModal.css';

interface ReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string;
    productName: string;
    onSubmit: (rating: number, review: string) => Promise<void>;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, productName, onSubmit }) => {
    const [rating, setRating] = useState<number>(5);
    const [review, setReview] = useState<string>('');
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onSubmit(rating, review);
            onClose();
            setReview('');
            setRating(5);
        } catch (error) {
            console.error('Failed to submit review', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content review-modal-content">
                <div className="modal-header">
                    <h2>Rate & Review</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <h3 className="product-name-preview">{productName}</h3>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Rating</label>
                        <div className="star-rating-input">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${star <= (hoveredRating || rating) ? 'filled' : ''}`}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                    onClick={() => setRating(star)}
                                    style={{ cursor: 'pointer', fontSize: '24px', color: star <= (hoveredRating || rating) ? '#ffd700' : '#ccc' }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Review</label>
                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Write your experience..."
                            required
                            rows={4}
                            className="review-textarea"
                            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose} className="btn-secondary" disabled={submitting}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={submitting}>
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
