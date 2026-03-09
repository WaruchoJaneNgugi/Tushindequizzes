import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useUI } from "../hooks/useUI";
import { usePointsPackages } from "../hooks/usePointsPackages";
import "../styles/buy-points.css";

interface Toast {
    id: string;
    type: 'error' | 'success' | 'warning' | 'info';
    title: string;
    message: string;
}

export const BuyPoints = () => {
    const { user, updateUser }  = useAuth();
    const { showBuyPoints, setShowBuyPoints } = useUI();
    const { pointsPackages, getPackageById, calculatePointsPerCurrency } = usePointsPackages();

    const [selectedPackageId,   setSelectedPackageId]   = useState<number | null>(null);
    const [phoneNumber,          setPhoneNumber]          = useState(user?.phoneNumber || "");
    const [isProcessing,         setIsProcessing]         = useState(false);
    const [processingPackageId,  setProcessingPackageId]  = useState<number | null>(null);
    const [toasts,               setToasts]               = useState<Toast[]>([]);

    const addToast = (type: Toast['type'], title: string, message: string, duration = 5000) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, type, title, message }]);
        setTimeout(() => removeToast(id), duration);
        return id;
    };
    const removeToast = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

    const handleClose = () => {
        setShowBuyPoints(false);
        setSelectedPackageId(null);
        setIsProcessing(false);
        setProcessingPackageId(null);
        setToasts([]);
    };

    const formatPhone = (phone: string): string => {
        if (!phone) return "";
        const clean = phone.replace(/\D/g, '');
        if (clean.startsWith('254') && clean.length === 12) return `+${clean}`;
        if (clean.startsWith('0')   && clean.length === 10)  return `+254${clean.substring(1)}`;
        if (clean.startsWith('7')   && clean.length === 9)   return `+254${clean}`;
        if (clean.length === 9) return `+254${clean}`;
        return phone;
    };

    const handlePurchase = async (packageId: number) => {
        if (!user) { addToast('error', 'Not Logged In', 'Please login to purchase points'); return; }
        if (!phoneNumber || phoneNumber.replace(/\D/g,'').length < 9) {
            addToast('error', 'Invalid Number', 'Enter a valid M-Pesa phone number'); return;
        }
        const pkg = getPackageById(packageId);
        if (!pkg) { addToast('error', 'Package Error', 'Package not found'); return; }

        setSelectedPackageId(packageId);
        setProcessingPackageId(packageId);
        setIsProcessing(true);

        try {
            const pid = addToast('info', 'Initiating Payment', 'Sending M-Pesa STK Push…', 3000);

            const response = await fetch('/api/mpesa/stkpush', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phoneNumber: phoneNumber.replace(/\D/g, ''),
                    amount: pkg.price,
                    packageId: pkg.id,
                    userId: user.id,
                    accountReference: `POINTS_${pkg.id}`,
                    transactionDesc: `Purchase of ${pkg.points} Smart Points`
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Payment initiation failed');

            removeToast(pid);
            addToast('success', 'Check Your Phone', `M-Pesa prompt sent to ${formatPhone(phoneNumber)}.`);
            updateUser({ pointsBalance: user.pointsBalance + pkg.points });

            setProcessingPackageId(null);
            setIsProcessing(false);
            setTimeout(() => { setShowBuyPoints(false); setSelectedPackageId(null); }, 3500);

        } catch (err) {
            addToast('error', 'Payment Failed', err instanceof Error ? err.message : 'Please try again.');
            setProcessingPackageId(null);
            setIsProcessing(false);
        }
    };

    useEffect(() => { if (!showBuyPoints) setToasts([]); }, [showBuyPoints]);

    if (!showBuyPoints || !user) return null;

    const TOAST_ICONS = { error: '⚠️', success: '✅', warning: '⚠️', info: 'ℹ️' };

    return (
        <>
            {/* ── TOASTS ── */}
            {toasts.length > 0 && (
                <div className="bp-toasts">
                    {toasts.map(t => (
                        <div key={t.id} className={`bp-toast bp-toast--${t.type}`}>
                            <span className="bp-toast-icon">{TOAST_ICONS[t.type]}</span>
                            <div className="bp-toast-body">
                                <span className="bp-toast-title">{t.title}</span>
                                <span className="bp-toast-msg">{t.message}</span>
                            </div>
                            <button className="bp-toast-close" onClick={() => removeToast(t.id)}>×</button>
                            <div className="bp-toast-bar"/>
                        </div>
                    ))}
                </div>
            )}

            {/* ── BACKDROP ── */}
            <div className="bp-backdrop" onClick={handleClose} />

            {/* ── MODAL ── */}
            <div className="bp-modal">

                {/* Header */}
                <div className="bp-header">
                    <div className="bp-header-left">
                        <div className="bp-header-icon">⚡</div>
                        <div>
                            <h2 className="bp-title">Buy Smart Points</h2>
                            <p className="bp-subtitle">M-Pesa · Instant delivery</p>
                        </div>
                    </div>
                    <button className="bp-close" onClick={handleClose}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                <div className="bp-body">

                    {/* Balance + Phone */}
                    <div className="bp-top-row">
                        <div className="bp-balance">
                            <span className="bp-balance-label">Balance</span>
                            <span className="bp-balance-val">{user.pointsBalance.toLocaleString()}</span>
                            <span className="bp-balance-unit">pts</span>
                        </div>
                        <div className="bp-phone-wrap">
                            <label className="bp-phone-label">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                M-Pesa Number
                            </label>
                            <div className="bp-phone-input-wrap">
                                <span className="bp-phone-prefix">+254</span>
                                <input
                                    type="tel"
                                    className="bp-phone-input"
                                    value={formatPhone(phoneNumber)}
                                    onChange={e => setPhoneNumber(e.target.value)}
                                    placeholder="+254 7XX XXX XXX"
                                    disabled={isProcessing}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Processing banner */}
                    {isProcessing && (
                        <div className="bp-processing">
                            <div className="bp-processing-dot"/>
                            <span>Sending M-Pesa prompt for package #{processingPackageId}…</span>
                        </div>
                    )}

                    {/* Packages */}
                    <div className="bp-packages">
                        {pointsPackages.map(pkg => {
                            const isMe = processingPackageId === pkg.id;
                            const isSel = selectedPackageId === pkg.id;
                            return (
                                <div
                                    key={pkg.id}
                                    className={`bp-pkg ${pkg.popular ? 'bp-pkg--popular' : ''} ${isSel ? 'bp-pkg--selected' : ''}`}
                                    onClick={() => !isProcessing && setSelectedPackageId(pkg.id)}
                                >
                                    {pkg.popular && <span className="bp-popular-badge">Popular</span>}
                                    <div className="bp-pkg-top">
                                        <span className="bp-pkg-icon">⚡</span>
                                        <span className="bp-pkg-pts">{pkg.points.toLocaleString()}</span>
                                        <span className="bp-pkg-pts-label">points</span>
                                    </div>
                                    <div className="bp-pkg-price">KSH {pkg.price}</div>
                                    <div className="bp-pkg-rate">{calculatePointsPerCurrency(pkg.id)} pts/KSH</div>
                                    <button
                                        className="bp-pkg-btn"
                                        onClick={e => { e.stopPropagation(); handlePurchase(pkg.id); }}
                                        disabled={isProcessing}
                                    >
                                        {isMe ? (
                                            <><span className="bp-pkg-spinner"/>Processing…</>
                                        ) : (
                                            `Buy · KSH ${pkg.price}`
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer note */}
                    <div className="bp-footer-note">
                        <span>📱 You'll receive an M-Pesa prompt — confirm to complete payment.</span>
                        <span>Points are credited instantly after successful payment.</span>
                    </div>

                </div>
            </div>
        </>
    );
};
