import type {FC} from "react";
import {useAuth} from "../hooks/useAuth.ts";
import "../styles/featureoverlay.css"
import {useUI} from "../hooks/useUI.ts";

interface ProfileOverlayProps {
    onClose: () => void;
    onEditProfile: () => void; // Add this prop
}

export const ProfileOverlay: FC<ProfileOverlayProps> = ({ onClose, onEditProfile }) => {
    const { user, logout } = useAuth();
    const { setShowBuyPoints } = useUI(); // Remove setShowProfile from here

    const profileStats = [
        { label: 'Games Played', value: '42', icon: '🎮' },
        { label: 'Win Rate', value: '67%', icon: '📈' },
        { label: 'Avg Score', value: '85%', icon: '⭐' },
        { label: 'Rank', value: '#4', icon: '🏆' },
    ];

    return (
        <>
            <div className="overlay-overlay" onClick={onClose} />
            <div className="feature-overlay">
                <div className="feature-overlay-header">
                    <div className="feature-header-left">
                        <button className="feature-back-button" onClick={onClose}>
                            <svg className="back-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>

                    <div className="feature-header-center">
                        <h2 className="feature-title">Profile</h2>
                        <p className="feature-subtitle">Your account and stats</p>
                    </div>
                    <div className="feature-header-right">
                        <button className="feature-action-button" onClick={logout}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="feature-overlay-content">
                    <div className="profile-container">
                        <div className="profile-header">
                            <div className="profile-avatar-section">
                                <div className="profile-avatar-large">
                                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="profile-info">
                                    <h2 className="profile-name">{user?.username || 'User'}</h2>
                                    <p className="profile-email">{user?.phoneNumber || 'No phone number'}</p>
                                    <div className="profile-membership">
                                        <span className="membership-badge">🎮 Regular Player</span>
                                        <span className="member-since">Member since Dec 2023</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                className="btn-edit-profile"
                                onClick={() => {
                                    onEditProfile(); // Call the prop function
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Edit Profile
                            </button>
                        </div>

                        {/* Rest of your component remains the same */}
                        <div className="profile-points-section">
                            <div className="points-card">
                                <div className="points-header">
                                    <h3 className="points-title">Your Points</h3>
                                    <span className="points-balance">{user?.pointsBalance || 0}</span>
                                </div>
                                <div className="points-progress">
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: '65%' }}></div>
                                    </div>
                                    <div className="progress-info">
                                        <span className="progress-text">65% to next level</span>
                                        <span className="progress-target">Next: 500 points</span>
                                    </div>
                                </div>
                                <button className="btn-buy-points"
                                        onClick={()=>setShowBuyPoints(true)}
                                >
                                    Buy More Points
                                </button>
                            </div>
                        </div>

                        <div className="profile-stats-grid">
                            <h3 className="stats-title">Your Statistics</h3>
                            <div className="stats-grid">
                                {profileStats.map((stat, index) => (
                                    <div key={index} className="stat-item">
                                        <div className="stat-icon">{stat.icon}</div>
                                        <div className="stat-content">
                                            <span className="stat-value">{stat.value}</span>
                                            <span className="stat-label">{stat.label}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="profile-settings">
                            <h3 className="settings-title">Account Settings</h3>
                            <div className="settings-list">
                                <button className="settings-item">
                                    <span className="settings-icon">🔔</span>
                                    <span className="settings-label">Notifications</span>
                                    <span className="settings-arrow">→</span>
                                </button>
                                <button className="settings-item">
                                    <span className="settings-icon">🔒</span>
                                    <span className="settings-label">Privacy & Security</span>
                                    <span className="settings-arrow">→</span>
                                </button>
                                <button className="settings-item">
                                    <span className="settings-icon">💳</span>
                                    <span className="settings-label">Payment Methods</span>
                                    <span className="settings-arrow">→</span>
                                </button>
                                <button className="settings-item">
                                    <span className="settings-icon">🆘</span>
                                    <span className="settings-label">Help & Support</span>
                                    <span className="settings-arrow">→</span>
                                </button>
                                <button className="settings-item logout" onClick={logout}>
                                    <span className="settings-icon">🚪</span>
                                    <span className="settings-label">Logout</span>
                                    <span className="settings-arrow">→</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};