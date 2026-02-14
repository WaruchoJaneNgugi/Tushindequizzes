import type {FC} from "react";
import "../../styles/featureoverlay.css"

interface AchievementsOverlayProps {
    onClose: () => void;
}

export const AchievementsOverlay: FC<AchievementsOverlayProps> = ({ onClose }) => {

    const achievements = [
        { id: 1, name: 'First Timer', description: 'Complete your first game', icon: '🎮', xp: 100, status: 'unlocked' },
        { id: 2, name: 'Login Streak', description: 'Login for 7 consecutive days', icon: '🔥', xp: 250, status: 'completed' },
        { id: 3, name: 'Quiz Master', description: 'Win 10 quiz games', icon: '👑', xp: 500, status: 'in-progress', progress: 7 },
        { id: 4, name: 'Speed Demon', description: 'Complete 5 games under 60 seconds', icon: '⚡', xp: 300, status: 'in-progress', progress: 3 },
        { id: 5, name: 'Perfect Score', description: 'Get 100% in any game', icon: '⭐', xp: 750, status: 'locked' },
        { id: 6, name: 'Social Butterfly', description: 'Share with 3 friends', icon: '🦋', xp: 200, status: 'in-progress', progress: 2 },
        { id: 7, name: 'Game Collector', description: 'Play 20 different games', icon: '📚', xp: 400, status: 'locked' },
        { id: 8, name: 'Point Millionaire', description: 'Earn 1,000,000 points', icon: '💰', xp: 1000, status: 'in-progress', progress: 42 },
    ];

    const calculateTotalXP = () => {
        return achievements
            .filter(ach => ach.status === 'completed')
            .reduce((total, ach) => total + ach.xp, 0);
    };

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
                        <p className="feature-subtitle">Unlock achievements and earn XP</p>
                    </div>
                    <div className="feature-header-right">
                        <button className="feature-action-button">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M19.4 15C19.2668 15.3059 19.1336 15.6118 19.0004 15.9177C18.9802 16.0405 18.9599 16.1633 18.9397 16.2861C18.8494 16.8992 18.759 17.5123 18.6687 18.1254C18.5107 18.7988 18.0713 19.3714 17.4594 19.6942C17.178 19.8378 16.8966 19.9814 16.6153 20.125C16.5045 20.184 16.3937 20.243 16.283 20.302C15.8218 20.56 15.3008 20.5 14.8981 20.1483C14.4953 19.7966 14.0926 19.4449 13.6898 19.0932C13.6287 19.0422 13.5675 18.9912 13.5064 18.9401C13.183 18.6587 12.8595 18.3774 12.5361 18.096C12.146 17.7566 11.8567 17.312 11.8567 16.7997C11.8567 16.2874 12.146 15.8428 12.5361 15.5034C12.8595 15.222 13.183 14.9407 13.5064 14.6593C13.5675 14.6082 13.6287 14.5572 13.6898 14.5062C14.0926 14.1545 14.4953 13.8028 14.8981 13.4511C15.3008 13.0994 15.8218 13.0394 16.283 13.2974C16.3937 13.3564 16.5045 13.4154 16.6153 13.4744C16.8966 13.618 17.178 13.7616 17.4594 13.9052C18.0713 14.228 18.5107 14.8006 18.6687 15.474C18.759 16.0871 18.8494 16.7002 18.9397 17.3133C18.9599 17.4361 18.9802 17.5589 19.0004 17.6817C19.1336 17.9876 19.2668 18.2935 19.4 18.5994" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="feature-overlay-content">
                    <div className="achievements-container">
                        <div className="achievements-summary">
                            <div className="summary-card">
                                <div className="summary-icon">🏆</div>
                                <div className="summary-info">
                                    <h3 className="summary-title">Total XP Earned</h3>
                                    <p className="summary-value">{calculateTotalXP()} XP</p>
                                </div>
                            </div>
                            <div className="summary-card">
                                <div className="summary-icon">📊</div>
                                <div className="summary-info">
                                    <h3 className="summary-title">Achievements</h3>
                                    <p className="summary-value">
                                        {achievements.filter(a => a.status === 'completed').length}/{achievements.length} Completed
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="achievements-grid-feature">
                            <h3 className="achievements-section-title">Your Achievements</h3>
                            <div className="achievements-list">
                                {achievements.map((achievement) => (
                                    <div key={achievement.id} className={`achievement-card ${achievement.status}`}>
                                        <div className="achievement-icon">
                                            <span className="achievement-emoji">{achievement.icon}</span>
                                            {achievement.status === 'completed' && (
                                                <div className="achievement-check">✓</div>
                                            )}
                                        </div>
                                        <div className="achievement-content">
                                            <div className="achievement-header">
                                                <h4 className="achievement-name">{achievement.name}</h4>
                                                <div className="achievement-xp">
                                                    <span className="xp-icon">⚡</span>
                                                    <span className="xp-value">{achievement.xp} XP</span>
                                                </div>
                                            </div>
                                            <p className="achievement-description">{achievement.description}</p>

                                            {achievement.status === 'in-progress' && achievement.progress && (
                                                <div className="achievement-progress">
                                                    <div className="progress-bar">
                                                        <div
                                                            className="progress-fill"
                                                            style={{ width: `${(achievement.progress / 10) * 100}%` }}
                                                        />
                                                    </div>
                                                    <div className="progress-text">
                                                        Progress: {achievement.progress}/10
                                                    </div>
                                                </div>
                                            )}

                                            {achievement.status === 'locked' && (
                                                <div className="achievement-locked">
                                                    <span className="lock-icon">🔒</span>
                                                    <span className="locked-text">Keep playing to unlock</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="achievement-status">
                                            <span className={`status-badge ${achievement.status}`}>
                                                {achievement.status === 'completed' && 'Completed'}
                                                {achievement.status === 'in-progress' && 'In Progress'}
                                                {achievement.status === 'unlocked' && 'Available'}
                                                {achievement.status === 'locked' && 'Locked'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="achievements-info">
                            <div className="info-card">
                                <h4 className="info-title">How Achievements Work</h4>
                                <ul className="info-list">
                                    <li>🎮 Play games to trigger achievements</li>
                                    <li>⚡ Earn XP for completing achievements</li>
                                    <li>🔥 Maintain login streaks for bonus achievements</li>
                                    <li>🏆 Complete all achievements to unlock special rewards</li>
                                    <li>📈 Track your progress on in-progress achievements</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};