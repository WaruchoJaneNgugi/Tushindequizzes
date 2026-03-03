// components/SearchOverlay.tsx
import {type FC, useEffect, useRef} from "react";

import "../../styles/search-overlay.css";
import {useGames} from "../../hooks/useGames.ts";
import {useGameClick} from "../../hooks/useGameClick.ts";
import type {GameCard} from "../../types/game.ts";

interface SearchOverlayProps {
    searchQuery: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClose: () => void;
    onClear: () => void;
}

export const SearchOverlay: FC<SearchOverlayProps> = ({
                                                          searchQuery,
                                                          onSearchChange,
                                                          onClose,
                                                          onClear
                                                      }) => {
    const { filteredGames } = useGames();
    const { handleGameClick } = useGameClick();
    const overlayRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when overlay opens
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleGameCardClick = (game: GameCard) => {
        handleGameClick(game.id);
        onClose();
    };

    const hasTag = (game: GameCard, tagName: string): boolean => {
        return game.tags?.includes(tagName) || false;
    };

    return (
        <div className="search-overlay">
            <div className="search-overlay-backdrop" onClick={onClose} />
            <div className="search-overlay-container" ref={overlayRef}>
                {/* Search Header */}
                <div className="search-overlay-header">
                    <div className="search-overlay-input-wrapper">
                        <svg className="search-overlay-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input
                            ref={inputRef}
                            type="text"
                            className="search-overlay-input"
                            placeholder="Search games..."
                            value={searchQuery}
                            onChange={onSearchChange}
                        />
                        {searchQuery && (
                            <button
                                className="search-overlay-clear"
                                onClick={onClear}
                                aria-label="Clear search"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6L18 18" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        )}
                        <button className="search-overlay-close" onClick={onClose}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 18L18 6M6 6L18 18" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Search Results */}
                <div className="search-overlay-content">
                    <div className="search-results-header">
                        <h2 className="search-results-title">
                            {searchQuery ? `Results for "${searchQuery}"` : 'Search Games'}
                        </h2>
                        <span className="search-results-count">
                            {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'} found
                        </span>
                    </div>

                    {filteredGames.length > 0 ? (
                        <div className="search-results-grid">
                            {filteredGames.map((game) => (
                                <div
                                    key={game.id}
                                    className="search-result-card"
                                    onClick={() => handleGameCardClick(game)}
                                >
                                    <div className="search-result-image-container">
                                        {hasTag(game, 'hot') && (
                                            <div className="game-tag-hot">
                                                <span className="tag-dot">⬤</span>
                                                <span className="tag-text">HOT</span>
                                            </div>
                                        )}
                                        {hasTag(game, 'new') && (
                                            <div className="game-tag-new">
                                                <span className="tag-dot">⬤</span>
                                                <span className="tag-text">NEW</span>
                                            </div>
                                        )}
                                        {game.imageUrl ? (
                                            <img
                                                src={game.imageUrl}
                                                alt={game.title}
                                                className="search-result-image"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    const container = e.currentTarget.parentElement;
                                                    if (container) {
                                                        container.innerHTML = `
                                                            <div class="search-result-fallback">
                                                                <div class="fallback-icon">🎮</div>
                                                            </div>
                                                        `;
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div className="search-result-fallback">
                                                <div className="fallback-icon">🎮</div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="search-result-info">
                                        <h3 className="search-result-title">{game.title}</h3>
                                        <p className="search-result-description">{game.description}</p>
                                        <div className="search-result-meta">
                                            <span className="search-result-category">{game.category}</span>
                                            <span className="search-result-difficulty">{game.difficulty}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="search-no-results">
                            <div className="no-results-icon">🔍</div>
                            <h3>No games found</h3>
                            <p>Try adjusting your search terms or browse categories</p>
                            <button className="btn-browse-categories" onClick={onClose}>
                                Browse Categories
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};