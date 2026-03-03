import React, { useState, useEffect } from 'react';
import "../../styles/continue-playing.css";
import type { GameCard } from "../../types/game.ts";
import { useGameClick } from "../../hooks/useGameClick.ts";

interface ContinuePlayingProps {
    recentGames: GameCard[];
}

export const ContinuePlaying: React.FC<ContinuePlayingProps> = ({ recentGames }) => {
    const { handleGameClick } = useGameClick();
    const [openedGames, setOpenedGames] = useState<GameCard[]>([]);

    // Load opened games from session storage on component mount
    useEffect(() => {
        const savedOpenedGames = sessionStorage.getItem('openedGames');
        if (savedOpenedGames) {
            try {
                const parsedGames = JSON.parse(savedOpenedGames);
                setOpenedGames(parsedGames);
            } catch (error) {
                console.error('Failed to parse opened games:', error);
            }
        }
    }, []);

    // Filter recentGames to only include games that have been opened
    const getContinuePlayingGames = () => {
        if (openedGames.length === 0) return [];

        // Match opened games with full game data from recentGames
        return openedGames
            .map(openedGame => {
                return recentGames.find(game => game.id === openedGame.id);
            })
            .filter((game): game is GameCard => game !== undefined)
            .slice(0, 10); // Limit to 10 games for performance
    };

    const continuePlayingGames = getContinuePlayingGames();

    // Don't render if no games have been opened
    if (continuePlayingGames.length === 0) {
        return null;
    }

    const handleGameCardClick = (game: GameCard) => {
        handleGameClick(game.id);
    };

    const hasTag = (game: GameCard, tagName: string): boolean => {
        return game.tags?.includes(tagName) || false;
    };

    return (
        <div className="continue-playing-section">

            {/* Subtitle with tags and continue button */}
            <div className="game-subtitle">
                <span className="game-tags">Continue Playing</span>
                {/*<button className="continue-btn">Continue Playing</button>*/}
            </div>

            {/* Horizontal scrollable game cards - only showing opened games */}
            <div className="recent-games-scroll">
                <div className="recent-games-track">
                    {continuePlayingGames.map((game) => (
                        <div
                            key={game.id}
                            className="recent-game-card"
                            onClick={() => handleGameCardClick(game)}
                        >
                            <div className="recent-game-image-container">
                                {hasTag(game, 'hot') && (
                                    <div className="game-tag-hot small">
                                        <span className="tag-dot">⬤</span>
                                        <span className="tag-text">HOT</span>
                                    </div>
                                )}
                                {hasTag(game, 'new') && (
                                    <div className="game-tag-new small">
                                        <span className="tag-dot">⬤</span>
                                        <span className="tag-text">NEW</span>
                                    </div>
                                )}

                                {game.imageUrl ? (
                                    <img
                                        src={game.imageUrl}
                                        alt={game.title}
                                        className="recent-game-image"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            const container = e.currentTarget.parentElement;
                                            if (container) {
                                                container.innerHTML += `
                                                    <div class="recent-game-fallback">
                                                        <div class="fallback-icon">🎮</div>
                                                    </div>
                                                `;
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="recent-game-fallback">
                                        <div className="fallback-icon">🎮</div>
                                    </div>
                                )}
                            </div>
                            <div className="recent-game-info">
                                <h3 className="recent-game-title">{game.title}</h3>
                                {/*<p className="recent-game-category">{game.category}</p>*/}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};