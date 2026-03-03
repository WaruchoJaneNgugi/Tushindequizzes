import {useGames} from '../../hooks/useGames';
import "../../styles/newgamesfilter.css";
import "../../styles/marque.css";
import HeroSlider from "./HeroSlider.tsx";
// import {ContinuePlaying} from "./ContinuePlaying.tsx";

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
        // filteredGames,

        setActiveFilter,
        activeFilter: storeFilter,
    } = useGames();

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

    // Get current category icon
    // const getCurrentIcon = () => {
    //     const category = filterCategories.find(c => c.id === currentFilter);
    //     return category ? category.icon : '🎮';
    // };

    const handleFilterClick = (filterId: string) => {
        if (onFilterChange) {
            onFilterChange(filterId);
        } else {
            setActiveFilter(filterId);
        }
    };
    // const recentGames = filteredGames.slice(0, 8);


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
            {/*<ContinuePlaying recentGames={recentGames}/>*/}

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
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mobile Filter Section */}
                <div className="mobile-filter-section">
                    {/* Active Category Display */}


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
            </div>
        </div>
    );
};