import { useCallback, useEffect, useRef, useState } from "react";
import {
    DIFFICULTY_CONFIG,
    type Position,
    type Move,
    type GameState,
    type Difficulty,
    type GameStatus,
    type PlayerStats
} from "./types/chess.ts";
import {
    applyMoveToBoard,
    cloneBoard,
    createInitialBoard,
    isInCheck as isInCheckFn,
    hasAnyLegalMoves as hasAnyLegal,
    getLegalMoves,
    PIECE_SYMBOLS,
    posEquals
} from "./utils/boardUtils.ts";
import { getBestMove as getBestAIMove } from "./utils/chessAI.ts";
import { DifficultySelector } from "./components/DifficultySelector.tsx";
import { ChessBoard } from "./components/ChessBoard.tsx";
// import MoveHistory from "./components/MoveHistory.tsx";
import { GameOverModal } from "./components/GameOverModal.tsx";
import { loadStats, saveStats } from "./hook/usePlayerStats.ts";
import "./assets/game.css";

const createGame = (): GameState => ({
    board: createInitialBoard(),
    currentTurn: 'white',
    selectedSquare: null,
    validMoves: [],
    moveHistory: [],
    capturedByWhite: [],
    capturedByBlack: [],
    status: 'playing',
    enPassantTarget: null,
    halfMoveClock: 0,
    fullMoveNumber: 1,
    inCheck: false,
});

