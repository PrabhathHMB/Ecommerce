import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import '../styles/toast.css';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: number;
    message: string;
    type: ToastType;
    title?: string;
    isExiting?: boolean;
}

interface ToastContextType {
    addToast: (message: string, type: ToastType, title?: string) => void;
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);


    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const addToast = useCallback((message: string, type: ToastType, title?: string) => {
        const id = Date.now(); // Simple ID generation
        const newToast: Toast = { id, message, type, title };

        setToasts(prev => [...prev, newToast]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts(prev => prev.map(t => t.id === id ? { ...t, isExiting: true } : t));
            setTimeout(() => removeToast(id), 300); // Wait for exit animation
        }, 3000);
    }, [removeToast]);

    const success = (message: string, title: string = 'Success') => addToast(message, 'success', title);
    const error = (message: string, title: string = 'Error') => addToast(message, 'error', title);
    const info = (message: string, title: string = 'Info') => addToast(message, 'info', title);
    const warning = (message: string, title: string = 'Warning') => addToast(message, 'warning', title);

    const getIcon = (type: ToastType) => {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'info': return 'ℹ️';
            default: return '';
        }
    };

    return (
        <ToastContext.Provider value={{ addToast, success, error, info, warning }}>
            {children}
            <div className="toast-container">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`toast toast-${toast.type} ${toast.isExiting ? 'exiting' : ''}`}
                    >
                        <div className="toast-icon">{getIcon(toast.type)}</div>
                        <div className="toast-content">
                            <div className="toast-title">{toast.title}</div>
                            <div className="toast-message">{toast.message}</div>
                        </div>
                        <button className="toast-close" onClick={() => removeToast(toast.id)}>
                            &times;
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
