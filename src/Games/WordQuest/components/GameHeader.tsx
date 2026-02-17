
import React, { useRef, useEffect, useState } from 'react';
import type {GameState} from '../types';

interface GameHeaderProps {
    gameState: GameState;
    totalPoints: number;
    isMuted: boolean;
    onQuit: () => void;
    onHint: () => void;
    onToggleMute: () => void;
    onShowHowTo: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
                                                   gameState,
                                                   totalPoints,
                                                   isMuted,
                                                   onQuit,
                                                   onHint,
                                                   onToggleMute,
                                                   onShowHowTo
                                               }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setIsSettingsOpen(false);
            }
        };
        if (isSettingsOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isSettingsOpen]);

    const displayedScore = totalPoints + gameState.score;

    return (
        <header className="game-navbar">
            <div className="nav-left">
                <button className="nav-icon-btn" onClick={onQuit}>
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                <div className="nav-meta">
                    <span className="nav-cat">{gameState.category.name}</span>
                    <span className="nav-diff">{gameState.difficulty}</span>
                </div>
            </div>

            <div className="nav-stats">
                <div className="stat-pill score-pill">
                    <span className="label">TOTAL POINTS</span>
                    <span className="val">{displayedScore}</span>
                </div>
            </div>

            <div className="nav-right">
                <button className="nav-icon-btn" onClick={onHint} disabled={gameState.status !== 'PLAYING'}>
                    <i className="fa-solid fa-lightbulb"></i>
                </button>
                <div className="settings-wrapper" ref={settingsRef}>
                    <button
                        className={`nav-icon-btn ${isSettingsOpen ? 'active' : ''}`}
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    >
                        <i className="fa-solid fa-cog"></i>
                    </button>
                    {isSettingsOpen && (
                        <div className="settings-dropdown">
                            <button className="dropdown-item" onClick={() => { onToggleMute(); setIsSettingsOpen(false); }}>
                                <i className={`fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'}`}></i>
                                {isMuted ? 'Unmute' : 'Mute'}
                            </button>
                            <button className="dropdown-item" onClick={() => { onShowHowTo(); setIsSettingsOpen(false); }}>
                                <i className="fa-solid fa-circle-question"></i>
                                How to Play
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default GameHeader;
