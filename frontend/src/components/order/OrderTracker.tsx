import React from 'react';

interface OrderTrackerProps {
    activeStatus: string;
}

const steps = ['PENDING', 'PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

const OrderTracker: React.FC<OrderTrackerProps> = ({ activeStatus }) => {
    const isCancelled = activeStatus === 'CANCELLED';
    const activeIndex = steps.indexOf(activeStatus);

    return (
        <div className="order-tracker-container">
            {isCancelled ? (
                <div className="order-cancelled-banner">
                    This order has been cancelled.
                </div>
            ) : activeStatus === 'RETURNED' ? (
                <div className="order-cancelled-banner" style={{ backgroundColor: '#ff9800' }}>
                    This order has been returned.
                </div>
            ) : (
                <div className="order-tracker">
                    {steps.map((step, index) => {
                        const isCompleted = index <= activeIndex;
                        const isActive = index === activeIndex;

                        return (
                            <div
                                key={step}
                                className={`tracker-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                            >
                                <div className="step-circle">
                                    {isCompleted ? (
                                        <span className="checkmark">✓</span>
                                    ) : (
                                        <span className="step-number">{index + 1}</span>
                                    )}
                                </div>
                                <div className="step-label">{step}</div>
                                {index < steps.length - 1 && (
                                    <div className={`step-line ${index < activeIndex ? 'filled' : ''}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default OrderTracker;
