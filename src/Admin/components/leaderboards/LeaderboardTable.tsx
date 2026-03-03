// components/leaderboards/LeaderboardTable.tsx
import type { LeaderboardEntry } from '../../types/adminTypes';

interface LeaderboardTableProps {
    leaderboard: LeaderboardEntry[];
}

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

export const LeaderboardTable = ({ leaderboard }: LeaderboardTableProps) => {
    if (leaderboard.length === 0) {
        return (
            <div className="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
                <p className="empty-title">No leaderboard data</p>
                <p className="empty-sub">Scores will appear here once players compete</p>
            </div>
        );
    }

    return (
        <div className="table-scroll">
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Score</th>
                        <th>Wins</th>
                        <th>Losses</th>
                        <th>Period</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((entry: LeaderboardEntry, i: number) => {
                        const rank = entry.rank ?? i + 1;
                        const username = entry.username || entry.user?.username || entry.userId;
                        const initial = (username || 'U').charAt(0).toUpperCase();
                        const gradients = [
                            'linear-gradient(135deg,#fbbf24,#d97706)',
                            'linear-gradient(135deg,#94a3b8,#64748b)',
                            'linear-gradient(135deg,#d97706,#92400e)',
                        ];

                        return (
                            <tr key={entry.userId || i}>
                                <td>
                                    <span className={`rank-badge rank-${rank <= 3 ? rank : 'other'}`}>
                                        {rank <= 3 ? RANK_MEDALS[rank - 1] : `#${rank}`}
                                    </span>
                                </td>
                                <td>
                                    <div className="user-cell">
                                        <div
                                            className="user-mini-avatar"
                                            style={{ background: gradients[rank - 1] || 'linear-gradient(135deg,#3b82f6,#06b6d4)' }}
                                        >
                                            {initial}
                                        </div>
                                        <div>
                                            <div className="user-cell-name">{username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-light)' }}>
                                        {(entry.score ?? 0).toLocaleString()}
                                    </strong>
                                </td>
                                <td>{entry.wins ?? '—'}</td>
                                <td>{entry.losses ?? '—'}</td>
                                <td>
                                    <span className="badge badge-blue">{entry.period || 'all_time'}</span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
