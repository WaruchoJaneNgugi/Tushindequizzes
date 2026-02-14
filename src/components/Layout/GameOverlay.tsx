// components/Game/GameOverlay.tsx
import { useGameStore } from '../../Store/gameStore';
import { useAuth } from '../../hooks/useAuth';
import { getGameComponent } from '../../utils/gameComponent';

export const GameOverlay = () => {
    const { selectedGame, showGameOverlay, setShowGameOverlay } = useGameStore();
    const { user } = useAuth();

    if (!selectedGame || !showGameOverlay) return null;

    const GameComponent = getGameComponent(selectedGame.id);

    const handleClose = () => {
        // if (
            // window.confirm('Are you sure you want to leave? Your progress may be lost.'))
            // {
            setShowGameOverlay(false);
        // }
    };

    return (
        <div className="game-overlay-overlay">
            <div className="game-overlay-container">
                <div className="game-overlay-header">
                    <div className="game-header-left">
                        <button
                            className="game-back-button"
                            onClick={handleClose}
                        >
                            <span className="svg-home-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.5 9V22.5H9V16.5C9 14.8431 10.3431 13.5 12 13.5C13.6569 13.5 15 14.8431 15 16.5V22.5H22.5V9L12 0L1.5 9Z" fill="rgba(255, 255, 255, 0.7)"></path>
                                </svg>
                            </span>
                            {/*<span className="back-text">Back to Home</span>*/}
                        </button>

                        <div className={`game-balance ${user?.pointsBalance ? 'points-updated' : ''}`}>
                            <div className="game-balance-label">
                                Points
                            </div>
                            <div className="game-balance-amount">
                                {user?.pointsBalance?.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                {GameComponent ? (
                    <GameComponent />
                ) : (
                    <div className="game-not-available">
                        <div className="not-available-icon">🎮</div>
                        <h3 className="comming-soon">Game Coming Soon!</h3>
                        <p>This game is not available yet. Please try another game.</p>
                        <button
                            className="btn-back-to-games"
                            onClick={handleClose}
                        >
                            Back to Games
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};