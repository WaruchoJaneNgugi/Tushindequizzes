// components/Layout/GamesFilter.tsx
import React, {useState} from 'react';
import {useGames} from '../../hooks/useGames';
import "../../styles/newgamesfilter.css";
import "../../styles/marque.css";
import HeroSlider from "./HeroSlider.tsx";

interface GamesFilterProps {
    onFilterChange?: (filter: string) => void;
    activeFilter?: string;
}

const allDescriptions = [
    {
        id: 'all',
        category: 'All',
        text: 'Explore our complete collection of games and quizzes',
        icon: '🎮'
    },
    {
        id: 'latest',
        category: 'Latest',
        text: 'Discover our newest and most recent game additions',
        icon: '✨'
    },
    {
        id: 'timed',
        category: 'Timed',
        text: 'Test your speed and accuracy with time-based challenges',
        icon: '⏱️'
    },
    {
        id: 'popular',
        category: 'Popular',
        text: 'Play the most loved and frequently played games',
        icon: '🔥'
    },
    {
        id: 'bible',
        category: 'Bible',
        text: 'Test your biblical knowledge with scripture-based quizzes',
        icon: '📖'
    },
    {
        id: 'puzzle',
        category: 'Puzzle',
        text: 'Solve brain-teasing puzzles and logic games',
        icon: '🧩'
    },
    {
        id: 'arcade',
        category: 'Arcade',
        text: 'Enjoy fast-paced action and arcade-style gameplay',
        icon: '👾'
    }
];

