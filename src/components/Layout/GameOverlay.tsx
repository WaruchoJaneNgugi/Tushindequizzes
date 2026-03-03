// components/Game/GameOverlay.tsx
import {useGameStore} from '../../Store/gameStore';
import {useAuth} from '../../hooks/useAuth';
import {getGameComponent} from '../../utils/gameComponent';
import {useState, useEffect, useRef} from 'react';

export const GameOverlay = () => {
    const {selectedGame, showGameOverlay, setShowGameOverlay} = useGameStore();
    const {user} = useAuth();
    const [isFullscreen, setIsFullscreen] = useState(false);
    // const [showSettings, setShowSettings] = useState(false);
    const [pointsUpdated, setPointsUpdated] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Add escape key handler
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, []);

    useEffect(() => {
        // Animate points when they change
        if (user?.pointsBalance) {
            setPointsUpdated(true);
            const timer = setTimeout(() => setPointsUpdated(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [user?.pointsBalance]);

    if (!selectedGame || !showGameOverlay) return null;

    const GameComponent = getGameComponent(selectedGame.id);

    const handleClose = () => {
        // Add confirmation if game is in progress
        const shouldClose = true; // You can implement game state check here
        // if (gameInProgress) {
        //     shouldClose = window.confirm('Are you sure you want to leave? Your progress may be lost.');
        // }
        if (shouldClose) {
            setShowGameOverlay(false);
            if (isFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    const toggleFullscreen = async () => {
        if (!containerRef.current) return;

        if (!isFullscreen) {
            if (containerRef.current.requestFullscreen) {
                await containerRef.current.requestFullscreen();
                setIsFullscreen(true);
            }
        } else {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    return (
        <div className="game-overlay-overlay" onClick={(e) => {
            // Close when clicking the overlay background
            if (e.target === e.currentTarget) handleClose();
        }}>
            <div
                ref={containerRef}
                className="game-overlay-container"
                role="dialog"
                aria-modal="true"
                aria-label={`Playing ${selectedGame.title}`}
            >
                {/* Professional Game Header */}
                <div className="game-overlay-header">
                    <div className="game-header-left">
                        <button
                            className="game-back-button"
                            onClick={handleClose}
                            aria-label="Back to games"
                            title="Back to games (Esc)"
                        >
                            <span className="svg-home-icon" aria-hidden="true">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
                                          fill="currentColor"/>
                                </svg>
                            </span>
                            <span className="back-text">Exit Game</span>
                        </button>

                        <div className={`game-balance ${pointsUpdated ? 'points-updated' : ''}`}>
                            <span className="game-balance-label" aria-label="Current points">
                                 points
                            </span>
                            <span className="game-balance-amount">
                                {user?.pointsBalance?.toLocaleString() ?? 0}
                            </span>
                        </div>
                    </div>

                    {/*<div className="game-header-center">*/}
                    {/*    <h2 className="game-title">*/}
                    {/*        {selectedGame.title}*/}
                    {/*        {selectedGame.isNew && <span className="game-tag-new">NEW</span>}*/}
                    {/*        {selectedGame.isHot && <span className="game-tag-hot">HOT</span>}*/}
                    {/*    </h2>*/}
                    {/*    <p className="game-subtitle">*/}
                    {/*        {selectedGame.category || selectedGame.developer || 'Premium Game'}*/}
                    {/*    </p>*/}
                    {/*</div>*/}

                    <div className="game-header-right">
                        {/*<button*/}
                        {/*    className={`game-action-button settings ${showSettings ? 'active' : ''}`}*/}
                        {/*    onClick={() => setShowSettings(!showSettings)}*/}
                        {/*    aria-label="Game settings"*/}
                        {/*    title="Settings"*/}
                        {/*>*/}
                        {/*    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">*/}
                        {/*        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94 0 .31.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor"/>*/}
                        {/*    </svg>*/}
                        {/*</button>*/}
                        <button
                            className="game-action-button fullscreen"
                            onClick={toggleFullscreen}
                            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                            title={isFullscreen ? 'Exit fullscreen (F)' : 'Enter fullscreen (F)'}
                        >
                            {isFullscreen ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
                                        fill="currentColor"/>
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                                        fill="currentColor"/>
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Settings Panel (if open) */}
                {/*{showSettings && (*/}
                {/*    <div className="game-settings-panel">*/}
                {/*        <h4>Game Settings</h4>*/}
                {/*        /!* Add your game-specific settings here *!/*/}
                {/*        <div className="settings-option">*/}
                {/*            <label>Sound</label>*/}
                {/*            <input type="checkbox" defaultChecked />*/}
                {/*        </div>*/}
                {/*        <div className="settings-option">*/}
                {/*            <label>Music</label>*/}
                {/*            <input type="checkbox" defaultChecked />*/}
                {/*        </div>*/}
                {/*        <button onClick={() => setShowSettings(false)}>Close</button>*/}
                {/*    </div>*/}
                {/*)}*/}

                {/* Game Content */}
                <div className="game-overlay-content-wrapper">
                    {GameComponent ? (
                        <div className="game-component-container">
                            {/* Game Info Notice */}
                            {/*<div className="entry-fee-notice">*/}
                            {/*    <span className="entry-fee-icon">💰</span>*/}
                            {/*    /!*<span>*!/*/}
                            {/*    /!*    {selectedGame.entryFee > 0*!/*/}
                            {/*    /!*        ? `This game costs ${selectedGame.entryFee} points to play`*!/*/}
                            {/*    /!*        : 'Free to play!'}*!/*/}
                            {/*    /!*</span>*!/*/}
                            {/*</div>*/}

                            <GameComponent/>

                            {/*/!* Game Instructions *!/*/}
                            {/*{selectedGame.instructions && (*/}
                            {/*    <div className="game-instructions">*/}
                            {/*        <h3>How to Play</h3>*/}
                            {/*        <p>{selectedGame.instructions}</p>*/}
                            {/*    </div>*/}
                            {/*)}*/}
                        </div>
                    ) : (
                        <div className="game-not-available">
                            <div className="not-available-icon" aria-hidden="true">🎮</div>
                            <h3 className="coming-soon">Game Coming Soon!</h3>
                            <p>
                                {selectedGame.title} is not available yet.
                                Please check back later or try another game.
                            </p>
                            <div className="game-actions">
                                <button
                                    className="btn-play-again"
                                    onClick={() => {
                                        // You could navigate to similar games here
                                        setShowGameOverlay(false);
                                    }}
                                >
                                    Browse Games
                                </button>
                                <button
                                    className="btn-exit"
                                    onClick={handleClose}
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer with Game Stats */}
                {/*{GameComponent && (*/}
                {/*    <div className="game-overlay-footer">*/}
                {/*        <div className="game-stats">*/}
                {/*            <div className="stat-item">*/}
                {/*                <span className="stat-label">Players Online</span>*/}
                {/*                <span className="stat-value">1.2k</span>*/}
                {/*            </div>*/}
                {/*            <div className="stat-item">*/}
                {/*                <span className="stat-label">Win Rate</span>*/}
                {/*                <span className="stat-value">78%</span>*/}
                {/*            </div>*/}
                {/*            <div className="stat-item">*/}
                {/*                <span className="stat-label">High Score</span>*/}
                {/*                <span className="stat-value">2,450</span>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*        <div className="game-feedback">*/}
                {/*            <button className="feedback-btn">*/}
                {/*                👍 Like*/}
                {/*            </button>*/}
                {/*            <button className="feedback-btn">*/}
                {/*                Report Issue*/}
                {/*            </button>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*)}*/}
            </div>
        </div>
    );
};