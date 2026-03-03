// Updated TopBar.tsx with overlay states
import "../../styles/globals.css"
import "../../styles/navtabs.css"
import "../../styles/sidebar.css"
import "../../styles/bottomnavbar.css"
import {type FC, useEffect, useRef, useState} from "react";
import {useAuth} from "../../hooks/useAuth";
import {useUI} from "../../hooks/useUI";
import {AuthModal} from "./AuthModal";
import {useGames} from "../../hooks/useGames.ts";
import {LeaderboardOverlay} from "../../pages/LeaderboardOverlay.tsx";
import {HistoryOverlay} from "../../pages/HistoryOverlay.tsx";
import {ProfileOverlay} from "../../pages/ProfileOverlay.tsx";
import {AchievementsOverlay} from "./AchievementsOverlay.tsx";
import {EditProfileOverlay} from "../../pages/EditProfileOverlay.tsx";
import "../../styles/topbar-search.css";
import {SearchOverlay} from "./SearchOverlay.tsx";

export const TopBar: FC = () => {
    const {user, isLoggedIn, logout} = useAuth();
    const {
        showMobileMenu,
        setShowAuthModal,
        setAuthModalMode,
        setShowMobileMenu,
        setShowBuyPoints,
    } = useUI();

    // Get filter functions and state from useGames
    const {setActiveFilter, activeFilter, searchQuery, setSearchQuery, setIsSearchActive} = useGames();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [showSearchOverlay, setShowSearchOverlay] = useState(false);
    // const [showMobileSearch, setShowMobileSearch] = useState(false);

    const [activeSidebarFilter, setActiveSidebarFilter] = useState(activeFilter || 'all');
    const [showSidebar, setShowSidebar] = useState(false);
    const [activeMobileNav, setActiveMobileNav] = useState('games');
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');

    // Overlay states
    const [showLeaderboardOverlay, setShowLeaderboardOverlay] = useState(false);
    const [showRewardsOverlay, setShowRewardsOverlay] = useState(false);
    const [showHistoryOverlay, setShowHistoryOverlay] = useState(false);
    const [showProfileOverlay, setShowProfileOverlay] = useState(false);
    const [showEditProfile, setShowEditProfile] = useState(false);

    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const sidebarRef = useRef<HTMLDivElement>(null);

    // Sync sidebar filter with activeFilter from useGames
    useEffect(() => {
        setActiveSidebarFilter(activeFilter || 'all');
    }, [activeFilter]);

    const handleEditProfile = async () => {
        try {
            setShowEditProfile(false);
            setShowProfileOverlay(true);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    // const toggleMobileSearch = () => {
    //     setShowMobileSearch(!showMobileSearch);
    //     if (!showMobileSearch) {
    //         setTimeout(() => {
    //             if (searchInputRef.current) {
    //                 searchInputRef.current.focus();
    //             }
    //         }, 300);
    //     }
    // };

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

    // Overlay handlers
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

    const handleSidebarFilter = (filterId: string) => {
        setActiveFilter(filterId);
        setActiveSidebarFilter(filterId);
        setShowSidebar(false);

        setTimeout(() => {
            const gamesSection = document.querySelector('.games-grid') ||
                document.querySelector('.games-filter-container');
            if (gamesSection) {
                gamesSection.scrollIntoView({behavior: 'smooth'});
            }
        }, 300);
    };

    const handleMobileNavClick = (navItem: string) => {
        setActiveMobileNav(navItem);

        switch (navItem) {
            case 'games':
                closeAllOverlays();
                setActiveFilter('all');
                setActiveSidebarFilter('all');
                setTimeout(() => {
                    window.scrollTo({top: 0, behavior: 'smooth'});
                    const gamesSection = document.querySelector('.games-grid') ||
                        document.querySelector('.games-filter-container');
                    if (gamesSection) {
                        gamesSection.scrollIntoView({behavior: 'smooth'});
                    }
                }, 100);
                break;
            case 'event':
            case 'achievements':
                setShowRewardsOverlay(true);
                break;
            case 'downloads':
            case 'leaderboard':
                setShowLeaderboardOverlay(true);
                break;
            case 'me':
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

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showMobileMenu && mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target as Node) &&
                !(event.target as Element).closest('.hamburger-btn')) {
                setShowMobileMenu(false);
            }

            if (showSidebar && sidebarRef.current &&
                !sidebarRef.current.contains(event.target as Node) &&
                !(event.target as Element).closest('.sidebar-toggle')) {
                setShowSidebar(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMobileMenu, showSidebar]);

    // Close on escape key press
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                if (showMobileMenu) setShowMobileMenu(false);
                if (showSidebar) setShowSidebar(false);
                if (showSearchOverlay) setShowSearchOverlay(false);
                closeAllOverlays();
            }
        };

        document.addEventListener('keydown', handleEscapeKey);
        return () => document.removeEventListener('keydown', handleEscapeKey);
    }, [showMobileMenu, showSidebar, showSearchOverlay, setShowMobileMenu]);

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
            <nav className="navbar">
                <div className="navbar-container">
                    {/* Brand/Logo */}
                    <div className="top-nav-left">
                        <button className="sidebar-toggle" onClick={toggleSidebar}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2"
                                      strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <div className="navbar-brand">
                            <h1 className="navbar-title">TushindeQuiz</h1>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="navbar-desktop-nav">
                        <div className="desktop-actions">
                            {isLoggedIn && (
                                <>
                                    {/* Points Display */}


                                    {/* Search Bar - Clickable for overlay */}
                                    <button
                                        className="mobile-search-toggle-btn"
                                        onClick={handleSearchIconClick}
                                        aria-label="Search"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                             stroke="currentColor" strokeWidth="2">
                                            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>

                                    <div className="desktop-points-display">
                                        <div
                                            className="points-btn game-points"
                                            onClick={handleBuyPointsClick}
                                        >
                                            <div className="points-amount">{user?.pointsBalance || 0}</div>
                                            <div className="points-label">Points</div>
                                        </div>
                                    </div>
                                    {/* Logout Button */}
                                    <button
                                        className="desktop-logout-btn"
                                        onClick={handleLogout}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
                                                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round"/>
                                            <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2"
                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M21 12H9" stroke="currentColor" strokeWidth="2"
                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className={`navbar-mobile-nav ${!isLoggedIn ? 'not-logged-in' : ''}`}>
                        {isLoggedIn ? (
                            <div className="navbar-left-section">
                                {/* Points Display for Mobile */}
                                <button
                                    className="points-btn game-points"
                                    onClick={handleBuyPointsClick}
                                >
                                    <span className="points-amount">{user?.pointsBalance || 0}</span>
                                    <span className="points-label-nav">Points</span>
                                </button>

                                {/* Mobile Search Icon */}
                                <button
                                    className="mobile-search-toggle-btn"
                                    onClick={handleSearchIconClick}
                                    aria-label="Search"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" strokeWidth="2">
                                        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                                              strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        ) : (
                            <div className="auth-buttons-container">
                                <button
                                    className="mobile-menu-item signup"
                                    onClick={() => toggleAuthModal('signup')}
                                >
                                    Join Now
                                </button>
                                <button
                                    className="mobile-login-btn"
                                    onClick={() => toggleAuthModal('login')}
                                >
                                    Login
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar Menu */}
                {showSidebar && (
                    <>
                        <div
                            className={`sidebar-overlay ${showSidebar ? 'active' : ''}`}
                            onClick={() => setShowSidebar(false)}
                        />
                        <div
                            className={`sidebar-menu ${showSidebar ? 'active' : ''}`}
                            ref={sidebarRef}
                        >
                            <button
                                className="sidebar-close"
                                onClick={() => setShowSidebar(false)}
                            >
                                ×
                            </button>

                            {/* User Info */}
                            {isLoggedIn && user && (
                                <div className="sidebar-header">
                                    <div className="sidebar-user">
                                        <div className="user-avatar-sidebar">
                                            {user.email?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div className="user-info-nav">
                                            <h3 className="user-name">{user.username || 'User'}</h3>
                                            <p className="user-email">{user.phoneNumber}</p>
                                        </div>
                                    </div>

                                    <div className="sidebar-points">
                                        <div className="points-info">
                                            <div className="points-label-sidebar">Smart Points</div>
                                            <div className="points-amount-sidebar">{user.pointsBalance || 0}</div>
                                        </div>
                                        <button
                                            className="buy-points-btn"
                                            onClick={handleBuyPointsClick}
                                        >
                                            Buy
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Sidebar Navigation */}
                            <div className="sidebar-nav">
                                {/* Main Navigation */}
                                <div className="sidebar-nav-section">
                                    <div className="sidebar-nav-title">Main</div>
                                    <button
                                        className="sidebar-menu-item"
                                        onClick={() => {
                                            setShowSidebar(false);
                                            closeAllOverlays();
                                        }}
                                    >
                                        <span className="sidebar-icon">🏠</span>
                                        <span>Dashboard</span>
                                    </button>
                                </div>

                                {/* Game Categories */}
                                <div className="sidebar-nav-section">
                                    <div className="sidebar-nav-title">Game Categories</div>
                                    <button
                                        className={`sidebar-menu-item game-category ${activeSidebarFilter === 'all' ? 'active' : ''}`}
                                        onClick={() => handleSidebarFilter('all')}
                                    >
                                        <span className="sidebar-icon">🎮</span>
                                        <span>All Games</span>
                                    </button>

                                    <button
                                        className={`sidebar-menu-item game-category ${activeSidebarFilter === 'latest' ? 'active' : ''}`}
                                        onClick={() => handleSidebarFilter('latest')}
                                    >
                                        <span className="sidebar-icon">🆕</span>
                                        <span>Latest Games</span>
                                    </button>

                                    <button
                                        className={`sidebar-menu-item game-category ${activeSidebarFilter === 'timed' ? 'active' : ''}`}
                                        onClick={() => handleSidebarFilter('timed')}
                                    >
                                        <span className="sidebar-icon">⏱️</span>
                                        <span>Timed Trivia</span>
                                    </button>

                                    <button
                                        className={`sidebar-menu-item game-category ${activeSidebarFilter === 'popular' ? 'active' : ''}`}
                                        onClick={() => handleSidebarFilter('popular')}
                                    >
                                        <span className="sidebar-icon">🔥</span>
                                        <span>Popular Games</span>
                                    </button>

                                    <button
                                        className={`sidebar-menu-item game-category ${activeSidebarFilter === 'bible' ? 'active' : ''}`}
                                        onClick={() => handleSidebarFilter('bible')}
                                    >
                                        <span className="sidebar-icon">📖</span>
                                        <span>Bible Quiz</span>
                                    </button>

                                    <button
                                        className={`sidebar-menu-item game-category ${activeSidebarFilter === 'puzzle' ? 'active' : ''}`}
                                        onClick={() => handleSidebarFilter('puzzle')}
                                    >
                                        <span className="sidebar-icon">🧩</span>
                                        <span>Puzzle Games</span>
                                    </button>

                                    <button
                                        className={`sidebar-menu-item game-category ${activeSidebarFilter === 'arcade' ? 'active' : ''}`}
                                        onClick={() => handleSidebarFilter('arcade')}
                                    >
                                        <span className="sidebar-icon">👾</span>
                                        <span>Arcade Games</span>
                                    </button>
                                </div>

                                {/* Other Features */}
                                <div className="sidebar-nav-section features">
                                    <div className="sidebar-nav-title">Features</div>
                                    <button
                                        className="sidebar-menu-item"
                                        onClick={() => {
                                            if (isLoggedIn) {
                                                handleLeaderboardClick();
                                            }
                                        }}
                                    >
                                        <span className="sidebar-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path d="M16 12L12 8L8 12M12 16V8" stroke="currentColor" strokeWidth="1.5"
                                                      strokeLinecap="round" strokeLinejoin="round"/>
                                                <path
                                                    d="M20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21Z"
                                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                                    strokeLinejoin="round"/>
                                            </svg>
                                        </span>
                                        <span>Leaderboard</span>
                                    </button>

                                    <button
                                        className="sidebar-menu-item"
                                        onClick={() => {
                                            if (isLoggedIn) {
                                                handleRewardsClick();
                                            }
                                        }}
                                    >
                                        <span className="sidebar-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
                                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                                    strokeLinejoin="round"/>
                                                <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor"
                                                      strokeWidth="1.5" strokeLinecap="round"
                                                      strokeLinejoin="round"/>
                                            </svg>
                                        </span>
                                        <span>Achievements</span>
                                    </button>

                                    <button
                                        className="sidebar-menu-item"
                                        onClick={() => {
                                            if (isLoggedIn) {
                                                handleHistoryClick();
                                            }
                                        }}
                                    >
                                        <span className="sidebar-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                 stroke="currentColor" strokeWidth="2">
                                                <circle cx="12" cy="12" r="9"/>
                                                <line x1="12" y1="7" x2="12" y2="12" strokeLinecap="round"/>
                                                <line x1="16" y1="16" x2="12" y2="12" strokeLinecap="round"/>
                                                <line x1="3" y1="3" x2="6" y2="6"/>
                                                <line x1="21" y1="3" x2="18" y2="6"/>
                                            </svg>
                                        </span>
                                        <span>History</span>
                                    </button>

                                    <button
                                        className="sidebar-menu-item"
                                        onClick={() => {
                                            if (isLoggedIn) {
                                                handleProfileClick();
                                            }
                                        }}
                                    >
                                        <span className="sidebar-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path
                                                    d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                                    strokeLinejoin="round"/>
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

            {/* Mobile Bottom Navigation */}
            <div className="mobile-bottom-nav">
                <button
                    className={`mobile-bottom-nav-item ${activeMobileNav === 'games' ? 'active' : ''}`}
                    onClick={() => isLoggedIn ? handleMobileNavClick('games') : null}
                >
                    <span className="mobile-nav-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                strokeLinejoin="round"/>
                        </svg>
                    </span>
                    <span className="mobile-nav-label">Games</span>
                </button>

                <button
                    className={`mobile-bottom-nav-item ${activeMobileNav === 'achievements' ? 'active' : ''}`}
                    onClick={() => isLoggedIn ? handleMobileNavClick('event') : null}
                >
                    <span className="mobile-nav-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                strokeLinejoin="round"/>
                            <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor"
                                  strokeWidth="1.5" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                        </svg>
                    </span>
                    <span className="mobile-nav-label">Achievements</span>
                </button>

                <button
                    className={`mobile-bottom-nav-item ${activeMobileNav === 'downloads' ? 'active' : ''}`}
                    onClick={() => isLoggedIn ? handleMobileNavClick('downloads') : null}
                >
                    <span className="mobile-nav-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M16 12L12 8L8 12M12 16V8" stroke="currentColor" strokeWidth="1.5"
                                  strokeLinecap="round" strokeLinejoin="round"/>
                            <path
                                d="M20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21Z"
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                strokeLinejoin="round"/>
                        </svg>
                    </span>
                    <span className="mobile-nav-label">LeaderBoard</span>
                </button>

                <button
                    className={`mobile-bottom-nav-item ${activeMobileNav === 'me' ? 'active' : ''}`}
                    onClick={() => isLoggedIn ? handleMobileNavClick('me') : null}
                >
                    <span className="mobile-nav-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21"
                                  stroke="currentColor"
                                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path
                                d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                strokeLinejoin="round"/>
                        </svg>
                    </span>
                    <span className="mobile-nav-label">Profile</span>
                </button>
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
                    setShowLeaderboardOverlay(false)
                    setActiveMobileNav("games");
                }}/>
            )}

            {showRewardsOverlay && (
                <AchievementsOverlay onClose={() => {
                    setShowRewardsOverlay(false)
                    setActiveMobileNav("games");
                }}/>
            )}

            {showHistoryOverlay && (
                <HistoryOverlay onClose={() => {
                    setShowHistoryOverlay(false);
                    setActiveMobileNav("games");
                }}/>
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

            <AuthModal/>
        </>
    );
};