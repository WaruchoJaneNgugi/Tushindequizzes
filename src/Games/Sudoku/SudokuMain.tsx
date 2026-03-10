import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

import { ArrowLeft } from 'lucide-react';
import {useSudoku} from "./hooks/useSudoku.ts";
import {soundEngine} from "./utils/sound.ts";
import {SettingsDropdown} from "./components/SettingsDropdown.tsx";
import {CanvasGame} from "./components/CanvasGame.tsx";
import {Message} from "./components/Message.tsx";
import {HowToPlayModal} from "./components/HowToPlayModal.tsx";
import {NewGameModal} from "./components/NewGameModal.tsx";
import {CongratsModal} from "./components/CongratsModal.tsx";
import {useGameStore} from "../../Store/gameStore.ts";



export function SudokuMain() {
    const {
        board,
        selected,
        setSelected,
        difficulty,
        stage,
        unlockedLevels,
        score,
        startNewGame,
        replayGame,
        nextStage,
        handleInput,
        handleErase,
        handleHint,
        hasConflict,
        isRelated,
        isSameValue,
        isComplete,
        hintedCell
    } = useSudoku();
    const {setShowGameOverlay} = useGameStore();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
    const [isNewGameOpen, setIsNewGameOpen] = useState(false);
    const [canvasWidth, setCanvasWidth] = useState<number | undefined>(undefined);

    useEffect(() => {
        soundEngine.setMuted(isMuted);
    }, [isMuted]);

    useEffect(() => {
        if (isComplete) {
            soundEngine.playWin();
            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#2563eb', '#3b82f6', '#60a5fa', '#fef08a', '#fde047']
            });
        }
    }, [isComplete]);
    const handleClose = () => {
        const shouldClose = true;

        if (shouldClose) {
            setShowGameOverlay(false);

        }
    };

    const handleNextLevel = () => {
        nextStage();
    };

    const handleReplay = () => {
        replayGame();
    };

    // const handleExit = () => {
    //     if (onExit) {
    //         onExit();
    //     } else {
    //         // Default fallback if no onExit is provided
    //         window.location.href = '/';
    //     }
    // };

    const STAGES_PER_LEVEL = {
        Easy: 3,
        Medium: 6,
        Hard: 10
    };

    return (
        <div className="sudoku-wrapper">
            <div className="sudoku-card">

                {/* Header */}
                <div className="sudoku-header sudoku-header-dynamic" style={{ width: canvasWidth ? `${canvasWidth}px` : '100%' }}>
                    <div className="sudoku-header-title" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                            onClick={handleClose}
                            className="sudoku-icon-btn"
                            style={{ padding: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            aria-label="Exit game"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <h1 style={{ margin: 0, lineHeight: 1 }}>Sudoku</h1>
                            <span>{difficulty} - Stage {stage}/{STAGES_PER_LEVEL[difficulty]}</span>
                        </div>
                    </div>
                    <div className="sudoku-header-actions">
                        <button
                            onClick={() => setIsNewGameOpen(true)}
                            className="sudoku-btn-new-game"
                        >
                            {difficulty}
                        </button>
                        <SettingsDropdown
                            isSettingsOpen={isSettingsOpen}
                            setIsSettingsOpen={setIsSettingsOpen}
                            isMuted={isMuted}
                            setIsMuted={setIsMuted}
                            setIsHowToPlayOpen={setIsHowToPlayOpen}
                        />
                    </div>
                </div>

                <div className="sudoku-canvas-wrapper">
                    {board && board.length > 0 ? (
                        <CanvasGame
                            board={board}
                            selected={selected}
                            setSelected={setSelected}
                            hasConflict={hasConflict}
                            isSameValue={isSameValue}
                            isRelated={isRelated}
                            handleHint={handleHint}
                            handleInput={handleInput}
                            handleErase={handleErase}
                            score={score}
                            hintedCell={hintedCell}
                            onWidthChange={setCanvasWidth}
                        />
                    ) : (
                        <div className="sudoku-loading">
                            Loading...
                        </div>
                    )}
                </div>

                <div className="sudoku-message-wrapper" style={{ width: canvasWidth ? `${canvasWidth}px` : '100%' }}>
                    <Message isComplete={isComplete ?? false} difficulty={difficulty} stage={stage} />
                </div>
            </div>

            <HowToPlayModal
                isOpen={isHowToPlayOpen}
                onClose={() => setIsHowToPlayOpen(false)}
            />

            <NewGameModal
                isOpen={isNewGameOpen}
                onClose={() => setIsNewGameOpen(false)}
                onStart={startNewGame}
                unlockedLevels={unlockedLevels}
                score={score}
            />

            <CongratsModal
                isOpen={isComplete ?? false}
                onNext={handleNextLevel}
                onReplay={handleReplay}
            />
        </div>
    );
}
