
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Difficulty } from '../types';
import type {
    Category,
    GameState,
    Position,
    PlacedWord
} from '../types';

import { generateGrid } from '../utils/gridGenerator';
import { fetchWordList } from '../services/geminiService';
import { soundService } from '../services/soundService';
import GameCanvas from './GameCanvas';
import CategorySelection from './CategorySelection';
import DifficultySelection from './DifficultySelection';
import GameHeader from './GameHeader';
import QuestTracker from './QuestTracker';
import {CATEGORIES, DIFFICULTY_SETTINGS} from "../constants.ts";
import "../styles.css"
const GAMES_PER_DIFFICULTY = 3;
const DIFFICULTY_ORDER = [Difficulty.BEGINNER, Difficulty.INTERMEDIATE, Difficulty.ADVANCED, Difficulty.EXPERT];
const QUEST_COMPLETION_BONUS = 150;

const createParticles = (count: number) => {
    const colors = ['#38bdf8', '#10b981', '#f59e0b', '#ef4444', '#818cf8', '#a78bfa'];
    return Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
        size: 5 + Math.random() * 10,
    }));
};

export const Confetti: React.FC<{ intensity?: 'normal' | 'high' }> = ({ intensity = 'normal' }) => {
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
    bonus: number;
    onProceed: () => void;
}

