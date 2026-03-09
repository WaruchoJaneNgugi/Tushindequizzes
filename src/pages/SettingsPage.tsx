import { useAuth } from "../hooks/useAuth";
import { useUI } from "../hooks/useUI";
import "../styles/settings-page.css";

export const SettingsPage = () => {
    const { user } = useAuth();
    const { showSettings, setShowSettings, setShowBuyPoints } = useUI();

    if (!showSettings || !user) return null;

    const handleClose = () => setShowSettings(false);
    const handleBuyPoints = () => { setShowSettings(false); setShowBuyPoints(true); };

    const stats = [
        { icon: '🎮', label: 'Games',     value: '0'  },
        { icon: '🏆', label: 'Wins',      value: '0'  },
        { icon: '📈', label: 'Rank',      value: '#1' },
        { icon: '⏱️', label: 'Play Time', value: '0h' },
    ];

    return (
        <div className="sp-backdrop" onClick={handleClose}>
            <div className="sp-card" onClick={e => e.stopPropagation()}>

                {/* ── Header ── */}
                <div className="sp-header">
                    <div className="sp-header-left">
                        <div className="sp-header-icon">⚙️</div>
                        <div>
                            <h2 className="sp-title">Account</h2>
                            <p className="sp-subtitle">Profile & Points</p>
                        </div>
                    </div>
                    <button className="sp-close" onClick={handleClose} aria-label="Close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                <div className="sp-body">

                    {/* ── Profile row ── */}
                    <div className="sp-profile-row">
                        <div className="sp-avatar">
                            {user.avatarInitials}
                            <div className="sp-online" />
                        </div>
                        <div className="sp-profile-info">
                            <span className="sp-username">{user.username}</span>
                            <span className="sp-phone">{user.phoneNumber}</span>
                        </div>
                    </div>

                    <div className="sp-divider" />

                    {/* ── Points ── */}
                    <div className="sp-points-block">
                        <div className="sp-points-top">
                            <div className="sp-points-left">
                                <span className="sp-points-label">
                                    <span>💎</span> Smart Points
                                </span>
                                <div className="sp-points-nums">
                                    <span className="sp-points-balance">{user.pointsBalance}</span>
                                    <span className="sp-points-unit">pts</span>
                                </div>
                            </div>
                            <div className="sp-points-detail">
                                <span className="sp-detail-lbl">Total Earned</span>
                                <span className="sp-detail-val">{user.smartPoints} pts</span>
                            </div>
                        </div>
                        <button className="sp-buy-btn" onClick={handleBuyPoints}>
                            <span>⚡</span>
                            <span>Buy Smart Points</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>

                    <div className="sp-divider" />

                    {/* ── Stats ── */}
                    <div className="sp-stats">
                        {stats.map((s, i) => (
                            <div key={i} className="sp-stat">
                                <span className="sp-stat-icon">{s.icon}</span>
                                <span className="sp-stat-val">{s.value}</span>
                                <span className="sp-stat-lbl">{s.label}</span>
                            </div>
                        ))}
                    </div>

                </div>

                {/* ── Footer ── */}
                <div className="sp-footer">
                    <span className="sp-footer-text">🔒 Data securely encrypted</span>
                    <span className="sp-footer-version">v1.0.0 · TushindeQuiz</span>
                </div>

            </div>
        </div>
    );
};