export const ChessMain=()=> {
    const [phase, setPhase] = useState<'lobby' | 'playing'>('lobby');
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [stats, setStats] = useState<PlayerStats>(() => loadStats());
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [isAIThinking, setIsAIThinking] = useState(false);
    const [showGameOver, setShowGameOver] = useState(false);
    const [playerWon, setPlayerWon] = useState(false);
    const gameEndProcessed = useRef(false);

    const PLAYER_COLOR = 'white';
    const AI_COLOR = 'black';

    const updateStats = useCallback((updater: ((prev: PlayerStats) => PlayerStats) | PlayerStats) => {
        setStats(prev => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            saveStats(next);
            return next;
        });
    }, []);

    const startGame = useCallback((diff: Difficulty) => {
        const cfg = DIFFICULTY_CONFIG[diff];
        updateStats(prev => ({ ...prev, points: prev.points - cfg.cost, gamesPlayed: prev.gamesPlayed + 1 }));
        gameEndProcessed.current = false;
        setGameState(createGame());
        setShowGameOver(false);
        setIsAIThinking(false);
        setPhase('playing');
    }, [updateStats]);

    const handleSquareClick = useCallback((pos: Position) => {
        setGameState(prev => {
            if (!prev) return prev;
            if (prev.status === 'checkmate' || prev.status === 'stalemate') return prev;
            if (prev.currentTurn !== PLAYER_COLOR) return prev;

            const piece = prev.board[pos.row][pos.col];

            // Execute a move
            if (prev.selectedSquare && prev.validMoves.some(m => posEquals(m, pos))) {
                const fromPiece = prev.board[prev.selectedSquare.row][prev.selectedSquare.col];
                if (!fromPiece) return prev;

                const nb = cloneBoard(prev.board);
                const captured = nb[pos.row][pos.col];

                // Detect en passant capture before applying move
                let epCapture = null;
                if (fromPiece.type === 'pawn' && prev.selectedSquare.col !== pos.col && !captured) {
                    epCapture = nb[prev.selectedSquare.row][pos.col];
                }

                applyMoveToBoard(nb, prev.selectedSquare, pos, fromPiece);

                // New en passant target
                let newEnPassant: Position | null = null;
                if (fromPiece.type === 'pawn' && Math.abs(pos.row - prev.selectedSquare.row) === 2)
                    newEnPassant = { row: (prev.selectedSquare.row + pos.row) / 2, col: pos.col };

                const newCapW = [...prev.capturedByWhite];
                if (captured && captured.color === AI_COLOR) newCapW.push(captured);
                if (epCapture) newCapW.push(epCapture);

                const move: Move = {
                    from: prev.selectedSquare,
                    to: pos,
                    piece: fromPiece,
                    captured: captured || undefined,
                    isEnPassant: !!epCapture,
                    isCastle: fromPiece.type === 'king' && Math.abs(pos.col - prev.selectedSquare.col) === 2,
                };

                const inChk = isInCheckFn(nb, AI_COLOR);
                const hasMoves = hasAnyLegal(nb, AI_COLOR, newEnPassant);
                let status: GameStatus = 'playing';
                if (!hasMoves && inChk) status = 'checkmate';
                else if (!hasMoves) status = 'stalemate';

                return {
                    ...prev,
                    board: nb,
                    currentTurn: AI_COLOR,
                    selectedSquare: null,
                    validMoves: [],
                    moveHistory: [...prev.moveHistory, move],
                    capturedByWhite: newCapW,
                    enPassantTarget: newEnPassant,
                    status,
                    inCheck: inChk,
                    halfMoveClock: prev.halfMoveClock + 1,
                    fullMoveNumber: fromPiece.color === 'black' ? prev.fullMoveNumber + 1 : prev.fullMoveNumber,
                };
            }

            // Select a piece
            if (piece && piece.color === PLAYER_COLOR) {
                const moves = getLegalMoves(prev.board, pos, prev.enPassantTarget);
                return { ...prev, selectedSquare: pos, validMoves: moves };
            }

            // Deselect
            return { ...prev, selectedSquare: null, validMoves: [] };
        });
    }, []);

    // Game end detection - wrapped in a stable callback to avoid ESLint warning
    const checkGameEnd = useCallback(() => {
        if (!gameState) return;
        if (gameEndProcessed.current) return;
        if (gameState.status !== 'checkmate' && gameState.status !== 'stalemate') return;

        gameEndProcessed.current = true;
        const won = gameState.status === 'checkmate' && gameState.currentTurn === AI_COLOR;
        setPlayerWon(won);
        setShowGameOver(true);

        if (won) {
            const cfg = DIFFICULTY_CONFIG[difficulty];
            updateStats(prev => ({ ...prev, points: prev.points + cfg.reward, wins: prev.wins + 1 }));
        } else if (gameState.status === 'checkmate') {
            updateStats(prev => ({ ...prev, losses: prev.losses + 1 }));
        }
    }, [gameState, difficulty, updateStats]);

    useEffect(() => {
        checkGameEnd();
    }, [checkGameEnd]);

    // AI move
    useEffect(() => {
        if (!gameState) return;
        if (gameState.currentTurn !== AI_COLOR) return;
        if (gameState.status === 'checkmate' || gameState.status === 'stalemate') return;

        // Use a ref to track if the effect is still mounted
        const isMounted = { current: true };

        setIsAIThinking(true);
        const cfg = DIFFICULTY_CONFIG[difficulty];

        const timer = setTimeout(() => {
            if (!isMounted.current) return;

            setGameState(prev => {
                if (!prev || prev.currentTurn !== AI_COLOR) {
                    setIsAIThinking(false);
                    return prev;
                }

                const aiMove = getBestAIMove(prev.board, AI_COLOR, cfg.depth, prev.enPassantTarget);
                if (!aiMove) {
                    setIsAIThinking(false);
                    return prev;
                }

                const piece = prev.board[aiMove.from.row][aiMove.from.col];
                if (!piece) {
                    setIsAIThinking(false);
                    return prev;
                }

                const nb = cloneBoard(prev.board);
                const captured = nb[aiMove.to.row][aiMove.to.col];

                let epCapture = null;
                if (piece.type === 'pawn' && aiMove.from.col !== aiMove.to.col && !captured) {
                    epCapture = nb[aiMove.from.row][aiMove.to.col];
                }

                applyMoveToBoard(nb, aiMove.from, aiMove.to, piece);

                let newEnPassant: Position | null = null;
                if (piece.type === 'pawn' && Math.abs(aiMove.to.row - aiMove.from.row) === 2)
                    newEnPassant = { row: (aiMove.from.row + aiMove.to.row) / 2, col: aiMove.to.col };

                const newCapB = [...prev.capturedByBlack];
                if (captured && captured.color === PLAYER_COLOR) newCapB.push(captured);
                if (epCapture) newCapB.push(epCapture);

                const move: Move = {
                    from: aiMove.from,
                    to: aiMove.to,
                    piece,
                    captured: captured || undefined
                };

                const inChk = isInCheckFn(nb, PLAYER_COLOR);
                const hasMoves = hasAnyLegal(nb, PLAYER_COLOR, newEnPassant);
                let status: GameStatus = 'playing';
                if (!hasMoves && inChk) status = 'checkmate';
                else if (!hasMoves) status = 'stalemate';

                if (isMounted.current) {
                    setIsAIThinking(false);
                }

                return {
                    ...prev,
                    board: nb,
                    currentTurn: PLAYER_COLOR,
                    selectedSquare: null,
                    validMoves: [],
                    moveHistory: [...prev.moveHistory, move],
                    capturedByBlack: newCapB,
                    enPassantTarget: newEnPassant,
                    status,
                    inCheck: inChk,
                    halfMoveClock: prev.halfMoveClock + 1,
                    fullMoveNumber: prev.fullMoveNumber + 1,
                };
            });
        }, 500);

        return () => {
            isMounted.current = false;
            clearTimeout(timer);
        };
    }, [difficulty, gameState?.currentTurn, gameState?.status]);

    const goToLobby = useCallback(() => {
        setPhase('lobby');
        setGameState(null);
        setShowGameOver(false);
        setIsAIThinking(false);
        gameEndProcessed.current = false;
    }, []);

    // Helper function to get dynamic class names
    const getAIPanelClass = () => {
        return `ai-panel ${isAIThinking ? 'ai-panel-thinking' : ''}`;
    };

    const getStatusBarClass = () => {
        return `status-bar ${gameState?.inCheck ? 'status-bar-check' : ''}`;
    };
    useEffect(() => {
        // Add Font Awesome CSS if not already present
        if (!document.querySelector('#font-awesome-css')) {
            const link = document.createElement('link');
            link.id = 'font-awesome-css';
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
            document.head.appendChild(link);
        }
    }, []);
    return (
        <div className="app-container">
            {/* Header */}
            <div className="header-chess">
                <h1 className="header-title">♟ ROYAL CHESS</h1>
                <p className="header-subtitle">Point-Based Gaming</p>
            </div>

            {/* Points bar */}
            <div className="points-bar">
                <div>
                    <span className="points-value">{stats.points}</span>
                    <span className="points-label">pts</span>
                </div>
                <div className="points-divider" />
                <div className="stats-text">
                    W: <span className="wins-text">{stats.wins}</span>
                    <span style={{ margin: '0 4px' }}>·</span>
                    L: <span className="losses-text">{stats.losses}</span>
                </div>
                {stats.points < 2 && (
                    <button
                        onClick={() => updateStats(prev => ({ ...prev, points: prev.points + 20 }))}
                        className="reset-points-btn"
                    >
                        +20 pts
                    </button>
                )}
            </div>

            {/* LOBBY */}
            {phase === 'lobby' && (
                <div className="lobby-container">
                    <div className="lobby-card">
                        <h2 className="lobby-title">Choose Your Battle</h2>
                        <DifficultySelector
                            selectedDifficulty={difficulty}
                            onSelect={setDifficulty}
                            playerPoints={stats.points}
                            onStartGame={() => startGame(difficulty)}
                        />
                    </div>
                </div>
            )}

            {/* GAME */}
            {phase === 'playing' && gameState && (
                <div className="game-container">
                    {/* AI Panel */}
                    <div className={getAIPanelClass()}>
                        <div className="ai-info">
                            <div className="ai-avatar">♚</div>
                            <div>
                                <div className="ai-name">
                                    AI · {DIFFICULTY_CONFIG[difficulty].label}
                                    {isAIThinking && (
                                        <span className="ai-thinking-text">thinking...</span>
                                    )}
                                </div>
                                <div className="ai-captured">
                                    {gameState.capturedByBlack.map((p, i) => (
                                        <span key={i} className="ai-captured-piece">
                                            {PIECE_SYMBOLS[p.type][p.color]}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <span className="ai-emoji">{DIFFICULTY_CONFIG[difficulty].label || '🤖'}</span>
                    </div>

                    {/* Board */}
                    <ChessBoard
                        board={gameState.board}
                        selectedSquare={gameState.selectedSquare}
                        validMoves={gameState.validMoves}
                        moveHistory={gameState.moveHistory}
                        inCheck={gameState.inCheck}
                        currentTurn={gameState.currentTurn}
                        onSquareClick={handleSquareClick}
                    />

                    {/* Status */}
                    <div className={getStatusBarClass()}>
                        {gameState.inCheck
                            ? '⚠️  CHECK!'
                            : gameState.currentTurn === 'white'
                                ? '🎯 Your turn · Click a piece to move'
                                : '🤖 AI is thinking...'}
                    </div>

                    {/* Player Panel */}
                    <div className="player-panel">
                        <div className="player-avatar">♔</div>
                        <div>
                            <div className="player-name">
                                You · White
                                {gameState.currentTurn === 'white' && (
                                    <span className="player-turn-indicator">▶ Your turn</span>
                                )}
                            </div>
                            <div className="player-captured">
                                {gameState.capturedByWhite.map((p, i) => (
                                    <span key={i} className="player-captured-piece">
                                        {PIECE_SYMBOLS[p.type][p.color]}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Move History */}
                    {/*<MoveHistory moves={gameState.moveHistory} />*/}

                    {/* Controls */}
                    <div className="controls-container">
                        <button onClick={goToLobby} className="control-btn">
                            ← Lobby
                        </button>
                        <button
                            onClick={() => {
                                gameEndProcessed.current = false;
                                setGameState(createGame());
                                setShowGameOver(false);
                                setIsAIThinking(false);
                                updateStats(prev => ({
                                    ...prev,
                                    points: prev.points - DIFFICULTY_CONFIG[difficulty].cost,
                                    gamesPlayed: prev.gamesPlayed + 1,
                                }));
                            }}
                            className="control-btn"
                        >
                            ↺ New Game
                        </button>
                    </div>
                </div>
            )}

            {/* Game Over Modal */}
            {showGameOver && gameState && (
                <GameOverModal
                    playerWon={playerWon}
                    status={gameState.status}
                    difficulty={difficulty}
                    onPlayAgain={() => startGame(difficulty)}
                    onChangeLevel={goToLobby}
                    pointsEarned={DIFFICULTY_CONFIG[difficulty].reward}
                    pointsLost={DIFFICULTY_CONFIG[difficulty].cost}
                />
            )}
        </div>
    );
}