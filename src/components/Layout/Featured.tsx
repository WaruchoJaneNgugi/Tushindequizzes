// components/Layout/FeaturedGames.tsx - Professional version
import { useRef, useState, useEffect, useCallback } from "react";
import "../../styles/featuredgames.css";
import { useGameStore } from "../../Store/gameStore.ts";
import type { GameCard } from "../../types/game.ts";

interface FeaturedGamesProps {
    onGameClick: (gameId: string | number) => void;
}

export const FeaturedGames = ({ onGameClick }: FeaturedGamesProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showPrevArrow, setShowPrevArrow] = useState(false);
    const [showNextArrow, setShowNextArrow] = useState(true);

    // Get featured games from the store
    const featuredGames = useGameStore((state) => state.featured);
    const allGames = useGameStore((state) => state.games);
    const featuredGamesFromFlag = allGames.filter(game => game.isFeatured);

    const featuredGamesToDisplay = featuredGames.length > 0
        ? featuredGames
        : featuredGamesFromFlag;

    // Update arrow visibility based on scroll position
    const updateArrowVisibility = useCallback(() => {
        if (!scrollContainerRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

        setShowPrevArrow(scrollLeft > 10);
        setShowNextArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }, []);

    // Initialize and update on resize
    useEffect(() => {
        updateArrowVisibility();
        window.addEventListener('resize', updateArrowVisibility);
        return () => window.removeEventListener('resize', updateArrowVisibility);
    }, [updateArrowVisibility]);

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: -320,
                behavior: 'smooth'
            });
            setTimeout(updateArrowVisibility, 300);
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({
                left: 320,
                behavior: 'smooth'
            });
            setTimeout(updateArrowVisibility, 300);
        }
    };

    // Handle scroll events
    const handleScroll = () => {
        updateArrowVisibility();
    };

    return (
        <div className="featured-games-section">
            <div className="featured-header">
                <h2 className="featured-title">
                    <span className="featured-icon">🔥</span>
                    Featured games
                </h2>
                <div className="featured-subtitle">
                    Discover our most popular and exciting games
                </div>
            </div>

            {featuredGamesToDisplay.length > 0 ? (
                <div className="featured-games-container">
                    {showPrevArrow && (
                        <button
                            className={`featured-nav-arrow featured-nav-prev ${!showPrevArrow ? 'disabled' : ''}`}
                            onClick={scrollLeft}
                            aria-label="Scroll left"
                            disabled={!showPrevArrow}
                        >
                            ‹
                        </button>
                    )}

                    <div
                        className="featured-games-scroll-wrapper"
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                    >
                        {featuredGamesToDisplay.map((game: GameCard) => (
                            <div
                                key={game.id}
                                className="featured-game-card"
                                onClick={() => onGameClick(game.id)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        onGameClick(game.id);
                                    }
                                }}
                            >
                                <div className="featured-game-image-container">
                                    {game.imageUrl ? (
                                        <img
                                            src={game.imageUrl}
                                            alt={game.title}
                                            className="featured-game-image"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                const container = e.currentTarget.parentElement;
                                                if (container) {
                                                    container.innerHTML = `
                                                        <div class="featured-game-fallback">
                                                            <div class="featured-fallback-icon">🎮</div>
                                                            <div class="featured-fallback-title">${game.title}</div>
                                                        </div>
                                                    `;
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div className="featured-game-fallback">
                                            <div className="featured-fallback-icon">🎮</div>
                                            <div className="featured-fallback-title">{game.title}</div>
                                        </div>
                                    )}
                                    <div className="featured-game-overlay">
                                        <div className="featured-play-button">
                                            <svg height="50px" width="50px" viewBox="0 0 512 512"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <defs>
                                                    <linearGradient id="featuredPlayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                        <stop offset="0%" stopColor="#00C9FF" stopOpacity="1"/>
                                                        <stop offset="100%" stopColor="#92FE9D" stopOpacity="1"/>
                                                    </linearGradient>
                                                </defs>
                                                <circle cx="256" cy="256" r="256" fill="url(#featuredPlayGradient)"/>
                                                <path d="M208 160L352 256L208 352V160Z" fill="#000000"/>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="featured-game-content">
                                    <h3 className="featured-game-title">{game.title}</h3>
                                    <p className="featured-game-description">
                                        {game.description || game.content || "An exciting game experience"}
                                    </p>
                                    <div className="featured-game-meta">
                                        {game.difficulty && (
                                            <span className="featured-meta-item">
                                                <span className="featured-meta-icon">⚡</span>
                                                {game.difficulty}
                                            </span>
                                        )}
                                        {game.players && (
                                            <span className="featured-meta-item">
                                                <span className="featured-meta-icon">👥</span>
                                                {game.players > 1000
                                                    ? `${(game.players / 1000).toFixed(1)}k`
                                                    : game.players} players
                                            </span>
                                        )}
                                        {game.points && (
                                            <span className="featured-meta-item">
                                                <span className="featured-meta-icon">💰</span>
                                                {game.points} pts
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {showNextArrow && (
                        <button
                            className={`featured-nav-arrow featured-nav-next ${!showNextArrow ? 'disabled' : ''}`}
                            onClick={scrollRight}
                            aria-label="Scroll right"
                            disabled={!showNextArrow}
                        >
                            ›
                        </button>
                    )}
                </div>
            ) : (
                <div className="featured-no-games">
                    <div className="no-featured-icon">🎮</div>
                    <h3>No Featured Games Available</h3>
                    <p>Check back soon for exciting featured games!</p>
                </div>
            )}
        </div>
    );
};