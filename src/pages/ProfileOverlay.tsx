import type { FC } from "react";
import { useAuth } from "../hooks/useAuth.ts";
import { useUI } from "../hooks/useUI.ts";
import "../styles/profile-overlay.css";

interface ProfileOverlayProps {
    onClose: () => void;
    onEditProfile: () => void;
}

export const ProfileOverlay: FC<ProfileOverlayProps> = ({ onClose, onEditProfile }) => {
    const { user, logout } = useAuth();
    const { setShowBuyPoints } = useUI();

    const profileStats = [
        { label: 'Games Played', value: '42',  icon: '🎮' },
        { label: 'Win Rate',     value: '67%', icon: '📈' },
        { label: 'Avg Score',    value: '85%', icon: '⭐' },
        { label: 'Rank',         value: '#4',  icon: '🏆' },
    ];

    const settingsItems = [
        { icon: '🔔', label: 'Notifications',      onClick: () => {} },
        { icon: '🔒', label: 'Privacy & Security', onClick: () => {} },
        { icon: '💳', label: 'Payment Methods',    onClick: () => {} },
        { icon: '🆘', label: 'Help & Support',     onClick: () => {} },
    ];

    const initial = user?.email?.charAt(0).toUpperCase() || 'U';

    return (
        <>
            <div className="pf-backdrop" onClick={onClose} />
            <div className="pf-shell">

                {/* ── TOPBAR ── */}
                <header className="pf-topbar">
                    <button className="pf-back" onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Back
                    </button>
                    <span className="pf-topbar-title">Profile</span>
                    <button className="pf-logout-btn" onClick={logout} title="Log out">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Log out
                    </button>
                </header>

                <div className="pf-body">

                    {/* ── HERO ── */}
                    <section className="pf-hero">
                        <div className="pf-avatar-ring">
                            <div className="pf-avatar">{initial}</div>
                        </div>
                        <div className="pf-hero-info">
                            <h1 className="pf-name">{user?.username || 'Player'}</h1>
                            <p className="pf-sub">{user?.phoneNumber || user?.email || '—'}</p>
                            <div className="pf-badges">
                                <span className="pf-badge pf-badge--green">🎮 Regular Player</span>
                                <span className="pf-badge pf-badge--dim">Member since Dec 2023</span>
                            </div>
                        </div>
                        <button className="pf-edit-btn" onClick={onEditProfile}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            Edit Profile
                        </button>
                    </section>

                    {/* ── POINTS CARD ── */}
                    <section className="pf-section">
                        <div className="pf-points-card">
                            <div className="pf-points-left">
                                <span className="pf-points-eyebrow">Your Balance</span>
                                <span className="pf-points-value">{(user?.pointsBalance || 0).toLocaleString()}</span>
                                <span className="pf-points-unit">points</span>
                            </div>
                            <div className="pf-points-right">
                                <div className="pf-progress-wrap">
                                    <div className="pf-progress-track">
                                        <div className="pf-progress-fill" style={{ width: '65%' }} />
                                    </div>
                                    <div className="pf-progress-meta">
                                        <span>65% to next level</span>
                                        <span>500 pts</span>
                                    </div>
                                </div>
                                <button className="pf-buy-btn" onClick={() => setShowBuyPoints(true)}>
                                    ⚡ Buy Points
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* ── STATS ── */}
                    <section className="pf-section">
                        <h2 className="pf-section-label">Statistics</h2>
                        <div className="pf-stats-grid">
                            {profileStats.map((s, i) => (
                                <div key={i} className="pf-stat-card">
                                    <span className="pf-stat-icon">{s.icon}</span>
                                    <span className="pf-stat-val">{s.value}</span>
                                    <span className="pf-stat-lbl">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── SETTINGS ── */}
                    <section className="pf-section">
                        <h2 className="pf-section-label">Account</h2>
                        <div className="pf-settings-list">
                            {settingsItems.map((item, i) => (
                                <button key={i} className="pf-settings-row" onClick={item.onClick}>
                                    <span className="pf-settings-icon">{item.icon}</span>
                                    <span className="pf-settings-label">{item.label}</span>
                                    <svg className="pf-settings-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            ))}
                            <button className="pf-settings-row pf-settings-row--danger" onClick={logout}>
                                <span className="pf-settings-icon">🚪</span>
                                <span className="pf-settings-label">Log out</span>
                                <svg className="pf-settings-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </section>

                </div>
            </div>
        </>
    );
};
