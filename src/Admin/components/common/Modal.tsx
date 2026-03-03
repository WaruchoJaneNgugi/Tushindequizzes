import { XMarkIcon } from '@heroicons/react/24/outline';

interface ModalProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

export const Modal = ({ title, onClose, children }: ModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <XMarkIcon className="w-5 h-5"/>
                    </button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
};