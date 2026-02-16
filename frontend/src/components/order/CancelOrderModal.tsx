import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';

interface CancelOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => Promise<void>;
    isSubmitting: boolean;
    title?: string;
    message?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isSubmitting,
    title = 'Cancel Order',
    message = "We're sorry you want to cancel. Please let us know why so we can improve our service.",
    confirmButtonText = 'Confirm Cancellation',
    cancelButtonText = 'Keep Order'
}) => {
    const [reason, setReason] = useState('');
    const { error } = useToast();

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!reason.trim()) {
            error('Please provide a reason');
            return;
        }
        await onConfirm(reason);
        setReason(''); // Reset after success
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content-wrapper">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="btn-close" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <p className="modal-description">
                        {message}
                    </p>

                    <div className="form-group">
                        <label htmlFor="cancelReason">Reason</label>
                        <textarea
                            id="cancelReason"
                            className="modal-textarea"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Please provide details..."
                            rows={4}
                        />
                    </div>

                    <div className="modal-warning">
                        <span className="warning-icon">⚠️</span>
                        <span>This action cannot be undone.</span>
                    </div>
                </div>

                <div className="modal-footer">
                    <button
                        className="btn-modal-secondary"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        {cancelButtonText}
                    </button>
                    <button
                        className="btn-modal-danger"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !reason.trim()}
                    >
                        {isSubmitting ? 'Submitting...' : confirmButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelOrderModal;
