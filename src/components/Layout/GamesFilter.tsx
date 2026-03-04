import { useState, useEffect, useRef } from 'react';
import { useGames } from '../../hooks/useGames';
import "../../styles/newgamesfilter.css";
import "../../styles/marque.css";
import HeroSlider from "./HeroSlider.tsx";

interface GamesFilterProps {
    onFilterChange?: (filter: string) => void;
    activeFilter?: string;
}

interface Description {
    id: string;
    category: string;
    text: string;
    icon: string;
    color: string;
    glowColor: string;
}

const allDescriptions: Description[] = [
    {
        id: 'all',
        category: 'All Games',
        text: 'Explore our complete collection of games and quizzes',
        icon: '🎮',
        color: '#00f5d4',
        glowColor: 'rgba(0,245,212,0.5)'
    },
    {
        id: 'latest',
        category: 'New Releases',
        text: 'Discover our newest and most recent game additions',
        icon: '✨',
        color: '#ff3cac',
        glowColor: 'rgba(255,60,172,0.5)'
    },
    {
        id: 'timed',
        category: 'Timed Trivia',
        text: 'Test your speed and accuracy with time-based challenges',
        icon: '⏱️',
        color: '#f5a623',
        glowColor: 'rgba(245,166,35,0.5)'
    },
    {
        id: 'popular',
        category: 'Trending Now',
        text: 'Play the most loved and frequently played games',
        icon: '🔥',
        color: '#ff4757',
        glowColor: 'rgba(255,71,87,0.5)'
    },
    {
        id: 'bible',
        category: 'Bible Quiz',
        text: 'Test your biblical knowledge with scripture-based quizzes',
        icon: '📖',
        color: '#7b2fff',
        glowColor: 'rgba(123,47,255,0.5)'
    },
    {
        id: 'puzzle',
        category: 'Brain Puzzles',
        text: 'Solve brain-teasing puzzles and logic games',
        icon: '🧩',
        color: '#26de81',
        glowColor: 'rgba(38,222,129,0.5)'
    },
    {
        id: 'arcade',
        category: 'Arcade Action',
        text: 'Enjoy fast-paced action and arcade-style gameplay',
        icon: '👾',
        color: '#ff6b6b',
        glowColor: 'rgba(255,107,107,0.5)'
    }
];

export const GamesFilter = ({ onFilterChange, activeFilter }: GamesFilterProps) => {
    const {
        setActiveFilter,
        activeFilter: storeFilter,
    } = useGames();

    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
    const [glitchEffect, setGlitchEffect] = useState(false);
    const marqueeRef = useRef<HTMLDivElement>(null);

    const currentFilter = activeFilter || storeFilter;
    const marqueeSpeed = 'slow';

    // Trigger glitch on filter change
    useEffect(() => {
        // setGlitchEffect(true);
        const timer = setTimeout(() => setGlitchEffect(false), 300);
        return () => clearTimeout(timer);
    }, [currentFilter]);

    // Get current category details
    const currentCategory = allDescriptions.find(d => d.id === currentFilter) || allDescriptions[0];

    // Get all descriptions for marquee with enhanced styling
    const getMarqueeDescriptions = () => {
        // Triple the array for smoother infinite scroll
        const descriptions = [...allDescriptions, ...allDescriptions, ...allDescriptions];
        return descriptions.map((desc, index) => ({
            ...desc,
            key: `${desc.id}-${index}`,
            isCurrent: desc.id === currentFilter
        }));
    };

    const filterCategories = [
        { id: 'all', label: 'All Games', icon: '🎮', color: '#00f5d4' },
        { id: 'latest', label: 'New', icon: '✨', color: '#ff3cac' },
        { id: 'timed', label: 'Timed Trivia', icon: '⏱️', color: '#f5a623' },
        { id: 'popular', label: 'Hot', icon: '🔥', color: '#ff4757' },
        { id: 'bible', label: 'Bible Quiz', icon: '📖', color: '#7b2fff' },
        { id: 'puzzle', label: 'Puzzle', icon: '🧩', color: '#26de81' },
        { id: 'arcade', label: 'Arcade', icon: '👾', color: '#ff6b6b' },
    ];

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
                {/* Hero Section with Slider */}
                <div className="filter-hero-section">
                    <HeroSlider />

                    {/* Animated Category Marquee */}
                    <div
                        ref={marqueeRef}
                        className={`category-marquee ${glitchEffect ? 'marquee-glitch' : ''}`}
                        style={{ '--accent-color': currentCategory.color } as React.CSSProperties}
                    >
                        <div className="marquee-gradient-left" />
                        <div className={`marquee-track marquee-${marqueeSpeed}`}>
                            {getMarqueeDescriptions().map((desc) => (
                                <div
                                    key={desc.key}
                                    className={`marquee-item ${desc.isCurrent ? 'current' : ''}`}
                                    onClick={() => handleFilterClick(desc.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <span className="marquee-icon" style={{ color: desc.color }}>
                                        {desc.icon}
                                    </span>
                                    <span className="marquee-text">{desc.text}</span>
                                    <span className="marquee-category" style={{
                                        background: `linear-gradient(135deg, ${desc.color}20, ${desc.color}40)`,
                                        borderColor: `${desc.color}40`
                                    }}>
                                        {desc.category}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="marquee-gradient-right" />
                    </div>
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
                                const isActive = currentFilter === category.id;
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
                                            '--chip-glow': `${category.color}40`
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
                        <div className="indicator-pulse" style={{ background: currentCategory.color }} />
                        <span className="indicator-text">
                            Currently viewing: <strong style={{ color: currentCategory.color }}>{currentCategory.category}</strong>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};