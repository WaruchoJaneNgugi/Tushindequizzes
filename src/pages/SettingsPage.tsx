import "../styles/settingspage.css";
import { useAuth } from "../hooks/useAuth";
import { useUI } from "../hooks/useUI";

export const SettingsPage = () => {
    const { user } = useAuth();
    const {
        showSettings,
        setShowSettings,
        setShowBuyPoints
    } = useUI();

    const handleClose = () => {
        setShowSettings(false);
    };

    const handleBuyPoints = () => {
        setShowSettings(false);
        setShowBuyPoints(true);
    };

    // Don't render if not open
    if (!showSettings || !user) return null;

    return (
        <div className="settings-overlay" onClick={handleClose}>
            <div className="settings-popup" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="settings-header">
                    <div className="header-content">
                        <div className="header-icon">⚙️</div>
                        <div className="header-text">
                            <h2 className="settings-title">Account Settings</h2>
                            <p className="settings-subtitle">Manage your profile and points</p>
                        </div>
                    </div>
                    <button className="settings-close-btn" onClick={handleClose} aria-label="Close settings">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>

                <div className="settings-container">
                    {/* Profile Section */}
                    <div className="profile-section">
                        <div className="profile-card">
                            <div className="profile-header">
                                <div className="profile-avatar-container">
                                    <div className="profile-avatar-large">
                                        {user.avatarInitials}
                                    </div>
                                    <div className="online-status"></div>
                                </div>
                                <div className="profile-info">
                                    <h3 className="profile-username">{user.username}</h3>
                                    <div className="profile-details">
                                        <span className="detail-item">
                                            {/*<span className="detail-icon">📱</span>*/}
                                            {user.phoneNumber}
                                        </span>
                                        {/*<span className="detail-item">*/}
                                        {/*    <span className="detail-icon">👤</span>*/}
                                        {/*    Member since {new Date().getFullYear()}*/}
                                        {/*</span>*/}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Points Section */}
                        <div className="points-section">
                            <div className="points-card">
                                <div className="points-header">
                                    <div className="points-icon-container">
                                        <span className="points-icon">💎</span>
                                    </div>
                                    <div className="points-info">
                                        <h4 className="points-title">Smart Points</h4>
                                        <p className="points-subtitle">Your current balance</p>
                                    </div>
                                </div>

                                <div className="balance-display">
                                    <div className="balance-main">
                                        <span className="balance-value">{user.pointsBalance}</span>
                                        <span className="balance-label">points</span>
                                    </div>
                                    <div className="balance-details">
                                        {/*<div className="detail-row">*/}
                                        {/*    <span className="detail-label">Current Points</span>*/}
                                        {/*    <span className="detail-value">{user.pointsBalance} pts</span>*/}
                                        {/*</div>*/}
                                        <div className="detail-row">
                                            <span className="detail-label">Total Earned</span>
                                            <span className="detail-value">{user.smartPoints} pts</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="btn-buy-points" onClick={handleBuyPoints}>
                                    <span className="buy-icon">⚡</span>
                                    <span className="buy-text">Buy Smart Points</span>
                                    <span className="buy-arrow">→</span>
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="stats-section">
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon">🎮</div>
                                    <div className="stat-info">
                                        <div className="stat-value">0</div>
                                        <div className="stat-label">Games Played</div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">🏆</div>
                                    <div className="stat-info">
                                        <div className="stat-value">0</div>
                                        <div className="stat-label">Wins</div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">📈</div>
                                    <div className="stat-info">
                                        <div className="stat-value">#1</div>
                                        <div className="stat-label">Rank</div>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">⏱️</div>
                                    <div className="stat-info">
                                        <div className="stat-value">0h</div>
                                        <div className="stat-label">Play Time</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="settings-footer">
                        <div className="footer-content">
                            <div className="footer-info">
                                <span className="footer-icon">🔒</span>
                                <span className="footer-text">Your data is securely encrypted</span>
                            </div>
                            <div className="footer-version">
                                <span className="version-text">v1.0.0 • TushindeQuiz</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}

            </div>
        </div>
    );
};