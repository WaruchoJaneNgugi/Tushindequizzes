import type { FC } from "react";
import { useState } from "react";
import "../styles/history-overlay.css";

interface HistoryOverlayProps {
    onClose: () => void;
}

const historyData = [
    { id: 1, game: 'Math Quiz',         date: 'Today, 10:30 AM',    points: 150,  status: 'won',  duration: '2:30' },
    { id: 2, game: 'Science Trivia',    date: 'Yesterday, 3:45 PM', points: 200,  status: 'won',  duration: '3:15' },
    { id: 3, game: 'History Challenge', date: 'Dec 12, 2:00 PM',    points: -50,  status: 'lost', duration: '4:10' },
    { id: 4, game: 'Geography Quiz',    date: 'Dec 11, 11:20 AM',   points: 100,  status: 'won',  duration: '2:45' },
    { id: 5, game: 'Literature Test',   date: 'Dec 10, 9:15 PM',    points: 75,   status: 'won',  duration: '3:30' },
    { id: 6, game: 'Sports Trivia',     date: 'Dec 9, 4:30 PM',     points: -30,  status: 'lost', duration: '2:15' },
    { id: 7, game: 'Movie Quiz',        date: 'Dec 8, 7:00 PM',     points: 180,  status: 'won',  duration: '3:45' },
    { id: 8, game: 'Music Challenge',   date: 'Dec 7, 1:45 PM',     points: 120,  status: 'won',  duration: '2:55' },
];

const GAME_ICONS: Record<string, string> = {
    'Math Quiz':         '➗',
    'Science Trivia':    '🔬',
    'History Challenge': '📜',
    'Geography Quiz':    '🌍',
    'Literature Test':   '📚',
    'Sports Trivia':     '⚽',
    'Movie Quiz':        '🎬',
    'Music Challenge':   '🎵',
};

const FILTERS = ['All Games', 'Wins Only', 'This Week', 'This Month'] as const;
type Filter = typeof FILTERS[number];

export const HistoryOverlay: FC<HistoryOverlayProps> = ({ onClose }) => {
    const [activeFilter, setActiveFilter] = useState<Filter>('All Games');
    const [search, setSearch] = useState('');

    const totalPoints = historyData.reduce((s, g) => s + g.points, 0);
    const wins        = historyData.filter(g => g.status === 'won').length;
    const winRate     = Math.round((wins / historyData.length) * 100);

    const filtered = historyData.filter(item => {
        const matchSearch = item.game.toLowerCase().includes(search.toLowerCase());
        const matchFilter =
            activeFilter === 'All Games' ? true :
            activeFilter === 'Wins Only' ? item.status === 'won' : true;
        return matchSearch && matchFilter;
    });

    return (
        <>
            <div className="hy-backdrop" onClick={onClose} />
            <div className="hy-shell">

                {/* ── TOPBAR ── */}
                <header className="hy-topbar">
                    <button className="hy-back" onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Back
                    </button>
                    <div className="hy-topbar-center">
                        <span className="hy-topbar-title">Game History</span>
                        <span className="hy-topbar-sub">Your gaming journey</span>
                    </div>
                    <button className="hy-export-btn" title="Export">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <path d="M12 16V8m0 8l-3-3m3 3 3-3M8 12H6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Export
                    </button>
                </header>

                {/* ── SUMMARY STRIP ── */}
                <div className="hy-summary">
                    <div className="hy-summary-item">
                        <span className="hy-summary-val">{historyData.length}</span>
                        <span className="hy-summary-lbl">Games</span>
                    </div>
                    <div className="hy-summary-sep"/>
                    <div className="hy-summary-item">
                        <span className="hy-summary-val">{wins}</span>
                        <span className="hy-summary-lbl">Wins</span>
                    </div>
                    <div className="hy-summary-sep"/>
                    <div className="hy-summary-item">
                        <span className="hy-summary-val hy-summary-val--accent">{winRate}%</span>
                        <span className="hy-summary-lbl">Win Rate</span>
                    </div>
                    <div className="hy-summary-sep"/>
                    <div className="hy-summary-item">
                        <span className={`hy-summary-val ${totalPoints >= 0 ? 'hy-pos' : 'hy-neg'}`}>
                            {totalPoints > 0 ? '+' : ''}{totalPoints}
                        </span>
                        <span className="hy-summary-lbl">Net Points</span>
                    </div>
                </div>

                {/* ── FILTER BAR ── */}
                <div className="hy-filterbar">
                    <div className="hy-filters">
                        {FILTERS.map(f => (
                            <button
                                key={f}
                                className={`hy-filter-btn ${activeFilter === f ? 'active' : ''}`}
                                onClick={() => setActiveFilter(f)}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <div className="hy-search">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M21 21l-4.35-4.35M19 11A8 8 0 1 1 3 11a8 8 0 0 1 16 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <input
                            className="hy-search-input"
                            type="text"
                            placeholder="Search…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                        {search && (
                            <button className="hy-search-clear" onClick={() => setSearch('')}>×</button>
                        )}
                    </div>
                </div>

                {/* ── LIST ── */}
                <div className="hy-body">
                    {filtered.length === 0 ? (
                        <div className="hy-empty">
                            <span>🔍</span>
                            <p>No games match your search.</p>
                        </div>
                    ) : (
                        <div className="hy-list">
                            {/* Column headers */}
                            <div className="hy-list-head">
                                <span className="hy-col hy-col--game">Game</span>
                                <span className="hy-col hy-col--date">Date</span>
                                <span className="hy-col hy-col--pts">Points</span>
                                <span className="hy-col hy-col--dur">Time</span>
                                <span className="hy-col hy-col--status">Result</span>
                            </div>

                            {filtered.map((item, i) => (
                                <div
                                    key={item.id}
                                    className={`hy-row ${item.status === 'won' ? 'hy-row--won' : 'hy-row--lost'}`}
                                    style={{ animationDelay: `${i * 30}ms` }}
                                >
                                    {/* Game */}
                                    <div className="hy-col hy-col--game">
                                        <div className="hy-game-icon">
                                            {GAME_ICONS[item.game] || '🎮'}
                                        </div>
                                        <div className="hy-game-info">
                                            <span className="hy-game-name">{item.game}</span>
                                            <span className="hy-game-type">Quiz Game</span>
                                        </div>
                                    </div>

                                    {/* Date */}
                                    <span className="hy-col hy-col--date hy-date">{item.date}</span>

                                    {/* Points */}
                                    <span className={`hy-col hy-col--pts hy-pts ${item.points > 0 ? 'hy-pos' : 'hy-neg'}`}>
                                        {item.points > 0 ? '+' : ''}{item.points}
                                    </span>

                                    {/* Duration */}
                                    <span className="hy-col hy-col--dur hy-dur">
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                            <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                        {item.duration}
                                    </span>

                                    {/* Status */}
                                    <span className={`hy-col hy-col--status hy-status hy-status--${item.status}`}>
                                        {item.status === 'won' ? '🏆 Won' : '💔 Lost'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── PAGINATION ── */}
                <footer className="hy-footer">
                    <button className="hy-page-btn" disabled>← Prev</button>
                    <span className="hy-page-info">Page 1 of 3</span>
                    <button className="hy-page-btn">Next →</button>
                </footer>

            </div>
        </>
    );
};
