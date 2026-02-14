import React from 'react';
import type { Player } from '../types/type.ts';
import '../style/resultpopup.css';

interface ResultsPopupProps {
    player: Player;
    onPlayAgain: () => void;
    onMenu: () => void;
    // onShare: () => void;
}

const ResultsPopup: React.FC<ResultsPopupProps> = ({
                                                       player,
                                                       onPlayAgain,
                                                       onMenu,
                                                       // onShare
                                                   }) => {
    const accuracy = player.totalQuestions > 0
        ? Math.round((player.correctAnswers / player.totalQuestions) * 100)
        : 0;

    const achievements = [
        { name: 'Bible Scholar', unlocked: player.score >= 500, icon: '📚' },
        { name: 'Hot Streak', unlocked: player.bestStreak >= 5, icon: '🔥' },
        { name: 'Bible Master', unlocked: player.level >= 3, icon: '👑' },
        { name: 'Perfect Score', unlocked: accuracy === 100, icon: '💯' }
    ];

    const unlockedAchievements = achievements.filter(a => a.unlocked);

    return (
        <div className="results-popup-overlay">
            <div className="results-popup">
                <div className="results-header">
                    <div className="results-icon">🏆</div>
                    <h2>Quiz Complete!</h2>
                    <p className="results-subtitle">You answered all the questions</p>
                </div>

                <div className="final-score">
                    <div className="score-display">
                        <span className="score-label">Final Score</span>
                        <span className="score-value">{player.score}</span>
                    </div>
                </div>

                <div className="results-stats">
                    <div className="stat-game-grid">
                        <div className="stat-item">
                            <span className="stat-icon">📊</span>
                            <span className="stat-label">Accuracy</span>
                            <span className="stat-value">{accuracy}%</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-icon">✅</span>
                            <span className="stat-label">Correct</span>
                            <span className="stat-value">{player.correctAnswers}/{player.totalQuestions}</span>
                        </div>
                        {/*<div className="stat-item">*/}
                        {/*    <span className="stat-icon">⭐</span>*/}
                        {/*    <span className="stat-label">Level</span>*/}
                        {/*    <span className="stat-value">{player.level}</span>*/}
                        {/*</div>*/}
                        <div className="stat-item">
                            <span className="stat-icon">🔥</span>
                            <span className="stat-label">Best Streak</span>
                            <span className="stat-value">{player.bestStreak}</span>
                        </div>
                    </div>
                </div>

                {unlockedAchievements.length > 0 && (
                    <div className="achievements-section">
                        <h3>🎖️ Achievements Unlocked</h3>
                        <div className="achievements-grid">
                            {unlockedAchievements.map((achievement, index) => (
                                <div key={index} className="achievement-badge">
                                    <span className="achievement-icon">{achievement.icon}</span>
                                    <span className="achievement-name">{achievement.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="results-actions">
                    <button className="action-btn primary" onClick={onPlayAgain}>
                        {/*<span className="btn-icon">🔄</span>*/}
                        <span className="btn-text">Play Again</span>
                    </button>
                    {/*<button className="action-btn" onClick={onShare}>*/}
                    {/*    /!*<span className="btn-icon">📤</span>*!/*/}
                    {/*    <span className="btn-text">Share Score</span>*/}
                    {/*</button>*/}
                    <button className="action-btn" onClick={onMenu}>
                        {/*<span className="btn-icon">🏠</span>*/}
                        <span className="btn-text">Main Menu</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResultsPopup;