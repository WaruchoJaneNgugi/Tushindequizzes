import { create } from 'zustand';
import RandomQuizIMG from '../assests/Bible-IMG.png';
import BibleQuiz from '../assests/Bible-IMG.png';
import IMGChess from '../assests/chess.png';
import ChemshaBongo from '../assests/chemsha-bongo-new.png';
import mathQuiz from '../assests/mathquiz.png';
import wordQuest from '../assests/wordquest.png';
import checkers from '../assests/checkers.png';
import Sodoku from '../assests/sodoku.png';
import type {GameCard} from "../types/game.ts";

interface GameState {
    games: GameCard[];
    filteredGames: GameCard[];
    featured: GameCard[];
    activeFilter: string;
    selectedGame: GameCard | null;
    showGameOverlay: boolean;
    searchQuery: string;
    isSearchActive: boolean;
    setActiveFilter: (filter: string) => void;
    setSelectedGame: (game: GameCard | null) => void;
    setShowGameOverlay: (show: boolean) => void;
    filterGames: (filter: string) => void;
    startGame: (gameId: string | number) => void;
    addGamePoints: (points: number) => void;
    searchGames: (query: string) => GameCard[];
    getGamesByCategory: (category: string) => GameCard[];
    setSearchQuery: (query: string) => void;
    setIsSearchActive: (active: boolean) => void;
    startGameFromSlide: (slideId: string) => void;
    getFeaturedGames: () => GameCard[];
}