export const QuestOverlay: React.FC<QuestOverlayProps> = ({ questNum, score, bonus, onProceed }) => {
    return (
        <div className="overlay splash-overlay" onClick={onProceed}>
            <div className="result-card quest-clear-card" onClick={(e) => e.stopPropagation()}>
                <div className="quest-badge">QUEST {questNum} COMPLETE</div>
                <h2 className="victory-text-glitch">OBJECTIVE<br/>CLEARED</h2>

                <div className="score-detail-group">
                    <div className="score-row-item">
                        <span className="label">QUEST BONUS</span>
                        <span className="val success-text">+{bonus}</span>
                    </div>
                    <div className="score-row-item total-focus">
                        <span className="label">TOTAL SCORE</span>
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
    const [canvasDims, setCanvasDims] = useState({ width: 560, height: 560, rows: 12, cols: 12 });

    const [prefetchedGames, setPrefetchedGames] = useState<Record<string, PrefetchedGame>>({});
    const prefetchTimeoutRef = useRef<number | null>(null);

    const [isMuted, setIsMuted] = useState(soundService.getIsMuted());
    const [showInstructions, setShowInstructions] = useState(false);

    const calculateCanvasSettings = useCallback((targetDiff: Difficulty) => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        const config = DIFFICULTY_SETTINGS[targetDiff];

        if (w < 768) {
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

            return { width, height, rows, cols };
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
            return { width: size, height: size, rows, cols };
        }
    }, []);

    useEffect(() => {
        const handleResize = () => setCanvasDims(calculateCanvasSettings(difficulty));
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
            const { grid, placedWords } = generateGrid(wordGroups, config, settings.rows, settings.cols);

            setPrefetchedGames(prev => ({
                ...prev,
                [key]: { key, grid, placedWords, rows: settings.rows, cols: settings.cols }
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

        let currentScore = 0;
        const progressKey = `progress-${cat.id}-${diff}`;
        const stored = localStorage.getItem(progressKey);

        if (!forceReset && stored) {
            const parsed = JSON.parse(stored);
            currentScore = parsed.score;
            targetSubLevel = parsed.subLevel || targetSubLevel;
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
                score: currentScore,
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
            const { grid, placedWords } = generateGrid(wordGroups, config, settings.rows, settings.cols);

            setGameState({
                grid, rows: settings.rows, cols: settings.cols, placedWords,
                difficulty: diff, subLevel: targetSubLevel, category: cat,
                score: currentScore, hintsUsed: 0, status: 'PLAYING'
            });
            setView('PLAYING');
            setShowQuestOverlay(false);
        } catch (e) {
            console.error("Game Initialization failed", e);
        } finally {
            setIsLoading(false);
        }
    }, [calculateCanvasSettings, prefetchedGames]);

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
                updatedWords[wordIdx] = { ...updatedWords[wordIdx], found: true };

                const currentQuestWords = updatedWords.filter(w => w.part === prev.subLevel);
                const isQuestComplete = currentQuestWords.every(w => w.found);

                const difficultyIndex = DIFFICULTY_ORDER.indexOf(prev.difficulty);
                const pointsPerWord = (difficultyIndex + 1) * 5;

                let addedScore = pointsPerWord;
                if (isQuestComplete) {
                    addedScore += QUEST_COMPLETION_BONUS;
                }

                const newScore = prev.score + addedScore;

                if (isQuestComplete) {
                    soundService.playWin();
                    if (prev.subLevel === GAMES_PER_DIFFICULTY) {
                        localStorage.removeItem(`progress-${prev.category.id}-${prev.difficulty}`);

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

                        return { ...prev, placedWords: updatedWords, status: 'WON', score: newScore + 500 };
                    } else {
                        setShowQuestOverlay(true);
                        return { ...prev, placedWords: updatedWords, score: newScore, status: 'IDLE' };
                    }
                }
                return { ...prev, placedWords: updatedWords, score: newScore };
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
                pw.word === randomWord.word ? { ...pw, found: true } : pw
            );

            const currentQuestWords = updatedWords.filter(w => w.part === prev.subLevel);
            const isQuestComplete = currentQuestWords.every(w => w.found);

            const hintPenalty = 20;
            let newScore = Math.max(0, prev.score - hintPenalty);

            if (isQuestComplete) {
                newScore += QUEST_COMPLETION_BONUS;
                soundService.playWin();
                if (prev.subLevel === GAMES_PER_DIFFICULTY) {
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
                    return { ...prev, placedWords: updatedWords, status: 'WON', score: newScore + 500 };
                } else {
                    setShowQuestOverlay(true);
                    return { ...prev, placedWords: updatedWords, score: newScore, status: 'IDLE' };
                }
            }

            return { ...prev, placedWords: updatedWords, hintsUsed: prev.hintsUsed + 1, score: newScore };
        });
    };

    const currentKey = `${category.id}-${difficulty}`;
    const isCurrentlyGenerating = isLoading || !prefetchedGames[currentKey];

    if (view === 'MENU') {
        return (
            <div className="menu-view">
                <div className="bg-decor">
                    <div className="blur-circle circle-1"></div>
                    <div className="blur-circle circle-2"></div>
                </div>
                <div className="menu-container">
                    <header className="menu-header">
                        <div className="logo" onClick={handleQuit}>
                            <span className="icon">🧠</span>
                            <h1>WORD QUEST</h1>
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
                            disabled={isCurrentlyGenerating && !isLoading}
                        >
                            {isLoading ? 'GENERATING...' : isCurrentlyGenerating ? 'INITIATING...' : 'Start'}
                        </button>
                    </main>
                </div>
            </div>
        );
    }

    if (!gameState) return null;

    const currentQuestWords = gameState.placedWords.filter(w => w.part === gameState.subLevel);

    return (
        <div className="game-layout-container">
            <div className="game-view">
                {gameState.status === 'WON' && <Confetti key="won-high" intensity="high" />}
                {showQuestOverlay && (
                    <QuestOverlay
                        questNum={gameState.subLevel}
                        score={gameState.score}
                        bonus={QUEST_COMPLETION_BONUS}
                        onProceed={nextQuest}
                    />
                )}

                <GameHeader
                    gameState={gameState}
                    isMuted={isMuted}
                    onQuit={handleQuit}
                    onHint={useHint}
                    onToggleMute={toggleMute}
                    onShowHowTo={() => setShowInstructions(true)}
                />

                <div className="game-body">
                    <section className="board-area">
                        <div className="board-wrapper">
                            <GameCanvas
                                gameState={gameState}
                                onWordSelection={onWordSelection}
                                width={canvasDims.width}
                                height={canvasDims.height}
                            />
                        </div>
                    </section>

                    <QuestTracker
                        subLevel={gameState.subLevel}
                        maxSubLevels={GAMES_PER_DIFFICULTY}
                        currentWords={currentQuestWords}
                    />
                </div>

                {showInstructions && (
                    <div className="overlay splash-overlay" onClick={() => setShowInstructions(false)}>
                        <div className="result-card instructions-card" onClick={(e) => e.stopPropagation()}>
                            <div className="quest-indicator">HOW TO PLAY</div>
                            <div className="instructions-body">
                                <div className="instr-step">
                                    <div className="instr-icon">🖱️</div>
                                    <div className="instr-text">
                                        <h3>Select Words</h3>
                                        <p>Click and drag over the letters to highlight a word from the log.</p>
                                    </div>
                                </div>
                                <div className="instr-step">
                                    <div className="instr-icon">🔄</div>
                                    <div className="instr-text">
                                        <h3>Directions</h3>
                                        <p>Words can be horizontal, vertical, or diagonal.</p>
                                    </div>
                                </div>
                            </div>
                            <button className="primary-btn full-width" onClick={() => setShowInstructions(false)}>
                                GOT IT <i className="fa-solid fa-check"></i>
                            </button>
                        </div>
                    </div>
                )}

                {(gameState.status === 'WON' || gameState.status === 'LOST') && (
                    <div className="overlay end-game-overlay">
                        <div className="summary-card result-card">
                            <h2 className={gameState.status === 'WON' ? 'success' : 'fail'}>
                                {gameState.status === 'WON' ? 'MISSION SUCCESS!' : 'TIME OVER'}
                            </h2>
                            <div className="score-box">
                                <span className="label">FINAL SCORE:</span>
                                <span className="val">{gameState.score}</span>
                            </div>
                            <div className="action-row">
                                {gameState.status === 'WON' && (() => {
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
                                    <button className="secondary-btn" onClick={() => startLevel(category, difficulty, 1, true)}>REPLAY</button>
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
