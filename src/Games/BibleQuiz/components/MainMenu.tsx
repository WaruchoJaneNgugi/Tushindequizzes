import React from 'react';
import type {Player} from '../types/type.ts';
import "../style/mainmenu.css"
import "../style/style.css"

interface MainMenuProps {
    player: Player;
    onStartGame: () => void;
    onShowTutorial: () => void;
    // onChangeName: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({
                                               player,
                                               onStartGame,
                                               onShowTutorial,
                                               // onChangeName
                                           }) => {
    // const accuracy = player.totalQuestions > 0
    //     ? Math.round((player.correctAnswers / player.totalQuestions) * 100)
    //     : 0;

    return (
        <div className="main-menu" style={{ background: '#0d0c14' }}>
            <div className="logo">
                <h1>📖 Bible Quiz Challenge</h1>
                <p>Test your knowledge of the Scriptures</p>
            </div>

            {/* UPDATED: Added player-stats-container */}
            <div className="player-stats-container">
                <div className="player-card">
                    {/*<div className="player-avatar">🙏</div>*/}
                    <div className="player-info">
                        {/*<h3>{player.name}</h3>*/}
                        <div className="player-stats">
                            {/*<span className="stat">Level: {player.level}</span>*/}
                            <span className="stat">Score: {player.score}</span>
                            <span className="stat">Best Streak: {player.bestStreak}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="menu-options">
                <button className="menu-btn primary" onClick={onStartGame}>
                    <span className="icon">🎮</span>
                    <span className="text">Start New Game</span>
                </button>

                <button className="menu-btn" onClick={onShowTutorial}>
                    <span className="icon">❓</span>
                    <span className="text">How to Play</span>
                </button>

                {/*<button className="menu-btn" onClick={onChangeName}>*/}
                {/*    <span className="icon">✏️</span>*/}
                {/*    <span className="text">Change Name</span>*/}
                {/*</button>*/}
            </div>

            <div className="quick-stats">
                <div className="stat-box">
                    <div className="stat-value">{player.correctAnswers}</div>
                    <div className="stat-label">Correct Answers</div>
                </div>
                <div className="stat-box">
                    <div className="stat-value">{player.totalQuestions}</div>
                    <div className="stat-label">Total Questions</div>
                </div>
                {/*<div className="stat-box">*/}
                {/*    <div className="stat-value">{accuracy}%</div>*/}
                {/*    <div className="stat-label">Accuracy</div>*/}
                {/*</div>*/}
            </div>
        </div>
    );
};

export default MainMenu;