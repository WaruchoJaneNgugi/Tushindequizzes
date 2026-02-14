import { useState, useEffect, useRef, useCallback } from 'react';
import MainMenu from './components/MainMenu.tsx';
import QuestionScreen from './components/QuestionScreen.tsx';
import Tutorial from './components/Tutorial.tsx';
import ResultsPopup from './components/ResultsPopup.tsx';
import LevelUpPopup from './components/LevelUpPopup.tsx';
import GameOverScreen from './components/GameOver.tsx';
import { BibleQuizGame } from './utils/gameLogic.ts';
import './style/style.css';
import type {AnswerResult, BibleQuestion, GameState, Player} from "./types/type.ts";

export const MainGameLayout = () => {
    const initialQuestions: BibleQuestion[] = [
        // Level 1 - Easy Questions
        {
            id: 1,
            question: "How many books are in the Old Testament?",
            options: ["27", "39", "66", "50"],
            correctAnswer: 1,
            category: "Bible Basics",
            difficulty: "easy",
            scripture: "The Old Testament contains 39 books in Protestant Bibles",
            explanation: "The Old Testament has 39 books, divided into Law, History, Poetry, and Prophets.",
            points: 10
        },
        {
            id: 2,
            question: "What is the first book of the Bible?",
            options: ["Exodus", "Genesis", "Matthew", "Psalms"],
            correctAnswer: 1,
            category: "Bible Basics",
            difficulty: "easy",
            scripture: "Genesis 1:1 - 'In the beginning God created the heavens and the earth.'",
            explanation: "Genesis is the first book of the Bible, meaning 'beginning' in Greek.",
            points: 10
        },
        {
            id: 3,
            question: "How many disciples did Jesus have?",
            options: ["10", "12", "15", "7"],
            correctAnswer: 1,
            category: "New Testament",
            difficulty: "easy",
            scripture: "Matthew 10:1 - 'He called his twelve disciples to him...'",
            explanation: "Jesus had 12 disciples who became his closest followers.",
            points: 10
        },
        {
            id: 4,
            question: "Who built the ark?",
            options: ["Moses", "Noah", "Abraham", "David"],
            correctAnswer: 1,
            category: "Old Testament",
            difficulty: "easy",
            scripture: "Genesis 6:14 - 'Make yourself an ark of gopher wood...'",
            explanation: "Noah built the ark to save his family and animals from the great flood.",
            points: 10
        },
        {
            id: 5,
            question: "What is the shortest verse in the Bible?",
            options: ["John 11:35", "Psalm 23:1", "John 3:16", "Genesis 1:1"],
            correctAnswer: 0,
            category: "Bible Trivia",
            difficulty: "easy",
            scripture: "John 11:35 - 'Jesus wept.'",
            explanation: "John 11:35 is the shortest verse in most English translations.",
            points: 10
        },
        // Level 2 - Medium Questions
        {
            id: 6,
            question: "Who was thrown into a lions' den but survived unharmed?",
            options: ["David", "Daniel", "Samson", "Joseph"],
            correctAnswer: 1,
            category: "Old Testament",
            difficulty: "medium",
            scripture: "Daniel 6:22 - 'My God sent his angel, and he shut the mouths of the lions.'",
            explanation: "Daniel was thrown into the lions' den for praying to God, but God protected him.",
            points: 15
        },
        {
            id: 7,
            question: "What was Paul's original name before conversion?",
            options: ["Peter", "Stephen", "Saul", "John"],
            correctAnswer: 2,
            category: "New Testament",
            difficulty: "medium",
            scripture: "Acts 13:9 - 'Then Saul, who was also called Paul...'",
            explanation: "Paul was originally named Saul before his conversion on the road to Damascus.",
            points: 15
        },
        {
            id: 8,
            question: "Which book comes right before Psalms in the Bible?",
            options: ["Proverbs", "Job", "Song of Solomon", "Ecclesiastes"],
            correctAnswer: 1,
            category: "Bible Order",
            difficulty: "medium",
            scripture: "The book of Job precedes Psalms in the Old Testament",
            explanation: "Job is the 18th book, Psalms is the 19th in most Protestant Bibles.",
            points: 15
        },
        {
            id: 9,
            question: "How many days and nights did Jesus fast in the wilderness?",
            options: ["7", "30", "40", "14"],
            correctAnswer: 2,
            category: "New Testament",
            difficulty: "medium",
            scripture: "Matthew 4:2 - 'After fasting forty days and forty nights, he was hungry.'",
            explanation: "Jesus fasted for 40 days and nights in the wilderness before being tempted by Satan.",
            points: 15
        },
        // Level 3 - Hard Questions
        {
            id: 10,
            question: "What are the four categories of Old Testament books in the Hebrew Bible?",
            options: [
                "Law, History, Poetry, Prophets",
                "Gospels, Epistles, History, Prophecy",
                "Pentateuch, Historical, Wisdom, Major/Minor Prophets",
                "Torah, Nevi'im, Ketuvim, Apocrypha"
            ],
            correctAnswer: 2,
            category: "Bible Structure",
            difficulty: "hard",
            scripture: "The Hebrew Bible (Tanakh) is divided into Torah (Law), Nevi'im (Prophets), and Ketuvim (Writings).",
            explanation: "In Christian categorization: Pentateuch (5), Historical (12), Wisdom (5), Major/Minor Prophets (17).",
            points: 20
        },
        {
            id: 11,
            question: "What was the name of the high priest who condemned Jesus?",
            options: ["Annas", "Caiaphas", "Pilate", "Herod"],
            correctAnswer: 1,
            category: "New Testament",
            difficulty: "hard",
            scripture: "Matthew 26:57 - 'Those who had arrested Jesus took him to Caiaphas the high priest...'",
            explanation: "Caiaphas was the high priest who presided over the Sanhedrin trial of Jesus.",
            points: 20
        },
        {
            id: 12,
            question: "Which prophet married a prostitute as an object lesson to Israel?",
            options: ["Isaiah", "Jeremiah", "Hosea", "Ezekiel"],
            correctAnswer: 2,
            category: "Old Testament",
            difficulty: "hard",
            scripture: "Hosea 1:2 - 'Go, marry a promiscuous woman and have children with her...'",
            explanation: "Hosea married Gomer to illustrate God's relationship with unfaithful Israel.",
            points: 20
        }
    ];

    const [game] = useState(() => new BibleQuizGame(
        localStorage.getItem('bibleQuizPlayer') || 'Bible Scholar',
        initialQuestions
    ));

    const [gameState, setGameState] = useState<GameState>({
        currentScreen: 'menu',
        currentQuestion: null,
        selectedAnswer: null,
        isAnswered: false,
        timeLeft: 30,
        gameStarted: false,
        showResults: false,
        showLevelUp: false,
        isGameOver: false
    });

    const [player, setPlayer] = useState<Player>(() => game.getPlayerStats());
    const [result, setResult] = useState<AnswerResult | null>(null);
    const [levelProgress, setLevelProgress] = useState(() => game.getLevelProgress());
    const [showLevelUpPopup, setShowLevelUpPopup] = useState(false);
    const [newLevelInfo, setNewLevelInfo] = useState<{
        level: number;
        name: string;
        multiplier: number;
        difficulty: string;
    } | null>(null);

    // Refs to manage timeout IDs
    const timerRef = useRef<number | null>(null);
    const autoNextRef = useRef<number | null>(null);

    // Define handleLevelUp first since it's used by other functions
    const handleLevelUp = useCallback(() => {
        console.log('LEVEL UP TRIGGERED!');
        const currentLevel = game.getCurrentLevel();
        const levelName = game.getLevelName();
        const multiplier = game.getLevelMultiplier();
        const levelDifficulty = game.getLevelDifficulty();

        console.log('New level info:', { currentLevel, levelName, multiplier, levelDifficulty });

        setNewLevelInfo({
            level: currentLevel,
            name: levelName,
            multiplier: multiplier,
            difficulty: levelDifficulty
        });
        setShowLevelUpPopup(true);
    }, [game]);

    // Define handleTimeUp which uses handleLevelUp
    const handleTimeUp = useCallback(() => {
        // Clear any pending timer
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (gameState.currentQuestion && !gameState.isAnswered) {
            const answerResult = game.submitAnswer(gameState.currentQuestion, -1);
            const newPlayer = game.getPlayerStats();
            const newLevelProgress = game.getLevelProgress();

            console.log('Time up result:', {
                pointsDeducted: answerResult.pointsDeducted,
                isGameOver: answerResult.isGameOver,
                playerPoints: newPlayer.points
            });

            setPlayer(newPlayer);
            setResult(answerResult);
            setLevelProgress(newLevelProgress);

            setGameState(prev => ({
                ...prev,
                isAnswered: true,
                timeLeft: 0
            }));

            // Check for game over immediately
            if (answerResult.isGameOver || newPlayer.points <= 0) {
                console.log('TIME UP - GAME OVER! Points:', newPlayer.points);

                // Show game over after delay
                setTimeout(() => {
                    setGameState(prev => ({
                        ...prev,
                        currentScreen: 'gameover'
                    }));
                }, 1500);
                return;
            }

            // Check for level up
            if (answerResult.levelUp) {
                handleLevelUp();
            }
        }
    }, [gameState.currentQuestion, gameState.isAnswered, game, handleLevelUp]);

    const handleContinueAfterLevelUp = useCallback(() => {
        console.log('Continuing after level up');
        setShowLevelUpPopup(false);
        setNewLevelInfo(null);

        // Check if game should be over (points check)
        const currentPlayer = game.getPlayerStats();
        if (currentPlayer.points <= 0) {
            console.log('Game over after level up - points:', currentPlayer.points);
            setGameState(prev => ({
                ...prev,
                currentScreen: 'gameover'
            }));
            return;
        }

        // Get next question with new level difficulty
        const nextQuestion = game.getNextQuestion();
        const newLevelProgress = game.getLevelProgress();
        const newPlayer = game.getPlayerStats();

        console.log('Next question after level up:', nextQuestion);
        console.log('New player stats:', newPlayer);
        console.log('New level progress:', newLevelProgress);

        if (nextQuestion && newPlayer.points > 0) {
            setGameState({
                currentScreen: 'game',
                currentQuestion: nextQuestion,
                selectedAnswer: null,
                isAnswered: false,
                timeLeft: 30,
                gameStarted: true,
                showResults: false,
                showLevelUp: false,
                isGameOver: false
            });
            setResult(null);
            setLevelProgress(newLevelProgress);
            setPlayer(newPlayer);
        } else if (newPlayer.points <= 0) {
            // Game over due to no points
            setGameState(prev => ({
                ...prev,
                currentScreen: 'gameover'
            }));
        } else {
            // No more questions - show results
            setGameState(prev => ({
                ...prev,
                showResults: true
            }));
        }
    }, [game]);

    // Timer effect - uses setTimeout for better control
    useEffect(() => {
        // Clear any existing timeouts
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (autoNextRef.current !== null) {
            clearTimeout(autoNextRef.current);
            autoNextRef.current = null;
        }

        // Start timer only if we're in game screen, have a question, not answered, and time left
        if (gameState.currentScreen === 'game' &&
            gameState.currentQuestion &&
            !gameState.isAnswered &&
            gameState.timeLeft > 0) {

            timerRef.current = window.setTimeout(() => {
                setGameState(prev => {
                    if (prev.timeLeft <= 1) {
                        // Time's up!
                        handleTimeUp();
                        return { ...prev, timeLeft: 0, isAnswered: true };
                    }
                    return { ...prev, timeLeft: prev.timeLeft - 1 };
                });
            }, 1000);

            return () => {
                if (timerRef.current !== null) {
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                }
            };
        }
    }, [gameState.currentScreen, gameState.currentQuestion, gameState.isAnswered, gameState.timeLeft, handleTimeUp]);

    // Auto-next effect - runs when answer is submitted
    useEffect(() => {
        if (gameState.isAnswered && result && gameState.currentScreen === 'game') {
            console.log('Auto-next effect triggered, result:', result);

            // Check for game over first
            if (result.isGameOver || player.points <= 0) {
                console.log('GAME OVER detected in auto-next, points:', player.points);

                // Show game over after a short delay
                setTimeout(() => {
                    setGameState(prev => ({
                        ...prev,
                        currentScreen: 'gameover'
                    }));
                }, 1500);
                return;
            }

            // Don't auto-proceed if we need to show level up popup
            if (showLevelUpPopup) {
                console.log('Skipping auto-next because level up popup is showing');
                return;
            }

            autoNextRef.current = window.setTimeout(() => {
                console.log('Auto-next triggered, current points:', player.points);

                // Get updated player stats
                const currentPlayer = game.getPlayerStats();
                if (currentPlayer.points <= 0) {
                    console.log('Game over - points at 0');
                    setGameState(prev => ({
                        ...prev,
                        currentScreen: 'gameover'
                    }));
                    return;
                }

                const nextQuestion = game.getNextQuestion();
                const newPlayer = game.getPlayerStats();
                const newLevelProgress = game.getLevelProgress();

                console.log('Next question available:', nextQuestion);
                console.log('New player points:', newPlayer.points);

                setPlayer(newPlayer);
                setLevelProgress(newLevelProgress);

                if (nextQuestion && newPlayer.points > 0) {
                    setGameState({
                        currentScreen: 'game',
                        currentQuestion: nextQuestion,
                        selectedAnswer: null,
                        isAnswered: false,
                        timeLeft: 30,
                        gameStarted: true,
                        showResults: false,
                        showLevelUp: false,
                        isGameOver: false
                    });
                    setResult(null);
                } else if (newPlayer.points <= 0) {
                    // Game over due to no points
                    setGameState(prev => ({
                        ...prev,
                        currentScreen: 'gameover'
                    }));
                } else {
                    // No more questions - show results popup
                    console.log('No more questions, showing results');
                    setGameState(prev => ({
                        ...prev,
                        showResults: true
                    }));
                }
            }, 1500); // 1.5 seconds delay

            return () => {
                if (autoNextRef.current !== null) {
                    clearTimeout(autoNextRef.current);
                    autoNextRef.current = null;
                }
            };
        }
    }, [gameState.isAnswered, result, gameState.currentScreen, showLevelUpPopup, game, player.points]);

    const startNewGame = () => {
        console.log('Starting new game');

        // Clear any existing timeouts
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        if (autoNextRef.current !== null) {
            clearTimeout(autoNextRef.current);
            autoNextRef.current = null;
        }

        game.startNewGame();
        const question = game.getNextQuestion();
        const newPlayer = game.getPlayerStats();
        const newLevelProgress = game.getLevelProgress();

        // Check if game should start (points should be positive)
        if (newPlayer.points <= 0) {
            console.log('Cannot start game - points are already 0!');
            setGameState(prev => ({
                ...prev,
                currentScreen: 'gameover'
            }));
            return;
        }

        console.log('First question:', question);
        console.log('Initial player:', newPlayer);
        console.log('Initial level progress:', newLevelProgress);

        setPlayer(newPlayer);
        setLevelProgress(newLevelProgress);
        setShowLevelUpPopup(false);
        setNewLevelInfo(null);

        setGameState({
            currentScreen: 'game',
            currentQuestion: question,
            selectedAnswer: null,
            isAnswered: false,
            timeLeft: 30,
            gameStarted: true,
            showResults: false,
            showLevelUp: false,
            isGameOver: false
        });

        setResult(null);
    };

    // Update handleAnswerSelect to check for game over
    const handleAnswerSelect = useCallback((answerIndex: number, question: BibleQuestion) => {
        console.log('Answer selected:', answerIndex, 'for question:', question.id);

        const answerResult = game.submitAnswer(question, answerIndex);
        const newPlayer = game.getPlayerStats();
        const newLevelProgress = game.getLevelProgress();

        console.log('Answer result:', {
            correct: answerResult.correct,
            pointsEarned: answerResult.pointsEarned,
            pointsDeducted: answerResult.pointsDeducted,
            levelUp: answerResult.levelUp,
            isGameOver: answerResult.isGameOver,
            currentPoints: newPlayer.points
        });

        setPlayer(newPlayer);
        setResult(answerResult);
        setLevelProgress(newLevelProgress);

        // Check for game over IMMEDIATELY
        if (answerResult.isGameOver || newPlayer.points <= 0) {
            console.log('GAME OVER - No points left! Current points:', newPlayer.points);
            setGameState(prev => ({
                ...prev,
                selectedAnswer: answerIndex,
                isAnswered: true,
                timeLeft: 0,
                showLevelUp: false,
                isGameOver: true
            }));

            // Show game over screen after delay
            setTimeout(() => {
                setGameState(prev => ({
                    ...prev,
                    currentScreen: 'gameover'
                }));
            }, 1500);
            return;
        }

        setGameState(prev => ({
            ...prev,
            selectedAnswer: answerIndex,
            isAnswered: true,
            timeLeft: 0,
            showLevelUp: answerResult.levelUp || false,
            isGameOver: false
        }));

        // Check for level up
        if (answerResult.levelUp) {
            console.log('Level up detected in handleAnswerSelect');
            handleLevelUp();
        }
    }, [game, handleLevelUp]);

    // Debug effect to check level progress
    useEffect(() => {
        if (gameState.currentScreen === 'game' && gameState.currentQuestion) {
            console.log('Current question difficulty:', gameState.currentQuestion.difficulty);
            console.log('Current level progress:', levelProgress);
            console.log('Player currentDifficultyLevel:', player.currentDifficultyLevel);
            console.log('Player points:', player.points, '/', player.maxPoints);
        }
    }, [gameState.currentScreen, gameState.currentQuestion, levelProgress, player]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current !== null) {
                clearTimeout(timerRef.current);
            }
            if (autoNextRef.current !== null) {
                clearTimeout(autoNextRef.current);
            }
        };
    }, []);

    const renderScreen = () => {
        switch (gameState.currentScreen) {
            case 'menu':
                return (
                    <MainMenu
                        player={player}
                        onStartGame={startNewGame}
                        onShowTutorial={() => setGameState(prev => ({ ...prev, currentScreen: 'tutorial' }))}
                    />
                );

            case 'tutorial':
                return (
                    <Tutorial
                        onStartGame={startNewGame}
                        onBack={() => setGameState(prev => ({ ...prev, currentScreen: 'menu' }))}
                    />
                );

            case 'game':
                if (!gameState.currentQuestion) {
                    // Check if it's because game is over
                    if (player.points <= 0 || gameState.isGameOver) {
                        return <GameOverScreen
                            player={player}
                            onRetry={startNewGame}
                            onMenu={() => setGameState(prev => ({ ...prev, currentScreen: 'menu' }))}
                        />;
                    }

                    return (
                        <div className="loading-screen">
                            <h2>No more questions available!</h2>
                            <button
                                className="btn-primary"
                                onClick={() => setGameState(prev => ({ ...prev, currentScreen: 'menu' }))}
                            >
                                Back to Menu
                            </button>
                        </div>
                    );
                }

                return (
                    <>
                        <QuestionScreen
                            question={gameState.currentQuestion}
                            timeLeft={gameState.timeLeft}
                            isAnswered={gameState.isAnswered}
                            selectedAnswer={gameState.selectedAnswer}
                            onAnswerSelect={(answerIndex) => handleAnswerSelect(answerIndex, gameState.currentQuestion!)}
                            onMenu={() => setGameState(prev => ({ ...prev, currentScreen: 'menu' }))}
                            showAutoNext={gameState.isAnswered}
                            currentLevel={levelProgress.level}
                            levelProgress={levelProgress}
                            player={player}
                        />

                        {gameState.showResults && (
                            <ResultsPopup
                                player={player}
                                onPlayAgain={startNewGame}
                                onMenu={() => setGameState(prev => ({ ...prev, currentScreen: 'menu', showResults: false }))}
                            />
                        )}
                    </>
                );

            case 'gameover':
                return (
                    <GameOverScreen
                        player={player}
                        onRetry={startNewGame}
                        onMenu={() => setGameState(prev => ({ ...prev, currentScreen: 'menu' }))}
                    />
                );

            default:
                return (
                    <div className="error-fallback">
                        <h2>Oops! Something went wrong</h2>
                        <button
                            className="btn-primary"
                            onClick={() => setGameState(prev => ({ ...prev, currentScreen: 'menu' }))}
                        >
                            Back to Menu
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="app-container">
            <div className="main-content">
                {/* Render the current screen */}
                {renderScreen()}

                {/* Level Up Popup */}
                {showLevelUpPopup && newLevelInfo && (
                    <LevelUpPopup
                        newLevel={newLevelInfo.level}
                        levelName={newLevelInfo.name}
                        pointsMultiplier={newLevelInfo.multiplier}
                        levelDifficulty={newLevelInfo.difficulty}
                        onContinue={handleContinueAfterLevelUp}
                    />
                )}
            </div>
        </div>
    );
};