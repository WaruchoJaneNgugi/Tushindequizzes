import type {FC} from "react";
import "../styles/featureoverlay.css"

interface HistoryOverlayProps {
    onClose: () => void;
}

export const HistoryOverlay: FC<HistoryOverlayProps> = ({ onClose }) => {

    // Mock history data
    const historyData = [
        { id: 1, game: 'Math Quiz', date: 'Today, 10:30 AM', points: 150, status: 'won', duration: '2:30' },
        { id: 2, game: 'Science Trivia', date: 'Yesterday, 3:45 PM', points: 200, status: 'won', duration: '3:15' },
        { id: 3, game: 'History Challenge', date: 'Dec 12, 2:00 PM', points: -50, status: 'lost', duration: '4:10' },
        { id: 4, game: 'Geography Quiz', date: 'Dec 11, 11:20 AM', points: 100, status: 'won', duration: '2:45' },
        { id: 5, game: 'Literature Test', date: 'Dec 10, 9:15 PM', points: 75, status: 'won', duration: '3:30' },
        { id: 6, game: 'Sports Trivia', date: 'Dec 9, 4:30 PM', points: -30, status: 'lost', duration: '2:15' },
        { id: 7, game: 'Movie Quiz', date: 'Dec 8, 7:00 PM', points: 180, status: 'won', duration: '3:45' },
        { id: 8, game: 'Music Challenge', date: 'Dec 7, 1:45 PM', points: 120, status: 'won', duration: '2:55' },
    ];
    //
    // const stats = {
    //     totalGames: 42,
    //     wins: 28,
    //     losses: 14,
    //     totalPoints: 1850,
    //     avgPoints: 44,
    //     winRate: '67%'
    // };

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
                        <h2 className="feature-title">Game History</h2>
                        <p className="feature-subtitle">Your gaming journey</p>
                    </div>
                    {/*<div className="feature-header-right">*/}
                    {/*    /!*<button className="feature-action-button">*!/*/}
                    {/*    /!*    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*!/*/}
                    {/*    /!*        <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*!/*/}
                    {/*    /!*        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*!/*/}
                    {/*    /!*        <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*!/*/}
                    {/*    /!*    </svg>*!/*/}
                    {/*    /!*</button>*!/*/}
                    {/*    /!*<button className="feature-action-button">*!/*/}
                    {/*    /!*    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*!/*/}
                    {/*    /!*        <path d="M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z" stroke="currentColor" strokeWidth="2"/>*!/*/}
                    {/*    /!*        <path d="M12 16V12L15 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>*!/*/}
                    {/*    /!*    </svg>*!/*/}
                    {/*    /!*</button>*!/*/}
                    {/*</div>*/}
                </div>

                <div className="feature-overlay-content">
                    <div className="history-container">
                        {/*<div className="history-stats">*/}
                        {/*    <div className="stat-card">*/}
                        {/*        <div className="stat-icon">🎮</div>*/}
                        {/*        <div className="stat-info">*/}
                        {/*            <h4 className="stat-label">Total Games</h4>*/}
                        {/*            <p className="stat-value">{stats.totalGames}</p>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*    <div className="stat-card">*/}
                        {/*        <div className="stat-icon">🏆</div>*/}
                        {/*        <div className="stat-info">*/}
                        {/*            <h4 className="stat-label">Wins</h4>*/}
                        {/*            <p className="stat-value">{stats.wins} ({stats.winRate})</p>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*    <div className="stat-card">*/}
                        {/*        <div className="stat-icon">📈</div>*/}
                        {/*        <div className="stat-info">*/}
                        {/*            <h4 className="stat-label">Total Points</h4>*/}
                        {/*            <p className="stat-value">{stats.totalPoints}</p>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*    <div className="stat-card">*/}
                        {/*        <div className="stat-icon">⏱️</div>*/}
                        {/*        <div className="stat-info">*/}
                        {/*            <h4 className="stat-label">Avg Points</h4>*/}
                        {/*            <p className="stat-value">{stats.avgPoints}</p>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        <div className="history-filters">
                            <div className="filter-group">
                                <button className="filter-btn active">All Games</button>
                                <button className="filter-btn">Wins Only</button>
                                <button className="filter-btn">This Week</button>
                                <button className="filter-btn">This Month</button>
                            </div>
                            <div className="search-box">
                                <input type="text" placeholder="Search games..." className="search-input" />
                                <button className="search-btn">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="history-list">
                            <div className="history-list-header">
                                <div className="header-col game">Game</div>
                                <div className="header-col date">Date & Time</div>
                                <div className="header-col points">Points</div>
                                <div className="header-col duration">Duration</div>
                                <div className="header-col status">Status</div>
                            </div>
                            <div className="history-items">
                                {historyData.map((item) => (
                                    <div key={item.id} className="history-item">
                                        <div className="game-col">
                                            <div className="game-info">
                                                <div className="game-icon">🎮</div>
                                                <div className="game-details">
                                                    <h4 className="game-name">{item.game}</h4>
                                                    <span className="game-type">Quiz Game</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="date-col">
                                            <span className="date-text">{item.date}</span>
                                        </div>
                                        <div className="points-col">
                                            <span className={`points-value ${item.points > 0 ? 'positive' : 'negative'}`}>
                                                {item.points > 0 ? '+' : ''}{item.points}
                                            </span>
                                        </div>
                                        <div className="duration-col">
                                            <span className="duration-text">{item.duration}</span>
                                        </div>
                                        <div className="status-col">
                                            <span className={`status-badge ${item.status}`}>
                                                {item.status === 'won' ? '🏆 Won' : '💔 Lost'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="history-footer">
                            <div className="pagination">
                                <button className="pagination-btn prev">← Previous</button>
                                <span className="page-info">Page 1 of 3</span>
                                <button className="pagination-btn next">Next →</button>
                            </div>
                            <button className="btn-export">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 16L12 8M12 16L9 13M12 16L15 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M8 12H6C4.89543 12 4 12.8954 4 14V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V14C20 12.8954 19.1046 12 18 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Export History
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};