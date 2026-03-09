import "../../styles/topbar.css"
import "../../styles/sidebar.css"
import "../../styles/bottomnavbar.css"
import { type FC, useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useUI } from "../../hooks/useUI";
import { AuthModal } from "./AuthModal";
import { useGames } from "../../hooks/useGames.ts";
import { LeaderboardOverlay } from "../../pages/LeaderboardOverlay.tsx";
import { HistoryOverlay } from "../../pages/HistoryOverlay.tsx";
import { ProfileOverlay } from "../../pages/ProfileOverlay.tsx";
import { AchievementsOverlay } from "./AchievementsOverlay.tsx";
import { EditProfileOverlay } from "../../pages/EditProfileOverlay.tsx";
import "../../styles/topbar-search.css";
import { SearchOverlay } from "./SearchOverlay.tsx";

export const TopBar: FC = () => {
    const { user, isLoggedIn, logout } = useAuth();
    const {
        setShowAuthModal,
        setAuthModalMode,
        setShowMobileMenu,
        setShowBuyPoints,
    } = useUI();

    const { setActiveFilter, searchQuery, setSearchQuery, setIsSearchActive } = useGames();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [showSearchOverlay, setShowSearchOverlay] = useState(false);

    // const [activeSidebarFilter, setActiveSidebarFilter] = useState(activeFilter || 'all');
    const [showSidebar, setShowSidebar] = useState(false);
    const [activeMobileNav, setActiveMobileNav] = useState('games');
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');

    // Overlay states
    const [showLeaderboardOverlay, setShowLeaderboardOverlay] = useState(false);
    const [showRewardsOverlay, setShowRewardsOverlay] = useState(false);
    const [showHistoryOverlay, setShowHistoryOverlay] = useState(false);
    const [showProfileOverlay, setShowProfileOverlay] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);

    const sidebarRef = useRef<HTMLDivElement>(null);
    //
    // useEffect(() => {
    //     setActiveSidebarFilter(activeFilter || 'all');
    // }, [activeFilter]);

    const handleEditProfile = async () => {
        try {
            setShowEditProfile(false);
            setShowProfileOverlay(true);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };
    const NAV_ITEMS = [
        {
            key: 'games',
            label: 'Games',
            icon: (
                <svg viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="6" width="20" height="13" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="8" cy="12" r="1.5" fill="currentColor"/>
                    <circle cx="12" cy="10" r="1.5" fill="currentColor"/>
                    <circle cx="16" cy="12" r="1.5" fill="currentColor"/>
                    <circle cx="12" cy="14" r="1.5" fill="currentColor"/>
                    <path d="M7 3L12 6L17 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            ),
        },
        {
            key: 'leaderboard',
            label: 'Ranks',
            icon: (
                <svg viewBox="0 0 24 24" fill="none">
                    <rect x="2"  y="13" width="5" height="9"  rx="1" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="9"  y="8"  width="6" height="14" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="17" y="2"  width="5" height="20" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
            ),
        },
        {
            key: 'achievements',
            label: 'Awards',
            icon: (
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M12 15C15.866 15 19 11.866 19 8C19 4.134 15.866 1 12 1C8.134 1 5 4.134 5 8C5 11.866 8.134 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M8.5 14.5L7 23L12 20.5L17 23L15.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 8L11 10L15 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            ),
        },
        {
            key: 'history',
            label: 'History',
            icon: (
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M3 12C3 7.029 7.029 3 12 3C16.971 3 21 7.029 21 12C21 16.971 16.971 21 12 21C10.14 21 8.418 20.423 7 19.438" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M12 7V12L15 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 7.5L3 12.5L7.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            ),
        },
        {
            key: 'profile',
            label: 'Profile',
            icon: (
                <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M4 20C4 17.239 7.582 15 12 15C16.418 15 20 17.239 20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            ),
        },
    ];

    const toggleAuthModal = (mode: 'login' | 'signup') => {
        setAuthModalMode(mode);
        setShowAuthModal(true);
        setShowMobileMenu(false);
        setShowSidebar(false);
    };

    const handleLogout = () => {
        logout();
        setShowMobileMenu(false);
        setShowSidebar(false);
    };

    const handleBuyPointsClick = () => {
        setShowBuyPoints(true);
        setShowMobileMenu(false);
        setShowSidebar(false);
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const handleLeaderboardClick = () => {
        setShowLeaderboardOverlay(true);
        setShowSidebar(false);
    };

    const handleRewardsClick = () => {
        setShowRewardsOverlay(true);
        setShowSidebar(false);
    };

    const handleHistoryClick = () => {
        setShowHistoryOverlay(true);
        setShowSidebar(false);
    };

    const handleProfileClick = () => {
        setShowProfileOverlay(true);
        setShowSidebar(false);
    };

    const closeAllOverlays = () => {
        setShowLeaderboardOverlay(false);
        setShowRewardsOverlay(false);
        setShowHistoryOverlay(false);
        setShowProfileOverlay(false);
        setActiveMobileNav("games");
    };
    //
    // const handleSidebarFilter = (filterId: string) => {
    //     setActiveFilter(filterId);
    //     setActiveSidebarFilter(filterId);
    //     setShowSidebar(false);
    //
    //     setTimeout(() => {
    //         const gamesSection = document.querySelector('.games-grid') ||
    //             document.querySelector('.games-filter-container');
    //         if (gamesSection) {
    //             gamesSection.scrollIntoView({ behavior: 'smooth' });
    //         }
    //     }, 300);
    // };

    const handleMobileNavClick = (navItem: string) => {
        setActiveMobileNav(navItem);

        switch (navItem) {
            case 'games':
                closeAllOverlays();
                setActiveFilter('all');
                // setActiveSidebarFilter('all');
                setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, 100);
                break;
            case 'achievements':
                setShowRewardsOverlay(true);
                break;
            case 'leaderboard':
                setShowLeaderboardOverlay(true);
                break;
            case 'history':
                setShowHistoryOverlay(true);
                break;
            case 'profile':
                setShowProfileOverlay(true);
                break;
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalSearchQuery(value);
        setSearchQuery(value);
        setIsSearchActive(value.length > 0);
    };

    const handleClearSearch = () => {
        setLocalSearchQuery('');
        setSearchQuery('');
        setIsSearchActive(false);
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    const handleSearchIconClick = () => {
        setShowSearchOverlay(true);
    };

    const closeSearchOverlay = () => {
        setShowSearchOverlay(false);
    };

    // Close sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showSidebar && sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node) &&
                !(event.target as Element).closest('.sidebar-toggle')) {
                setShowSidebar(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showSidebar]);

    // Close on escape key press
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if (showSidebar) setShowSidebar(false);
                if (showSearchOverlay) setShowSearchOverlay(false);
                closeAllOverlays();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        return () => document.removeEventListener('keydown', handleEscapeKey);
    }, [showSidebar, showSearchOverlay]);

    // Prevent body scroll when overlays are open
    useEffect(() => {
        const isOverlayOpen = showLeaderboardOverlay || showRewardsOverlay ||
            showHistoryOverlay || showProfileOverlay || showSearchOverlay;

        if (showSidebar || isOverlayOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showSidebar, showLeaderboardOverlay, showRewardsOverlay,
        showHistoryOverlay, showProfileOverlay, showSearchOverlay]);

    return (
        <>
            <nav className="topbar">
                <div className="topbar-container">
                    {/* Left Section */}
                    <div className="topbar-left">
                        <button className="topbar-menu-btn" onClick={toggleSidebar}>
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2"
                                      strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <div className="topbar-logo">
                            <span className="logo-text">TUSHINDE<span className="logo-highlight">QUIZ</span></span>
                        </div>
                    </div>

                    {/* Right Section - Modern Minimal Actions */}
                    <div className="topbar-right">
                        {isLoggedIn ? (
                            <>
                                {/* Points Display - Modern with "Points" text */}
                                <button className="topbar-points" onClick={handleBuyPointsClick}>
                                    {/*<span className="points-icon">⚡</span>*/}
                                    <span className="points-value">{user?.pointsBalance || 0}</span>
                                    <span className="points-label">Points</span>
                                </button>
                                {/* Search Icon - Modern */}
                                <button className="topbar-icon-btn" onClick={handleSearchIconClick}>
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                                              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>

                                {/* Logout Icon - Modern */}
                                <button className="topbar-icon-btn logout-btn" onClick={handleLogout} title="Logout">
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                                              stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <div className="topbar-auth">
                                <button className="auth-link" onClick={() => toggleAuthModal('login')}>
                                    Sign In
                                </button>
                                <button className="auth-button" onClick={() => toggleAuthModal('signup')}>
                                    Join Free
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Menu */}
                {showSidebar && (
                    <>
                        <div className="sidebar-overlay active" onClick={() => setShowSidebar(false)} />
                        <div className={`sidebar-menu ${showSidebar ? 'active' : ''}`} ref={sidebarRef}>
                            <button className="sidebar-close" onClick={() => setShowSidebar(false)}>×</button>

                            {isLoggedIn && user && (
                                <div className="sidebar-header">
                                    <div className="sidebar-user">
                                        <div className="user-avatar-sidebar">
                                            {user.email?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div className="user-info-nav">
                                            <h3 className="user-name">{user.username || 'User'}</h3>
                                            <p className="user-email">{user.phoneNumber || user.email}</p>
                                        </div>
                                    </div>

                                    <div className="sidebar-points">
                                        {/*<div className="points-info">*/}
                                        {/*    <div className="points-label-sidebar">Smart Points</div>*/}
                                        {/*    <div className="points-amount-sidebar">{user.pointsBalance || 0}</div>*/}
                                        {/*</div>*/}
                                        <button className="buy-points-btn" onClick={handleBuyPointsClick}>
                                            Buy Points
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="sidebar-nav">
                                <div className="sidebar-nav-section">
                                    <div className="sidebar-nav-title">Main</div>
                                    <button className="sidebar-menu-item" onClick={() => setShowSidebar(false)}>
                                        <span className="sidebar-icon">🏠</span>
                                        <span>Dashboard</span>
                                    </button>
                                </div>

                                {/*<div className="sidebar-nav-section">*/}
                                {/*    <div className="sidebar-nav-title">Game Categories</div>*/}
                                {/*    {['all', 'latest', 'timed', 'popular', 'bible', 'puzzle', 'arcade'].map(filter => (*/}
                                {/*        <button*/}
                                {/*            key={filter}*/}
                                {/*            className={`sidebar-menu-item game-category ${activeSidebarFilter === filter ? 'active' : ''}`}*/}
                                {/*            onClick={() => handleSidebarFilter(filter)}*/}
                                {/*        >*/}
                                {/*            <span className="sidebar-icon">*/}
                                {/*                {filter === 'all' && '🎮'}*/}
                                {/*                {filter === 'latest' && '🆕'}*/}
                                {/*                {filter === 'timed' && '⏱️'}*/}
                                {/*                {filter === 'popular' && '🔥'}*/}
                                {/*                {filter === 'bible' && '📖'}*/}
                                {/*                {filter === 'puzzle' && '🧩'}*/}
                                {/*                {filter === 'arcade' && '👾'}*/}
                                {/*            </span>*/}
                                {/*            <span>*/}
                                {/*                {filter === 'all' && 'All Games'}*/}
                                {/*                {filter === 'latest' && 'Latest Games'}*/}
                                {/*                {filter === 'timed' && 'Timed Trivia'}*/}
                                {/*                {filter === 'popular' && 'Popular Games'}*/}
                                {/*                {filter === 'bible' && 'Bible Quiz'}*/}
                                {/*                {filter === 'puzzle' && 'Puzzle Games'}*/}
                                {/*                {filter === 'arcade' && 'Arcade Games'}*/}
                                {/*            </span>*/}
                                {/*        </button>*/}
                                {/*    ))}*/}
                                {/*</div>*/}

                                <div className="sidebar-nav-section features">
                                    <div className="sidebar-nav-title">Features</div>
                                    <button className="sidebar-menu-item" onClick={handleLeaderboardClick}>
                                        <span className="sidebar-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M16 12L12 8L8 12M12 16V8" stroke="currentColor" strokeWidth="1.5" />
                                                <path d="M20 21H4V4H20V21Z" stroke="currentColor" strokeWidth="1.5" />
                                            </svg>
                                        </span>
                                        <span>Leaderboard</span>
                                    </button>
                                    <button className="sidebar-menu-item" onClick={handleRewardsClick}>
                                        <span className="sidebar-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
                                                      stroke="currentColor" strokeWidth="1.5" />
                                                <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88"
                                                      stroke="currentColor" strokeWidth="1.5" />
                                            </svg>
                                        </span>
                                        <span>Achievements</span>
                                    </button>
                                    <button className="sidebar-menu-item" onClick={handleHistoryClick}>
                                        <span className="sidebar-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                                                <polyline points="12 7 12 12 15 15" stroke="currentColor" strokeWidth="1.5" />
                                            </svg>
                                        </span>
                                        <span>History</span>
                                    </button>
                                    <button className="sidebar-menu-item" onClick={handleProfileClick}>
                                        <span className="sidebar-icon">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21"
                                                      stroke="currentColor" strokeWidth="1.5" />
                                                <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                                                      stroke="currentColor" strokeWidth="1.5" />
                                            </svg>
                                        </span>
                                        <span>Profile</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </nav>

            <div className="mobile-bottom-nav">
                {NAV_ITEMS.map(({ key, label, icon }) => (
                    <div
                        key={key}
                        className={`mobile-bottom-nav-item ${activeMobileNav === key ? 'active' : ''}`}
                        onClick={() => isLoggedIn && handleMobileNavClick(key)}
                        aria-label={label}
                        aria-current={activeMobileNav === key ? 'page' : undefined}
                    >
                        <div className="mobile-nav-icon">
                            {icon}
                        </div>
                        <span className="mobile-nav-label">{label}</span>
                    </div>
                ))}
            </div>

            {/* Search Overlay */}
            {showSearchOverlay && (
                <SearchOverlay
                    searchQuery={localSearchQuery}
                    onSearchChange={handleSearchChange}
                    onClose={closeSearchOverlay}
                    onClear={handleClearSearch}
                />
            )}

            {/* Other Overlays */}
            {showLeaderboardOverlay && (
                <LeaderboardOverlay onClose={() => {
                    setShowLeaderboardOverlay(false);
                    setActiveMobileNav("games");
                }} />
            )}

            {showRewardsOverlay && (
                <AchievementsOverlay onClose={() => {
                    setShowRewardsOverlay(false);
                    setActiveMobileNav("games");
                }} />
            )}

            {showHistoryOverlay && (
                <HistoryOverlay onClose={() => {
                    setShowHistoryOverlay(false);
                    setActiveMobileNav("games");
                }} />
            )}

            {showProfileOverlay && (
                <ProfileOverlay
                    onClose={() => {
                        setShowProfileOverlay(false);
                        setActiveMobileNav("games");
                    }}
                    onEditProfile={() => {
                        setShowProfileOverlay(false);
                        setShowEditProfile(true);
                    }}
                />
            )}

            {showEditProfile && (
                <EditProfileOverlay
                    onClose={() => {
                        setShowEditProfile(false);
                        setShowProfileOverlay(true);
                    }}
                    onSave={handleEditProfile}
                />
            )}

            <AuthModal />
        </>
    );
};