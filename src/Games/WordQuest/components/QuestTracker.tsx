
import React from 'react';
import type {PlacedWord} from '../types';

interface QuestTrackerProps {
    subLevel: number;
    maxSubLevels: number;
    currentWords: PlacedWord[];
}

const QuestTracker: React.FC<QuestTrackerProps> = ({ subLevel, maxSubLevels, currentWords }) => {
    const foundCount = currentWords.filter(w => w.found).length;

    return (
        <aside className="game-sidebar">
            <div className="quest-tracker">
                <div className="quest-header">QUEST {subLevel} / {maxSubLevels}</div>
                <div className="progress-track">
                    <div
                        className="progress-fill"
                        style={{ width: `${(foundCount / currentWords.length) * 100}%` }}
                    ></div>
                </div>
            </div>
            <div className="words-scroll">
                {currentWords.map((pw, i) => (
                    <div key={i} className={`word-row ${pw.found ? 'found' : ''}`}>
                        <span className="status-dot"></span>
                        <span className="word-text">{pw.word}</span>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default QuestTracker;
