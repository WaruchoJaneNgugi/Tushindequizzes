// components/Layout/GameGrid.tsx
import { GamesFilter } from "./GamesFilter";
import { useGames } from '../../hooks/useGames';
import "../../styles/globals.css";
import type { GameCard } from "../../types/game.ts";
import { useGameClick } from "../../hooks/useGameClick.ts";

export const GameGrid = () => {
    const {
        filteredGames,
        activeFilter,
        searchQuery,
        setActiveFilter,
        setSearchQuery,
        setIsSearchActive,
    } = useGames();

    const { handleGameClick } = useGameClick();

    const handleGameCardClick = (game: GameCard) => {
        handleGameClick(game.id);
    };

    // const filterCategories = [
    //     { id: 'all', label: 'All ' },
    //     { id: 'latest', label: 'Latest' },
    //     { id: 'timed', label: 'Timed Trivia' },
    //     { id: 'popular', label: 'Popular' },
    //     { id: 'bible', label: 'Bible Quiz' },
    //     { id: 'puzzle', label: 'Puzzle' },
    //     { id: 'arcade', label: 'Arcade' },
    // ];

    // const currentFilter = activeFilter;

    // const getCategoryTitle = () => {
    //     if (searchQuery) {
    //         return `Search Results: "${searchQuery}"`;
    //     }
    //
    //     const category = filterCategories.find(cat => cat.id === currentFilter);
    //     return category ? `${category.label}` : 'All Games';
    // };

    // Helper function to check if a game has a specific tag
    const hasTag = (game: GameCard, tagName: string): boolean => {
        return game.tags?.includes(tagName) || false;
    };

    return (
        <>
            <GamesFilter
                onFilterChange={setActiveFilter}
                activeFilter={activeFilter}
            />

                <div className="games-grid">
                    {filteredGames.length > 0 ? (
                        filteredGames.map((card) => (
                            <div
                                className="game-card"
                                key={card.id}
                                onClick={() => handleGameCardClick(card)}
                            >
                                <div className="game-card-image-container">
                                    {/* Check if tags array includes 'hot' */}
                                    {hasTag(card, 'hot') && (
                                        <div className="game-tag-hot">
                                            <span className="tag-dot">⬤</span>
                                            <span className="tag-text">HOT</span>
                                        </div>
                                    )}

                                    {/* Check if tags array includes 'new' */}
                                    {hasTag(card, 'new') && (
                                        <div className="game-tag-new">
                                            <span className="tag-dot">⬤</span>
                                            <span className="tag-text">NEW</span>
                                        </div>
                                    )}

                                    {card.imageUrl && (
                                        <img
                                            src={card.imageUrl}
                                            alt={card.title}
                                            className="game-card-image"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                const container = e.currentTarget.parentElement;
                                                if (container) {
                                                    // Preserve tags when showing fallback
                                                    const hotTag = container.querySelector('.game-tag-hot')?.outerHTML || '';
                                                    const newTag = container.querySelector('.game-tag-new')?.outerHTML || '';
                                                    container.innerHTML = `
                                                        <div class="game-image-fallback">
                                                            <div class="fallback-icon">🎮</div>
                                                            <div class="fallback-title">${card.title}</div>
                                                        </div>
                                                        ${hotTag}${newTag}
                                                    `;
                                                }
                                            }}
                                        />
                                    )}
                                    <div className="game-card-title-overlay">{card.title}</div>
                                </div>

                                <div className="game-card-hover">
                                    <div className="play-button">
                                        <svg height="200px" width="200px" viewBox="0 0 512 512"
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
                            <div className="no-results-icon">🔍</div>
                            <h3>No games found</h3>
                            <p>
                                {searchQuery
                                    ? `No games found matching "${searchQuery}"`
                                    : "No games available in this category"}
                            </p>
                            {searchQuery && (
                                <button
                                    className="btn-clear-search"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setIsSearchActive(false);
                                    }}
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    )}
                </div>
            {/*</div>*/}
        </>
    );
};