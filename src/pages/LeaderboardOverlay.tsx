import { useAuth } from "../hooks/useAuth";
import type { FC } from "react";
import { useState } from "react";
import { useLeaderboard } from "../hooks/useLeaderboard";
import "../styles/featureoverlay.css";
import type {LeaderboardPeriod} from "../Store/leaderboardService.ts";

interface LeaderboardOverlayProps {
    onClose: () => void;
    gameId?: string;
}

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

    const handlePeriodChange = (period: LeaderboardPeriod) => {
        changePeriod(period);
    };

    const formatPeriodLabel = (period: string): string => {
        switch(period) {
            case 'daily': return 'Daily';
            case 'weekly': return 'Weekly';
            case 'monthly': return 'Monthly';
            case 'all_time': return 'All Time';
            default: return period;
        }
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Find current user in leaderboard data
    const currentUserEntry = leaderboardData.find(entry => entry.userId === user?.id);

    return (
        <>
            <div className="overlay-overlay" onClick={onClose} />
            <div className={`feature-overlay ${showFullscreen ? 'fullscreen' : ''}`}>
                <div className="feature-overlay-header">
                    <div className="feature-header-left">
                        <button className="feature-back-button" onClick={onClose}>
                            <svg className="back-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <div className="feature-header-center">
                        <h2 className="feature-title">Leaderboard</h2>
                        <p className="feature-subtitle">Top Players - {formatPeriodLabel(currentPeriod)}</p>
                    </div>
                    <div className="feature-header-right">
                        <button className="feature-action-button" onClick={() => setShowFullscreen(!showFullscreen)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button className="feature-action-button" onClick={refresh} disabled={loading}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23 4V10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M1 20V14H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M3.51 9C4.0177 7.56686 4.8794 6.28546 6.01545 5.27541C7.1515 4.26535 8.52172 3.56385 10.0008 3.24489C11.4799 2.92593 13.0168 3.00136 14.4569 3.46381C15.8971 3.92626 17.1899 4.7563 18.21 5.87L23 10M1 14L5.79 18.13C6.8101 19.2437 8.1029 20.0737 9.54305 20.5362C10.9832 20.9986 12.5201 21.0741 13.9992 20.7551C15.4783 20.4362 16.8485 19.7347 17.9846 18.7246C19.1206 17.7145 19.9823 16.4331 20.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="feature-overlay-content">
                    <div className="leaderboard-container">
                        {/* Header with filters and stats */}
                        <div className="leaderboard-header">
                            <div className="leaderboard-filters">
                                {(['daily', 'weekly', 'monthly', 'all_time'] as LeaderboardPeriod[]).map(period => (
                                    <button
                                        key={period}
                                        className={`filter-btn ${currentPeriod === period ? 'active' : ''}`}
                                        onClick={() => handlePeriodChange(period)}
                                        disabled={loading}
                                    >
                                        {formatPeriodLabel(period)}
                                    </button>
                                ))}
                            </div>

                            <div className="leaderboard-stats">
                                <div className="stat-item">
                                    <span className="stat-label">Your Rank</span>
                                    <span className="stat-value">
                                        {userRank ? `#${userRank.rank}` : currentUserEntry ? `#${currentUserEntry.rank}` : '-'}
                                    </span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Total Players</span>
                                    <span className="stat-value">{pagination.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                <p>Loading leaderboard...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="error-container">
                                <p className="error-message">{error}</p>
                                <button onClick={refresh} className="retry-button">
                                    Try Again
                                </button>
                            </div>
                        )}

                        {/* Leaderboard List */}
                        {!loading && !error && (
                            <>
                                <div className="leaderboard-list">
                                    <div className="leaderboard-row header">
                                        <div className="rank-col">Rank</div>
                                        <div className="name-col">Player</div>
                                        <div className="score-col">Score</div>
                                        <div className="stats-col">W/L</div>
                                        <div className="winrate-col">Win Rate</div>
                                    </div>

                                    {leaderboardData.length > 0 ? (
                                        leaderboardData.map((player) => (
                                            <div
                                                key={player.userId}
                                                className={`leaderboard-row ${player.userId === user?.id ? 'current-user' : ''}`}
                                            >
                                                <div className="rank-col">
                                                    {player.rank <= 3 ? (
                                                        <span className={`rank-badge rank-${player.rank}`}>
                                                            {player.rank === 1 && '🥇'}
                                                            {player.rank === 2 && '🥈'}
                                                            {player.rank === 3 && '🥉'}
                                                        </span>
                                                    ) : (
                                                        <span className="rank-number">#{player.rank}</span>
                                                    )}
                                                </div>

                                                <div className="name-col">
                                                    <div className="player-info">
                                                        <div className="player-avatar">
                                                            {player.username?.charAt(0).toUpperCase() || '?'}
                                                        </div>
                                                        <div className="player-details">
                                                            <span className="player-name">{player.username}</span>
                                                            {player.userId === user?.id && (
                                                                <span className="player-tag">You</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="score-col">
                                                    <span className="score-value">{player.score.toLocaleString()}</span>
                                                </div>

                                                <div className="stats-col">
                                                    <span className="stats-value">
                                                        {player.wins}/{player.losses}
                                                    </span>
                                                </div>

                                                <div className="winrate-col">
                                                    <span className="winrate-value">{player.winRate.toFixed(1)}%</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="empty-state">
                                            <p>No leaderboard data available for this period.</p>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination */}
                                {pagination.pages > 1 && (
                                    <div className="pagination">
                                        <button
                                            className="pagination-btn"
                                            onClick={() => goToPage(pagination.page - 1)}
                                            disabled={pagination.page === 1 || loading}
                                        >
                                            ← Prev
                                        </button>

                                        <span className="pagination-info">
                                            Page {pagination.page} of {pagination.pages}
                                        </span>

                                        <button
                                            className="pagination-btn"
                                            onClick={() => goToPage(pagination.page + 1)}
                                            disabled={pagination.page === pagination.pages || loading}
                                        >
                                            Next →
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {/* User Stats Footer */}
                        {user && (currentUserEntry || userRank) && (
                            <div className="leaderboard-footer">
                                <div className="current-user-highlight">
                                    <div className="current-user-rank">
                                        <span className="current-rank-label">Your Position</span>
                                        <span className="current-rank-value">
                                            #{currentUserEntry?.rank || userRank?.rank || '-'}
                                        </span>
                                    </div>
                                    <div className="current-user-stats">
                                        <div className="current-stat">
                                            <span className="current-stat-label">Score</span>
                                            <span className="current-stat-value">
                                                {currentUserEntry?.score.toLocaleString() || userRank?.score.toLocaleString() || 0}
                                            </span>
                                        </div>
                                        <div className="current-stat">
                                            <span className="current-stat-label">W/L</span>
                                            <span className="current-stat-value">
                                                {currentUserEntry ? `${currentUserEntry.wins}/${currentUserEntry.losses}` : '0/0'}
                                            </span>
                                        </div>
                                        <div className="current-stat">
                                            <span className="current-stat-label">Win Rate</span>
                                            <span className="current-stat-value">
                                                {currentUserEntry ? `${currentUserEntry.winRate.toFixed(1)}%` : '0%'}
                                            </span>
                                        </div>
                                    </div>
                                    {currentUserEntry?.lastPlayed && (
                                        <div className="last-played">
                                            Last played: {formatDate(currentUserEntry.lastPlayed)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};