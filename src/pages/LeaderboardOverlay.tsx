import {useAuth} from "../hooks/useAuth.ts";
import type {FC} from "react";
import "../styles/featureoverlay.css"

interface LeaderboardOverlayProps {
    onClose: () => void;
}

export const LeaderboardOverlay: FC<LeaderboardOverlayProps> = ({ onClose }) => {
    const { user } = useAuth();

    // Mock data - replace with actual API call
    const leaderboardData = [
        { rank: 1, name: 'Alex Johnson', points: 12500, games: 48 },
        { rank: 2, name: 'Maria Garcia', points: 11200, games: 42 },
        { rank: 3, name: 'David Chen', points: 9800, games: 39 },
        { rank: 4, name: user?.username || 'You', points: user?.pointsBalance || 0, games: 35, isCurrentUser: true },
        { rank: 5, name: 'Emma Wilson', points: 7500, games: 30 },
        { rank: 6, name: 'James Brown', points: 7200, games: 28 },
        { rank: 7, name: 'Sophia Lee', points: 6800, games: 26 },
        { rank: 8, name: 'Michael Wang', points: 6500, games: 24 },
        { rank: 9, name: 'Olivia Taylor', points: 6200, games: 23 },
        { rank: 10, name: 'Daniel Martinez', points: 5900, games: 22 },
    ];

    return (
        <>
            <div className="overlay-overlay" onClick={onClose} />
            <div className="feature-overlay">
                <div className="feature-overlay-header">
                    <div className="feature-header-left">
                        <button className="feature-back-button" onClick={onClose}>
                            <svg className="back-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            {/*<span className="back-text">Back</span>*/}
                        </button>
                    </div>
                    <div className="feature-header-center">
                        <h2 className="feature-title">Leaderboard</h2>
                        <p className="feature-subtitle">Top Players This Week</p>
                    </div>
                    <div className="feature-header-right">
                        <button className="feature-action-button">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M10 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button className="feature-action-button">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.325 4.317C10.751 2.561 13.249 2.561 13.675 4.317C13.858 5.151 14.63 5.736 15.483 5.736C17.324 5.736 18.02 7.499 16.707 8.597C16.014 9.181 15.733 10.107 16.016 10.941C16.442 12.697 14.816 14.168 13.297 13.317C12.589 12.941 11.411 12.941 10.703 13.317C9.184 14.168 7.558 12.697 7.984 10.941C8.267 10.107 7.986 9.181 7.293 8.597C5.98 7.499 6.676 5.736 8.517 5.736C9.37 5.736 10.142 5.151 10.325 4.317Z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M15 19C15 19.7956 14.6839 20.5587 14.1213 21.1213C13.5587 21.6839 12.7956 22 12 22C11.2044 22 10.4413 21.6839 9.87868 21.1213C9.31607 20.5587 9 19.7956 9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="feature-overlay-content">
                    <div className="leaderboard-container">
                        <div className="leaderboard-header">
                            <div className="leaderboard-filters">
                                <button className="filter-btn active">Weekly</button>
                                <button className="filter-btn">Monthly</button>
                                <button className="filter-btn">All Time</button>
                            </div>
                            <div className="leaderboard-stats">
                                <div className="stat-item">
                                    <span className="stat-label">Your Rank</span>
                                    <span className="stat-value">#4</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">Total Players</span>
                                    <span className="stat-value">1,247</span>
                                </div>
                            </div>
                        </div>

                        <div className="leaderboard-list">
                            <div className="leaderboard-row header">
                                <div className="rank-col">Rank</div>
                                <div className="name-col">Player</div>
                                <div className="points-col">Points</div>
                                <div className="games-col">Games</div>
                            </div>
                            {leaderboardData.map((player) => (
                                <div
                                    key={player.rank}
                                    className={`leaderboard-row ${player.isCurrentUser ? 'current-user' : ''}`}
                                >
                                    <div className="rank-col">
                                        {player.rank <= 3 ? (
                                            <span className={`rank-badge rank-${player.rank}`}>
                                                {player.rank}
                                            </span>
                                        ) : (
                                            <span className="rank-number">{player.rank}</span>
                                        )}
                                    </div>
                                    <div className="name-col">
                                        <div className="player-info">
                                            <div className="player-avatar">
                                                {player.name.charAt(0)}
                                            </div>
                                            <div className="player-details">
                                                <span className="player-name">{player.name}</span>
                                                {player.isCurrentUser && (
                                                    <span className="player-tag">You</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="points-col">
                                        <span className="points-value">{player.points.toLocaleString()}</span>
                                    </div>
                                    <div className="games-col">
                                        <span className="games-count">{player.games}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="leaderboard-footer">
                            <div className="current-user-highlight">
                                <div className="current-user-rank">
                                    <span className="current-rank-label">Your Position</span>
                                    <span className="current-rank-value">#4</span>
                                </div>
                                <div className="current-user-points">
                                    <span className="current-points-label">Your Points</span>
                                    <span className="current-points-value">{user?.pointsBalance || 0}</span>
                                </div>
                                <button className="btn-view-all">
                                    View Full Leaderboard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};