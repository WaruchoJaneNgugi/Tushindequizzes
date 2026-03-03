// pages/Dashboard.tsx
import { useStore } from '../store/useStore';
import { AchievementForm } from '../components/achievements/AchievementForm';
import { CategoryForm } from '../components/categories/CategoryForm';
import { GameForm } from '../components/games/GameForm';
import { UserForm } from '../components/users/UserForm';
import { LeaderboardsTab } from '../components/leaderboards/LeaderboardsTab';
import { ThemeToggle } from '../components/ThemeToggle';
import '../assets/adminstyles.css';
import { useState, useEffect, useCallback } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import {
    achievementsApi, categoriesApi, gamesApi,
    leaderboardsApi, sessionsApi, transactionsApi, usersApi,
} from '../services/api';
import {
    TrophyIcon, CubeIcon, CpuChipIcon, ChartBarIcon,
    CircleStackIcon, CurrencyDollarIcon, UsersIcon,
    PresentationChartLineIcon, PlusIcon, PencilIcon,
    TrashIcon, ArrowPathIcon, DocumentArrowDownIcon,
    MagnifyingGlassIcon, XMarkIcon, CheckIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import type {
    User, Game, Transaction, TransactionStats,
    Achievement, Category, GameSession, LeaderboardEntry,
    ModalState, FormDataM, LoadingStates, PaginationState, ApiResponse, StatData
} from '../types/adminTypes';
import {parsePagination} from "../hooks/paginationHelpers.ts";

// ─── NAV CONFIG ──────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
    {
        label: 'Overview',
        items: [
            { id: 'dashboard', label: 'Dashboard', icon: PresentationChartLineIcon },
        ]
    },
    {
        label: 'Content',
        items: [
            { id: 'achievements', label: 'Achievements', icon: TrophyIcon },
            { id: 'categories', label: 'Categories', icon: CubeIcon },
            { id: 'games', label: 'Games', icon: CpuChipIcon },
        ]
    },
    {
        label: 'Players',
        items: [
            { id: 'leaderboards', label: 'Leaderboards', icon: ChartBarIcon },
            { id: 'sessions', label: 'Sessions', icon: CircleStackIcon },
            { id: 'users', label: 'Users', icon: UsersIcon },
        ]
    },
    {
        label: 'Finance',
        items: [
            { id: 'transactions', label: 'Transactions', icon: CurrencyDollarIcon },
        ]
    },
];

// ─── ICON COLORS ─────────────────────────────────────────────────────────────
// const TAB_COLORS: Record<string, { bg: string; color: string }> = {
//     dashboard: { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa' },
//     achievements: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24' },
//     categories: { bg: 'rgba(16,185,129,0.12)', color: '#34d399' },
//     games: { bg: 'rgba(168,85,247,0.12)', color: '#c084fc' },
//     leaderboards: { bg: 'rgba(239,68,68,0.12)', color: '#f87171' },
//     sessions: { bg: 'rgba(99,102,241,0.12)', color: '#a5b4fc' },
//     transactions: { bg: 'rgba(16,185,129,0.12)', color: '#34d399' },
//     users: { bg: 'rgba(249,115,22,0.12)', color: '#fb923c' },
// };

// ─── MODAL ───────────────────────────────────────────────────────────────────
interface ModalWrapProps { title: string; onClose: () => void; children: React.ReactNode; }

function Modal({ title, onClose, children }: ModalWrapProps) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-head">
                    <h3 className="modal-title">{title}</h3>
                    <button className="modal-close" onClick={onClose}>
                        <XMarkIcon />
                    </button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
    useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
    return (
        <div className={`toast toast-${type}`}>
            {type === 'success' ? <CheckIcon /> : <ExclamationTriangleIcon />}
            {message}
        </div>
    );
}

// ─── DASHBOARD COMPONENT ─────────────────────────────────────────────────────
interface DashboardProps {
    user?: { name?: string; phone?: string } | null;
}

