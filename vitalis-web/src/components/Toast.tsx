import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

export function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const Icon = type === 'success' ? CheckCircle : XCircle;
    const bgColor = type === 'success' ? 'bg-primary-600' : 'bg-red-600';

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md`}
        >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

interface ToastContainerProps {
    toasts: Array<{ id: string; message: string; type: ToastType }>;
    onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => onRemove(toast.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}
