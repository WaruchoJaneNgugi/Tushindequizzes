import { useAuth } from "../hooks/useAuth";
import type { FC } from "react";
import { useState } from "react";
import { useLeaderboard } from "../hooks/useLeaderboard";
import "../styles/leaderboard-overlay.css";
import type { LeaderboardPeriod } from "../Store/leaderboardService.ts";

interface LeaderboardOverlayProps {
    onClose: () => void;
    gameId?: string;
}

const PERIOD_CONFIG: { key: LeaderboardPeriod; label: string; icon: string }[] = [
    { key: 'daily',    label: 'Today',    icon: '☀️' },
    { key: 'weekly',   label: 'Week',     icon: '📅' },
    { key: 'monthly',  label: 'Month',    icon: '🗓️' },
    { key: 'all_time', label: 'All Time', icon: '🏛️' },
];

const MEDAL = ['🥇', '🥈', '🥉'];

export const LeaderboardOverlay: FC<LeaderboardOverlayProps> = ({ onClose, gameId = 'default' }) => {
    const { user } = useAuth();
    const {
        leaderboardData,
        pagination,
        loading,
        error,
        currentPeriod,
        userRank,
        changePeriod,
        goToPage,
        refresh
    } = useLeaderboard(gameId);

    const [showFullscreen, setShowFullscreen] = useState(false);

    const currentUserEntry = leaderboardData.find(e => e.userId === user?.id);
    const top3 = leaderboardData.slice(0, 3);
    const rest = leaderboardData.slice(3);

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <>
            <div className="lb-backdrop" onClick={onClose} />

            <div className={`lb-shell ${showFullscreen ? 'lb-shell--full' : ''}`}>

                {/* ── TOP BAR ── */}
                <header className="lb-topbar">
                    <button className="lb-back" onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Back
                    </button>

                    <div className="lb-topbar-center">
                        <span className="lb-live-dot" />
                        <span className="lb-topbar-label">LEADERBOARD</span>
                    </div>

                    <div className="lb-topbar-actions">
                        <button className="lb-icon-btn" onClick={() => setShowFullscreen(v => !v)} title="Toggle fullscreen">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                {showFullscreen
                                    ? <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    : <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                }
                            </svg>
                        </button>
                        <button className="lb-icon-btn" onClick={refresh} disabled={loading} title="Refresh">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={loading ? 'lb-spin' : ''}>
                                <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </header>

                {/* ── PERIOD TABS ── */}
                <nav className="lb-periods">
                    {PERIOD_CONFIG.map(p => (
                        <button
                            key={p.key}
                            className={`lb-period-btn ${currentPeriod === p.key ? 'active' : ''}`}
                            onClick={() => changePeriod(p.key)}
                            disabled={loading}
                        >
                            <span className="lb-period-icon">{p.icon}</span>
                            <span>{p.label}</span>
                        </button>
                    ))}
                </nav>

                {/* ── SCROLLABLE BODY ── */}
                <div className="lb-body">

                    {/* Quick stats row */}
                    <div className="lb-meta-row">
                        <div className="lb-meta-pill">
                            <span className="lb-meta-lbl">Your Rank</span>
                            <span className="lb-meta-val lb-meta-val--accent">
                                {userRank ? `#${userRank.rank}` : currentUserEntry ? `#${currentUserEntry.rank}` : '—'}
                            </span>
                        </div>
                        <div className="lb-meta-sep"/>
                        <div className="lb-meta-pill">
                            <span className="lb-meta-lbl">Players</span>
                            <span className="lb-meta-val">{pagination.total.toLocaleString()}</span>
                        </div>
                        {pagination.pages > 1 && (
                            <>
                                <div className="lb-meta-sep"/>
                                <div className="lb-meta-pill">
                                    <span className="lb-meta-lbl">Page</span>
                                    <span className="lb-meta-val">{pagination.page}/{pagination.pages}</span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="lb-error">
                            <span>⚠️ {error}</span>
                            <button onClick={refresh}>Retry</button>
                        </div>
                    )}

                    {/* Loading */}
                    {loading && leaderboardData.length === 0 && (
                        <div className="lb-loading">
                            <div className="lb-spinner"/>
                            <p>Loading leaderboard…</p>
                        </div>
                    )}

                    {!loading && leaderboardData.length > 0 && (
                        <>
                            {/* ── PODIUM (top 3) — only on first page ── */}
                            {pagination.page === 1 && top3.length > 0 && (
                                <div className="lb-podium">
                                    {/* Reorder: 2nd, 1st, 3rd */}
                                    {[top3[1], top3[0], top3[2]].map((player, visualIdx) => {
                                        if (!player) return null;
                                        const podiumRank = [2, 1, 3][visualIdx];
                                        const isCenter = visualIdx === 1;
                                        const isMe = player.userId === user?.id;
                                        return (
                                            <div
                                                key={player.userId}
                                                className={`lb-podium-slot lb-podium-slot--${podiumRank} ${isMe ? 'lb-podium-slot--me' : ''}`}
                                            >
                                                <div className="lb-podium-medal">{MEDAL[podiumRank - 1]}</div>
                                                <div className={`lb-podium-avatar ${isCenter ? 'lb-podium-avatar--center' : ''}`}>
                                                    {player.username?.charAt(0).toUpperCase() || '?'}
                                                    {isMe && <span className="lb-podium-you">YOU</span>}
                                                </div>
                                                <div className="lb-podium-name">{player.username}</div>
                                                <div className="lb-podium-score">{player.score.toLocaleString()}</div>
                                                <div className="lb-podium-winrate">{player.winRate.toFixed(1)}% WR</div>
                                                <div className={`lb-podium-base lb-podium-base--${podiumRank}`}>{podiumRank}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* ── RANKED TABLE ── */}
                            <div className="lb-table">
                                <div className="lb-table-head">
                                    <span className="lb-col lb-col--rank">Rank</span>
                                    <span className="lb-col lb-col--player">Player</span>
                                    <span className="lb-col lb-col--score">Score</span>
                                    <span className="lb-col lb-col--wl">W / L</span>
                                    <span className="lb-col lb-col--wr">Win Rate</span>
                                </div>

                                {(pagination.page === 1 ? rest : leaderboardData).map((player, i) => {
                                    const isMe = player.userId === user?.id;
                                    return (
                                        <div
                                            key={player.userId}
                                            className={`lb-row ${isMe ? 'lb-row--me' : ''} ${i % 2 === 0 ? 'lb-row--even' : ''}`}
                                        >
                                            <span className="lb-col lb-col--rank">
                                                <span className="lb-rank-num">#{player.rank}</span>
                                            </span>
                                            <span className="lb-col lb-col--player">
                                                <div className="lb-avatar">{player.username?.charAt(0).toUpperCase() || '?'}</div>
                                                <div className="lb-player-info">
                                                    <span className="lb-player-name">{player.username}</span>
                                                    {isMe && <span className="lb-you-tag">YOU</span>}
                                                </div>
                                            </span>
                                            <span className="lb-col lb-col--score lb-score">{player.score.toLocaleString()}</span>
                                            <span className="lb-col lb-col--wl">
                                                <span className="lb-wins">{player.wins}W</span>
                                                <span className="lb-slash">/</span>
                                                <span className="lb-losses">{player.losses}L</span>
                                            </span>
                                            <span className="lb-col lb-col--wr">
                                                <div className="lb-wr-bar">
                                                    <div className="lb-wr-fill" style={{ width: `${Math.min(player.winRate, 100)}%` }}/>
                                                </div>
                                                <span className="lb-wr-text">{player.winRate.toFixed(1)}%</span>
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* ── PAGINATION ── */}
                            {pagination.pages > 1 && (
                                <div className="lb-pagination">
                                    <button
                                        className="lb-page-btn"
                                        onClick={() => goToPage(pagination.page - 1)}
                                        disabled={pagination.page === 1 || loading}
                                    >
                                        ← Prev
                                    </button>
                                    <div className="lb-page-dots">
                                        {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
                                            const pg = i + 1;
                                            return (
                                                <button
                                                    key={pg}
                                                    className={`lb-page-dot ${pagination.page === pg ? 'active' : ''}`}
                                                    onClick={() => goToPage(pg)}
                                                    disabled={loading}
                                                >
                                                    {pg}
                                                </button>
                                            );
                                        })}
                                        {pagination.pages > 7 && <span className="lb-page-ellipsis">…</span>}
                                    </div>
                                    <button
                                        className="lb-page-btn"
                                        onClick={() => goToPage(pagination.page + 1)}
                                        disabled={pagination.page === pagination.pages || loading}
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {!loading && leaderboardData.length === 0 && !error && (
                        <div className="lb-empty">
                            <span>🏆</span>
                            <p>No data for this period yet. Be the first to play!</p>
                        </div>
                    )}
                </div>

                {/* ── STICKY YOUR STATS FOOTER ── */}
                {user && (currentUserEntry || userRank) && (
                    <footer className="lb-footer">
                        <div className="lb-footer-badge">
                            <span className="lb-footer-rank">
                                #{currentUserEntry?.rank || userRank?.rank || '?'}
                            </span>
                            <span className="lb-footer-label">Your Rank</span>
                        </div>
                        <div className="lb-footer-divider"/>
                        <div className="lb-footer-stat">
                            <span className="lb-footer-stat-val lb-footer-score">
                                {(currentUserEntry?.score || userRank?.score || 0).toLocaleString()}
                            </span>
                            <span className="lb-footer-stat-lbl">Score</span>
                        </div>
                        <div className="lb-footer-divider"/>
                        <div className="lb-footer-stat">
                            <span className="lb-footer-stat-val">
                                <span className="lb-wins">{currentUserEntry?.wins ?? 0}</span>
                                <span className="lb-slash"> / </span>
                                <span className="lb-losses">{currentUserEntry?.losses ?? 0}</span>
                            </span>
                            <span className="lb-footer-stat-lbl">W / L</span>
                        </div>
                        <div className="lb-footer-divider"/>
                        <div className="lb-footer-stat">
                            <span className="lb-footer-stat-val">{currentUserEntry?.winRate.toFixed(1) ?? '0.0'}%</span>
                            <span className="lb-footer-stat-lbl">Win Rate</span>
                        </div>
                        {currentUserEntry?.lastPlayed && (
                            <>
                                <div className="lb-footer-divider lb-footer-divider--hide-sm"/>
                                <div className="lb-footer-stat lb-footer-stat--hide-sm">
                                    <span className="lb-footer-stat-val lb-footer-date">{formatDate(currentUserEntry.lastPlayed)}</span>
                                    <span className="lb-footer-stat-lbl">Last Played</span>
                                </div>
                            </>
                        )}
                    </footer>
                )}
            </div>
        </>
    );
};