const DEFAULT_GAMES: GameCard[] = [
    {
        id: "word-quest",
        title: "Word Quest",
        content: "Quick trivia challenge",
        imageUrl: wordQuest,
        category: 'popular',
        tags: ['hot','timed', 'trivia', 'fast-paced',"puzzle"],
        description: "Race against the clock in this fast-paced trivia game. Answer as many questions as you can before time runs out!",
        players: 2800,
        difficulty: 'Medium',
        points: 75,
        duration: '3-5 min',
        isFeatured: false,
    },
    {
        id: "bible-quiz",
        title: "Bible Quiz",
        content: "Test your Bible knowledge",
        imageUrl: BibleQuiz,
        category: 'latest',
        tags: ['featured','bible', 'quiz','trivia', 'religion'],
        description: "A comprehensive Bible trivia game with questions from both Old and New Testaments. Test your knowledge of scriptures, characters, and biblical events.",
        players: 4500,
        difficulty: 'Medium',
        points: 100,
        duration: '5-10 min',
        isFeatured: true,
    },
    {
        id: "math-quiz",
        title: "Math Quiz",
        content: "Solve challenging math Quiz",
        imageUrl: mathQuiz,
        category: 'latest',
        tags: ['featured','puzzle','quiz', 'logic', 'brain-teaser'],
        description: "A brain-teasing Math Quiz game that challenges your logic and problem-solving skills. Each level gets progressively harder!",
        players: 3200,
        difficulty: 'Hard',
        points: 150,
        duration: '10-15 min',
        isFeatured: true,
    },
    {
        id: "checkers",
        title: "checkers",
        content: "Fun arcade challenges",
        imageUrl: checkers,
        category: 'latest',
        tags: ['new','arcade', 'fun'],
        description: "An action-packed arcade game with multiple mini-games. Perfect for quick gaming sessions!",
        players: 5100,
        difficulty: 'Easy',
        points: 50,
        duration: '2-5 min',
        isFeatured: false,
    },

    {
        id: 'sodoku',
        title: "Sudoku",
        content: "Logic and reasoning game",
        imageUrl: Sodoku,
        category: 'puzzle',
        tags: ['new','puzzle', 'brain', 'logic'],
        description: "Exercise your brain with challenging logic puzzles that require creative thinking and pattern recognition.",
        players: 2400,
        difficulty: 'Medium',
        points: 120,
        duration: '8-12 min',
        isFeatured: true,
    },
    {
        id: "chess",
        title: "chess",
        content: "Fun arcade challenges",
        imageUrl: IMGChess,
        category: 'popular',
        tags: ['new','arcade', 'fun'],
        description: "An action-packed arcade game with multiple mini-games. Perfect for quick gaming sessions!",
        players: 1900,
        difficulty: 'Hard',
        points: 200,
        duration: '15-20 min',
        isFeatured: true,
    },
    // {
    //     id: 7,
    //     title: "Trivia Showdown",
    //     content: "Latest questions",
    //     imageUrl: RandomQuiz2IMG,
    //     category: 'latest',
    //     tags: ['latest', 'trivia', 'new'],
    //     description: "Fresh trivia questions added daily! Compete with players worldwide in this constantly updated game.",
    //     players: 3700,
    //     difficulty: 'Easy',
    //     points: 60,
    //     duration: '5-7 min',
    //     isFeatured: false,
    // },
    // {
    //     id: 8,
    //     title: "Speed Quiz",
    //     content: "Timed challenge",
    //     imageUrl: RandomQuizIMG,
    //     category: 'timed',
    //     tags: ['timed', 'speed', 'challenge'],
    //     description: "How fast can you think? Answer trivia questions under extreme time pressure in this adrenaline-packed game.",
    //     players: 2900,
    //     difficulty: 'Hard',
    //     points: 180,
    //     duration: '2-4 min',
    //     isFeatured: false,
    // },
    // {
    //     id: 9,
    //     title: "Fun Zone",
    //     content: "Arcade games collection",
    //     imageUrl: RandomQuiz2IMG,
    //     category: 'arcade',
    //     tags: ['arcade', 'fun', 'entertainment'],
    //     description: "A collection of fun, casual arcade games perfect for relaxing and having a good time.",
    //     players: 4200,
    //     difficulty: 'Easy',
    //     points: 40,
    //     duration: '3-6 min',
    //     isFeatured: false,
    // },
    // {
    //     id: 10,
    //     title: "Popular Quiz",
    //     content: "Trending game",
    //     imageUrl: RandomQuizIMG,
    //     category: 'popular',
    //     tags: ['popular', 'trending', 'top'],
    //     description: "Join thousands of players in our most popular quiz game. Updated weekly with trending topics!",
    //     players: 6800,
    //     difficulty: 'Medium',
    //     points: 90,
    //     duration: '7-10 min',
    //     isFeatured: true,
    // },
    // {
    //     id: 11, // Changed from duplicate id: 10
    //     title: "Memory Master",
    //     content: "Memory challenge game",
    //     imageUrl: RandomQuizIMG,
    //     category: 'puzzle',
    //     tags: ['puzzle', 'memory', 'brain'],
    //     description: "Test your memory skills with increasingly difficult patterns and sequences.",
    //     players: 3100,
    //     difficulty: 'Medium',
    //     points: 110,
    //     duration: '6-9 min',
    //     isFeatured: false,
    // },
    // {
    //     id: 12, // Changed from duplicate id: 10
    //     title: "Word Wizard",
    //     content: "Word puzzle game",
    //     imageUrl: RandomQuiz2IMG,
    //     category: 'puzzle',
    //     tags: ['puzzle', 'word', 'language'],
    //     description: "Challenge your vocabulary and word-finding skills in this exciting word puzzle game.",
    //     players: 3900,
    //     difficulty: 'Medium',
    //     points: 95,
    //     duration: '8-12 min',
    //     isFeatured: false,
    // },
    // {
    //     id: 13, // Changed from duplicate id: 10
    //     title: "Math Mania",
    //     content: "Math challenge game",
    //     imageUrl: RandomQuizIMG,
    //     category: 'puzzle',
    //     tags: ['puzzle', 'math', 'numbers'],
    //     description: "Sharpen your math skills with fun and challenging mathematical puzzles.",
    //     players: 2700,
    //     difficulty: 'Hard',
    //     points: 140,
    //     duration: '10-15 min',
    //     isFeatured: true,
    // },
];

// Add actual featured games with unique images if available
const FEATURED_GAMES: GameCard[] = [
    {
        id: "featured-1",
        title: "DIGO OF PRI",
        content: "Exciting puzzle adventure",
        imageUrl: RandomQuizIMG, // Use existing image or add new one
        category: 'puzzle',
        tags: ['puzzle', 'adventure', 'featured'],
        description: "Embark on an exciting puzzle adventure with DIGO OF PRI",
        players: 5000,
        difficulty: 'Medium',
        points: 120,
        duration: '8-12 min',
        isFeatured: true
    },
    // {
    //     id: "featured-2",
    //     title: "ROCKET GOAL",
    //     content: "Fast-paced action game",
    //     imageUrl: RandomQuiz2IMG, // Use existing image or add new one
    //     category: 'arcade',
    //     tags: ['arcade', 'action', 'featured'],
    //     description: "Fast-paced action game with rocket challenges",
    //     players: 4200,
    //     difficulty: 'Easy',
    //     points: 80,
    //     duration: '5-8 min',
    //     isFeatured: true
    // },
    {
        id: "featured-3",
        title: "EPIC BATTLE",
        content: "Strategic combat game",
        imageUrl: BibleQuiz, // Use existing image or add new one
        category: 'arcade',
        tags: ['arcade', 'strategy', 'featured'],
        description: "Engage in strategic battles and defeat your opponents",
        players: 3500,
        difficulty: 'Hard',
        points: 160,
        duration: '12-18 min',
        isFeatured: true
    },
    {
        id: "featured-4",
        title: "MYSTERY QUEST",
        content: "Adventure mystery game",
        imageUrl: ChemshaBongo, // Use existing image or add new one
        category: 'puzzle',
        tags: ['puzzle', 'mystery', 'featured'],
        description: "Solve mysteries and uncover hidden secrets in this adventure game",
        players: 2900,
        difficulty: 'Medium',
        points: 130,
        duration: '9-14 min',
        isFeatured: true
    },
];

