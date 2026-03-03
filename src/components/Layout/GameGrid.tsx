import {GamesFilter} from "./GamesFilter";
import {useGames} from '../../hooks/useGames';
import "../../styles/globals.css";
import type {GameCard} from "../../types/game.ts";
import {useGameClick} from "../../hooks/useGameClick.ts";

export const GameGrid = () => {
    const {
        filteredGames,
        activeFilter,
        // searchQuery,
        setActiveFilter,
        // setSearchQuery,
        // setIsSearchActive,
    } = useGames();

    const {handleGameClick} = useGameClick();

    const handleGameCardClick = (game: GameCard) => {
        // Pass the entire game object instead of just the ID
        handleGameClick(game.id, game);
    };

    const hasTag = (game: GameCard, tagName: string): boolean => {
        return game.tags?.includes(tagName) || false;
    };

    // Get recent games (you can modify this logic based on your data)

    return (
        <>
            <GamesFilter
                onFilterChange={setActiveFilter}
                activeFilter={activeFilter}
            />

            <div className="game-category-title">
                <div className="game-subtitle">
                    <span className="game-tags">Top Picks</span>
                    {/*<button className="continue-btn">Continue Playing</button>*/}
                </div>
            </div>



                    <div className="games-grid-card">
                        {filteredGames.length > 0 && (
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

                                        {card.imageUrl ? (
                                            <img
                                                src={card.imageUrl}
                                                alt={card.title}
                                                className="game-card-image"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    const container = e.currentTarget.parentElement;
                                                    if (container) {
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
                                        ) : (
                                            <div className="game-image-fallback">
                                                <div className="fallback-icon">🎮</div>
                                                <div className="fallback-title">{card.title}</div>
                                            </div>
                                        )}
                                        <div className="game-card-title-overlay">{card.title}</div>
                                    </div>

                                    <div className="game-card-hover">
                                        <div className="play-button">
                                            <svg height="60px" width="60px" viewBox="0 0 512 512"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <defs>
                                                    <linearGradient id="playButtonGradient" x1="0%" y1="0%" x2="100%"
                                                                    y2="0%">
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
                        )
                        }
                    </div>
        </>
    );
};