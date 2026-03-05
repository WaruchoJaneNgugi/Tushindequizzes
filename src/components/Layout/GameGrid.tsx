import { GamesFilter } from "./GamesFilter";
import { useGames } from '../../hooks/useGames';
import "../../styles/game-grid.css";
import "../../styles/shimmer.css";
import type { GameCard } from "../../types/game.ts";
import { useGameClick } from "../../hooks/useGameClick.ts";
import { useState, useEffect } from 'react';

export const GameGrid = () => {
    const {
        filteredGames,
        activeFilter,
        setActiveFilter,
    } = useGames();

    const { handleGameClick } = useGameClick();
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
    const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

    const handleGameCardClick = (game: GameCard) => {
        handleGameClick(game.id, game);
    };

    const hasTag = (game: GameCard, tagName: string): boolean => {
        return game.tags?.includes(tagName) || false;
    };

    // Convert id to string to ensure type safety
    const handleImageLoad = (gameId: string | number) => {
        const id = String(gameId);
        setLoadedImages(prev => ({ ...prev, [id]: true }));
    };

    const handleImageError = (gameId: string | number) => {
        const id = String(gameId);
        setFailedImages(prev => ({ ...prev, [id]: true }));
        setLoadedImages(prev => ({ ...prev, [id]: false }));
    };

    // Check if we should show shimmer
    const shouldShowShimmer = (card: GameCard) => {
        const id = String(card.id);
        return !loadedImages[id] || failedImages[id] || !card.imageUrl;
    };

    // Preload images when component mounts or filteredGames change
    useEffect(() => {
        // Only preload images that haven't been loaded or failed yet
        const newGames = filteredGames.filter(game => {
            const id = String(game.id);
            return game.imageUrl && !loadedImages[id] && !failedImages[id];
        });

        newGames.forEach(game => {
            if (game.imageUrl) {
                const img = new Image();
                img.src = game.imageUrl;
                img.onload = () => handleImageLoad(game.id);
                img.onerror = () => handleImageError(game.id);
            }
        });
    }, [filteredGames]); // Only depend on filteredGames, not loadedImages/failedImages to avoid loops

    return (
        <div className="main-game-grid-container">
            <GamesFilter
                onFilterChange={setActiveFilter}
                activeFilter={activeFilter}
            />

            <div className="games-grid-card">
                {filteredGames.length > 0 ? (
                    filteredGames.map((card) => (
                        <div
                            className="main-game-card"
                            key={card.id}
                            onClick={() => handleGameCardClick(card)}
                        >
                            <div className="game-card-image-container">
                                {hasTag(card, 'hot') && (
                                    <div className="game-tag-hot">
                                        <span className="tag-dot">⬤</span>
                                        <span className="tag-text">HOT</span>
                                    </div>
                                )}

                                {hasTag(card, 'new') && (
                                    <div className="game-tag-new">
                                        <span className="tag-dot">⬤</span>
                                        <span className="tag-text">NEW</span>
                                    </div>
                                )}

                                {/* Show shimmer while loading or if no image */}
                                {shouldShowShimmer(card) && (
                                    <div className="shimmer-wrapper">
                                        <div className="shimmer-effect" />
                                        <div className="shimmer-content">
                                            <div className="shimmer-icon">🎮</div>
                                            <div className="shimmer-title">{card.title}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Actual image - always render but control opacity */}
                                {card.imageUrl && !failedImages[String(card.id)] && (
                                    <img
                                        src={card.imageUrl}
                                        alt={card.title}
                                        className="grid-game-card-image"
                                        style={{
                                            opacity: loadedImages[String(card.id)] ? 1 : 0,
                                            transition: 'opacity 0.4s ease-in-out'
                                        }}
                                        loading="lazy"
                                        onLoad={() => handleImageLoad(card.id)}
                                        onError={() => handleImageError(card.id)}
                                    />
                                )}

                                <div className="game-card-title-overlay">{card.title}</div>
                            </div>

                            <div className="game-card-hover">
                                <div className="play-button">
                                    <svg height="60px" width="60px" viewBox="0 0 512 512"
                                         xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient id="playButtonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#00C9FF" stopOpacity="1"/>
                                                <stop offset="100%" stopColor="#92FE9D" stopOpacity="1"/>
                                            </linearGradient>
                                        </defs>
                                        <circle cx="256" cy="256" r="256" fill="url(#playButtonGradient)"/>
                                        <path d="M208 160L352 256L208 352V160Z" fill="#000000"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results-message">
                        <div className="no-results-icon">🎮</div>
                        <h3>No Games Found</h3>
                        <p>Try adjusting your filters or check back later for new games!</p>
                    </div>
                )}
            </div>
        </div>
    );
};