import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Difficulty} from '../types';
import type {
    Category,
    GameState,
    Position,
    PlacedWord
} from '../types';
import {
    DIFFICULTY_SETTINGS,
    CATEGORIES
} from '../constants';
import {generateGrid} from '../utils/gridGenerator';
import {fetchWordList} from '../services/geminiService';
import {soundService} from '../services/soundService';
import GameCanvas from './GameCanvas';
import CategorySelection from './CategorySelection';
import DifficultySelection from './DifficultySelection';
import GameHeader from './GameHeader';
import QuestTracker from './QuestTracker';
import "../styles.css"

const GAMES_PER_DIFFICULTY = 3;
const DIFFICULTY_ORDER = [Difficulty.BEGINNER, Difficulty.INTERMEDIATE, Difficulty.ADVANCED, Difficulty.EXPERT];
const MISSION_SUCCESS_BONUS = 500;
const GAME_START_COST = 1;

const createParticles = (count: number) => {
    const colors = ['#38bdf8', '#10b981', '#f59e0b', '#ef4444', '#818cf8', '#a78bfa'];
    return Array.from({length: count}).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
        size: 5 + Math.random() * 10,
    }));
};

export const Confetti: React.FC<{ intensity?: 'normal' | 'high' }> = ({intensity = 'normal'}) => {
    const count = intensity === 'high' ? 200 : 100;
    const [particles] = useState(() => createParticles(count));

    return (
        <div className="confetti-container">
            {particles.map(p => (
                <div
                    key={p.id}
                    className="particle"
                    style={{
                        left: `${p.left}%`,
                        backgroundColor: p.color,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                        width: `${p.size}px`,
                        height: `${p.size}px`,
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
};

interface QuestOverlayProps {
    questNum: number;
    score: number;
    questScore: number;
    onProceed: () => void;
}

export const QuestOverlay: React.FC<QuestOverlayProps> = ({questNum, score, questScore, onProceed}) => {
    return (
        <div className="overlay splash-overlay" onClick={onProceed}>
            <div className="result-card quest-clear-card" onClick={(e) => e.stopPropagation()}>
                <div className="quest-badge">QUEST {questNum} COMPLETE</div>
                <h2 className="victory-text-glitch">OBJECTIVE<br/>CLEARED</h2>

                <div className="score-detail-group">
                    <div className="score-row-item">
                        <span className="label">QUEST SCORE</span>
                        <span className="val success-text">+{questScore}</span>
                    </div>
                    <div className="score-row-item total-focus">
                        <span className="label">PROJECTED TOTAL</span>
                        <span className="val">{score}</span>
                    </div>
                </div>

                <button className="primary-btn hero-btn" onClick={onProceed}>
                    NEXT MISSION <i className="fa-solid fa-arrow-right"></i>
                </button>
            </div>
        </div>
    );
};

interface PrefetchedGame {
    key: string;
    grid: string[][];
    placedWords: PlacedWord[];
    rows: number;
    cols: number;
}

const WordQuest: React.FC = () => {
    const [unlockedDifficulties, setUnlockedDifficulties] = useState<Difficulty[]>(() => {
        const saved = localStorage.getItem('word-quest-unlocked');
        return saved ? JSON.parse(saved) : [Difficulty.BEGINNER];
    });

    const [totalPoints, setTotalPoints] = useState<number>(() => {
        const savedPoints = localStorage.getItem('word-quest-total-points');
        return savedPoints ? parseInt(savedPoints, 10) : 10;
    });

    const savedDiff = localStorage.getItem('word-quest-difficulty') as Difficulty || Difficulty.BEGINNER;
    const initialDiff = unlockedDifficulties.includes(savedDiff) ? savedDiff : Difficulty.BEGINNER;

    const savedCatId = localStorage.getItem('word-quest-category') || CATEGORIES[0].id;
    const initialCategory = CATEGORIES.find(c => c.id === savedCatId) || CATEGORIES[0];

    const [difficulty, setDifficulty] = useState<Difficulty>(initialDiff);
    const [category, setCategory] = useState<Category>(initialCategory);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState<'MENU' | 'PLAYING'>('MENU');
    const [showQuestOverlay, setShowQuestOverlay] = useState(false);
    const [canvasConfig, setCanvasConfig] = useState({
        width: 560,
        height: 560,
        rows: 12,
        cols: 12,
        isMobile: window.innerWidth < 768
    });

    const [prefetchedGames, setPrefetchedGames] = useState<Record<string, PrefetchedGame>>({});
    const prefetchTimeoutRef = useRef<number | null>(null);

    const [isMuted, setIsMuted] = useState(soundService.getIsMuted());
    const [showInstructions, setShowInstructions] = useState(false);
    const [activeInstructionTab, setActiveInstructionTab] = useState('gameplay');

    useEffect(() => {
        localStorage.setItem('word-quest-total-points', totalPoints.toString());
    }, [totalPoints]);

    const calculateCanvasSettings = useCallback((targetDiff: Difficulty) => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const config = DIFFICULTY_SETTINGS[targetDiff];
        const isMobile = w < 768;

        if (isMobile) {
            const padding = 12;
            const navbarHeight = 64;
            const footerReserved = 160;
            const availableWidth = w - padding * 2;
            const availableHeight = h - navbarHeight - footerReserved;

            const cols = config.gridSize;
            let cellSide = availableWidth / cols;

            if (cellSide * cols > availableHeight) {
                cellSide = availableHeight / cols;
            }

            let rows = Math.floor(availableHeight / cellSide);
            rows = Math.max(cols, Math.min(rows, Math.floor(cols * 1.5)));

            const width = cols * cellSide;
            const height = rows * cellSide;

            return {width, height, rows, cols, isMobile};
        } else {
            const padding = 40;
            const sidebarWidth = w >= 1024 ? 280 : 240;
            const headerHeight = 80;
            const effectiveAppWidth = Math.min(w, 1300);
            const availableWidth = (effectiveAppWidth - sidebarWidth) - padding;
            const availableHeight = h - headerHeight - padding;
            const cols = config.gridSize;
            const rows = config.gridSize;
            const size = Math.min(availableWidth, availableHeight, 720);
            return {width: size, height: size, rows, cols, isMobile};
        }
    }, []);

    useEffect(() => {
        const handleResize = () => setCanvasConfig(calculateCanvasSettings(difficulty));
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [calculateCanvasSettings, difficulty]);

    const pregenerateGame = useCallback(async (cat: Category, diff: Difficulty) => {
        const key = `${cat.id}-${diff}`;
        if (prefetchedGames[key]) return;

        try {
            const config = DIFFICULTY_SETTINGS[diff];
            const wordGroups = await fetchWordList(cat, config);
            const settings = calculateCanvasSettings(diff);
            const {grid, placedWords} = generateGrid(wordGroups, config, settings.rows, settings.cols);

            setPrefetchedGames(prev => ({
                ...prev,
                [key]: {key, grid, placedWords, rows: settings.rows, cols: settings.cols}
            }));
        } catch (e) {
            console.error(`Failed to pre-generate ${key}`, e);
        }
    }, [calculateCanvasSettings, prefetchedGames]);

    useEffect(() => {
        localStorage.setItem('word-quest-difficulty', difficulty);
        localStorage.setItem('word-quest-category', category.id);
        localStorage.setItem('word-quest-unlocked', JSON.stringify(unlockedDifficulties));

        if (prefetchTimeoutRef.current) window.clearTimeout(prefetchTimeoutRef.current);

        prefetchTimeoutRef.current = window.setTimeout(() => {
            pregenerateGame(category, difficulty);

            const currentIndex = DIFFICULTY_ORDER.indexOf(difficulty);
            if (currentIndex < DIFFICULTY_ORDER.length - 1) {
                const nextDiff = DIFFICULTY_ORDER[currentIndex + 1];
                if (unlockedDifficulties.includes(nextDiff)) {
                    pregenerateGame(category, nextDiff);
                }
            }
        }, 100);

        return () => {
            if (prefetchTimeoutRef.current) window.clearTimeout(prefetchTimeoutRef.current);
        };
    }, [difficulty, category, pregenerateGame, unlockedDifficulties]);

    const startLevel = useCallback(async (cat: Category, diff: Difficulty, targetSubLevel: number = 1, forceReset: boolean = false) => {
        const key = `${cat.id}-${diff}`;
        const config = DIFFICULTY_SETTINGS[diff];

        let initialScore = 0;
        const progressKey = `progress-${cat.id}-${diff}`;
        const stored = localStorage.getItem(progressKey);

        if (!forceReset && stored) {
            const parsed = JSON.parse(stored);
            initialScore = parsed.score;
            targetSubLevel = parsed.subLevel || targetSubLevel;
        } else {
            if (totalPoints < GAME_START_COST) return;
            setTotalPoints(prev => prev - GAME_START_COST);
            initialScore = 0;
        }

        const cached = prefetchedGames[key];
        if (cached) {
            setGameState({
                grid: cached.grid,
                rows: cached.rows,
                cols: cached.cols,
                placedWords: cached.placedWords,
                difficulty: diff,
                subLevel: targetSubLevel,
                category: cat,
                score: initialScore,
                hintsUsed: 0,
                status: 'PLAYING'
            });
            setView('PLAYING');
            setShowQuestOverlay(false);
            return;
        }

        setIsLoading(true);
        try {
            const settings = calculateCanvasSettings(diff);
            const wordGroups = await fetchWordList(cat, config);
            const {grid, placedWords} = generateGrid(wordGroups, config, settings.rows, settings.cols);

            setGameState({
                grid, rows: settings.rows, cols: settings.cols, placedWords,
                difficulty: diff, subLevel: targetSubLevel, category: cat,
                score: initialScore, hintsUsed: 0, status: 'PLAYING'
            });
            setView('PLAYING');
            setShowQuestOverlay(false);
        } catch (e) {
            console.error("Game Initialization failed", e);
        } finally {
            setIsLoading(false);
        }
    }, [calculateCanvasSettings, prefetchedGames, totalPoints]);

    const handleQuit = useCallback(() => {
        setGameState(prev => {
            if (prev && prev.status === 'PLAYING') {
                const progressKey = `progress-${prev.category.id}-${prev.difficulty}`;
                localStorage.setItem(progressKey, JSON.stringify({
                    subLevel: prev.subLevel,
                    score: prev.score
                }));
            }
            return null;
        });
        setView('MENU');
        setShowQuestOverlay(false);
    }, []);

    const nextQuest = useCallback(() => {
        setGameState(prev => {
            if (!prev) return null;
            setShowQuestOverlay(false);
            return {
                ...prev,
                subLevel: prev.subLevel + 1,
                status: 'PLAYING'
            };
        });
    }, []);

    const onWordSelection = useCallback((start: Position, end: Position) => {
        setGameState(prev => {
            if (!prev || prev.status !== 'PLAYING') return prev;

            const wordIdx = prev.placedWords.findIndex(pw => {
                if (pw.found || pw.part !== prev.subLevel) return false;

                const forward = pw.start.r === start.r && pw.start.c === start.c && pw.end.r === end.r && pw.end.c === end.c;
                const backward = pw.start.r === end.r && pw.start.c === end.c && pw.end.r === start.r && pw.end.c === start.c;
                return forward || backward;
            });

            if (wordIdx !== -1) {
                soundService.playSuccess();
                const updatedWords = [...prev.placedWords];
                updatedWords[wordIdx] = {...updatedWords[wordIdx], found: true};

                const currentQuestWords = updatedWords.filter(w => w.part === prev.subLevel);
                const isQuestComplete = currentQuestWords.every(w => w.found);

                const difficultyIndex = DIFFICULTY_ORDER.indexOf(prev.difficulty);
                const pointsPerWord = (difficultyIndex + 2) * 10;
                const newScore = prev.score + pointsPerWord;

                if (isQuestComplete) {
                    soundService.playWin();
                    if (prev.subLevel === GAMES_PER_DIFFICULTY) {
                        localStorage.removeItem(`progress-${prev.category.id}-${prev.difficulty}`);
                        const finalMissionScore = newScore + MISSION_SUCCESS_BONUS;
                        setTotalPoints(tp => tp + finalMissionScore);

                        const currentIndex = DIFFICULTY_ORDER.indexOf(prev.difficulty);
                        if (currentIndex < DIFFICULTY_ORDER.length - 1) {
                            const nextDiff = DIFFICULTY_ORDER[currentIndex + 1];
                            setUnlockedDifficulties(old => {
                                if (old.includes(nextDiff)) return old;
                                const updated = [...old, nextDiff];
                                localStorage.setItem('word-quest-unlocked', JSON.stringify(updated));
                                return updated;
                            });
                        }

                        return {...prev, placedWords: updatedWords, status: 'WON', score: finalMissionScore};
                    } else {
                        setShowQuestOverlay(true);
                        return {...prev, placedWords: updatedWords, score: newScore, status: 'IDLE'};
                    }
                }
                return {...prev, placedWords: updatedWords, score: newScore};
            }
            return prev;
        });
    }, []);

    const toggleMute = () => {
        const newVal = !isMuted;
        setIsMuted(newVal);
        soundService.setMuted(newVal);
    };

    const useHint = () => {
        setGameState(prev => {
            if (!prev || prev.status !== 'PLAYING') return prev;
            const unfound = prev.placedWords.filter(pw => !pw.found && pw.part === prev.subLevel);
            if (unfound.length === 0) return prev;

            soundService.playHint();
            const randomWord = unfound[Math.floor(Math.random() * unfound.length)];
            const updatedWords = prev.placedWords.map(pw =>
                pw.word === randomWord.word ? {...pw, found: true} : pw
            );

            const currentQuestWords = updatedWords.filter(w => w.part === prev.subLevel);
            const isQuestComplete = currentQuestWords.every(w => w.found);

            const hintPenalty = 20;
            const newScore = Math.max(0, prev.score - hintPenalty);

            if (isQuestComplete) {
                soundService.playWin();
                if (prev.subLevel === GAMES_PER_DIFFICULTY) {
                    const finalMissionScore = newScore + MISSION_SUCCESS_BONUS;
                    setTotalPoints(tp => tp + finalMissionScore);
                    const currentIndex = DIFFICULTY_ORDER.indexOf(prev.difficulty);
                    if (currentIndex < DIFFICULTY_ORDER.length - 1) {
                        const nextDiff = DIFFICULTY_ORDER[currentIndex + 1];
                        setUnlockedDifficulties(old => {
                            if (old.includes(nextDiff)) return old;
                            const updated = [...old, nextDiff];
                            localStorage.setItem('word-quest-unlocked', JSON.stringify(updated));
                            return updated;
                        });
                    }
                    return {...prev, placedWords: updatedWords, status: 'WON', score: finalMissionScore};
                } else {
                    setShowQuestOverlay(true);
                    return {...prev, placedWords: updatedWords, score: newScore, status: 'IDLE'};
                }
            }

            return {...prev, placedWords: updatedWords, hintsUsed: prev.hintsUsed + 1, score: newScore};
        });
    };

    const currentKey = `${category.id}-${difficulty}`;
    const isCurrentlyGenerating = isLoading || !prefetchedGames[currentKey];
    const insufficientPoints = totalPoints < GAME_START_COST;

    if (view === 'MENU') {
        return (
            <div className="menu-view">
                <div className="bg-decor">
                    <div className="blur-circle circle-1"></div>
                    <div className="blur-circle circle-2"></div>
                </div>
                <div className="menu-container">
                    <header className="menu-header">
                        <div className="logo">
                            <span className="icon">🧠</span>
                            <h1>WORD QUEST</h1>
                        </div>
                        <div className="total-points-display">
                            <span>TOTAL POINTS</span>
                            <div className="points-val">{totalPoints}</div>
                        </div>
                    </header>

                    <main className="menu-content">
                        <CategorySelection
                            categories={CATEGORIES}
                            selectedCategory={category}
                            onSelect={setCategory}
                        />

                        <DifficultySelection
                            difficulty={difficulty}
                            unlockedDifficulties={unlockedDifficulties}
                            difficultyOrder={DIFFICULTY_ORDER}
                            onSelect={setDifficulty}
                        />

                        <button
                            className="primary-btn start-game-btn"
                            onClick={() => startLevel(category, difficulty)}
                            disabled={(isCurrentlyGenerating && !isLoading) || insufficientPoints}
                        >
                            {isLoading ? 'GENERATING...'
                                : isCurrentlyGenerating ? 'INITIATING...'
                                    : insufficientPoints ? 'INSUFFICIENT POINTS'
                                        : 'Start Mission'}
                        </button>
                    </main>
                </div>
            </div>
        );
    }

    if (!gameState) return null;

    const currentQuestWords = gameState.placedWords.filter(w => w.part === gameState.subLevel);

    const difficultyIndex = DIFFICULTY_ORDER.indexOf(gameState.difficulty);
    const pointsPerWord = (difficultyIndex + 2) * 10;
    const wordsPerQuest = DIFFICULTY_SETTINGS[gameState.difficulty].wordCount / GAMES_PER_DIFFICULTY;
    const questScoreForOverlay = wordsPerQuest * pointsPerWord;

    return (
            <div className="game-layout-container">
                <div className="game-view">
                    {gameState.status === 'WON' && <Confetti key="won-high" intensity="high"/>}
                    {showQuestOverlay && (
                        <QuestOverlay
                            questNum={gameState.subLevel}
                            score={totalPoints + gameState.score}
                            questScore={questScoreForOverlay}
                            onProceed={nextQuest}
                        />
                    )}

                    <GameHeader
                        gameState={gameState}
                        totalPoints={totalPoints}
                        isMuted={isMuted}
                        onQuit={handleQuit}
                        onHint={useHint}
                        onToggleMute={toggleMute}
                        onShowHowTo={() => setShowInstructions(true)}
                    />

                    <div className="game-body">
                        {/*<section className="board-area">*/}
                        {/*    <div className="board-wrapper">*/}
                                <GameCanvas
                                    gameState={gameState}
                                    onWordSelection={onWordSelection}
                                    width={canvasConfig.width}
                                    height={canvasConfig.height}
                                    isMobile={canvasConfig.isMobile}
                                />
                            {/*</div>*/}
                        {/*</section>*/}

                        <QuestTracker
                            subLevel={gameState.subLevel}
                            maxSubLevels={GAMES_PER_DIFFICULTY}
                            currentWords={currentQuestWords}
                        />
                    </div>

                    {showInstructions && (
                        <div className="overlay splash-overlay" onClick={() => setShowInstructions(false)}>
                            <div className="result-card instructions-card" onClick={(e) => e.stopPropagation()}>
                                <div className="quest-indicator">INTELLIGENCE BRIEFING</div>

                                <div className="instr-tabs">
                                    <button
                                        className={`instr-tab-btn ${activeInstructionTab === 'gameplay' ? 'active' : ''}`}
                                        onClick={() => setActiveInstructionTab('gameplay')}
                                        aria-label="Gameplay Instructions"
                                    >
                                        <i className="fa-solid fa-gamepad"></i>
                                        <span>Gameplay</span>
                                    </button>
                                    <button
                                        className={`instr-tab-btn ${activeInstructionTab === 'progression' ? 'active' : ''}`}
                                        onClick={() => setActiveInstructionTab('progression')}
                                        aria-label="Progression Instructions"
                                    >
                                        <i className="fa-solid fa-shoe-prints"></i>
                                        <span>Progression</span>
                                    </button>
                                    <button
                                        className={`instr-tab-btn ${activeInstructionTab === 'scoring' ? 'active' : ''}`}
                                        onClick={() => setActiveInstructionTab('scoring')}
                                        aria-label="Scoring Instructions"
                                    >
                                        <i className="fa-solid fa-star"></i>
                                        <span>Scoring</span>
                                    </button>
                                </div>

                                <div className="instructions-body">
                                    {activeInstructionTab === 'gameplay' && (
                                        <div className="instr-tab-content" key="gameplay">
                                            <div className="instr-section">
                                                <div className="section-title"><i
                                                    className="fa-solid fa-crosshairs"></i> Objective
                                                </div>
                                                <p>Find all hidden words in the grid. Select words by dragging from the
                                                    first letter to the last. Words can be forwards, backwards, up,
                                                    down, and diagonal.</p>
                                            </div>
                                            <div className="instr-section">
                                                <div className="section-title"><i
                                                    className="fa-solid fa-coins"></i> Point System
                                                </div>
                                                <p>You have a total point balance. Earn points by completing missions.
                                                    Spend a small fee to start new missions.</p>
                                            </div>
                                        </div>
                                    )}
                                    {activeInstructionTab === 'progression' && (
                                        <div className="instr-tab-content" key="progression">
                                            <div className="instr-grid-info">
                                                <div className="info-box">
                                                    <div className="info-title">QUESTS</div>
                                                    <p>Each difficulty level consists of <strong>3 Quests</strong>.
                                                        Clear all words in a quest to advance to the next one.</p>
                                                </div>
                                                <div className="info-box">
                                                    <div className="info-title">UNLOCKS</div>
                                                    <p>Complete all 3 quests in a level to unlock the <strong>next
                                                        difficulty tier</strong> and face a greater challenge.</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeInstructionTab === 'scoring' && (
                                        <div className="instr-tab-content" key="scoring">
                                            <div className="instr-section">
                                                <div className="section-title"><i
                                                    className="fa-solid fa-star"></i> Scoring
                                                </div>
                                                <p style={{marginBottom: '0.5rem'}}>Points are awarded for each word
                                                    found. The total score for completing a quest is based on
                                                    difficulty, distributed evenly per word.</p>
                                                <div className="scoring-table">
                                                    <div className="score-item"><span>Beginner Quest Total</span> <span
                                                        className="pts">200 (20/word)</span></div>
                                                    <div className="score-item"><span>Intermediate Quest Total</span>
                                                        <span className="pts">300 (30/word)</span></div>
                                                    <div className="score-item"><span>Advanced Quest Total</span> <span
                                                        className="pts">400 (40/word)</span></div>
                                                    <div className="score-item"><span>Expert Quest Total</span> <span
                                                        className="pts">500 (50/word)</span></div>
                                                </div>
                                                <div className="bonus-info">
                                                    <div><span
                                                        className="accent">Mission Success:</span> +{MISSION_SUCCESS_BONUS} Bonus
                                                        (for clearing all 3 quests)
                                                    </div>
                                                    <div className="penalty"><span
                                                        className="danger">Hint Usage:</span> -20 pts
                                                    </div>
                                                    <div className="penalty"><span
                                                        className="danger">Mission Start:</span> -{GAME_START_COST} pt
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button className="primary-btn full-width" onClick={() => setShowInstructions(false)}>
                                    UNDERSTOOD <i className="fa-solid fa-check"></i>
                                </button>
                            </div>
                        </div>
                    )}

                    {gameState.status === 'WON' && (
                        <div className="overlay end-game-overlay">
                            <div className="summary-card result-card">
                                <h2 className="success">MISSION SUCCESS!</h2>
                                <div className="score-detail-group">
                                    <div className="score-row-item">
                                        <span className="label">MISSION SCORE</span>
                                        <span className="val success-text">+{gameState.score}</span>
                                    </div>
                                    <div className="score-row-item total-focus">
                                        <span className="label">NEW TOTAL POINTS</span>
                                        <span className="val">{totalPoints}</span>
                                    </div>
                                </div>
                                <div className="action-row">
                                    {(() => {
                                        const currentIndex = DIFFICULTY_ORDER.indexOf(gameState.difficulty);
                                        const nextDiff = (currentIndex !== -1 && currentIndex < DIFFICULTY_ORDER.length - 1) ? DIFFICULTY_ORDER[currentIndex + 1] : null;
                                        return nextDiff && (
                                            <button className="primary-btn full-width" onClick={() => {
                                                setDifficulty(nextDiff);
                                                startLevel(category, nextDiff, 1, true);
                                            }}>
                                                NEXT LEVEL: {nextDiff} <i className="fa-solid fa-forward"></i>
                                            </button>
                                        );
                                    })()}
                                    <div className="split-row">
                                        <button className="secondary-btn"
                                                onClick={() => startLevel(category, difficulty, 1, true)}>REPLAY
                                        </button>
                                        <button className="secondary-btn" onClick={handleQuit}>MENU</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {isLoading && (
                        <div className="overlay">
                            <div className="loading-card">
                                <div className="loading-icon"><i className="fa-solid fa-circle-notch fa-spin"></i></div>
                                <h2>GENERATING BOARD</h2>
                                <p>Gathering themed words for {category.name}...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
    );
};

export default WordQuest;
