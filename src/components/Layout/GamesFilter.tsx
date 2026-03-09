import { useState,  } from 'react';
import { useGames } from '../../hooks/useGames';
import "../../styles/newgamesfilter.css";
import HeroSlider from "./HeroSlider.tsx";
import WinnerMarquee from "./WinnerMarquee.tsx";

interface GamesFilterProps {
    onFilterChange?: (filter: string) => void;
    activeFilter?: string;
}

const filterCategories = [
    { id: 'all',     label: 'All Games',    icon: '🎮', color: '#00f5d4' },
    { id: 'latest',  label: 'New',          icon: '✨', color: '#ff3cac' },
    { id: 'timed',   label: 'Timed Trivia', icon: '⏱️', color: '#f5a623' },
    { id: 'popular', label: 'Hot',          icon: '🔥', color: '#ff4757' },
    { id: 'quiz',    label: 'Quizzes',      icon: '🧠', color: '#7b2fff' },
    { id: 'puzzle',  label: 'Puzzle',       icon: '🧩', color: '#26de81' },
    { id: 'arcade',  label: 'Arcade',       icon: '👾', color: '#ff6b6b' },
];

const allDescriptions = [
    { id: 'all',     category: 'All Games',      color: '#00f5d4' },
    { id: 'latest',  category: 'New Releases',   color: '#ff3cac' },
    { id: 'timed',   category: 'Timed Trivia',   color: '#f5a623' },
    { id: 'popular', category: 'Trending Now',   color: '#ff4757' },
    { id: 'quiz',    category: 'Quiz',           color: '#7b2fff' },
    { id: 'puzzle',  category: 'Brain Puzzles',  color: '#26de81' },
    { id: 'arcade',  category: 'Arcade Action',  color: '#ff6b6b' },
];

export const GamesFilter = ({ onFilterChange, activeFilter }: GamesFilterProps) => {
    const { setActiveFilter, activeFilter: storeFilter } = useGames();

    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    const currentFilter = activeFilter || storeFilter;
    const currentCategory = allDescriptions.find(d => d.id === currentFilter) ?? allDescriptions[0];

    const handleFilterClick = (filterId: string) => {
        if (filterId === currentFilter) return;
        if (onFilterChange) {
            onFilterChange(filterId);
        } else {
            setActiveFilter(filterId);
        }
    };

    return (
        <div className="games-filter-wrapper">
            {/* Cyberpunk Grid Background */}
            <div className="filter-backdrop">
                <div className="grid-lines" />
                <div className="scan-lines" />
            </div>

            <div className="games-filter-container">
                {/* Hero Section with Slider + Winner Marquee */}
                <div className="filter-hero-section">
                    <HeroSlider />

                    {/* ── Winner Marquee (replaces old category marquee) ── */}
                    <WinnerMarquee />
                </div>

                {/* Filter Controls */}
                <div className="filter-controls-section">
                    {/* Desktop Categories */}
                    <div className="desktop-categories">
                        <div className="categories-header">
                            <span className="header-label">GAME CATEGORIES</span>
                            <div className="header-line" />
                        </div>
                        <div className="categories-grid">
                            {filterCategories.map((category) => {
                                const isActive  = currentFilter === category.id;
                                const isHovered = hoveredCategory === category.id;

                                return (
                                    <button
                                        key={category.id}
                                        className={`category-card ${isActive ? 'active' : ''} ${isHovered ? 'hover' : ''}`}
                                        onClick={() => handleFilterClick(category.id)}
                                        onMouseEnter={() => setHoveredCategory(category.id)}
                                        onMouseLeave={() => setHoveredCategory(null)}
                                        style={{ '--card-color': category.color } as React.CSSProperties}
                                    >
                                        <div className="card-glow" />
                                        <div className="card-content">
                                            <span className="card-icon">{category.icon}</span>
                                            <span className="card-label">{category.label}</span>
                                            {category.id === 'popular' && (
                                                <span className="card-badge">HOT</span>
                                            )}
                                        </div>
                                        <div className="card-corner tl" />
                                        <div className="card-corner tr" />
                                        <div className="card-corner bl" />
                                        <div className="card-corner br" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile Categories */}
                    <div className="mobile-categories">
                        <div className="mobile-categories-header">
                            <span className="mobile-header-label">BROWSE</span>
                            <div className="mobile-header-glow" />
                        </div>
                        <div className="mobile-categories-scroll">
                            {filterCategories.map((category) => {
                                const isActive = currentFilter === category.id;

                                return (
                                    <button
                                        key={category.id}
                                        className={`mobile-category-chip ${isActive ? 'active' : ''}`}
                                        onClick={() => handleFilterClick(category.id)}
                                        style={{
                                            '--chip-color': category.color,
                                            '--chip-glow': `${category.color}40`,
                                        } as React.CSSProperties}
                                    >
                                        <span className="chip-icon">{category.icon}</span>
                                        <span className="chip-label">{category.label}</span>
                                        {category.id === 'popular' && (
                                            <span className="chip-hot">🔥</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Active Filter Indicator */}
                    <div className="active-filter-indicator">
                        <div
                            className="indicator-pulse"
                            style={{ background: currentCategory.color }}
                        />
                        <span className="indicator-text">
                            Currently viewing:{' '}
                            <strong style={{ color: currentCategory.color }}>
                                {currentCategory.category}
                            </strong>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
