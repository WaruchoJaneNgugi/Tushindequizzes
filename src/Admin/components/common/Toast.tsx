import { useEffect } from 'react';
import { CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

export const Toast = ({ message, type, onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3500);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm ${
                type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}>
            {type === 'success' ? <CheckIcon className="w-4 h-4"/> : <ExclamationTriangleIcon className="w-4 h-4"/>}
            {message}
        </div>
    );
};