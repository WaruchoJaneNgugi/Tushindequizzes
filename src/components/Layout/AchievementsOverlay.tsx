import type { FC } from "react";
import { useEffect, useState } from "react";
import { useAchievements } from "../../hooks/useAchievements.ts";
import "../../styles/achievements-overlay.css";

interface RewardsOverlayProps {
    onClose: () => void;
}

export const AchievementsOverlay: FC<RewardsOverlayProps> = ({ onClose }) => {
    const { stats, achievements, loading, error, claimAchievement, fetchUserAchievements } = useAchievements();
    const [claimingId, setClaimingId] = useState<string | number | null>(null);
    const [filter, setFilter] = useState<'all' | 'available' | 'claimed' | 'locked'>('all');

    useEffect(() => {
        fetchUserAchievements();
    }, [fetchUserAchievements]);

    const handleClaim = async (achievementId: string | number) => {
        setClaimingId(achievementId);
        try {
            await claimAchievement(achievementId);
        } catch (error) {
            // Error handled by hook
        } finally {
            setClaimingId(null);
        }
    };

    const filteredAchievements = achievements.filter(achievement => {
        if (filter === 'all') return true;
        return achievement.status === filter;
    });

    const claimedCount = achievements.filter(a => a.status === 'claimed').length;
    const availableCount = achievements.filter(a => a.status === 'available').length;
    const lockedCount = achievements.filter(a => a.status === 'locked').length;
    const totalPoints = achievements
        .filter(a => a.status === 'claimed')
        .reduce((sum, a) => sum + (a.points || 0), 0);

    const completionPct = achievements.length > 0
        ? Math.round((claimedCount / achievements.length) * 100)
        : 0;

    const FILTERS: { key: typeof filter; label: string; emoji: string; count: number }[] = [
        { key: 'all',       label: 'All',       emoji: '✦', count: achievements.length },
        { key: 'available', label: 'Ready',      emoji: '🎁', count: availableCount },
        { key: 'claimed',   label: 'Claimed',    emoji: '✅', count: claimedCount },
        { key: 'locked',    label: 'Locked',     emoji: '🔒', count: lockedCount },
    ];

    return (
        <>
            <div className="ach-backdrop" onClick={onClose} />
            <div className="ach-shell">

                {/* ── TOP BAR ── */}
                <header className="ach-topbar">
                    <button className="ach-back" onClick={onClose} aria-label="Close">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>Back</span>
                    </button>

                    <div className="ach-topbar-title">
                        <span className="ach-topbar-eyebrow">Player Profile</span>
                        <h1 className="ach-topbar-heading">Achievements</h1>
                    </div>

                    <button className="ach-refresh" onClick={fetchUserAchievements} disabled={loading} aria-label="Refresh">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={loading ? 'spinning' : ''}>
                            <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </header>

                <div className="ach-body">

                    {/* ── LEFT SIDEBAR ── */}
                    <aside className="ach-sidebar">
                        {/* Ring progress */}
                        <div className="ach-ring-card">
                            <svg className="ach-ring-svg" viewBox="0 0 120 120">
                                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
                                <circle
                                    cx="60" cy="60" r="50" fill="none"
                                    stroke="url(#ringGrad)" strokeWidth="10"
                                    strokeLinecap="round"
                                    strokeDasharray={`${2 * Math.PI * 50}`}
                                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - completionPct / 100)}`}
                                    transform="rotate(-90 60 60)"
                                    style={{ transition: 'stroke-dashoffset 1s ease' }}
                                />
                                <defs>
                                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#00C9FF"/>
                                        <stop offset="100%" stopColor="#92FE9D"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="ach-ring-inner">
                                <span className="ach-ring-pct">{completionPct}%</span>
                                <span className="ach-ring-label">Complete</span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="ach-stat-stack">
                            <div className="ach-stat-row">
                                <span className="ach-stat-icon">🪙</span>
                                <div>
                                    <div className="ach-stat-val">{totalPoints.toLocaleString()}</div>
                                    <div className="ach-stat-lbl">Points Earned</div>
                                </div>
                            </div>
                            <div className="ach-divider"/>
                            <div className="ach-stat-row">
                                <span className="ach-stat-icon">🏆</span>
                                <div>
                                    <div className="ach-stat-val">{claimedCount}<span className="ach-stat-denom">/{stats?.totalAchievements || achievements.length}</span></div>
                                    <div className="ach-stat-lbl">Achievements</div>
                                </div>
                            </div>
                            {stats?.totalPointsAvailable ? (
                                <>
                                    <div className="ach-divider"/>
                                    <div className="ach-stat-row">
                                        <span className="ach-stat-icon">🎯</span>
                                        <div>
                                            <div className="ach-stat-val">{stats.totalPointsAvailable.toLocaleString()}</div>
                                            <div className="ach-stat-lbl">Points Available</div>
                                        </div>
                                    </div>
                                </>
                            ) : null}
                        </div>

                        {/* Filter pills */}
                        <nav className="ach-filter-nav">
                            {FILTERS.map(f => (
                                <button
                                    key={f.key}
                                    className={`ach-filter-pill ${filter === f.key ? 'active' : ''}`}
                                    onClick={() => setFilter(f.key)}
                                >
                                    <span className="ach-filter-emoji">{f.emoji}</span>
                                    <span className="ach-filter-text">{f.label}</span>
                                    <span className="ach-filter-count">{f.count}</span>
                                </button>
                            ))}
                        </nav>

                        {/* Tip card */}
                        <div className="ach-tip-card">
                            <p className="ach-tip-head">💡 Earn More Points</p>
                            <ul className="ach-tip-list">
                                <li>🎮 Play games daily</li>
                                <li>🏆 Win for bonus pts</li>
                                <li>📅 Login streaks</li>
                            </ul>
                        </div>
                    </aside>

                    {/* ── MAIN CONTENT ── */}
                    <main className="ach-main">

                        {error && (
                            <div className="ach-error">
                                <span>⚠️ {error}</span>
                                <button onClick={fetchUserAchievements}>Retry</button>
                            </div>
                        )}

                        {loading && achievements.length === 0 && (
                            <div className="ach-loading">
                                <div className="ach-spinner"/>
                                <p>Loading achievements…</p>
                            </div>
                        )}

                        {/* Recent activity */}
                        {stats?.recentAchievements && stats.recentAchievements.length > 0 && (
                            <section className="ach-recent">
                                <h2 className="ach-section-label">Recent Activity</h2>
                                <div className="ach-recent-chips">
                                    {stats.recentAchievements.map((id, i) => {
                                        const a = achievements.find(x => x.id === id);
                                        return (
                                            <span key={i} className="ach-recent-chip">
                                                {a ? a.name : `Achievement #${id}`}
                                            </span>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* Section heading */}
                        <div className="ach-grid-header">
                            <h2 className="ach-section-label">
                                {filter === 'all'       && 'All Achievements'}
                                {filter === 'available' && '🎁 Ready to Claim'}
                                {filter === 'claimed'   && '✅ Completed'}
                                {filter === 'locked'    && '🔒 Locked'}
                            </h2>
                            <span className="ach-grid-count">{filteredAchievements.length} items</span>
                        </div>

                        {/* Achievement grid */}
                        {filteredAchievements.length === 0 ? (
                            <div className="ach-empty">
                                <span className="ach-empty-icon">🔍</span>
                                <p>No achievements in this category.</p>
                            </div>
                        ) : (
                            <div className="ach-grid">
                                {filteredAchievements.map((a) => (
                                    <div key={a.id} className={`ach-card ach-card--${a.status}`}>

                                        {/* Glow blob */}
                                        <div className="ach-card-glow"/>

                                        {/* Icon column */}
                                        <div className="ach-card-icon-wrap">
                                            <div className="ach-card-icon">
                                                {a.icon || (
                                                    a.status === 'claimed'   ? '✅' :
                                                    a.status === 'available' ? '🎁' : '🔒'
                                                )}
                                            </div>
                                            {a.status === 'claimed' && <div className="ach-card-check">✓</div>}
                                        </div>

                                        {/* Text column */}
                                        <div className="ach-card-body">
                                            <div className="ach-card-top">
                                                <h3 className="ach-card-name">{a.name}</h3>
                                                <div className="ach-card-pts">
                                                    <span>🪙</span>
                                                    <span>{a.points}</span>
                                                </div>
                                            </div>
                                            <p className="ach-card-desc">{a.description}</p>

                                            {a.progress !== undefined && a.maxProgress && (
                                                <div className="ach-card-progress">
                                                    <div className="ach-progress-track">
                                                        <div
                                                            className="ach-progress-fill"
                                                            style={{ width: `${Math.min((a.progress / a.maxProgress) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                    <span className="ach-progress-txt">{a.progress}/{a.maxProgress}</span>
                                                </div>
                                            )}

                                            {a.earnedAt && (
                                                <p className="ach-card-date">
                                                    Earned {new Date(a.earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            )}
                                        </div>

                                        {/* Claim button */}
                                        <button
                                            className={`ach-claim-btn ach-claim-btn--${a.status}`}
                                            onClick={() => a.status === 'available' && handleClaim(a.id)}
                                            disabled={a.status !== 'available' || claimingId === a.id}
                                        >
                                            {claimingId === a.id ? (
                                                <span className="ach-btn-spinner"/>
                                            ) : (
                                                <>
                                                    {a.status === 'claimed'   && <><span>✓</span> Claimed</>}
                                                    {a.status === 'available' && <><span>↑</span> Claim</>}
                                                    {a.status === 'locked'    && <><span>🔒</span> Locked</>}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
};