export const GamesFilter = ({onFilterChange, activeFilter}: GamesFilterProps) => {
    const {
        setActiveFilter,
        activeFilter: storeFilter,
        searchQuery,
        setSearchQuery,
        isSearchActive,
        setIsSearchActive
    } = useGames();
    const [localSearchQuery, setLocalSearchQuery] = useState('');

    const currentFilter = activeFilter || storeFilter;
    const marqueeSpeed = 'slow';

    // Get all descriptions for marquee (duplicate for seamless loop)
    const getMarqueeDescriptions = () => {
        const descriptions = [...allDescriptions, ...allDescriptions];
        return descriptions.map((desc, index) => ({
            ...desc,
            key: `${desc.id}-${index}`,
            isCurrent: desc.id === currentFilter
        }));
    };

    const filterCategories = [
        {id: 'all', label: 'All Games', icon: '🎮'},
        {id: 'latest', label: 'New', icon: '✨'},
        {id: 'timed', label: 'Timed Trivia', icon: '⏱️'},
        {id: 'popular', label: 'Hot', icon: '🔥'},
        {id: 'bible', label: 'Bible Quiz', icon: '📖'},
        {id: 'puzzle', label: 'Puzzle', icon: '🧩'},
        {id: 'arcade', label: 'Arcade', icon: '👾'},
    ];

    // Function to get current category description
    // const getCurrentDescription = () => {
    //     if (searchQuery) {
    //         return `Showing games matching "${searchQuery}"`;
    //     }
    //     const desc = allDescriptions.find(d => d.id === currentFilter);
    //     return desc ? desc.text : 'Challenge yourself with our curated collection';
    // };

    // Get current category icon
    const getCurrentIcon = () => {
        const category = filterCategories.find(c => c.id === currentFilter);
        return category ? category.icon : '🎮';
    };

    const handleFilterClick = (filterId: string) => {
        if (onFilterChange) {
            onFilterChange(filterId);
        } else {
            setActiveFilter(filterId);
        }
        setIsSearchActive(false);
    };

    const handleSearchClick = () => {
        setIsSearchActive(!isSearchActive);
        if (!isSearchActive) {
            setTimeout(() => {
                document.getElementById('game-search-input')?.focus();
            }, 100);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalSearchQuery(value);
        setSearchQuery(value);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(localSearchQuery);
    };

    const handleClearSearch = () => {
        setLocalSearchQuery('');
        setSearchQuery('');
        setIsSearchActive(false);
    };

    return (
        <div className="games-filter-container">
            <div className="filter-header">
                <HeroSlider/>

                <div className="hero-container">
                    <div className="descriptions-marquee-container">
                        <div className={`descriptions-marquee-track descriptions-marquee-${marqueeSpeed}`}>
                            {getMarqueeDescriptions().map((desc) => (
                                <div
                                    key={desc.key}
                                    className={`descriptions-marquee-item ${desc.isCurrent ? 'current' : ''}`}
                                    onClick={() => handleFilterClick(desc.id)}
                                    style={{cursor: 'pointer'}}
                                >
                                    <span className="description-icon">{desc.icon}</span>
                                    <span className="description-text">{desc.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="filter-controls">
                {/* Desktop Categories with Icons */}
                <div className="desktop-categories">
                    <div className="filter-categories">
                        {filterCategories.map((category) => (
                            <button
                                key={category.id}
                                className={`filter-category ${currentFilter === category.id ? 'active' : ''}`}
                                onClick={() => handleFilterClick(category.id)}
                            >
                                <span className="category-icon">{category.icon}</span>
                                <span className="category-label">{category.label}</span>
                                {/*{currentFilter === category.id && (*/}
                                {/*    <span className="active-indicator-filter">●</span>*/}
                                {/*)}*/}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mobile-filter-section">
                    {/* Active Category Display */}
                    <div className="mobile-active-category" onClick={handleSearchClick}>
                        {!isSearchActive && (
                            <div className="active-category-content" onClick={handleSearchClick}>
                                <span className="active-category-icon">{getCurrentIcon()}</span>
                                <div className="active-category-info">
                                    <h1 className="active-category-label">
                                        {filterCategories.find(cat => cat.id === currentFilter)?.label || 'All Games'}
                                    </h1>
                                    <p className="active-category-badge">
                                        {isSearchActive ? 'Searching for games...' : 'Tap to search'}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className={`mobile-search-container ${isSearchActive ? 'active' : ''}`}>
                            <form onSubmit={handleSearchSubmit} className="mobile-search-form">
                                <input
                                    id="game-search-input"
                                    type="text"
                                    className="mobile-search-input"
                                    placeholder="Search by game name "
                                    value={localSearchQuery}
                                    onChange={handleSearchChange}
                                />
                                {localSearchQuery && (
                                    <div
                                        className="mobile-search-clear"
                                        onClick={handleClearSearch}
                                        aria-label="Clear search"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                                             stroke="currentColor" strokeWidth="2">
                                            <path d="M18 6L6 18M6 6L18 18" strokeLinecap="round"
                                                  strokeLinejoin="round"/>
                                        </svg>
                                    </div>
                                )}
                            </form>
                        </div>

                        <div className="active-category-actions">
                            <div
                                className="mobile-search-trigger"
                                aria-label="Toggle search"
                            >
                                {isSearchActive ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                         strokeWidth="2">
                                        <path d="M18 6L6 18M6 6L18 18" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                         strokeWidth="2">
                                        <path
                                            d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                                            strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Categories Pills with Icons */}
                    <div className="mobile-categories-pills">
                        <div className="categories-pills-container">
                            {filterCategories.map((category) => (
                                <button
                                    key={category.id}
                                    className={`category-pill ${currentFilter === category.id ? 'active' : ''}`}
                                    onClick={() => handleFilterClick(category.id)}
                                >
                                    <span className="pill-icon">{category.icon}</span>
                                    <span className="pill-label">{category.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Desktop Search */}
                <div className="desktop-search">
                    <div className="search-container">
                        <form onSubmit={handleSearchSubmit} className="search-bar-form desktop">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 strokeWidth="2" className="search-bar-icon">
                                <path
                                    d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                                    strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <input
                                type="text"
                                className="search-bar-input desktop"
                                placeholder="Search games..."
                                value={localSearchQuery}
                                onChange={handleSearchChange}
                            />
                            {localSearchQuery && (
                                <button
                                    type="button"
                                    className="search-clear-button"
                                    onClick={handleClearSearch}
                                    aria-label="Clear search"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" strokeWidth="2">
                                        <path d="M18 6L6 18M6 6L18 18" strokeLinecap="round"
                                              strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            {/* Show search results indicator */}
            {searchQuery && (
                <div className="search-results-indicator">
                    <div className="search-results-header">
                        <span className="search-query-text">Search results for: "{searchQuery}"</span>
                        <button
                            className="clear-search-link"
                            onClick={handleClearSearch}
                        >
                            Clear search
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};