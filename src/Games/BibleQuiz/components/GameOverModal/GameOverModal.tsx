// src/components/GameOverModal/GameOverModal.tsx - UPDATED
import React from 'react';
import './GameOverModal.css';

interface GameOverModalProps {
    score: number;
    startingPoints?: number;
    reason: 'points' | 'time' | 'quit';
    totalQuestions: number;
    questionsAnswered: number;
    onClose: (action: 'retry' | 'home') => void;
    quizColor?: string;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
                                                         score,
                                                         startingPoints = 100,
                                                         reason,
                                                         totalQuestions,
                                                         questionsAnswered,
                                                         onClose,
                                                         quizColor = '#e74c3c'
                                                     }) => {
    const getReasonMessage = () => {
        switch (reason) {
            case 'points':
                return score === 0 ? 'Your score hit zero!' : 'Your score dropped below zero!';
            case 'time':
                return 'Time ran out!';
            case 'quit':
                return 'Quiz terminated';
        }
    };

    const getReasonIcon = () => {
        switch (reason) {
            case 'points':
                return '💔';
            case 'time':
                return '⏰';
            case 'quit':
                return '🚫';
        }
    };

    const pointsLost = startingPoints - score;
    const correctPercentage = Math.round((questionsAnswered / totalQuestions) * 100);

    return (
        <div className="gameOverOverlay">
            <div className="gameOverModal" style={{ borderTop: `6px solid ${quizColor}` }}>
                <div className="gameOverIcon">{getReasonIcon()}</div>

                <h2 className="gameOverTitle">Game Over!</h2>
                <p className="gameOverReason">{getReasonMessage()}</p>

                <div className="gameOverStats">
                    <div className="statItem">
                        <span className="statLabel">Starting Points</span>
                        <span className="statValue">{startingPoints}</span>
                    </div>

                    <div className="statItem">
                        <span className="statLabel">Final Score</span>
                        <span className="statValue" style={{ color: score <= 0 ? '#e74c3c' : '#2ecc71' }}>
              {score}
            </span>
                    </div>

                    <div className="statItem">
                        <span className="statLabel">Points Lost</span>
                        <span className="statValue" style={{ color: '#e74c3c' }}>
              -{pointsLost}
            </span>
                    </div>

                    <div className="statItem">
                        <span className="statLabel">Questions Answered</span>
                        <span className="statValue">{questionsAnswered}/{totalQuestions}</span>
                    </div>

                    <div className="statItem">
                        <span className="statLabel">Completion</span>
                        <span className="statValue">{correctPercentage}%</span>
                    </div>
                </div>

                <div className="gameOverMessage">
                    <p>
                        {reason === 'points' && "You started with 100 points but couldn't keep them. Try again!"}
                        {reason === 'time' && "Speed comes with practice. You started with 100 points - try to protect them!"}
                    </p>
                </div>

                <div className="gameOverActions">
                    <button
                        className="retryButton"
                        style={{ backgroundColor: quizColor }}
                        onClick={() => onClose('retry')}
                    >
                        Try Again (Start with 100)
                    </button>

                    <button
                        className="homeButton"
                        onClick={() => onClose('home')}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameOverModal;