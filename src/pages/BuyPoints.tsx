import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useUI } from "../hooks/useUI";
import { usePointsPackages } from "../hooks/usePointsPackages";
import "../styles/buypoints.css";

interface Toast {
    id: string;
    type: 'error' | 'success' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
}

export const BuyPoints = () => {
    const { user, updateUser } = useAuth();
    const { showBuyPoints, setShowBuyPoints } = useUI();
    const { pointsPackages, getPackageById, calculatePointsPerCurrency } = usePointsPackages();

    const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingPackageId, setProcessingPackageId] = useState<number | null>(null);
    const [toasts, setToasts] = useState<Toast[]>([]);

    // Function to add a toast
    const addToast = (type: Toast['type'], title: string, message: string, duration = 5000) => {
        const id = Date.now().toString();
        const newToast: Toast = { id, type, title, message, duration };

        setToasts(prev => [...prev, newToast]);

        // Auto remove toast after duration
        setTimeout(() => {
            removeToast(id);
        }, duration);

        return id;
    };

    // Function to remove a toast
    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const handleCloseBuyPoints = () => {
        setShowBuyPoints(false);
        setSelectedPackageId(null);
        setIsProcessing(false);
        setProcessingPackageId(null);
        setToasts([]);
    };

    const handlePurchase = async (packageId: number) => {
        if (!user) {
            addToast('error', 'Authentication Required', 'Please login to purchase points');
            return;
        }

        if (!phoneNumber || phoneNumber.length < 10) {
            addToast('error', 'Invalid Phone Number', 'Please enter a valid M-Pesa phone number');
            return;
        }

        const selectedPackage = getPackageById(packageId);
        if (!selectedPackage) {
            addToast('error', 'Package Error', 'Selected package not found');
            return;
        }

        // Set the selected package for visual feedback
        setSelectedPackageId(packageId);
        setProcessingPackageId(packageId);
        setIsProcessing(true);

        try {
            // Show processing toast
            const processingToastId = addToast('info', 'Processing Payment', 'Initiating M-Pesa STK Push...', 3000);

            // Call your backend API to initiate STK Push
            const response = await fetch('/api/mpesa/stkpush', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber: phoneNumber.replace(/\D/g, ''), // Remove non-digits
                    amount: selectedPackage.price,
                    packageId: selectedPackage.id,
                    userId: user.id,
                    accountReference: `POINTS_${selectedPackage.id}`,
                    transactionDesc: `Purchase of ${selectedPackage.points} Smart Points`
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Payment initiation failed');
            }

            // Remove processing toast
            removeToast(processingToastId);

            // Show success toast
            addToast('success', 'Payment Initiated', `M-Pesa request sent to ${phoneNumber}. Please check your phone to complete the payment.`);

            // Note: In a real app, you would poll your backend to confirm payment
            // For now, we'll update points immediately (in production, wait for webhook confirmation)
            updateUser({
                pointsBalance: user.pointsBalance + selectedPackage.points
            });

            // Reset states
            setProcessingPackageId(null);
            setIsProcessing(false);

            // Close modal after successful initiation
            setTimeout(() => {
                setShowBuyPoints(false);
                setSelectedPackageId(null);
                setPhoneNumber(user.phoneNumber);
            }, 3000);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Payment failed. Please try again.';
            addToast('error', 'Payment Failed', errorMessage);
            setProcessingPackageId(null);
            setIsProcessing(false);
        }
    };
    // Helper function to format phone number
    const formatPhoneNumber = (phone: string): string => {
        if (!phone) return "";

        // Remove any non-digits
        const cleanNumber = phone.replace(/\D/g, '');

        // Format based on different cases
        if (cleanNumber.startsWith('254') && cleanNumber.length === 12) {
            // Already in +254 format (254712345678)
            return `+${cleanNumber}`;
        } else if (cleanNumber.startsWith('0') && cleanNumber.length === 10) {
            // Kenyan local format (0712345678) → convert to +254712345678
            return `+254${cleanNumber.substring(1)}`;
        } else if (cleanNumber.startsWith('7') && cleanNumber.length === 9) {
            // Without leading 0 (712345678) → add +254
            return `+254${cleanNumber}`;
        } else if (cleanNumber.startsWith('+254')) {
            // Already has +254 prefix
            return cleanNumber;
        }

        // If none of the above, return as is (or with +254 prefix if it's 9 digits)
        if (cleanNumber.length === 9) {
            return `+254${cleanNumber}`;
        }

        return phone; // Return original if we can't format it
    };

    // Auto-close toasts when modal closes
    useEffect(() => {
        if (!showBuyPoints) {
            setToasts([]);
        }
    }, [showBuyPoints]);

    if (!showBuyPoints || !user) return null;

    return (
        <>
            {/* Toast Notifications Container */}
            {toasts.length > 0 && (
                <div className="toast-container">
                    {toasts.map(toast => (
                        <div key={toast.id} className={`toast ${toast.type}`}>
                            <div className="toast-icon">
                                {toast.type === 'error' && '⚠️'}
                                {toast.type === 'success' && '✅'}
                                {toast.type === 'warning' && '⚠️'}
                                {toast.type === 'info' && 'ℹ️'}
                            </div>
                            <div className="toast-content">
                                <h4 className="toast-title">{toast.title}</h4>
                                <p className="toast-message">{toast.message}</p>
                            </div>
                            <button
                                className="toast-close"
                                onClick={() => removeToast(toast.id)}
                            >
                                ×
                            </button>
                            <div className="toast-progress"></div>
                        </div>
                    ))}
                </div>
            )}

            <div className="buy-points-overlay" onClick={handleCloseBuyPoints}>
                <div className="buy-points-modal" onClick={(e) => e.stopPropagation()}>
                    <button className="buy-points-close" onClick={handleCloseBuyPoints}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                    </button>

                    <div className="buy-points-header">
                        <div className="buy-points-icon">⚡</div>
                        <h2 className="buy-points-title">Buy Smart Points</h2>
                        <p className="buy-points-subtitle">Select a package and enter your M-Pesa number</p>
                    </div>
                    <div className="phone-input-section">
                        <div className="current-balance">
                            <span className="balance-label">Your Points:</span>
                            <span className="balance-value">{user.pointsBalance}</span>
                        </div>
                        <div className="phone-input-header">
                            <span className="phone-input-icon">📱</span>
                            <h3 className="phone-input-title">M-Pesa Phone Number</h3>
                        </div>


                        <div className="phone-input-wrapper">
                            <input
                                type="tel"
                                value={formatPhoneNumber(user.phoneNumber)}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="+254 7XX XXX XXX"
                                className="phone-input"
                                disabled={isProcessing}
                            />
                            <span className="phone-prefix">+254</span>
                        </div>
                        {/*<p className="phone-input-help">*/}
                        {/*    Enter the phone number registered with M-Pesa*/}
                        {/*</p>*/}

                    </div>


                    {/* Phone Number Input */}


                    {/* Payment Processing Indicator */}
                    {isProcessing && (
                        <div className="processing-indicator">
                            <div className="processing-spinner">⚡</div>
                            <p className="processing-text">
                                Initiating M-Pesa payment for package #{processingPackageId}...
                            </p>
                        </div>
                    )}

                    {/* Points Packages Grid */}
                    <div className="points-packages-grid">
                        {pointsPackages.map((pkg) => {
                            const isPackageProcessing = processingPackageId === pkg.id;
                            const isSelected = selectedPackageId === pkg.id;

                            return (
                                <div
                                    key={pkg.id}
                                    className={`points-package ${pkg.popular ? 'popular' : ''} ${isSelected ? 'selected' : ''}`}
                                    onClick={() => !isProcessing && setSelectedPackageId(pkg.id)}
                                >
                                    {pkg.popular && <div className="popular-badge">Most Popular</div>}
                                    <div className="package-icon">⚡</div>
                                    <div className="package-points">{pkg.points} Points</div>
                                    <div className="package-price">KSH {pkg.price}</div>
                                    <div className="package-value">
                                        ~{calculatePointsPerCurrency(pkg.id)} pts/KSH
                                    </div>
                                    <button
                                        className="package-buy-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handlePurchase(pkg.id);
                                        }}
                                        disabled={isProcessing}
                                    >
                                        {isPackageProcessing ? (
                                            <>
                                                <span>Processing...</span>
                                                <span className="loading-spinner">⚡</span>
                                            </>
                                        ) : (
                                            `Buy for KSH ${pkg.price}`
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Selected Package Info */}
                    {selectedPackageId && !isProcessing && (
                        <div className="selected-package-info">
                            <div className="selected-package-header">
                                <h3 className="selected-package-title">
                                    <span className="selected-package-title-icon">🎯</span> Ready to Purchase
                                </h3>
                                <div className="selected-package-price">
                                    Click "Buy" button above
                                </div>
                            </div>

                            <div className="selected-package-grid">
                                <div className="selected-package-stat">
                                    <div className="selected-package-stat-label">Package</div>
                                    <div className="selected-package-stat-value">
                                        #{selectedPackageId}
                                    </div>
                                </div>
                                <div className="selected-package-stat">
                                    <div className="selected-package-stat-label">Phone</div>
                                    <div className="selected-package-stat-value new-balance">
                                        {phoneNumber}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="buy-points-footer">
                        <p className="disclaimer">
                            ⚡ Click "Buy" to receive an M-Pesa prompt on your phone<br />
                            ⚡ Points are added instantly upon successful payment<br />
                            ⚡ For assistance, contact support at support@smartpoints.com
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};