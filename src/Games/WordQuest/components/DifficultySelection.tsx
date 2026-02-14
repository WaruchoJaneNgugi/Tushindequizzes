
import React, { useState, useRef, useEffect } from 'react';
import { Difficulty } from '../types';

interface DifficultySelectionProps {
    difficulty: Difficulty;
    unlockedDifficulties: Difficulty[];
    difficultyOrder: Difficulty[];
    onSelect: (diff: Difficulty) => void;
}

const DifficultySelection: React.FC<DifficultySelectionProps> = ({
                                                                     difficulty,
                                                                     unlockedDifficulties,
                                                                     difficultyOrder,
                                                                     onSelect
                                                                 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleToggle = () => setIsOpen(!isOpen);

    const handleSelect = (diff: Difficulty) => {
        if (unlockedDifficulties.includes(diff)) {
            onSelect(diff);
            setIsOpen(false);
        }
    };

    return (
        <div className="selection-group" ref={containerRef}>
            <label>DIFFICULTY</label>
            <div className="custom-dropdown-wrapper">
                <button
                    className={`difficulty-trigger ${isOpen ? 'active' : ''}`}
                    onClick={handleToggle}
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <span className="current-val">{difficulty}</span>
                    <i className={`fa-solid fa-chevron-down select-icon ${isOpen ? 'rotate' : ''}`}></i>
                </button>

                {isOpen && (
                    <div className="difficulty-options-list" role="listbox">
                        {difficultyOrder.map(diff => {
                            const isUnlocked = unlockedDifficulties.includes(diff);
                            const isSelected = difficulty === diff;

                            return (
                                <button
                                    key={diff}
                                    className={`difficulty-option-item ${isSelected ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`}
                                    onClick={() => handleSelect(diff)}
                                    disabled={!isUnlocked}
                                    role="option"
                                    aria-selected={isSelected}
                                >
                                    <div className="option-content">
                                        {!isUnlocked && <i className="fa-solid fa-lock mr-2 lock-icon"></i>}
                                        <span>{diff}</span>
                                    </div>
                                    {isSelected && <i className="fa-solid fa-check check-mark"></i>}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DifficultySelection;