export const useGameStore = create<GameState>((set, get) => ({
    games: DEFAULT_GAMES,
    filteredGames: DEFAULT_GAMES,
    featured: FEATURED_GAMES, // Use the FEATURED_GAMES array
    activeFilter: 'all',
    selectedGame: null,
    showGameOverlay: false,
    searchQuery: '',
    isSearchActive: false,

    setActiveFilter: (filter) => {
        set({ activeFilter: filter, searchQuery: '' });
        get().filterGames(filter);
    },

    startGameFromSlide: (slideId: string) => {
        const { games, setSelectedGame, setShowGameOverlay } = get();
        const game = games.find(g => g.id === slideId);

        if (game) {
            setSelectedGame(game);
            setShowGameOverlay(true);
            console.log(`Starting game from slide: ${game.title}`);
        } else {
            console.warn(`Game with ID ${slideId} not found`);
        }
    },

    setSelectedGame: (game) => set({ selectedGame: game, showGameOverlay: true }),
    setShowGameOverlay: (show) => set({ showGameOverlay: show }),

    filterGames: (filter) => {
        const { games, searchQuery } = get();

        // If there's a search query, filter by both
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            const filtered = games.filter(game =>
                (filter === 'all' || game.category === filter || game.tags?.includes(filter)) &&
                (game.title.toLowerCase().includes(lowerQuery) ||
                    game.description?.toLowerCase().includes(lowerQuery) ||
                    game.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)))
            );
            set({ filteredGames: filtered, activeFilter: filter });
        } else if (filter === 'all') {
            set({ filteredGames: games, activeFilter: filter });
        } else {
            const filtered = games.filter(card =>
                card.category === filter ||
                (card.tags && card.tags.includes(filter))
            );
            set({ filteredGames: filtered, activeFilter: filter });
        }
    },

    setSearchQuery: (query) => {
        set({ searchQuery: query });
        const { activeFilter, games } = get();

        if (query.trim() === '') {
            get().filterGames(activeFilter);
        } else {
            const lowerQuery = query.toLowerCase();
            const filtered = games.filter(game =>
                (activeFilter === 'all' || game.category === activeFilter || game.tags?.includes(activeFilter)) &&
                (game.title.toLowerCase().includes(lowerQuery) ||
                    game.description?.toLowerCase().includes(lowerQuery) ||
                    game.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)))
            );
            set({ filteredGames: filtered });
        }
    },

    setIsSearchActive: (active) => {
        set({ isSearchActive: active });
        if (!active) {
            set({ searchQuery: '' });
            get().filterGames(get().activeFilter);
        }
    },

    startGame: (gameId) => {
        const { games } = get();
        const game = games.find(g => g.id === gameId);
        if (game) {
            console.log(`Starting game: ${game.title}`);
            alert(`Starting ${game.title}!`);
        }
    },

    addGamePoints: (points) => {
        console.log(`Adding ${points} points to user`);
    },

    searchGames: (query) => {
        const { games } = get();
        const lowerQuery = query.toLowerCase();
        return games.filter(game =>
            game.title.toLowerCase().includes(lowerQuery) ||
            game.description?.toLowerCase().includes(lowerQuery) ||
            game.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    },

    getGamesByCategory: (category) => {
        const { games } = get();
        return games.filter(game => game.category === category);
    },

    // Add this getter to get featured games
    getFeaturedGames: () => {
        // Return the FEATURED_GAMES array or filter games with isFeatured: true
        return get().featured; // Using the separate featured array
        // OR: return get().games.filter(game => game.isFeatured);
    },
}));