const Dashboard = ({ user }: DashboardProps) => {
    const { activeTab, setActiveTab } = useStore();
    const [collapsed, setCollapsed] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const showToast = (message: string, type: 'success' | 'error' = 'success') =>
        setToast({ message, type });

    // ── Dashboard data ────────────────────────────────────────────────────────
    const { stats, recentActivity, chartData, loading, error, refreshData } = useDashboardData();

    // ── Tab data ──────────────────────────────────────────────────────────────
    const [users, setUsers] = useState<User[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [txStats, setTxStats] = useState<TransactionStats | null>(null);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [sessions, setSessions] = useState<GameSession[]>([]);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({});
    const [loadingStates, setLoadingStates] = useState<LoadingStates>({
        users: false, games: false, transactions: false,
        achievements: false, categories: false, sessions: false, leaderboards: false,
    });

    const setTabLoading = (key: keyof LoadingStates, value: boolean) =>
        setLoadingStates(prev => ({ ...prev, [key]: value }));

    // ── Modal ─────────────────────────────────────────────────────────────────
    const [modal, setModal] = useState<ModalState | null>(null);
    const [form, setForm] = useState<FormDataM>({});
    const [submitting, setSubmitting] = useState(false);

    const closeModal = () => { setModal(null); setForm({}); };

    const openModal = (type: ModalState['type'], mode: ModalState['mode'], data?: any) => {
        // const defaults: Partial<FormDataM> = {
        //     achievement: { isActive: true, criteriaType: 'games_played', threshold: 1 },
        //     game: { difficulty: 'medium', isActive: true, isFeatured: false },
        //     transaction: { type: 'bonus', paymentMethod: 'manual' },
        // }[type] ?? {};

        let formData: FormDataM = {};

        if (type === 'achievement') {
            if (mode === 'create') {
                formData = {
                    title: '',
                    description: '',
                    pointsReward: 0,
                    criteriaType: 'games_played',
                    threshold: 1,
                    gameId: '',
                    isActive: true
                };
            } else if (mode === 'edit' && data) {
                // For edit, transform the API data structure to form structure
                formData = {
                    title: data.title || '',
                    description: data.description || '',
                    pointsReward: data.pointsReward || 0,
                    criteriaType: data.criteria?.type || 'games_played',
                    threshold: data.criteria?.threshold || 1,
                    gameId: data.criteria?.gameId || '',
                    isActive: data.isActive !== false
                };
            } else if (mode === 'delete' && data) {
                formData = { ...data };
            }
        }

        setForm(formData);
        setModal({ type, mode, data });
    };

    // ── Fetch helpers ─────────────────────────────────────────────────────────
    const fetchUsers = useCallback(async (page = 1) => {
        setTabLoading('users', true);
        try {
            const res = await usersApi.getAll({ page, limit: 10 });
            if (res.success && res.data) {
                // Handle both array and object responses
                if (Array.isArray(res.data)) {
                    setUsers(res.data);
                } else if (res.data && typeof res.data === 'object' && 'users' in res.data) {
                    // Type assertion to tell TypeScript this is a UsersResponse
                    const data = res.data as { users: User[] };
                    setUsers(data.users || []);
                }

                const parsedPagination = parsePagination(res.pagination);
                if (parsedPagination) {
                    setPagination(prev => ({ ...prev, users: parsedPagination }));
                }
            }
        } catch {
            showToast('Failed to fetch users', 'error');
        } finally {
            setTabLoading('users', false);
        }
    }, []);


    const fetchGames = useCallback(async (page = 1) => {
        setTabLoading('games', true);
        try {
            const res = await gamesApi.getAll({ page, limit: 12 });
            if (res.success && res.data) {
                if (Array.isArray(res.data)) {
                    setGames(res.data);
                } else if (res.data && typeof res.data === 'object' && 'games' in res.data) {
                    // Type assertion to tell TypeScript this is a GamesResponse
                    const data = res.data as { games: Game[] };
                    setGames(data.games || []);
                }

                const parsedPagination = parsePagination(res.pagination);
                if (parsedPagination) {
                    setPagination(prev => ({ ...prev, games: parsedPagination }));
                }
            }
        } catch {
            showToast('Failed to fetch games', 'error');
        } finally {
            setTabLoading('games', false);
        }
    }, []);

    const fetchTransactions = useCallback(async (page = 1) => {
        setTabLoading('transactions', true);
        try {
            const [txRes, statsRes] = await Promise.all([
                transactionsApi.getAll({ page, limit: 10 }),
                transactionsApi.getStats(),
            ]);

            if (txRes.success && txRes.data) {
                if (Array.isArray(txRes.data)) {
                    setTransactions(txRes.data);
                } else if (txRes.data && typeof txRes.data === 'object') {
                    setTransactions(Object.values(txRes.data));
                }

                const parsedPagination = parsePagination(txRes.pagination);
                if (parsedPagination) {
                    setPagination(prev => ({ ...prev, transactions: parsedPagination }));
                }
            }

            if (statsRes.success && statsRes.data) {
                // Ensure statsRes.data is properly typed
                setTxStats(statsRes.data as TransactionStats);
            }
        } catch {
            showToast('Failed to fetch transactions', 'error');
        } finally {
            setTabLoading('transactions', false);
        }
    }, []);

    const fetchAchievements = useCallback(async (page = 1) => {
        setTabLoading('achievements', true);
        try {
            const res = await achievementsApi.getAll({ page, limit: 12 });
            if (res.success && res.data) {
                if (Array.isArray(res.data)) {
                    setAchievements(res.data);
                } else if (res.data && typeof res.data === 'object' && 'achievements' in res.data) {
                    // Type assertion to tell TypeScript this is an AchievementsResponse
                    const data = res.data as { achievements: Achievement[] };
                    setAchievements(data.achievements || []);
                }

                const parsedPagination = parsePagination(res.pagination);
                if (parsedPagination) {
                    setPagination(prev => ({ ...prev, achievements: parsedPagination }));
                }
            }
        } catch {
            showToast('Failed to fetch achievements', 'error');
        } finally {
            setTabLoading('achievements', false);
        }
    }, []);

    const fetchCategories = useCallback(async (page = 1) => {
        setTabLoading('categories', true);
        try {
            const res = await categoriesApi.getAll({ page, limit: 10 });
            if (res.success && res.data) {
                if (Array.isArray(res.data)) {
                    setCategories(res.data);
                } else if (res.data && typeof res.data === 'object' && 'categories' in res.data) {
                    // Type assertion to tell TypeScript this is a CategoriesResponse
                    const data = res.data as { categories: Category[] };
                    setCategories(data.categories || []);
                }

                const parsedPagination = parsePagination(res.pagination);
                if (parsedPagination) {
                    setPagination(prev => ({ ...prev, categories: parsedPagination }));
                }
            }
        } catch {
            showToast('Failed to fetch categories', 'error');
        } finally {
            setTabLoading('categories', false);
        }
    }, []);

    const fetchSessions = useCallback(async (page = 1) => {
        setTabLoading('sessions', true);
        try {
            const res = await sessionsApi.getAll({ page, limit: 10 });
            if (res.success && res.data) {
                if (Array.isArray(res.data)) {
                    setSessions(res.data);
                } else if (res.data && typeof res.data === 'object') {
                    setSessions(Object.values(res.data));
                }

                const parsedPagination = parsePagination(res.pagination);
                if (parsedPagination) {
                    setPagination(prev => ({ ...prev, sessions: parsedPagination }));
                }
            }
        } catch {
            showToast('Failed to fetch sessions', 'error');
        } finally {
            setTabLoading('sessions', false);
        }
    }, []);

    const fetchLeaderboard = useCallback(async () => {
        setTabLoading('leaderboards', true);
        try {
            const res = await leaderboardsApi.getGlobal('all_time');
            if (res.success && res.data) setLeaderboard(Array.isArray(res.data) ? res.data : []);
        } catch { showToast('Failed to fetch leaderboard', 'error'); }
        finally { setTabLoading('leaderboards', false); }
    }, []);

    const FETCHERS: Record<string, () => void> = {
        users: fetchUsers, games: fetchGames, transactions: fetchTransactions,
        achievements: fetchAchievements, categories: fetchCategories,
        sessions: fetchSessions, leaderboards: fetchLeaderboard,
    };

    useEffect(() => {
        FETCHERS[activeTab]?.();
    }, [activeTab]);

    const handleRefresh = () => {
        if (activeTab === 'dashboard') refreshData();
        else FETCHERS[activeTab]?.();
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!modal) return;
        setSubmitting(true);
        try {
            let res: ApiResponse<any> | undefined;
// In Dashboard.tsx, update the achievement section in handleSubmit:

            if (modal.type === 'achievement') {
                const criteria = {
                    type: form.criteriaType || 'games_played',
                    threshold: Number(form.threshold || 1),
                    ...(form.gameId ? { gameId: form.gameId } : {}),
                };

                try {
                    if (modal.mode === 'create') {
                        res = await achievementsApi.create({
                            title: form.title,
                            description: form.description,
                            pointsReward: Number(form.pointsReward),
                            criteria: criteria,
                            isActive: form.isActive !== false,
                        });
                    } else if (modal.mode === 'edit' && modal.data) {
                        res = await achievementsApi.update(modal.data.id, {
                            title: form.title,
                            description: form.description,
                            pointsReward: Number(form.pointsReward),
                            criteria: criteria,
                            isActive: form.isActive !== false,
                        });
                    } else if (modal.mode === 'delete' && modal.data) {
                        res = await achievementsApi.delete(modal.data.id);
                    }

                    if (res?.success) {
                        await fetchAchievements();
                        showToast(`Achievement ${modal.mode}d successfully`);
                        closeModal();
                    } else {
                        showToast(res?.error || res?.message || 'Operation failed', 'error');
                    }
                } catch (error) {
                    console.error('Achievement operation error:', error);
                    showToast('An unexpected error occurred', 'error');
                }
            }
            else if (modal.type === 'category') {
                const slug = form.slug || (form.name || '').toLowerCase().replace(/\s+/g, '-');
                if (modal.mode === 'create') res = await categoriesApi.create({ name: form.name, slug });
                else if (modal.mode === 'edit' && modal.data) res = await categoriesApi.update(modal.data.id, { name: form.name, slug: form.slug });
                else if (modal.mode === 'delete' && modal.data) res = await categoriesApi.delete(modal.data.id);
                if (res?.success) { await fetchCategories(); showToast(`Category ${modal.mode}d`); closeModal(); }
                else showToast(res?.error || res?.message || 'Operation failed', 'error');
            }
            else if (modal.type === 'game') {
                if (modal.mode === 'create') {
                    res = await gamesApi.create({
                        title: form.title,
                        slug: form.slug || (form.title || '').toLowerCase().replace(/\s+/g, '-'),
                        description: form.description, category: form.category,
                        difficulty: form.difficulty || 'medium',
                        entryFee: Number(form.entryFee || 0),
                        rewardPoints: Number(form.rewardPoints || 100),
                        durationMinutes: Number(form.durationMinutes || 10),
                        metadata: form.metadata || {},
                    });
                } else if (modal.mode === 'edit' && modal.data) {
                    res = await gamesApi.update(modal.data.id, {
                        title: form.title, description: form.description,
                        category: form.category, difficulty: form.difficulty,
                        entryFee: Number(form.entryFee), rewardPoints: Number(form.rewardPoints),
                        durationMinutes: Number(form.durationMinutes),
                        isActive: form.isActive !== false, isFeatured: form.isFeatured === true,
                    });
                } else if (modal.mode === 'delete' && modal.data) {
                    res = await gamesApi.delete(modal.data.id);
                }
                if (res?.success) { await fetchGames(); showToast(`Game ${modal.mode}d`); closeModal(); }
                else showToast(res?.error || res?.message || 'Operation failed', 'error');
            }

            else if (modal.type === 'user') {
                if (modal.mode === 'edit' && modal.data) {
                    res = await usersApi.updateStatus(modal.data.id, {
                        isActive: form.isActive !== false, reason: form.reason || 'Admin update', notes: form.notes,
                    });
                } else if (modal.mode === 'delete' && modal.data) {
                    res = await usersApi.delete(modal.data.id, {
                        reason: form.reason || 'Admin deletion', deleteData: form.deleteData === true,
                    });
                }
                if (res?.success) { await fetchUsers(); showToast(`User ${modal.mode}d`); closeModal(); }
                else showToast(res?.error || res?.message || 'Operation failed', 'error');
            }

            else if (modal.type === 'transaction') {
                if (modal.mode === 'create') {
                    res = await transactionsApi.create({
                        type: form.type || 'bonus', pointsAmount: Number(form.pointsAmount),
                        amountPaid: form.amountPaid ? Number(form.amountPaid) : undefined,
                        paymentMethod: form.paymentMethod || 'manual',
                        description: form.description, referenceId: form.referenceId,
                    });
                } else if (modal.mode === 'edit' && modal.data) {
                    res = await transactionsApi.updateStatus(modal.data.id, { status: form.status, notes: form.notes });
                }
                if (res?.success) { await fetchTransactions(); showToast(`Transaction ${modal.mode}d`); closeModal(); }
                else showToast(res?.error || res?.message || 'Operation failed', 'error');
            }

            else if (modal.type === 'leaderboard') {
                if (modal.mode === 'edit') {
                    res = await leaderboardsApi.updateScores({
                        userId: form.userId, gameId: form.gameId,
                        period: form.period || 'all_time', score: Number(form.score),
                        wins: form.wins ? Number(form.wins) : undefined,
                        losses: form.losses ? Number(form.losses) : undefined,
                    });
                } else if (modal.mode === 'delete') {
                    res = await leaderboardsApi.reset({
                        gameId: form.gameId, period: form.period || 'daily',
                        excludeAllTime: form.excludeAllTime === true,
                    });
                }
                if (res?.success) { await fetchLeaderboard(); showToast('Leaderboard updated'); closeModal(); }
                else showToast(res?.error || res?.message || 'Operation failed', 'error');
            }

        } catch {
            showToast('Unexpected error occurred', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Computed ──────────────────────────────────────────────────────────────
    const userInitial = user?.name?.charAt(0).toUpperCase() ?? 'A';
    const userName = user?.name ?? 'Admin User';
    const userPhone = user?.phone ?? '';

    const statCards: StatData[] = [
        { label: 'Total Players', value: stats ? stats.totalUsers.toLocaleString() : '—', changeType: 'increase', icon: UsersIcon, color: 'from-blue-500 to-blue-600', bgColor: 'blue', active: stats ? `${stats.attemptsToday} attempts today` : undefined },
        { label: 'Published Quizzes', value: stats ? stats.totalQuizzes.toLocaleString() : '—', changeType: 'increase', icon: CubeIcon, color: 'from-green-500 to-green-600', bgColor: 'green' },
        { label: 'Total Attempts', value: stats ? stats.totalAttempts.toLocaleString() : '—', changeType: 'increase', icon: ChartBarIcon, color: 'from-purple-500 to-purple-600', bgColor: 'purple' },
        { label: 'Avg. Score', value: stats ? `${stats.averageScore}%` : '—', changeType: 'decrease', icon: TrophyIcon, color: 'from-yellow-500 to-yellow-600', bgColor: 'yellow' },
    ];

    const maxAttempts = Math.max(...chartData.map(d => d.attempts), 1);

    // ── Modal title ────────────────────────────────────────────────────────────
    const modalTitle = modal
        ? `${modal.mode.charAt(0).toUpperCase() + modal.mode.slice(1)} ${modal.type.charAt(0).toUpperCase() + modal.type.slice(1)}`
        : '';

    // ═════════════════════════════════════════════════════════════════════════
    return (
        <div className="admin-shell">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* ── HEADER ── */}
            <header className="admin-header">

                <div className="header-brand">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}
                    >
                        <div className="brand-logo">
                            <PresentationChartLineIcon />
                        </div>
                    </button>
                    {!collapsed && (
                        <div>
                            <div className="brand-name">Admin Dashboard</div>
                            <div className="brand-tagline">Platform Management</div>
                        </div>
                    )}
                </div>
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                {mobileMenuOpen && (
                    <div className="sidebar-overlay active" onClick={() => setMobileMenuOpen(false)} />
                )}

                <div className="header-center">
                    <div className="search-field">
                        <MagnifyingGlassIcon />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="header-actions">
                    <button className="header-icon-btn" onClick={handleRefresh} title="Refresh">
                        <ArrowPathIcon />
                    </button>
                    <button className="header-icon-btn" title="Export">
                        <DocumentArrowDownIcon />
                    </button>
                    <ThemeToggle />
                    <div className="header-avatar" title={userName}>{userInitial}</div>
                </div>
            </header>

            <div className="admin-body">
                {/* ── SIDEBAR ── */}
                <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}${mobileMenuOpen ? 'mobile-open' : ''}`}>
                    <nav className="sidebar-nav">
                        {NAV_SECTIONS.map(section => (
                            <div key={section.label}>
                                <div className="sidebar-section-label">{section.label}</div>
                                {section.items.map(item => {
                                    const Icon = item.icon;
                                    const isActive = activeTab === item.id;
                                    return (
                                        <button
                                            key={item.id}
                                            className={`nav-btn ${isActive ? 'active' : ''}`}
                                            onClick={() => setActiveTab(item.id)}
                                            title={collapsed ? item.label : undefined}
                                        >
                                            <Icon className="nav-btn-icon" />
                                            <span className="nav-btn-label">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </nav>

                    <div className="sidebar-footer">
                        <div className="sidebar-user">
                            <div className="sidebar-user-avatar">{userInitial}</div>
                            {!collapsed && (
                                <div className="sidebar-user-info">
                                    <div className="sidebar-user-name">{userName}</div>
                                    <div className="sidebar-user-sub">{userPhone}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* ── MAIN ── */}
                <main className="admin-main">
                    <div className="page-head">
                        <div className="page-head-left">
                            <h1 className="page-title">
                                {NAV_SECTIONS.flatMap(s => s.items).find(t => t.id === activeTab)?.label || 'Dashboard'}
                            </h1>
                            <p className="page-subtitle">
                                {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <div className="page-head-right">
                            {!['dashboard', 'sessions', 'leaderboards'].includes(activeTab) && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => openModal(activeTab.replace(/s$/, '') as ModalState['type'], 'create')}
                                >
                                    <PlusIcon />
                                    Create New
                                </button>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div style={{ padding: '12px 16px', background: 'var(--danger-bg)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: '0.85rem' }}>
                            {error}
                        </div>
                    )}

                    {/* ═══ DASHBOARD ═══ */}
                    {activeTab === 'dashboard' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {loading ? (
                                <div className="stats-grid">
                                    {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '120px' }} />)}
                                </div>
                            ) : (
                                <div className="stats-grid">

                                    {statCards.map((s) => {
                                        const colors: Record<string, { bg: string; icon: string }> = {
                                            blue: { bg: 'rgba(59,130,246,0.1)', icon: '#60a5fa' },
                                            green: { bg: 'rgba(16,185,129,0.1)', icon: '#34d399' },
                                            purple: { bg: 'rgba(168,85,247,0.1)', icon: '#c084fc' },
                                            yellow: { bg: 'rgba(245,158,11,0.1)', icon: '#fbbf24' },
                                        };
                                        const c = colors[s.bgColor] ?? colors.blue;
                                        const Icon = s.icon;
                                        return (
                                            <div key={s.label} className="stat-card">
                                                <div className="stat-head">
                                                    <div className="stat-icon-box" style={{ background: c.bg }}>
                                                        <Icon className="stat-icon" />
                                                    </div>
                                                </div>
                                                <div className="stat-value">{s.value}</div>
                                                <div className="stat-label">{s.label}</div>
                                                {s.active && <div className="stat-sub">{s.active}</div>}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="charts-row">
                                <div className="card">
                                    <div className="card-head">
                                        <div>
                                            <div className="card-title">Quiz Attempts — Last 7 Days</div>
                                            <div className="card-subtitle">Daily activity overview</div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <div className="chart-bars-wrap">
                                            {chartData.map((d, i) => (
                                                <div key={i} className="chart-bar-group">
                                                    <div className="chart-bar-track">
                                                        <div
                                                            className="chart-bar-fill"
                                                            style={{ height: `${Math.max((d.attempts / maxAttempts) * 100, 3)}%` }}
                                                            data-value={`${d.attempts} attempts`}
                                                        />
                                                    </div>
                                                    <span className="chart-bar-label">{d.day}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-head">
                                        <div className="card-title">Recent Activity</div>
                                    </div>
                                    <div className="card-body" style={{ padding: '0 20px' }}>
                                        {recentActivity.length === 0 ? (
                                            <div className="empty-state">
                                                <p className="empty-title">No recent activity</p>
                                            </div>
                                        ) : (
                                            <div className="activity-list">
                                                {recentActivity.map(item => (
                                                    <div key={item.id} className="activity-item">
                                                        <div className="activity-dot">{item.userInitials}</div>
                                                        <div className="activity-info">
                                                            <div className="activity-text">{item.user} {item.action}</div>
                                                            <div className="activity-time">{item.time}</div>
                                                        </div>
                                                        {item.points != null && item.points > 0 && (
                                                            <span className="activity-pts">+{item.points} pts</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══ ACHIEVEMENTS ═══ */}
                    {activeTab === 'achievements' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="action-bar">
                                <button className="btn btn-yellow" onClick={() => openModal('achievement', 'create')}>
                                    <PlusIcon /> New Achievement
                                </button>
                            </div>
                            {loadingStates.achievements ? (
                                <div className="ach-grid">
                                    {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: '160px', borderRadius: 'var(--radius-lg)' }} />)}
                                </div>
                            ) : achievements.length === 0 ? (
                                <div className="empty-state">
                                    <TrophyIcon style={{ width: 40, height: 40 }} />
                                    <p className="empty-title">No achievements yet</p>
                                    <p className="empty-sub">Create your first achievement</p>
                                </div>
                            ) : (
                                <div className="ach-grid">
                                    {achievements.map((item: Achievement) => (
                                        <div key={item.id} className="ach-card">
                                            <div className="ach-card-top">
                                                <div className="ach-icon"><TrophyIcon /></div>
                                                <div className="ach-actions">
                                                    <button className="row-action-btn" onClick={() => openModal('achievement', 'edit', item)}><PencilIcon /></button>
                                                    <button className="row-action-btn danger" onClick={() => openModal('achievement', 'delete', item)}><TrashIcon /></button>
                                                </div>
                                            </div>
                                            <div className="ach-title">{item.title}</div>
                                            <div className="ach-desc">{item.description}</div>
                                            <div className="ach-foot">
                                                <span className="ach-pts">🏆 {item.pointsReward} pts</span>
                                                <span className={`badge ${item.isActive ? 'badge-green' : 'badge-red'}`}>
                                                    <span className="badge-dot" /> {item.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══ CATEGORIES ═══ */}
                    {activeTab === 'categories' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="action-bar">
                                <button className="btn btn-primary" onClick={() => openModal('category', 'create')}>
                                    <PlusIcon /> New Category
                                </button>
                            </div>
                            <div className="table-wrap">
                                <div className="table-head-row">
                                    <div>
                                        <div className="table-title">All Categories</div>
                                        <div className="table-count">{categories.length} categories</div>
                                    </div>
                                </div>
                                {loadingStates.categories ? (
                                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        <div className="spinner" style={{ margin: '0 auto' }} />
                                    </div>
                                ) : (
                                    <div className="table-scroll">
                                        <table>
                                            <thead>
                                                <tr><th>Name</th><th>Slug</th><th>Status</th><th>Created</th><th>Actions</th></tr>
                                            </thead>
                                            <tbody>
                                                {categories.length === 0 ? (
                                                    <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>No categories found</td></tr>
                                                ) : categories.map((cat: Category) => (
                                                    <tr key={cat.id}>
                                                        <td><strong>{cat.name}</strong></td>
                                                        <td><span className="mono">{cat.slug}</span></td>
                                                        <td>
                                                            <span className={`badge ${cat.isActive ? 'badge-green' : 'badge-red'}`}>
                                                                <span className="badge-dot" />{cat.isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                            {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : '—'}
                                                        </td>
                                                        <td>
                                                            <div className="row-actions">
                                                                <button className="row-action-btn" onClick={() => openModal('category', 'edit', cat)}><PencilIcon /></button>
                                                                <button className="row-action-btn danger" onClick={() => openModal('category', 'delete', cat)}><TrashIcon /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ═══ GAMES ═══ */}
                    {activeTab === 'games' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="action-bar">
                                <button className="btn btn-primary" onClick={() => openModal('game', 'create')}>
                                    <PlusIcon /> New Game
                                </button>
                            </div>
                            {loadingStates.games ? (
                                <div className="games-grid">
                                    {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: '200px', borderRadius: 'var(--radius-lg)' }} />)}
                                </div>
                            ) : games.length === 0 ? (
                                <div className="empty-state"><CpuChipIcon style={{ width: 40, height: 40 }} /><p className="empty-title">No games yet</p></div>
                            ) : (
                                <div className="games-grid">
                                    {games.map((game: Game) => (
                                        <div key={game.id} className="game-card">
                                            <div className="game-card-top">
                                                <div className="game-icon"><CpuChipIcon /></div>
                                                <div className="row-actions">
                                                    <button className="row-action-btn" onClick={() => openModal('game', 'edit', game)}><PencilIcon /></button>
                                                    <button className="row-action-btn danger" onClick={() => openModal('game', 'delete', game)}><TrashIcon /></button>
                                                </div>
                                            </div>
                                            <div className="game-title">{game.title}</div>
                                            <div className="game-desc">{game.description}</div>
                                            <div className="game-tags">
                                                <span className="game-tag">⏱ {game.durationMinutes}m</span>
                                                <span className="game-tag">🎯 {game.difficulty}</span>
                                                <span className="game-tag">💰 {game.entryFee} pts</span>
                                                <span className="game-tag">🏆 {game.rewardPoints} pts</span>
                                            </div>
                                            <div className="game-foot">
                                                <span className={`badge ${game.isActive ? 'badge-green' : 'badge-red'}`}>
                                                    <span className="badge-dot" />{game.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                                {game.isFeatured && <span className="badge badge-yellow">⭐ Featured</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ═══ LEADERBOARDS ═══ */}
                    {activeTab === 'leaderboards' && (
                        <LeaderboardsTab
                            leaderboard={leaderboard}
                            loading={loadingStates.leaderboards}
                            onEdit={() => openModal('leaderboard', 'edit')}
                            onReset={() => openModal('leaderboard', 'delete')}
                        />
                    )}

                    {/* ═══ SESSIONS ═══ */}
                    {activeTab === 'sessions' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="filters-bar">
                                <select className="filter-select" onChange={() => fetchSessions()}>
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="abandoned">Abandoned</option>
                                </select>
                            </div>
                            <div className="table-wrap">
                                <div className="table-head-row">
                                    <div>
                                        <div className="table-title">Game Sessions</div>
                                        <div className="table-count">
                                            {pagination.sessions ? `${pagination.sessions.total} total` : `${sessions.length} sessions`}
                                        </div>
                                    </div>
                                </div>
                                {loadingStates.sessions ? (
                                    <div style={{ padding: '32px', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
                                ) : (
                                    <div className="table-scroll">
                                        <table>
                                            <thead>
                                                <tr><th>Session</th><th>Player</th><th>Game</th><th>Score</th><th>Points</th><th>Status</th><th>Duration</th><th>Started</th><th>Actions</th></tr>
                                            </thead>
                                            <tbody>
                                                {sessions.length === 0 ? (
                                                    <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>No sessions found</td></tr>
                                                ) : sessions.map((session: GameSession) => (
                                                    <tr key={session.id}>
                                                        <td><span className="mono">{session.id.slice(0, 8)}…</span></td>
                                                        <td>
                                                            <div className="user-cell">
                                                                <div className="user-mini-avatar" style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                                                                    {(session.user?.username || 'U').charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="user-cell-name">{session.user?.username || 'Unknown'}</div>
                                                                    <div className="user-cell-sub">{session.user?.phoneNumber || ''}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ fontSize: '0.82rem' }}>{session.game?.title || '—'}</td>
                                                        <td><strong style={{ fontFamily: 'var(--font-mono)' }}>{session.score ?? '—'}</strong></td>
                                                        <td><span style={{ color: 'var(--success)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>+{session.pointsEarned ?? 0}</span></td>
                                                        <td>
                                                            <span className={`badge ${session.status === 'completed' ? 'badge-green' : session.status === 'abandoned' ? 'badge-red' : 'badge-yellow'}`}>
                                                                <span className="badge-dot" />{session.status}
                                                            </span>
                                                        </td>
                                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                                            {session.durationSeconds ? `${Math.floor(session.durationSeconds / 60)}m ${session.durationSeconds % 60}s` : '—'}
                                                        </td>
                                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                            {session.startedAt ? new Date(session.startedAt).toLocaleString() : '—'}
                                                        </td>
                                                        <td>
                                                            {session.status === 'active' && (
                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={async () => {
                                                                        const res = await sessionsApi.abandon(session.id);
                                                                        if (res.success) { showToast('Session abandoned'); fetchSessions(); }
                                                                        else showToast('Failed to abandon session', 'error');
                                                                    }}
                                                                >
                                                                    Abandon
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {pagination.sessions && (
                                    <div className="table-foot">
                                        <span className="table-foot-text">
                                            Page {pagination.sessions.page} / {pagination.sessions.pages} · {pagination.sessions.total} total
                                        </span>
                                        <div className="pagination">
                                            <button className="btn btn-ghost btn-sm" disabled={pagination.sessions.page <= 1} onClick={() => fetchSessions(pagination.sessions!.page - 1)}>← Prev</button>
                                            <button className="btn btn-ghost btn-sm" disabled={pagination.sessions.page >= pagination.sessions.pages} onClick={() => fetchSessions(pagination.sessions!.page + 1)}>Next →</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ═══ TRANSACTIONS ═══ */}
                    {activeTab === 'transactions' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {txStats && (
                                <div className="mini-stats">
                                    {[
                                        { label: 'Revenue', value: `KES ${(txStats.totalRevenue || 0).toLocaleString()}`, icon: CurrencyDollarIcon, color: { bg: 'rgba(16,185,129,0.12)', icon: '#34d399' } },
                                        { label: 'Transactions', value: (txStats.totalTransactions || 0).toLocaleString(), icon: CircleStackIcon, color: { bg: 'rgba(59,130,246,0.12)', icon: '#60a5fa' } },
                                        { label: 'Points Sold', value: (txStats.totalPointsPurchased || 0).toLocaleString(), icon: TrophyIcon, color: { bg: 'rgba(245,158,11,0.12)', icon: '#fbbf24' } },
                                        { label: 'Pending', value: String(txStats.paymentStatuses?.pending || 0), icon: ArrowPathIcon, color: { bg: 'rgba(239,68,68,0.12)', icon: '#f87171' } },
                                    ].map((s, i) => {
                                        const Icon = s.icon;
                                        return (
                                            <div key={i} className="mini-stat">
                                                <div className="mini-stat-icon" style={{ background: s.color.bg }}>
                                                    <Icon style={{ width: 16, height: 16, color: s.color.icon }} />
                                                </div>
                                                <div>
                                                    <div className="mini-stat-val">{s.value}</div>
                                                    <div className="mini-stat-label">{s.label}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <div className="table-wrap">
                                <div className="table-head-row">
                                    <div>
                                        <div className="table-title">All Transactions</div>
                                        <div className="table-count">{pagination.transactions ? `${pagination.transactions.total} total` : ''}</div>
                                    </div>
                                    <button className="btn btn-primary btn-sm" onClick={() => openModal('transaction', 'create')}>
                                        <PlusIcon /> New Transaction
                                    </button>
                                </div>
                                <div className="table-scroll">
                                    <table>
                                        <thead>
                                            <tr><th>ID</th><th>User</th><th>Type</th><th>Points</th><th>Amount</th><th>Method</th><th>Status</th><th>Date</th><th>Actions</th></tr>
                                        </thead>
                                        <tbody>
                                            {loadingStates.transactions ? (
                                                <tr className="loading-row"><td colSpan={9}><div className="spinner" style={{ margin: '0 auto' }} /></td></tr>
                                            ) : transactions.length === 0 ? (
                                                <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>No transactions found</td></tr>
                                            ) : transactions.map((tx: Transaction) => (
                                                <tr key={tx.id}>
                                                    <td><span className="mono">{tx.id.slice(0, 8)}…</span></td>
                                                    <td>
                                                        <div className="user-cell">
                                                            <div className="user-mini-avatar" style={{ background: 'linear-gradient(135deg,#a855f7,#9333ea)' }}>
                                                                {(tx.user?.username || 'U').charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="user-cell-name">{tx.user?.username || '—'}</div>
                                                                <div className="user-cell-sub">{tx.user?.phoneNumber || ''}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td><span className="badge badge-purple">{tx.type}</span></td>
                                                    <td><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{tx.pointsAmount?.toLocaleString()}</span></td>
                                                    <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--success)' }}>{tx.amountPaid?.toFixed(2) ?? '—'}</td>
                                                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{tx.paymentMethod || '—'}</td>
                                                    <td>
                                                        <span className={`badge ${tx.paymentStatus === 'completed' ? 'badge-green' : tx.paymentStatus === 'failed' ? 'badge-red' : 'badge-yellow'}`}>
                                                            <span className="badge-dot" />{tx.paymentStatus}
                                                        </span>
                                                    </td>
                                                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                        {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '—'}
                                                    </td>
                                                    <td>
                                                        <div className="row-actions">
                                                            <button className="row-action-btn" title="Edit" onClick={() => openModal('transaction', 'edit', tx)}><PencilIcon /></button>
                                                            {tx.paymentStatus === 'completed' && (
                                                                <button
                                                                    className="row-action-btn danger"
                                                                    title="Refund"
                                                                    onClick={async () => {
                                                                        const reason = window.prompt('Refund reason?');
                                                                        if (!reason) return;
                                                                        const res = await transactionsApi.refund(tx.id, { refundAmount: tx.amountPaid || 0, reason });
                                                                        if (res.success) { showToast('Refund processed'); fetchTransactions(); }
                                                                        else showToast(res.error || 'Refund failed', 'error');
                                                                    }}
                                                                >
                                                                    <ArrowPathIcon />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {pagination.transactions && (
                                    <div className="table-foot">
                                        <span className="table-foot-text">
                                            Page {pagination.transactions.page} / {pagination.transactions.pages}
                                        </span>
                                        <div className="pagination">
                                            <button className="btn btn-ghost btn-sm" disabled={pagination.transactions.page <= 1} onClick={() => fetchTransactions(pagination.transactions!.page - 1)}>← Prev</button>
                                            <button className="btn btn-ghost btn-sm" disabled={pagination.transactions.page >= pagination.transactions.pages} onClick={() => fetchTransactions(pagination.transactions!.page + 1)}>Next →</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ═══ USERS ═══ */}
                    {activeTab === 'users' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div className="filters-bar">
                                <div className="search-field" style={{ width: 220 }}>
                                    <MagnifyingGlassIcon />
                                    <input type="text" placeholder="Search users..." />
                                </div>
                                <select className="filter-select"><option>All Roles</option><option>admin</option><option>user</option></select>
                                <select className="filter-select"><option>All Status</option><option>Active</option><option>Inactive</option></select>
                            </div>

                            <div className="table-wrap">
                                <div className="table-head-row">
                                    <div>
                                        <div className="table-title">All Users</div>
                                        <div className="table-count">
                                            {pagination.users ? `${pagination.users.total} total` : `${users.length} users`}
                                        </div>
                                    </div>
                                </div>
                                {loadingStates.users ? (
                                    <div style={{ padding: '32px', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
                                ) : (
                                    <div className="table-scroll">
                                        <table>
                                            <thead>
                                                <tr><th>User</th><th>Phone</th><th>Role</th><th>Points</th><th>Level</th><th>Games</th><th>Status</th><th>Joined</th><th>Actions</th></tr>
                                            </thead>
                                            <tbody>
                                                {users.length === 0 ? (
                                                    <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>No users found</td></tr>
                                                ) : users.map((u: User) => (
                                                    <tr key={u.id}>
                                                        <td>
                                                            <div className="user-cell">
                                                                <div className="user-mini-avatar" style={{ background: 'linear-gradient(135deg,#3b82f6,#06b6d4)' }}>
                                                                    {(u.username || 'U').charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="user-cell-name">{u.username}</div>
                                                                    {u.countryCode && <div className="user-cell-sub">{u.countryCode}</div>}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>{u.phoneNumber}</td>
                                                        <td><span className="badge badge-purple">{u.role}</span></td>
                                                        <td><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--success)' }}>{(u.pointsBalance || 0).toLocaleString()}</span></td>
                                                        <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{u.level || 1}</td>
                                                        <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)' }}>{u.totalGamesPlayed || 0}</td>
                                                        <td>
                                                            <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>
                                                                <span className="badge-dot" />{u.isActive ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </td>
                                                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                                                        </td>
                                                        <td>
                                                            <div className="row-actions">
                                                                <button className="row-action-btn" onClick={() => openModal('user', 'edit', u)}><PencilIcon /></button>
                                                                <button className="row-action-btn danger" onClick={() => openModal('user', 'delete', u)}><TrashIcon /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                                {pagination.users && (
                                    <div className="table-foot">
                                        <span className="table-foot-text">
                                            Page {pagination.users.page} / {pagination.users.pages} · {pagination.users.total} users
                                        </span>
                                        <div className="pagination">
                                            <button className="btn btn-ghost btn-sm" disabled={pagination.users.page <= 1} onClick={() => fetchUsers(pagination.users!.page - 1)}>← Prev</button>
                                            <button className="btn btn-ghost btn-sm" disabled={pagination.users.page >= pagination.users.pages} onClick={() => fetchUsers(pagination.users!.page + 1)}>Next →</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* ═══ MODALS ═══ */}
            {modal && (
                <Modal title={modalTitle} onClose={closeModal}>

                    {/* Shared delete confirmation (non-user, non-leaderboard) */}
                    {modal.mode === 'delete' && !['user', 'leaderboard'].includes(modal.type) && (
                        <div className="form-stack">
                            <div className="delete-box">
                                <ExclamationTriangleIcon />
                                <p className="delete-box-text">
                                    Delete <strong>{modal.data?.title || modal.data?.name || modal.data?.username}</strong>? This cannot be undone.
                                </p>
                            </div>
                            <div className="form-actions">
                                <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                                <button className="btn btn-danger" style={{ background: 'var(--danger)', color: '#fff' }} disabled={submitting} onClick={handleSubmit}>
                                    {submitting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Achievement form */}
                    {(modal.mode === 'create' || modal.mode === 'edit') && modal.type === 'achievement' && (
                        <AchievementForm
                            form={{ title: form.title || '', description: form.description || '', pointsReward: Number(form.pointsReward) || 0, criteriaType: form.criteriaType || 'games_played', threshold: Number(form.threshold) || 1, gameId: form.gameId || '', isActive: form.isActive !== false }}
                            setForm={f => setForm({ ...form, ...f })}
                            submitting={submitting}
                            mode={modal.mode}
                            onSubmit={handleSubmit}
                            onCancel={closeModal}
                        />
                    )}

                    {/* Category form */}
                    {(modal.mode === 'create' || modal.mode === 'edit') && modal.type === 'category' && (
                        <CategoryForm
                            form={{ name: form.name || '', slug: form.slug || '' }}
                            setForm={f => setForm({ ...form, ...f })}
                            submitting={submitting}
                            mode={modal.mode}
                            onSubmit={handleSubmit}
                            onCancel={closeModal}
                        />
                    )}

                    {/* Game form */}
                    {(modal.mode === 'create' || modal.mode === 'edit') && modal.type === 'game' && (
                        <GameForm
                            form={{ title: form.title || '', slug: form.slug || '', description: form.description || '', category: form.category || '', difficulty: form.difficulty || 'medium', entryFee: Number(form.entryFee) || 0, rewardPoints: Number(form.rewardPoints) || 0, durationMinutes: Number(form.durationMinutes) || 0, isActive: form.isActive !== false, isFeatured: form.isFeatured === true }}
                            setForm={f => setForm({ ...form, ...f })}
                            submitting={submitting}
                            mode={modal.mode}
                            onSubmit={handleSubmit}
                            onCancel={closeModal}
                        />
                    )}

                    {/* User form (edit & delete handled by component) */}
                    {(modal.mode === 'edit' || modal.mode === 'delete') && modal.type === 'user' && (
                        <UserForm
                            form={{ isActive: form.isActive !== false, reason: form.reason || '', notes: form.notes || '', deleteData: form.deleteData || false }}
                            setForm={f => setForm({ ...form, ...f })}
                            submitting={submitting}
                            mode={modal.mode as 'edit' | 'delete'}
                            user={modal.data}
                            onSubmit={handleSubmit}
                            onCancel={closeModal}
                        />
                    )}

                    {/* Transaction create */}
                    {modal.mode === 'create' && modal.type === 'transaction' && (
                        <div className="form-stack">
                            <div className="form-row form-row-2">
                                <div className="form-group">
                                    <label className="form-label">Type *</label>
                                    <select className="form-select" value={form.type || 'bonus'} onChange={e => setForm({ ...form, type: e.target.value })}>
                                        <option value="bonus">Bonus</option>
                                        <option value="purchase">Purchase</option>
                                        <option value="withdrawal">Withdrawal</option>
                                        <option value="refund">Refund</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Payment Method</label>
                                    <select className="form-select" value={form.paymentMethod || 'manual'} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
                                        <option value="manual">Manual</option>
                                        <option value="mpesa">M-Pesa</option>
                                        <option value="card">Card</option>
                                        <option value="wallet">Wallet</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description *</label>
                                <input className="form-input" placeholder="Transaction description" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
                            </div>
                            <div className="form-row form-row-2">
                                <div className="form-group">
                                    <label className="form-label">Points *</label>
                                    <input type="number" className="form-input" placeholder="0" value={form.pointsAmount || ''} onChange={e => setForm({ ...form, pointsAmount: e.target.value })} min="0" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Amount Paid (KES)</label>
                                    <input type="number" className="form-input" placeholder="0.00" value={form.amountPaid || ''} onChange={e => setForm({ ...form, amountPaid: e.target.value })} min="0" step="0.01" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Reference ID</label>
                                <input className="form-input" placeholder="Optional reference" value={form.referenceId || ''} onChange={e => setForm({ ...form, referenceId: e.target.value })} />
                            </div>
                            <div className="form-actions">
                                <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                                <button className="btn btn-primary" disabled={submitting || !form.type || !form.description || !form.pointsAmount} onClick={handleSubmit}>
                                    {submitting ? 'Creating...' : 'Create Transaction'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Transaction edit status */}
                    {modal.mode === 'edit' && modal.type === 'transaction' && (
                        <div className="form-stack">
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                                Update status for <span className="mono">{modal.data?.id?.slice(0, 8)}...</span>
                            </p>
                            <div className="form-group">
                                <label className="form-label">Status *</label>
                                <select className="form-select" value={form.status || modal.data?.paymentStatus || 'pending'} onChange={e => setForm({ ...form, status: e.target.value })}>
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                    <option value="failed">Failed</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Notes</label>
                                <input className="form-input" placeholder="Additional notes" value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} />
                            </div>
                            <div className="form-actions">
                                <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                                <button className="btn btn-primary" disabled={submitting} onClick={handleSubmit}>
                                    {submitting ? 'Updating...' : 'Update Status'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Leaderboard update scores */}
                    {modal.mode === 'edit' && modal.type === 'leaderboard' && (
                        <div className="form-stack">
                            <div className="form-row form-row-2">
                                <div className="form-group">
                                    <label className="form-label">User ID *</label>
                                    <input className="form-input" placeholder="UUID" value={form.userId || ''} onChange={e => setForm({ ...form, userId: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Game ID *</label>
                                    <input className="form-input" placeholder="UUID" value={form.gameId || ''} onChange={e => setForm({ ...form, gameId: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-row form-row-2">
                                <div className="form-group">
                                    <label className="form-label">Period</label>
                                    <select className="form-select" value={form.period || 'all_time'} onChange={e => setForm({ ...form, period: e.target.value })}>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="all_time">All Time</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Score *</label>
                                    <input type="number" className="form-input" placeholder="0" value={form.score || ''} onChange={e => setForm({ ...form, score: e.target.value })} min="0" />
                                </div>
                            </div>
                            <div className="form-row form-row-2">
                                <div className="form-group">
                                    <label className="form-label">Wins</label>
                                    <input type="number" className="form-input" placeholder="0" value={form.wins || ''} onChange={e => setForm({ ...form, wins: e.target.value })} min="0" />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Losses</label>
                                    <input type="number" className="form-input" placeholder="0" value={form.losses || ''} onChange={e => setForm({ ...form, losses: e.target.value })} min="0" />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                                <button className="btn btn-primary" disabled={submitting || !form.userId || !form.gameId || !form.score} onClick={handleSubmit}>
                                    {submitting ? 'Updating...' : 'Update Scores'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Leaderboard reset */}
                    {modal.mode === 'delete' && modal.type === 'leaderboard' && (
                        <div className="form-stack">
                            <div className="delete-box">
                                <ExclamationTriangleIcon />
                                <p className="delete-box-text">This will clear scores for the selected game and period.</p>
                            </div>
                            <div className="form-row form-row-2">
                                <div className="form-group">
                                    <label className="form-label">Game ID *</label>
                                    <input className="form-input" placeholder="UUID" value={form.gameId || ''} onChange={e => setForm({ ...form, gameId: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Period</label>
                                    <select className="form-select" value={form.period || 'daily'} onChange={e => setForm({ ...form, period: e.target.value })}>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="all_time">All Time</option>
                                    </select>
                                </div>
                            </div>
                            <label className="checkbox-row">
                                <input type="checkbox" checked={form.excludeAllTime || false} onChange={e => setForm({ ...form, excludeAllTime: e.target.checked })} />
                                <span className="checkbox-label">Exclude all-time leaderboard from reset</span>
                            </label>
                            <div className="form-actions">
                                <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                                <button className="btn btn-danger" style={{ background: 'var(--danger)', color: '#fff' }} disabled={submitting || !form.gameId} onClick={handleSubmit}>
                                    {submitting ? 'Resetting...' : 'Reset Leaderboard'}
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>
            )}
        </div>
    );
};

export default Dashboard;
