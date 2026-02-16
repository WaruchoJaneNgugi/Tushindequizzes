import type { FC } from "react";
import { useState, useEffect } from "react";
import { useAchievements } from "../hooks/useAchievements";
// import { useAuth } from "../hooks/useAuth";
import "../styles/featureoverlay.css";

interface RewardsOverlayProps {
    onClose: () => void;
}

export const RewardsOverlay: FC<RewardsOverlayProps> = ({ onClose }) => {
    // const { user } = useAuth();
    const { stats, userAchievements, loading, error, claimAchievement, fetchUserAchievements } = useAchievements();
    const [claimingId, setClaimingId] = useState<number | null>(null);

    // Refresh achievements when overlay opens
    useEffect(() => {
        fetchUserAchievements();
    }, [fetchUserAchievements]);

    const handleClaim = async (achievementId: number) => {
        setClaimingId(achievementId);
        try {
            await claimAchievement(achievementId);
            // Show success message (you can add a toast notification here)
        } catch (error) {
            // Error is handled by the hook
        } finally {
            setClaimingId(null);
        }
    };

    // If you don't have user achievements endpoint yet, use mock data for now
    const rewards = userAchievements.length > 0 ? userAchievements : [
        { id: 1, name: 'Welcome Bonus', description: 'Complete your first game', points: 100, status: 'claimed' },
        { id: 2, name: 'Daily Login', description: 'Login for 7 consecutive days', points: 250, status: 'available' },
        { id: 3, name: 'Quiz Master', description: 'Win 10 quiz games', points: 500, status: 'locked' },
        { id: 4, name: 'Speed Demon', description: 'Complete 5 games under 60 seconds', points: 300, status: 'available' },
        { id: 5, name: 'Perfect Score', description: 'Get 100% in any game', points: 750, status: 'locked' },
        { id: 6, name: 'Social Star', description: 'Share with 3 friends', points: 200, status: 'available' },
    ];

    const claimedCount = rewards.filter(r => r.status === 'claimed').length;
    const totalPoints = rewards
        .filter(r => r.status === 'claimed')
        .reduce((sum, r) => sum + r.points, 0);

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
                        <h2 className="feature-title">Achievements</h2>
                        <p className="feature-subtitle">Earn points and unlock achievements</p>
                    </div>
                    <div className="feature-header-right">
                        <button className="feature-action-button" onClick={fetchUserAchievements} disabled={loading}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M19.4 15C19.2668 15.3059 19.1336 15.6118 19.0004 15.9177C18.9802 16.0405 18.9599 16.1633 18.9397 16.2861C18.8494 16.8992 18.759 17.5123 18.6687 18.1254C18.5107 18.7988 18.0713 19.3714 17.4594 19.6942C17.178 19.8378 16.8966 19.9814 16.6153 20.125C16.5045 20.184 16.3937 20.243 16.283 20.302C15.8218 20.56 15.3008 20.5 14.8981 20.1483C14.4953 19.7966 14.0926 19.4449 13.6898 19.0932C13.6287 19.0422 13.5675 18.9912 13.5064 18.9401C13.183 18.6587 12.8595 18.3774 12.5361 18.096C12.146 17.7566 11.8567 17.312 11.8567 16.7997C11.8567 16.2874 12.146 15.8428 12.5361 15.5034C12.8595 15.222 13.183 14.9407 13.5064 14.6593C13.5675 14.6082 13.6287 14.5572 13.6898 14.5062C14.0926 14.1545 14.4953 13.8028 14.8981 13.4511C15.3008 13.0994 15.8218 13.0394 16.283 13.2974C16.3937 13.3564 16.5045 13.4154 16.6153 13.4744C16.8966 13.618 17.178 13.7616 17.4594 13.9052C18.0713 14.228 18.5107 14.8006 18.6687 15.474C18.759 16.0871 18.8494 16.7002 18.9397 17.3133C18.9599 17.4361 18.9802 17.5589 19.0004 17.6817C19.1336 17.9876 19.2668 18.2935 19.4 18.5994" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="feature-overlay-content">
                    {loading && !stats && (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Loading achievements...</p>
                        </div>
                    )}

                    {error && (
                        <div className="error-container">
                            <p className="error-message">{error}</p>
                            <button onClick={fetchUserAchievements} className="retry-button">
                                Retry
                            </button>
                        </div>
                    )}

                    <div className="rewards-container">
                        {/* Stats Summary */}
                        <div className="rewards-summary">
                            <div className="summary-card">
                                <div className="summary-icon">🏆</div>
                                <div className="summary-info">
                                    <h3 className="summary-title">Total Points Earned</h3>
                                    <p className="summary-value">
                                        {stats?.totalPointsAvailable?.toLocaleString() || totalPoints} Points
                                    </p>
                                </div>
                            </div>
                            <div className="summary-card">
                                <div className="summary-icon">📊</div>
                                <div className="summary-info">
                                    <h3 className="summary-title">Achievements</h3>
                                    <p className="summary-value">
                                        {claimedCount}/{stats?.totalAchievements || rewards.length} Completed
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Achievements from API */}
                        {stats?.recentAchievements && stats.recentAchievements.length > 0 && (
                            <div className="recent-achievements">
                                <h3 className="rewards-section-title">Recent Activity</h3>
                                <div className="recent-badge">
                                    {stats.recentAchievements.map((achievement, index) => (
                                        <span key={index} className="recent-achievement-badge">
                                            New Achievement #{achievement}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Achievements Grid */}
                        <div className="rewards-grid">
                            <h3 className="rewards-section-title">Available Rewards</h3>
                            <div className="rewards-list">
                                {rewards.map((reward) => (
                                    <div key={reward.id} className={`reward-card ${reward.status}`}>
                                        <div className="reward-icon">
                                            {reward.status === 'claimed' && '✅'}
                                            {reward.status === 'available' && '🎁'}
                                            {reward.status === 'locked' && '🔒'}
                                        </div>
                                        <div className="reward-content">
                                            <h4 className="reward-name">{reward.name}</h4>
                                            <p className="reward-description">{reward.description}</p>
                                            <div className="reward-points">
                                                <span className="points-icon">🪙</span>
                                                <span className="points-value">{reward.points} Points</span>
                                            </div>
                                        </div>
                                        <button
                                            className={`reward-claim-btn ${reward.status}`}
                                            onClick={() => reward.status === 'available' && handleClaim(reward.id)}
                                            disabled={reward.status !== 'available' || claimingId === reward.id}
                                        >
                                            {claimingId === reward.id ? (
                                                <span className="loading-spinner-small"></span>
                                            ) : (
                                                <>
                                                    {reward.status === 'claimed' && 'Claimed'}
                                                    {reward.status === 'available' && 'Claim Now'}
                                                    {reward.status === 'locked' && 'Locked'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Info Card */}
                        <div className="rewards-info">
                            <div className="info-card">
                                <h4 className="info-title">How to Earn More Points</h4>
                                <ul className="info-list">
                                    <li>🎮 Play games daily</li>
                                    <li>🏆 Win games to get bonus points</li>
                                    <li>📅 Login consecutively for streak bonuses</li>
                                    <li>🤝 Invite friends to earn referral points</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};