import type { FC } from "react";
import { useEffect, useState } from "react";
import "../../styles/featureoverlay.css";
import { useAchievements } from "../../hooks/useAchievements.ts";

interface RewardsOverlayProps {
    onClose: () => void;
}

export const AchievementsOverlay: FC<RewardsOverlayProps> = ({ onClose }) => {
    const { stats, achievements, loading, error, claimAchievement, fetchUserAchievements } = useAchievements(); // Make sure this matches: achievements, not userAchievements
    const [claimingId, setClaimingId] = useState<string | number | null>(null);
    const [filter, setFilter] = useState<'all' | 'available' | 'claimed' | 'locked'>('all');

    // Refresh achievements when overlay opens
    useEffect(() => {
        fetchUserAchievements();
    }, [fetchUserAchievements]);

    const handleClaim = async (achievementId: string | number) => {
        setClaimingId(achievementId);
        try {
            await claimAchievement(achievementId);
            // Show success message (you can add a toast notification here)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // Error is handled by the hook
        } finally {
            setClaimingId(null);
        }
    };

    // Filter achievements based on selected filter
    const filteredAchievements = achievements.filter(achievement => {
        if (filter === 'all') return true;
        return achievement.status === filter;
    });

    // Calculate stats from actual achievements
    const claimedCount = achievements.filter(a => a.status === 'claimed').length;
    const totalPoints = achievements
        .filter(a => a.status === 'claimed')
        .reduce((sum, a) => sum + (a.points || 0), 0);

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
                    {loading && achievements.length === 0 && (
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
                        <div className="rewards-summary">
                            <div className="summary-card">
                                <div className="summary-icon">🏆</div>
                                <div className="summary-info">
                                    <h3 className="summary-title">Total Points Earned</h3>
                                    <p className="summary-value">
                                        {totalPoints.toLocaleString()} Points
                                    </p>
                                </div>
                            </div>
                            <div className="summary-card">
                                <div className="summary-icon">📊</div>
                                <div className="summary-info">
                                    <h3 className="summary-title">Achievements</h3>
                                    <p className="summary-value">
                                        {claimedCount}/{stats?.totalAchievements || achievements.length} Completed
                                    </p>
                                </div>
                            </div>
                            {stats?.totalPointsAvailable ? (
                                <div className="summary-card">
                                    <div className="summary-icon">🎯</div>
                                    <div className="summary-info">
                                        <h3 className="summary-title">Points Available</h3>
                                        <p className="summary-value">
                                            {stats.totalPointsAvailable.toLocaleString()} Points
                                        </p>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {/* Filter Tabs */}
                        <div className="achievement-filters">
                            <button
                                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                                onClick={() => setFilter('all')}
                            >
                                All ({achievements.length})
                            </button>
                            <button
                                className={`filter-btn ${filter === 'available' ? 'active' : ''}`}
                                onClick={() => setFilter('available')}
                            >
                                Available ({achievements.filter(a => a.status === 'available').length})
                            </button>
                            <button
                                className={`filter-btn ${filter === 'claimed' ? 'active' : ''}`}
                                onClick={() => setFilter('claimed')}
                            >
                                Claimed ({achievements.filter(a => a.status === 'claimed').length})
                            </button>
                            <button
                                className={`filter-btn ${filter === 'locked' ? 'active' : ''}`}
                                onClick={() => setFilter('locked')}
                            >
                                Locked ({achievements.filter(a => a.status === 'locked').length})
                            </button>
                        </div>

                        {/* Recent Achievements from API */}
                        {stats?.recentAchievements && stats.recentAchievements.length > 0 && (
                            <div className="recent-achievements">
                                <h3 className="rewards-section-title">Recent Activity</h3>
                                <div className="recent-badge">
                                    {stats.recentAchievements.map((achievementId, index) => {
                                        const achievement = achievements.find(a => a.id === achievementId);
                                        return (
                                            <span key={index} className="recent-achievement-badge">
                                                {achievement ? achievement.name : `Achievement #${achievementId}`}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Achievements Grid - Using real data */}
                        <div className="rewards-grid">
                            <h3 className="rewards-section-title">
                                {filter === 'all' && 'All Achievements'}
                                {filter === 'available' && 'Available to Claim'}
                                {filter === 'claimed' && 'Completed Achievements'}
                                {filter === 'locked' && 'Locked Achievements'}
                            </h3>

                            {filteredAchievements.length === 0 ? (
                                <div className="empty-state">
                                    <p>No achievements found in this category.</p>
                                </div>
                            ) : (
                                <div className="rewards-list">
                                    {filteredAchievements.map((achievement) => (
                                        <div key={achievement.id} className={`reward-card ${achievement.status}`}>
                                            <div className="reward-icon">
                                                {achievement.icon || (
                                                    achievement.status === 'claimed' ? '✅' :
                                                        achievement.status === 'available' ? '🎁' : '🔒'
                                                )}
                                            </div>
                                            <div className="reward-content">
                                                <h4 className="reward-name">{achievement.name}</h4>
                                                <p className="reward-description">{achievement.description}</p>

                                                {/* Progress bar if achievement has progress */}
                                                {achievement.progress !== undefined && achievement.maxProgress && (
                                                    <div className="achievement-progress">
                                                        <div className="progress-bar">
                                                            <div
                                                                className="progress-fill"
                                                                style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                                                            />
                                                        </div>
                                                        <span className="progress-text">
                                                            {achievement.progress}/{achievement.maxProgress}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="reward-points">
                                                    <span className="points-icon">🪙</span>
                                                    <span className="points-value">{achievement.points} Points</span>
                                                </div>

                                                {/* Show earned date if claimed */}
                                                {achievement.earnedAt && (
                                                    <div className="earned-date">
                                                        Earned: {new Date(achievement.earnedAt).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                className={`reward-claim-btn ${achievement.status}`}
                                                onClick={() => achievement.status === 'available' && handleClaim(achievement.id)}
                                                disabled={achievement.status !== 'available' || claimingId === achievement.id}
                                            >
                                                {claimingId === achievement.id ? (
                                                    <span className="loading-spinner-small"></span>
                                                ) : (
                                                    <>
                                                        {achievement.status === 'claimed' && 'Claimed'}
                                                        {achievement.status === 'available' && 'Claim Now'}
                                                        {achievement.status === 'locked' && 'Locked'}
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Info Card */}
                        <div className="rewards-info">
                            <div className="info-card">
                                <h4 className="info-title">How to Earn More Points</h4>
                                <ul className="info-list">
                                    <li>🎮 Play games daily</li>
                                    <li>🏆 Win games to get bonus points</li>
                                    <li>📅 Login consecutively for streak bonuses</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};