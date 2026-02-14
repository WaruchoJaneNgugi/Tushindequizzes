import React from 'react';
// import { PointsDisplay } from './PointsDisplay';
import type { BibleQuestion, Player } from '../types/type.ts';

interface QuestionScreenProps {
    question: BibleQuestion;
    timeLeft: number;
    isAnswered: boolean;
    selectedAnswer: number | null;
    onAnswerSelect: (answerIndex: number) => void;
    onMenu: () => void;
    showAutoNext?: boolean;
    currentLevel: number;
    levelProgress: { current: number; needed: number; level: number };
    player: Player;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({
                                                           question,
                                                           timeLeft,
                                                           isAnswered,
                                                           selectedAnswer,
                                                           onAnswerSelect,
                                                           onMenu,
                                                           showAutoNext = false,
                                                           currentLevel,
                                                           levelProgress,
                                                           player
                                                       }) => {
    // Calculate timer class directly from timeLeft
    const getTimerClass = () => {
        if (timeLeft <= 10) return 'critical';
        if (timeLeft <= 20) return 'warning';
        return '';
    };

    // Calculate timer color directly
    const getTimerColor = () => {
        if (timeLeft <= 10) return '#FF4757';
        if (timeLeft <= 20) return '#FFA500';
        return '#00C9FF';
    };

    const handleAnswerClick = (answerIndex: number) => {
        if (isAnswered) return;
        onAnswerSelect(answerIndex);
    };

    const getDifficultyColor = () => {
        switch (question.difficulty) {
            case 'easy': return '#92FE9D';
            case 'medium': return '#FFA500';
            case 'hard': return '#FF4757';
            default: return '#00C9FF';
        }
    };

    const getOptionClass = (index: number) => {
        if (!isAnswered) return '';

        const isCorrectAnswer = index === question.correctAnswer;
        const isSelected = index === selectedAnswer;

        if (isCorrectAnswer) return 'selected correct';
        if (isSelected && !isCorrectAnswer) return 'selected wrong';
        return '';
    };

    const getLevelColor = (level: number) => {
        switch(level) {
            case 1: return '#92FE9D'; // Green for easy
            case 2: return '#FFA500'; // Orange for medium
            case 3: return '#FF4757'; // Red for hard
            default: return '#00C9FF';
        }
    };

    const getLevelName = (level: number) => {
        switch(level) {
            case 1: return 'Beginner';
            case 2: return 'Intermediate';
            case 3: return 'Expert';
            default: return 'Master';
        }
    };

    const getDifficultyName = (difficulty: string) => {
        switch(difficulty) {
            case 'easy': return 'Easy';
            case 'medium': return 'Medium';
            case 'hard': return 'Hard';
            default: return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
        }
    };

    const timerClass = getTimerClass();
    const timerColor = getTimerColor();
    const levelColor = getLevelColor(currentLevel);
    const difficultyColor = getDifficultyColor();

    return (
        <div className="game-screen">
            {/* Game Header with Stats and Level Display */}
            <div className="game-header">
                {/* Player Stats Row - ADDED responsive container class */}
                <div className="player-stats-row responsive-container">
                    <div className="player-stat">
                        <div className="stat-icon">🏆</div>
                        <div className="bible-stat-content">
                            <div className="stat-label">Score</div>
                            <div className="stat-value">{player.score}</div>
                        </div>
                    </div>
                    <div className="player-stat">
                        <div className="stat-icon">🔥</div>
                        <div className="bible-stat-content">
                            <div className="stat-label">Streak</div>
                            <div className="stat-value">{player.currentStreak}</div>
                        </div>
                    </div>
                    <div className="player-stat">
                        <div className="stat-icon">✅</div>
                        <div className="bible-stat-content">
                            <div className="stat-label">Correct</div>
                            <div className="stat-value">
                                {player.correctAnswers}/{player.totalQuestions}
                            </div>
                        </div>
                    </div>

                    {/*/!* Points Display in Header - NOW wrapped properly *!/*/}
                    {/*<div className="header-points">*/}
                    {/*    <PointsDisplay currentPoints={player.points} />*/}
                    {/*</div>*/}
                </div>

                {/* Level Progress and Timer Row - ADDED responsive container */}
                <div className="level-timer-row responsive-container">
                    <div className="level-progress-section">
                        <div className="level-info">
                            <div className="level-badge" style={{ borderColor: levelColor }}>
                                <span className="level-name">{getLevelName(currentLevel)}</span>
                                <span className="level-number" style={{ color: levelColor }}>
                                    Level {currentLevel}
                                </span>
                            </div>

                            <div className="progress-container">
                                <div className="progress-info">
                                    <span className="progress-text">Progress to Next Level</span>
                                    <span className="progress-count">
                                        {levelProgress.current}/{levelProgress.needed}
                                    </span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${(levelProgress.current / levelProgress.needed) * 100}%`,
                                            backgroundColor: levelColor
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="timer-menu-section">
                        <div className="timer-display">
                            <div className="timer-label">TIME LEFT</div>
                            <div
                                className={`timer-circle ${timerClass}`}
                                style={{ borderColor: timerColor }}
                            >
                                <span className="timer-seconds">{timeLeft}s</span>
                            </div>
                        </div>

                        <button
                            className="menu-button responsive-menu-button"
                            onClick={onMenu}
                            disabled={isAnswered && !showAutoNext}
                        >
                            <span className="button-icon">🏠</span>
                            <span className="button-text">Menu</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Question Area */}
            <div className="question-area">
                {/* Question Metadata - ADDED responsive class */}
                <div className="question-meta responsive-meta">
                    <span className="category-badge">
                        <span className="badge-icon">📚</span>
                        <span className="badge-text">{question.category}</span>
                    </span>
                    <span
                        className="difficulty-badge"
                        style={{
                            borderColor: difficultyColor,
                            color: difficultyColor
                        }}
                    >
                        <span className="badge-icon">⚡</span>
                        <span className="badge-text">{getDifficultyName(question.difficulty)}</span>
                    </span>
                    {/*<span className="points-badge">*/}
                    {/*    <span className="badge-icon">⭐</span>*/}
                    {/*    <span className="badge-text">{question.points} points</span>*/}
                    {/*</span>*/}
                </div>

                {/* Question Text */}
                <div className="question-text-container">
                    <h2 className="question-text">{question.question}</h2>
                </div>

                {/* Answer Options */}
                <div className="options-container">
                    {question.options.map((option, index) => (
                        <button
                            key={index}
                            className={`option-button ${getOptionClass(index)}`}
                            onClick={() => handleAnswerClick(index)}
                            disabled={isAnswered}
                        >
                            <span className="option-number">{index + 1}</span>
                            <span className="option-text">{option}</span>
                            {isAnswered && index === question.correctAnswer && (
                                <span className="correct-icon">✓</span>
                            )}
                            {isAnswered && index === selectedAnswer && index !== question.correctAnswer && (
                                <span className="wrong-icon">✗</span>
                            )}
                        </button>
                    ))}
                    {isAnswered && (
                        <div className="feedback-section">
                            <div className="feedback-content">
                                {selectedAnswer === question.correctAnswer ? (
                                    <div className="correct-feedback">
                                        <div className="feedback-header">
                                            <span className="feedback-icon">🎉</span>
                                            <h3>Excellent! Correct Answer!</h3>
                                        </div>
                                        <p className="explanation">{question.explanation}</p>
                                        {question.scripture && (
                                            <div className="scripture-reference">
                                                <span className="scripture-icon">📖</span>
                                                <em>{question.scripture}</em>
                                            </div>
                                        )}
                                        <div className="points-earned">
                                            <span className="points-label">Points Earned</span>
                                            <span className="points-value">+{question.points}</span>
                                        </div>
                                        {showAutoNext && (
                                            <div className="auto-next-notice">
                                                <div className="loading-spinner"></div>
                                                <span>Next question in 1.5 seconds...</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="wrong-feedback">
                                        <div className="feedback-header">
                                            <span className="feedback-icon">💡</span>
                                            <h3>Incorrect Answer</h3>
                                        </div>
                                        <p className="explanation">{question.explanation}</p>
                                        {question.scripture && (
                                            <div className="scripture-reference">
                                                <span className="scripture-icon">📖</span>
                                                <em>{question.scripture}</em>
                                            </div>
                                        )}
                                        <div className="correct-answer">
                                            <span className="answer-label">Correct Answer</span>
                                            <span className="answer-value">
                                                {question.options[question.correctAnswer]}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuestionScreen;