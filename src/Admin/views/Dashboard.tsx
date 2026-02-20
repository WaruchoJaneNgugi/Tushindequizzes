import {useStore} from "../store/useStore.ts";

import {
    TrophyIcon,
    CubeIcon,
    CpuChipIcon,
    ChartBarIcon,
    CircleStackIcon,
    CurrencyDollarIcon,
    UsersIcon,
    PresentationChartLineIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    FunnelIcon,
    ArrowPathIcon,
    DocumentArrowDownIcon,
    MagnifyingGlassIcon,
    ChevronDownIcon,
    XMarkIcon,
    CheckIcon,
    ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import {ThemeToggle} from '../components/ThemeToggle';
import '../assets/adminstyles.css';
import {useState, useEffect, useCallback} from 'react';
import {useDashboardData} from '../hooks/useDashboardData';
import {
    achievementsApi,
    categoriesApi,
    gamesApi,
    leaderboardsApi,
    sessionsApi,
    transactionsApi,
    usersApi,
} from '../services/api';
import '../assets/admin.css';

// Import types
import {
    type User,
    type Game,
    type Transaction,
    type TransactionStats,
    type Achievement,
    type Category,
    type GameSession,
    type LeaderboardEntry,
    type Tab,
    type StatData,
    type ModalState,
    type FormData,
    type ToastState,
    type LoadingStates,
    type PaginationState,
    type ApiResponse,
} from '../types/adminTypes';

const tabs: Tab[] = [
    {id: 'dashboard', label: 'Dashboard', icon: PresentationChartLineIcon, color: 'from-blue-500 to-blue-600'},
    {id: 'achievements', label: 'Achievements', icon: TrophyIcon, color: 'from-yellow-500 to-yellow-600'},
    {id: 'categories', label: 'Categories', icon: CubeIcon, color: 'from-green-500 to-green-600'},
    {id: 'games', label: 'Games', icon: CpuChipIcon, color: 'from-purple-500 to-purple-600'},
    {id: 'leaderboards', label: 'Leaderboards', icon: ChartBarIcon, color: 'from-red-500 to-red-600'},
    {id: 'sessions', label: 'Sessions', icon: CircleStackIcon, color: 'from-indigo-500 to-indigo-600'},
    {id: 'transactions', label: 'Transactions', icon: CurrencyDollarIcon, color: 'from-emerald-500 to-emerald-600'},
    {id: 'users', label: 'Users', icon: UsersIcon, color: 'from-orange-500 to-orange-600'},
];

// ─── Modal Component ──────────────────────────────────────────────────────────
interface ModalProps {
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

function Modal({title, onClose, children}: ModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
            <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <XMarkIcon className="w-5 h-5"/>
                    </button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}

// ─── Toast Component ─────────────────────────────────────────────────────────
interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

function Toast({message, type, onClose}: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3500);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm ${
                type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}>
            {type === 'success' ? <CheckIcon className="w-4 h-4"/> : <ExclamationTriangleIcon className="w-4 h-4"/>}
            {message}
        </div>
    );
}

interface DashboardProps {
    user?: { name?: string; phone?: string } | null
}

const Dashboard = ({user}: DashboardProps) => {
    const {activeTab, setActiveTab} = useStore();
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [toast, setToast] = useState<ToastState | null>(null);

    const showToast = (message: string, type: 'success' | 'error' = 'success') =>
        setToast({message, type});

    // ── Dashboard data ─────────────────────────────────────────────────────────
    const {stats, recentActivity, chartData, loading, error, refreshData} = useDashboardData();

    // ── Tab data ───────────────────────────────────────────────────────────────
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
        users: false,
        games: false,
        transactions: false,
        achievements: false,
        categories: false,
        sessions: false,
        leaderboards: false,
    });

    const setLoading = (key: keyof LoadingStates, value: boolean) => {
        setLoadingStates(prev => ({...prev, [key]: value}));
    };

    // ── Modal state ────────────────────────────────────────────────────────────
    const [modal, setModal] = useState<ModalState | null>(null);
    const [form, setForm] = useState<FormData>({});
    const [submitting, setSubmitting] = useState<boolean>(false);

    // ── Fetch functions ────────────────────────────────────────────────────────
    const fetchUsers = useCallback(async (page = 1) => {
        setLoading('users', true);
        try {
            const res = await usersApi.getAll({page, limit: 10});
            if (res.success && res.data) {
                const usersData = Array.isArray(res.data) ? res.data : res.data.users || [];
                setUsers(usersData);
                if (res.pagination) setPagination(prev => ({...prev, users: res.pagination}));
            }
        } catch (e) {
            console.error('Error fetching users:', e);
            showToast('Failed to fetch users', 'error');
        } finally {
            setLoading('users', false);
        }
    }, []);

    const fetchGames = useCallback(async (page = 1) => {
        setLoading('games', true);
        try {
            const res = await gamesApi.getAll({page, limit: 10});
            if (res.success && res.data) {
                const gamesData = Array.isArray(res.data) ? res.data : res.data.games || [];
                setGames(gamesData);
                if (res.pagination) setPagination(prev => ({...prev, games: res.pagination}));
            }
        } catch (e) {
            console.error('Error fetching games:', e);
            showToast('Failed to fetch games', 'error');
        } finally {
            setLoading('games', false);
        }
    }, []);

    const fetchTransactions = useCallback(async (page = 1) => {
        setLoading('transactions', true);
        try {
            const [txRes, statsRes] = await Promise.all([
                transactionsApi.getAll({page, limit: 10}),
                transactionsApi.getStats(),
            ]);

            if (txRes.success && txRes.data) {
                const txData = Array.isArray(txRes.data) ? txRes.data : [];
                setTransactions(txData);
                if (txRes.pagination) setPagination(prev => ({...prev, transactions: txRes.pagination}));
            }

            if (statsRes.success && statsRes.data) {
                setTxStats(statsRes.data);
            }
        } catch (e) {
            console.error('Error fetching transactions:', e);
            showToast('Failed to fetch transactions', 'error');
        } finally {
            setLoading('transactions', false);
        }
    }, []);

    const fetchAchievements = useCallback(async (page = 1) => {
        setLoading('achievements', true);
        try {
            const res = await achievementsApi.getAll({page, limit: 12});
            if (res.success && res.data) {
                const achievementsData = Array.isArray(res.data) ? res.data : res.data.achievements || [];
                setAchievements(achievementsData);
                if (res.pagination) setPagination(prev => ({...prev, achievements: res.pagination}));
            }
        } catch (e) {
            console.error('Error fetching achievements:', e);
            showToast('Failed to fetch achievements', 'error');
        } finally {
            setLoading('achievements', false);
        }
    }, []);

    const fetchCategories = useCallback(async (page = 1) => {
        setLoading('categories', true);
        try {
            const res = await categoriesApi.getAll({page, limit: 10});
            if (res.success && res.data) {
                const categoriesData = Array.isArray(res.data) ? res.data : res.data.categories || [];
                setCategories(categoriesData);
                if (res.pagination) setPagination(prev => ({...prev, categories: res.pagination}));
            }
        } catch (e) {
            console.error('Error fetching categories:', e);
            showToast('Failed to fetch categories', 'error');
        } finally {
            setLoading('categories', false);
        }
    }, []);

    const fetchSessions = useCallback(async (page = 1) => {
        setLoading('sessions', true);
        try {
            const res = await sessionsApi.getAll({page, limit: 10});
            if (res.success && res.data) {
                const sessionsData = Array.isArray(res.data) ? res.data : [];
                setSessions(sessionsData);
                if (res.pagination) setPagination(prev => ({...prev, sessions: res.pagination}));
            }
        } catch (e) {
            console.error('Error fetching sessions:', e);
            showToast('Failed to fetch sessions', 'error');
        } finally {
            setLoading('sessions', false);
        }
    }, []);

    const fetchLeaderboard = useCallback(async () => {
        setLoading('leaderboards', true);
        try {
            const res = await leaderboardsApi.getGlobal('all_time');
            if (res.success && res.data) {
                const leaderboardData = Array.isArray(res.data) ? res.data : [];
                setLeaderboard(leaderboardData);
            }
        } catch (e) {
            console.error('Error fetching leaderboard:', e);
            showToast('Failed to fetch leaderboard', 'error');
        } finally {
            setLoading('leaderboards', false);
        }
    }, []);

    useEffect(() => {
        switch (activeTab) {
            case 'users':
                fetchUsers();
                break;
            case 'games':
                fetchGames();
                break;
            case 'transactions':
                fetchTransactions();
                break;
            case 'achievements':
                fetchAchievements();
                break;
            case 'categories':
                fetchCategories();
                break;
            case 'sessions':
                fetchSessions();
                break;
            case 'leaderboards':
                fetchLeaderboard();
                break;
        }
    }, [activeTab, fetchUsers, fetchGames, fetchTransactions, fetchAchievements, fetchCategories, fetchSessions, fetchLeaderboard]);

    const handleRefresh = () => {
        if (activeTab === 'dashboard') {
            refreshData();
        } else {
            switch (activeTab) {
                case 'users':
                    fetchUsers();
                    break;
                case 'games':
                    fetchGames();
                    break;
                case 'transactions':
                    fetchTransactions();
                    break;
                case 'achievements':
                    fetchAchievements();
                    break;
                case 'categories':
                    fetchCategories();
                    break;
                case 'sessions':
                    fetchSessions();
                    break;
                case 'leaderboards':
                    fetchLeaderboard();
                    break;
            }
        }
    };

    // ── CRUD submit handlers ───────────────────────────────────────────────────
    const handleSubmit = async () => {
        if (!modal) return;
        setSubmitting(true);

        try {
            let res: ApiResponse<any> | undefined;

            switch (modal.type) {
                case 'achievement':
                    if (modal.mode === 'create') {
                        const criteria = {
                            type: form.criteriaType || 'games_played',
                            threshold: Number(form.threshold || 1),
                            ...(form.gameId ? { gameId: form.gameId } : {})
                        };

                        console.log('Creating achievement with data:', {
                            title: form.title,
                            description: form.description,
                            pointsReward: Number(form.pointsReward),
                            criteria,
                            isActive: form.isActive !== false,
                        });

                        res = await achievementsApi.create({
                            title: form.title,
                            description: form.description,
                            pointsReward: Number(form.pointsReward),
                            criteria,
                            isActive: form.isActive !== false,
                        });
                    } else if (modal.mode === 'edit' && modal.data) {
                        res = await achievementsApi.update(modal.data.id, {
                            title: form.title,
                            description: form.description,
                            pointsReward: Number(form.pointsReward),
                            criteria: {
                                type: form.criteriaType || modal.data.criteria?.type || 'games_played',
                                threshold: Number(form.threshold || modal.data.criteria?.threshold || 1),
                                ...(form.gameId ? { gameId: form.gameId } : {})
                            },
                            isActive: form.isActive !== false,
                        });
                    } else if (modal.mode === 'delete' && modal.data) {
                        res = await achievementsApi.delete(modal.data.id);
                    }

                    if (res?.success) {
                        await fetchAchievements();
                        showToast(`Achievement ${modal.mode}d successfully`);
                        setModal(null);
                    } else {
                        showToast(res?.error || res?.message || 'Operation failed', 'error');
                    }
                    break;

                case 'category':
                    if (modal.mode === 'create') {
                        const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-');
                        console.log('Creating category:', { name: form.name, slug });
                        res = await categoriesApi.create({
                            name: form.name,
                            slug: slug
                        });
                    } else if (modal.mode === 'edit' && modal.data) {
                        res = await categoriesApi.update(modal.data.id, {
                            name: form.name,
                            slug: form.slug
                        });
                    } else if (modal.mode === 'delete' && modal.data) {
                        res = await categoriesApi.delete(modal.data.id);
                    }

                    if (res?.success) {
                        await fetchCategories();
                        showToast(`Category ${modal.mode}d successfully`);
                        setModal(null);
                    } else {
                        showToast(res?.error || res?.message || 'Operation failed', 'error');
                    }
                    break;

                case 'game':
                    if (modal.mode === 'create') {
                        const gameData = {
                            title: form.title,
                            slug: form.slug || form.title.toLowerCase().replace(/\s+/g, '-'),
                            description: form.description,
                            category: form.category,
                            difficulty: form.difficulty || 'medium',
                            entryFee: Number(form.entryFee || 0),
                            rewardPoints: Number(form.rewardPoints || 100),
                            durationMinutes: Number(form.durationMinutes || 10),
                            metadata: form.metadata || {}
                        };
                        console.log('Creating game:', gameData);
                        res = await gamesApi.create(gameData);
                    } else if (modal.mode === 'edit' && modal.data) {
                        res = await gamesApi.update(modal.data.id, {
                            title: form.title,
                            description: form.description,
                            category: form.category,
                            difficulty: form.difficulty,
                            entryFee: Number(form.entryFee),
                            rewardPoints: Number(form.rewardPoints),
                            durationMinutes: Number(form.durationMinutes),
                            isActive: form.isActive !== false,
                            isFeatured: form.isFeatured === true,
                            metadata: form.metadata
                        });
                    } else if (modal.mode === 'delete' && modal.data) {
                        res = await gamesApi.delete(modal.data.id);
                    }

                    if (res?.success) {
                        await fetchGames();
                        showToast(`Game ${modal.mode}d successfully`);
                        setModal(null);
                    } else {
                        showToast(res?.error || res?.message || 'Operation failed', 'error');
                    }
                    break;

                case 'user':
                    if (modal.mode === 'edit' && modal.data) {
                        res = await usersApi.updateStatus(modal.data.id, {
                            isActive: form.isActive !== false,
                            reason: form.reason || 'Admin update',
                            notes: form.notes,
                        });
                    } else if (modal.mode === 'delete' && modal.data) {
                        res = await usersApi.delete(modal.data.id, {
                            reason: form.reason || 'Admin deletion',
                            deleteData: form.deleteData === true
                        });
                    }

                    if (res?.success) {
                        await fetchUsers();
                        showToast(`User ${modal.mode}d successfully`);
                        setModal(null);
                    } else {
                        showToast(res?.error || res?.message || 'Operation failed', 'error');
                    }
                    break;

                case 'transaction':
                    if (modal.mode === 'create') {
                        const transactionData = {
                            type: form.type || 'bonus',
                            pointsAmount: Number(form.pointsAmount),
                            amountPaid: form.amountPaid ? Number(form.amountPaid) : undefined,
                            paymentMethod: form.paymentMethod || 'manual',
                            description: form.description,
                            referenceId: form.referenceId,
                            metadata: form.metadata
                        };
                        console.log('Creating transaction:', transactionData);
                        res = await transactionsApi.create(transactionData);
                    } else if (modal.mode === 'edit' && modal.data) {
                        res = await transactionsApi.updateStatus(modal.data.id, {
                            status: form.status,
                            notes: form.notes,
                        });
                    }

                    if (res?.success) {
                        await fetchTransactions();
                        showToast(`Transaction ${modal.mode}d successfully`);
                        setModal(null);
                    } else {
                        showToast(res?.error || res?.message || 'Operation failed', 'error');
                    }
                    break;

                case 'leaderboard':
                    if (modal.mode === 'edit') {
                        res = await leaderboardsApi.updateScores({
                            userId: form.userId,
                            gameId: form.gameId,
                            period: form.period || 'all_time',
                            score: Number(form.score),
                            wins: form.wins ? Number(form.wins) : undefined,
                            losses: form.losses ? Number(form.losses) : undefined,
                        });
                    } else if (modal.mode === 'delete') {
                        res = await leaderboardsApi.reset({
                            gameId: form.gameId,
                            period: form.period || 'daily',
                            excludeAllTime: form.excludeAllTime === true,
                        });
                    }

                    if (res?.success) {
                        await fetchLeaderboard();
                        showToast('Leaderboard updated successfully');
                        setModal(null);
                    } else {
                        showToast(res?.error || res?.message || 'Operation failed', 'error');
                    }
                    break;
            }
        } catch (error) {
            // console.error('Submit error:', error);
            showToast(  `Unexpected error occurred`,"error");
        } finally {
            setSubmitting(false);
        }
    };

    const openModal = (type: ModalState['type'], mode: ModalState['mode'], data?: any) => {
        console.log('🚀 openModal called with:', { type, mode, data });

        try {
            // Initialize form with existing data or empty object
            if (data) {
                console.log('📋 Setting form with existing data:', data);
                const formData: FormData = { ...data };

                // Handle special cases for criteria
                if (type === 'achievement' && data.criteria) {
                    formData.criteriaType = data.criteria.type;
                    formData.threshold = data.criteria.threshold;
                    formData.gameId = data.criteria.gameId;
                }

                setForm(formData);
            } else {
                console.log('📋 Setting form with defaults for:', type);
                // For create mode, set default values
                const defaultForm: FormData = {};

                if (type === 'achievement') {
                    defaultForm.isActive = true;
                    defaultForm.criteriaType = 'games_played';
                    defaultForm.threshold = 1;
                } else if (type === 'category') {
                    // No defaults needed
                } else if (type === 'game') {
                    defaultForm.difficulty = 'medium';
                    defaultForm.isActive = true;
                    defaultForm.isFeatured = false;
                } else if (type === 'transaction') {
                    defaultForm.type = 'bonus';
                    defaultForm.paymentMethod = 'manual';
                }

                setForm(defaultForm);
            }

            // Set the modal state
            console.log('🔧 Setting modal state with:', { type, mode, data });
            setModal({ type, mode, data });

            // Log after setting (though we'll see this in the useEffect)
        } catch (error) {
            console.error('❌ Error in openModal:', error);
        }
    };

    // ── Stats for dashboard ────────────────────────────────────────────────────
    const currentStatsData: StatData[] = stats
        ? [
            {
                label: 'TOTAL PLAYERS',
                value: stats.totalUsers.toLocaleString(),
                // change: '+12%',
                changeType: 'increase',
                active: `${stats.attemptsToday} attempts today`,
                icon: UsersIcon,
                color: 'from-blue-500 to-blue-600',
                bgColor: 'bg-blue-50 dark:bg-blue-900/20'
            },
            {
                label: 'PUBLISHED QUIZZES',
                value: stats.totalQuizzes.toLocaleString(),
                // change: '+8%',
                changeType: 'increase',
                icon: CubeIcon,
                color: 'from-green-500 to-green-600',
                bgColor: 'bg-green-50 dark:bg-green-900/20'
            },
            {
                label: 'TOTAL ATTEMPTS',
                value: stats.totalAttempts.toLocaleString(),
                // change: '+5%',
                changeType: 'increase',
                icon: ChartBarIcon,
                color: 'from-purple-500 to-purple-600',
                bgColor: 'bg-purple-50 dark:bg-purple-900/20'
            },
            {
                label: 'AVG. SCORE',
                value: `${stats.averageScore}%`,
                // change: '-2%',
                changeType: 'decrease',
                icon: TrophyIcon,
                color: 'from-yellow-500 to-yellow-600',
                bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
            },
        ]
        : [
            {
                label: 'TOTAL PLAYERS',
                value: '—',
                // change: '—',
                changeType: 'increase',
                icon: UsersIcon,
                color: 'from-blue-500 to-blue-600',
                bgColor: 'bg-blue-50 dark:bg-blue-900/20'
            },
            {
                label: 'PUBLISHED QUIZZES',
                value: '—',
                // change: '—',
                changeType: 'increase',
                icon: CubeIcon,
                color: 'from-green-500 to-green-600',
                bgColor: 'bg-green-50 dark:bg-green-900/20'
            },
            {
                label: 'TOTAL ATTEMPTS',
                value: '—',
                // change: '—',
                changeType: 'increase',
                icon: ChartBarIcon,
                color: 'from-purple-500 to-purple-600',
                bgColor: 'bg-purple-50 dark:bg-purple-900/20'
            },
            {
                label: 'AVG. SCORE',
                value: '—',
                // change: '—',
                changeType: 'decrease',
                icon: TrophyIcon,
                color: 'from-yellow-500 to-yellow-600',
                bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
            },
        ];

    const userInitial = user?.name?.charAt(0).toUpperCase() || 'A';
    const userName = user?.name || 'Admin User';
    const userPhone = user?.phone || '';

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="dashboard-container">
            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)}/>}

            {/* ── Header ── */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="header-left">
                        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="mobile-menu-btn">
                            <ChevronDownIcon className="icon-small"/>
                        </button>
                        <div className="logo-section">
                            <div className="logo-icon">
                                <PresentationChartLineIcon className="icon-medium text-white"/>
                            </div>
                            <div>
                                <h1 className="logo-title">Admin Dashboard</h1>
                                <p className="logo-subtitle">Manage your platform with ease</p>
                            </div>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="search-wrapper">
                            <MagnifyingGlassIcon className="search-icon"/>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>
                        <ThemeToggle/>
                    </div>
                </div>
            </header>

            <div className="main-layout">
                {/* ── Sidebar ── */}
                <aside className={`sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                    <nav className="sidebar-nav">
                        {tabs.map((tab: Tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`nav-item ${isActive ? 'nav-item-active' : ''}`}
                                    data-color={tab.color}
                                >
                                    <Icon className={`nav-icon ${isActive ? 'nav-icon-active' : ''}`}/>
                                    {!sidebarCollapsed && <span className="nav-label">{tab.label}</span>}
                                    {isActive && !sidebarCollapsed && <div className="active-indicator"></div>}
                                </button>
                            );
                        })}
                    </nav>
                    {!sidebarCollapsed && (
                        <div className="user-profile">
                            <div className="user-avatar">{userInitial}</div>
                            <div className="user-info">
                                <p className="user-name">{userName}</p>
                                <p className="user-email">{userPhone}</p>
                            </div>
                        </div>
                    )}
                </aside>

                {/* ── Main Content ── */}
                <main className="main-content">
                    <div className="page-header">
                        <h2 className="page-title">{tabs.find(t => t.id === activeTab)?.label} Management</h2>
                        <div className="action-buttons">
                            <button className="icon-button" onClick={handleRefresh}>
                                <ArrowPathIcon className="icon-small"/>
                            </button>
                            <button className="icon-button">
                                <DocumentArrowDownIcon className="icon-small"/>
                            </button>
                            {!['dashboard', 'sessions', 'leaderboards'].includes(activeTab) && (
                                <button className="primary-button"
                                        onClick={() => openModal(activeTab.replace(/s$/, '') as ModalState['type'], 'create')}>
                                    <PlusIcon className="icon-small"/>
                                    <span>Create New</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    {/* ── DASHBOARD TAB ── */}
                    {activeTab === 'dashboard' && (
                        loading ? (
                            <div className="loading-skeleton">
                                <div className="stats-grid">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-card"></div>)}
                                </div>
                            </div>
                        ) : (
                            <div className="dashboard-content">
                                <div className="stats-grid">
                                    {currentStatsData.map((stat: StatData) => {
                                        const Icon = stat.icon;
                                        return (
                                            <div key={stat.label} className="stat-card">
                                                <div className="stat-header">
                                                    <div className={`stat-icon-wrapper ${stat.bgColor}`}>
                                                        <Icon className={`stat-icon bg-gradient-to-br ${stat.color}`}/>
                                                    </div>
                          {/*                          <span*/}
                          {/*                              className={`stat-change ${stat.changeType === 'increase' ? 'positive' : 'negative'}`}>*/}
                          {/*  {stat.}*/}
                          {/*</span>*/}
                                                </div>
                                                <p className="stat-value">{stat.value}</p>
                                                <p className="stat-label">{stat.label}</p>
                                                {stat.active && <p className="stat-active">{stat.active}</p>}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="charts-row">
                                    <div className="chart-card">
                                        <div className="chart-header">
                                            <div>
                                                <h3 className="chart-title">Quiz Attempts (Last 7 Days)</h3>
                                                <p className="chart-subtitle">Daily quiz completions</p>
                                            </div>
                                        </div>
                                        <div className="chart-bars">
                                            {chartData.map((data, index) => (
                                                <div key={index} className="bar-container">
                                                    <div className="bar-wrapper">
                                                        <div className="bar"
                                                             style={{height: `${Math.max(data.attempts, 2)}%`}}>
                                                            <div className="bar-tooltip">{data.attempts} attempts</div>
                                                        </div>
                                                    </div>
                                                    <span className="bar-label">{data.day}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="activity-card">
                                        <h3 className="activity-title">Recent Activity</h3>
                                        <div className="activity-list">
                                            {recentActivity.length === 0 ? (
                                                <p className="no-data">No recent activity</p>
                                            ) : recentActivity.map(item => (
                                                <div key={item.id} className="activity-item">
                                                    <div className="activity-avatar">{item.userInitials}</div>
                                                    <div className="activity-details">
                                                        <p className="activity-text">{item.user} {item.action}</p>
                                                        <p className="activity-time">{item.time}</p>
                                                    </div>
                                                    {item.points != null && item.points > 0 && (
                                                        <span className="activity-points">+{item.points} pts</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    )}

                    {/* ── ACHIEVEMENTS TAB ── */}
                    {activeTab === 'achievements' && (
                        <div className="tab-content">
                            <div className="action-bar">
                                <button className="primary-button yellow-button"
                                        onClick={() => openModal('achievement', 'create')}>
                                    <PlusIcon className="icon-small"/> Create Achievement
                                </button>
                                <button className="secondary-button">
                                    <FunnelIcon className="icon-small"/> Filter
                                </button>
                            </div>
                            {loadingStates.achievements ? (
                                    <div className="loading-spinner">...</div>
                                )
                                : achievements.length === 0 ? (
                                <div className="no-data">No achievements found</div>
                            ):(
                            <div className="achievements-grid">
                            {achievements.map((item: Achievement) => (
                                             <div key={item.id} className="achievement-card">
                                                 <div className="achievement-header">
                                                     <div className="achievement-icon-wrapper yellow-bg">
                                                         <TrophyIcon className="achievement-icon yellow-text"/>
                                                     </div>
                                                     <div className="achievement-actions">
                                                         <button
                                                             className="action-icon-btn"
                                                             onClick={() => openModal('achievement', 'edit', item)}
                                                         >
                                                             <PencilIcon className="icon-small"/>
                                                         </button>
                                                         <button
                                                             className="action-icon-btn"
                                                             onClick={() => openModal('achievement', 'delete', item)}
                                                         >
                                                             <TrashIcon className="icon-small text-red"/>
                                                         </button>
                                                     </div>
                                                 </div>
                                                 <h4 className="achievement-title">{item.title}</h4>
                                                 <p className="achievement-description">{item.description}</p>
                                                 <div className="flex items-center justify-between mt-2">
                                                     <span
                                                         className="text-xs text-gray-500">Points: {item.pointsReward}</span>
                                                     <span
                                                         className={`status-badge ${item.isActive ? 'active' : 'inactive'}`}>
                               {item.isActive ? 'Active' : 'Inactive'}
                             </span>
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                 )}
                        </div>
                    )}

                    {/* ── CATEGORIES TAB ── */}
                    {activeTab === 'categories' && (
                        <div className="tab-content">
                            <div className="action-bar">
                                <button className="primary-button"
                                        onClick={() => openModal('category', 'create')}>
                                    <PlusIcon className="icon-small"/> Create Category
                                </button>
                            </div>
                            {loadingStates.categories ? (
                                <div className="loading-spinner">...</div>
                            ) : (
                                <div className="table-card">
                                    <table className="data-table">
                                        <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Slug</th>
                                            <th>Status</th>
                                            <th>Created</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {categories.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="no-data">No categories found</td>
                                            </tr>
                                        ): categories.map((cat: Category) => (
                                                                <tr key={cat.id}>
                                                                    <td><strong>{cat.name}</strong></td>
                                                                    <td>
                                                                        <code
                                                                            className="text-xs bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">
                                                                            {cat.slug}
                                                                        </code>
                                                                    </td>
                                                                    <td>
                                        <span className={`status-badge ${cat.isActive ? 'active' : 'inactive'}`}>
                                          {cat.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                                                    </td>
                                                                    <td className="date">
                                                                        {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : '—'}
                                                                    </td>
                                                                    <td>
                                                                        <div className="row-actions">
                                                                            <button
                                                                                className="action-icon-btn"
                                                                                onClick={() => openModal('category', 'edit', cat)}
                                                                            >
                                                                                <PencilIcon className="icon-small"/>
                                                                            </button>
                                                                            <button
                                                                                className="action-icon-btn"
                                                                                onClick={() => openModal('category', 'delete', cat)}
                                                                            >
                                                                                <TrashIcon className="icon-small text-red"/>
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── GAMES TAB ── */}
                    {activeTab === 'games' && (
                        <div className="tab-content">
                            <div className="action-bar">
                                <button className="primary-button" onClick={() => openModal('game', 'create')}>
                                    <PlusIcon className="icon-small"/> Create Game
                                </button>
                                <button className="secondary-button">
                                    <FunnelIcon className="icon-small"/> Filter
                                </button>
                            </div>
                            {loadingStates.games ? (
                                <div className="loading-spinner">...</div>
                            ) : games.length === 0 ? (
                                <div className="no-data">No games found</div>
                            ) : (
                                            <div className="games-grid-admin">
                                                {games.map((game: Game) => (
                                                    <div key={game.id} className="achievement-card">
                                                        <div className="achievement-header">
                                                            <div className="achievement-icon-wrapper purple-bg">
                                                                <CpuChipIcon className="achievement-icon purple-text"/>
                                                            </div>
                                                            <div className="achievement-actions">
                                                                <button
                                                                    className="action-icon-btn"
                                                                    onClick={() => openModal('game', 'edit', game)}
                                                                >
                                                                    <PencilIcon className="icon-small"/>
                                                                </button>
                                                                <button
                                                                    className="action-icon-btn"
                                                                    onClick={() => openModal('game', 'delete', game)}
                                                                >
                                                                    <TrashIcon className="icon-small text-red"/>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <h4 className="achievement-title">{game.title}</h4>
                                                        <p className="achievement-description">{game.description}</p>
                                                        <div className="game-meta flex gap-2 mt-2 flex-wrap">
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                              ⏱ {game.durationMinutes}m
                            </span>
                                                            <span
                                                                className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                              🎯 {game.difficulty}
                            </span>
                                                            <span
                                                                className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                              💰 {game.entryFee} pts
                            </span>
                                                            <span
                                                                className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                              🏆 {game.rewardPoints} pts
                            </span>
                                                        </div>
                                                        <div className="flex gap-2 mt-2">
                            <span className={`status-badge ${game.isActive ? 'active' : 'inactive'}`}>
                              {game.isActive ? 'Active' : 'Inactive'}
                            </span>
                                                            {game.isFeatured && (
                                                                <span className="status-badge"
                                                                      style={{background: '#f59e0b', color: '#fff'}}>
                                Featured
                              </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                        </div>
                    )}

                    {/* ── LEADERBOARDS TAB ── */}
                    {activeTab === 'leaderboards' && (
                        <div className="tab-content">
                            <div className="action-bar">
                                <button className="primary-button"
                                        onClick={() => openModal('leaderboard', 'edit')}>
                                    <PencilIcon className="icon-small"/> Update Scores
                                </button>
                                <button
                                    className="secondary-button"
                                    style={{color: '#ef4444'}}
                                    onClick={() => openModal('leaderboard', 'delete')}
                                >
                                    <ArrowPathIcon className="icon-small"/> Reset Leaderboard
                                </button>
                            </div>
                            {loadingStates.leaderboards ? (
                                <div className="loading-spinner">...</div>
                            ) : (
                                <div className="table-card">
                                    <table className="data-table">
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
                                        {leaderboard.length === 0 ? (
                                            <tr>
                                                <td colSpan={6} className="no-data">No leaderboard data found
                                                </td>
                                            </tr>
                                        ) : leaderboard.map((entry: LeaderboardEntry, i: number) => (
                                            <tr key={entry.userId || i}>
                                                <td>
                                                    <div className={`font-bold ${
                                                        i === 0 ? 'text-yellow-500' :
                                                            i === 1 ? 'text-gray-400' :
                                                                i === 2 ? 'text-amber-600' : ''
                                                    }`}>
                                                        #{entry.rank || i + 1}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="user-cell">
                                                        <div className="user-avatar-small blue-gradient">
                                                            {(entry.username || entry.user?.username || 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                        <span>{entry.username || entry.user?.username || entry.userId}</span>
                                                    </div>
                                                </td>
                                                <td><strong>{(entry.score || 0).toLocaleString()}</strong></td>
                                                <td>{entry.wins ?? '—'}</td>
                                                <td>{entry.losses ?? '—'}</td>
                                                <td><span
                                                    className="role-badge">{entry.period || 'all_time'}</span>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── SESSIONS TAB ── */}
                    {activeTab === 'sessions' && (
                        <div className="tab-content">
                            <div className="filters-bar">
                                <div className="filters-group">
                                    <select className="filter-select" onChange={() => fetchSessions()}>
                                        <option value="">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="completed">Completed</option>
                                        <option value="abandoned">Abandoned</option>
                                    </select>
                                </div>
                            </div>
                            {loadingStates.sessions ? (
                                <div className="loading-spinner">...</div>
                            ) : (
                                <div className="table-card">
                                    <div className="table-header">
                                        <h3 className="table-title">Game Sessions</h3>
                                        <p className="text-sm text-gray-500">
                                            {pagination.sessions ? `${pagination.sessions.total} total sessions` : ''}
                                        </p>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="data-table">
                                            <thead>
                                            <tr>
                                                <th>Session ID</th>
                                                <th>Player</th>
                                                <th>Game</th>
                                                <th>Score</th>
                                                <th>Points Earned</th>
                                                <th>Status</th>
                                                <th>Duration</th>
                                                <th>Started</th>
                                                <th>Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {sessions.length === 0 ? (
                                                <tr>
                                                    <td colSpan={9} className="no-data">No sessions found</td>
                                                </tr>
                                            ) : sessions.map((session: GameSession) => (
                                                <tr key={session.id}>
                                                    <td className="transaction-id text-xs">{session.id.slice(0, 8)}…</td>
                                                    <td>
                                                        <div className="user-cell">
                                                            <div className="user-avatar-small indigo-gradient">
                                                                {(session.user?.username || 'U').charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium">{session.user?.username || 'Unknown'}</p>
                                                                <p className="text-xs text-gray-400">{session.user?.phoneNumber || ''}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-sm">{session.game?.title || '—'}</td>
                                                    <td><strong>{session.score ?? '—'}</strong></td>
                                                    <td className="text-emerald-600 font-medium">+{session.pointsEarned ?? 0}</td>
                                                    <td>
                              <span className={`status-badge ${
                                  session.status === 'completed' ? 'active' :
                                      session.status === 'abandoned' ? 'inactive' : 'pending'
                              }`}>
                                {session.status}
                              </span>
                                                    </td>
                                                    <td className="text-sm text-gray-500">
                                                        {session.durationSeconds ?
                                                            `${Math.floor(session.durationSeconds / 60)}m ${session.durationSeconds % 60}s` :
                                                            '—'
                                                        }
                                                    </td>
                                                    <td className="date text-xs">
                                                        {session.startedAt ? new Date(session.startedAt).toLocaleString() : '—'}
                                                    </td>
                                                    <td>
                                                        {session.status === 'active' && (
                                                            <button
                                                                className="link-button text-red-500"
                                                                onClick={async () => {
                                                                    const res = await sessionsApi.abandon(session.id);
                                                                    if (res.success) {
                                                                        showToast('Session abandoned');
                                                                        fetchSessions();
                                                                    } else {
                                                                        showToast('Failed to abandon session', 'error');
                                                                    }
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
                                    {pagination.sessions && (
                                        <div className="table-footer">
                                            <p className="showing-text">
                                                Page {pagination.sessions.page} of {pagination.sessions.pages} ({pagination.sessions.total} total)
                                            </p>
                                            <div className="pagination">
                                                <button
                                                    className="pagination-btn"
                                                    disabled={pagination.sessions.page <= 1}
                                                    onClick={() => fetchSessions(pagination.sessions!.page - 1)}
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    className="pagination-btn"
                                                    disabled={pagination.sessions.page >= pagination.sessions.pages}
                                                    onClick={() => fetchSessions(pagination.sessions!.page + 1)}
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── TRANSACTIONS TAB ── */}
                    {activeTab === 'transactions' && txStats && (
                        <div className="tab-content">
                            {/* Stats mini cards */}
                            <div className="stats-grid-small">
                                {[
                                    {
                                        label: 'Total Revenue',
                                        value: `KES ${(txStats.totalRevenue || 0).toLocaleString()}`,
                                        icon: CurrencyDollarIcon
                                    },
                                    {
                                        label: 'Total Transactions',
                                        value: (txStats.totalTransactions || 0).toLocaleString(),
                                        icon: CircleStackIcon
                                    },
                                    {
                                        label: 'Points Purchased',
                                        value: (txStats.totalPointsPurchased || 0).toLocaleString(),
                                        icon: TrophyIcon
                                    },
                                    {
                                        label: 'Pending',
                                        value: (txStats.paymentStatuses?.pending || 0).toString(),
                                        icon: ArrowPathIcon
                                    },
                                ].map((stat, i) => {
                                    const Icon = stat.icon;
                                    return (
                                        <div key={i} className="stat-card-small">
                                            <div className="stat-small-header">
                                                <div className="stat-small-icon emerald-bg">
                                                    <Icon className="icon-small emerald-text"/>
                                                </div>
                                            </div>
                                            <p className="stat-small-value">{stat.value}</p>
                                            <p className="stat-small-label">{stat.label}</p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="table-card">
                                <div className="table-header">
                                    <h3 className="table-title">All Transactions</h3>
                                    <div className="table-actions">
                                        <button className="primary-button small"
                                                onClick={() => openModal('transaction', 'create')}>
                                            <PlusIcon className="icon-small"/> New Transaction
                                        </button>
                                    </div>
                                </div>
                                <div className="table-responsive">
                                    <table className="data-table">
                                        <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>User</th>
                                            <th>Type</th>
                                            <th>Points</th>
                                            <th>Amount (KES)</th>
                                            <th>Method</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th>Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {loadingStates.transactions ? (
                                            <tr>
                                                <td colSpan={9} className="loading-cell">...</td>
                                            </tr>
                                        ) : transactions.length === 0 ? (
                                            <tr>
                                                <td colSpan={9} className="no-data">No transactions found</td>
                                            </tr>
                                        ) : transactions.map((tx: Transaction) => (
                                            <tr key={tx.id}>
                                                <td className="transaction-id text-xs">{tx.id.slice(0, 8)}…</td>
                                                <td>
                                                    <div className="user-cell">
                                                        <div className="user-avatar-small purple-gradient">
                                                            {(tx.user?.username || 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm">{tx.user?.username || '—'}</p>
                                                            <p className="text-xs text-gray-400">{tx.user?.phoneNumber || ''}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span className="role-badge">{tx.type}</span></td>
                                                <td className="font-medium">{tx.pointsAmount?.toLocaleString()}</td>
                                                <td className="amount">{tx.amountPaid?.toFixed(2) ?? '—'}</td>
                                                <td>{tx.paymentMethod || '—'}</td>
                                                <td>
                            <span className={`status-badge ${
                                tx.paymentStatus === 'completed' ? 'active' :
                                    tx.paymentStatus === 'failed' ? 'inactive' : 'pending'
                            }`}>
                              {tx.paymentStatus}
                            </span>
                                                </td>
                                                <td className="date text-xs">
                                                    {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '—'}
                                                </td>
                                                <td>
                                                    <div className="row-actions">
                                                        <button
                                                            className="action-icon-btn"
                                                            title="Update Status"
                                                            onClick={() => openModal('transaction', 'edit', tx)}
                                                        >
                                                            <PencilIcon className="icon-small"/>
                                                        </button>
                                                        {tx.paymentStatus === 'completed' && (
                                                            <button
                                                                className="link-button text-xs text-red-500"
                                                                onClick={async () => {
                                                                    const reason = window.prompt('Refund reason?');
                                                                    if (!reason) return;
                                                                    const res = await transactionsApi.refund(tx.id, {
                                                                        refundAmount: tx.amountPaid || 0,
                                                                        reason
                                                                    });
                                                                    if (res.success) {
                                                                        showToast('Refund processed');
                                                                        fetchTransactions();
                                                                    } else {
                                                                        showToast(res.error || 'Refund failed', 'error');
                                                                    }
                                                                }}
                                                            >
                                                                Refund
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
                                    <div className="table-footer">
                                        <p className="showing-text">
                                            Page {pagination.transactions.page} of {pagination.transactions.pages}
                                        </p>
                                        <div className="pagination">
                                            <button
                                                className="pagination-btn"
                                                disabled={pagination.transactions.page <= 1}
                                                onClick={() => fetchTransactions(pagination.transactions!.page - 1)}
                                            >
                                                Previous
                                            </button>
                                            <button
                                                className="pagination-btn"
                                                disabled={pagination.transactions.page >= pagination.transactions.pages}
                                                onClick={() => fetchTransactions(pagination.transactions!.page + 1)}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── USERS TAB ── */}
                    {activeTab === 'users' && (
                        <div className="tab-content">
                            <div className="filters-bar">
                                <div className="filters-group">
                                    <div className="search-wrapper small">
                                        <MagnifyingGlassIcon className="search-icon"/>
                                        <input type="text" placeholder="Search users..."
                                               className="search-input small"/>
                                    </div>
                                    <select className="filter-select">
                                        <option>All Roles</option>
                                        <option>admin</option>
                                        <option>user</option>
                                    </select>
                                    <select className="filter-select">
                                        <option>All Status</option>
                                        <option>Active</option>
                                        <option>Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div className="table-card">
                                {loadingStates.users ? (
                                    <div className="loading-spinner">...</div>
                                ) : (
                                    <>
                                        <table className="data-table">
                                            <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Phone</th>
                                                <th>Role</th>
                                                <th>Points</th>
                                                <th>Level</th>
                                                <th>Games Played</th>
                                                <th>Status</th>
                                                <th>Joined</th>
                                                <th>Actions</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {users.length === 0 ? (
                                                <tr>
                                                    <td colSpan={9} className="no-data">No users found</td>
                                                </tr>
                                            ) : users.map((user: User) => (
                                                <tr key={user.id}>
                                                    <td>
                                                        <div className="user-profile-cell">
                                                            <div className="user-avatar blue-gradient">
                                                                {(user.username || 'U').charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="user-fullname">{user.username}</p>
                                                                {user.countryCode && (
                                                                    <p className="text-xs text-gray-400">{user.countryCode}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="phone">{user.phoneNumber}</td>
                                                    <td><span className="role-badge">{user.role}</span></td>
                                                    <td className="font-medium text-emerald-600">
                                                        {(user.pointsBalance || 0).toLocaleString()}
                                                    </td>
                                                    <td className="text-center">{user.level || 1}</td>
                                                    <td className="text-center">{user.totalGamesPlayed || 0}</td>
                                                    <td>
                              <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                                                    </td>
                                                    <td className="date">
                                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                                                    </td>
                                                    <td>
                                                        <div className="row-actions">
                                                            <button
                                                                className="action-icon-btn"
                                                                title="Update Status"
                                                                onClick={() => openModal('user', 'edit', user)}
                                                            >
                                                                <PencilIcon className="icon-small"/>
                                                            </button>
                                                            <button
                                                                className="action-icon-btn"
                                                                title="Delete User"
                                                                onClick={() => openModal('user', 'delete', user)}
                                                            >
                                                                <TrashIcon className="icon-small text-red"/>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                        {pagination.users && (
                                            <div className="table-footer">
                                                <p className="showing-text">
                                                    Page {pagination.users.page} of {pagination.users.pages} ({pagination.users.total} users)
                                                </p>
                                                <div className="pagination">
                                                    <button
                                                        className="pagination-btn"
                                                        disabled={pagination.users.page <= 1}
                                                        onClick={() => fetchUsers(pagination.users!.page - 1)}
                                                    >
                                                        Previous
                                                    </button>
                                                    <button
                                                        className="pagination-btn"
                                                        disabled={pagination.users.page >= pagination.users.pages}
                                                        onClick={() => fetchUsers(pagination.users!.page + 1)}
                                                    >
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* ── MODALS ── */}
            {modal && (
                <Modal
                    title={`${modal.mode === 'create' ? 'Create' :
                        modal.mode === 'edit' ? 'Edit' :
                            modal.mode === 'delete' ? 'Delete' : 'View'} ${
                        modal.type.charAt(0).toUpperCase() + modal.type.slice(1)}`}
                    onClose={() => setModal(null)}
                >
                    {/* DELETE CONFIRMATION - For all entities except leaderboard */}
                    {modal.mode === 'delete' && modal.type !== 'leaderboard' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                                <ExclamationTriangleIcon className="w-6 h-6 text-red-500 flex-shrink-0" />
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    Are you sure you want to delete <strong>
                                    {modal.data?.title || modal.data?.name || modal.data?.username}
                                </strong>? This action cannot be undone.
                                </p>
                            </div>

                            {/* Additional fields for user deletion */}
                            {modal.type === 'user' && (
                                <>
                                    <div>
                                        <label className="form-label">Reason for deletion</label>
                                        <input
                                            className="form-input"
                                            placeholder="Enter reason"
                                            value={form.reason || ''}
                                            onChange={e => setForm({ ...form, reason: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="deleteData"
                                            checked={form.deleteData || false}
                                            onChange={e => setForm({ ...form, deleteData: e.target.checked })}
                                        />
                                        <label htmlFor="deleteData" className="text-sm">
                                            Permanently delete all user data
                                        </label>
                                    </div>
                                </>
                            )}

                            <div className="flex gap-2 justify-end">
                                <button
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => setModal(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                                    disabled={submitting}
                                    onClick={handleSubmit}
                                >
                                    {submitting ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* LEADERBOARD RESET - Special delete for leaderboard */}
                    {modal.mode === 'delete' && modal.type === 'leaderboard' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                    Reset leaderboard data. This will clear scores for the selected game and period.
                                </p>
                            </div>

                            <div>
                                <label className="form-label">Game ID *</label>
                                <input
                                    className="form-input"
                                    placeholder="Enter game UUID"
                                    value={form.gameId || ''}
                                    onChange={e => setForm({ ...form, gameId: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Period</label>
                                <select
                                    className="form-input"
                                    value={form.period || 'daily'}
                                    onChange={e => setForm({ ...form, period: e.target.value })}
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="all_time">All Time</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="excludeAllTime"
                                    checked={form.excludeAllTime || false}
                                    onChange={e => setForm({ ...form, excludeAllTime: e.target.checked })}
                                />
                                <label htmlFor="excludeAllTime" className="text-sm">
                                    Exclude all-time leaderboard from reset
                                </label>
                            </div>

                            <div className="flex gap-2 justify-end">
                                <button
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => setModal(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                                    disabled={submitting || !form.gameId}
                                    onClick={handleSubmit}
                                >
                                    {submitting ? 'Resetting...' : 'Reset Leaderboard'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ACHIEVEMENT CREATE/EDIT FORM */}
                    {(modal.mode === 'create' || modal.mode === 'edit') && modal.type === 'achievement' && (
                        <div className="space-y-4">
                            <div>
                                <label className="form-label">Title *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter achievement title"
                                    value={form.title || ''}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Description *</label>
                                <textarea
                                    className="form-input"
                                    rows={3}
                                    placeholder="Enter achievement description"
                                    value={form.description || ''}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Points Reward *</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Enter points"
                                    value={form.pointsReward || ''}
                                    onChange={e => setForm({ ...form, pointsReward: e.target.value })}
                                    min="0"
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Criteria Type</label>
                                <select
                                    className="form-input"
                                    value={form.criteriaType || 'games_played'}
                                    onChange={e => setForm({ ...form, criteriaType: e.target.value })}
                                >
                                    <option value="games_played">Games Played</option>
                                    <option value="consecutive_wins">Consecutive Wins</option>
                                    <option value="score_threshold">Score Threshold</option>
                                    <option value="total_points">Total Points</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Threshold *</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Enter threshold value"
                                    value={form.threshold || ''}
                                    onChange={e => setForm({ ...form, threshold: e.target.value })}
                                    min="1"
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Game ID (Optional)</label>
                                <input
                                    className="form-input"
                                    placeholder="Enter game UUID for game-specific achievement"
                                    value={form.gameId || ''}
                                    onChange={e => setForm({ ...form, gameId: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={form.isActive !== false}
                                    onChange={e => setForm({ ...form, isActive: e.target.checked })}
                                />
                                <label htmlFor="isActive">Active</label>
                            </div>

                            <div className="flex gap-2 justify-end pt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => setModal(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                    disabled={submitting || !form.title || !form.description || !form.pointsReward}
                                    onClick={handleSubmit}
                                >
                                    {submitting ? 'Saving...' : modal.mode === 'create' ? 'Create Achievement' : 'Update Achievement'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* CATEGORY CREATE/EDIT FORM */}
                    {(modal.mode === 'create' || modal.mode === 'edit') && modal.type === 'category' && (
                        <div className="space-y-4">
                            <div>
                                <label className="form-label">Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter category name"
                                    value={form.name || ''}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Slug</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter slug (auto-generated from name if empty)"
                                    value={form.slug || ''}
                                    onChange={e => setForm({ ...form, slug: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Leave empty to auto-generate from name
                                </p>
                            </div>

                            <div className="flex gap-2 justify-end pt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => setModal(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                    disabled={submitting || !form.name}
                                    onClick={handleSubmit}
                                >
                                    {submitting ? 'Saving...' : modal.mode === 'create' ? 'Create Category' : 'Update Category'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* GAME CREATE/EDIT FORM */}
                    {(modal.mode === 'create' || modal.mode === 'edit') && modal.type === 'game' && (
                        <div className="space-y-4">
                            <div>
                                <label className="form-label">Title *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter game title"
                                    value={form.title || ''}
                                    onChange={e => setForm({ ...form, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Slug</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter slug (auto-generated from title if empty)"
                                    value={form.slug || ''}
                                    onChange={e => setForm({ ...form, slug: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-input"
                                    rows={3}
                                    placeholder="Enter game description"
                                    value={form.description || ''}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="form-label">Category</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Category"
                                        value={form.category || ''}
                                        onChange={e => setForm({ ...form, category: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Difficulty</label>
                                    <select
                                        className="form-input"
                                        value={form.difficulty || 'medium'}
                                        onChange={e => setForm({ ...form, difficulty: e.target.value })}
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                        <option value="expert">Expert</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="form-label">Entry Fee</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="0"
                                        value={form.entryFee || ''}
                                        onChange={e => setForm({ ...form, entryFee: e.target.value })}
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Reward Points</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="100"
                                        value={form.rewardPoints || ''}
                                        onChange={e => setForm({ ...form, rewardPoints: e.target.value })}
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Duration (min)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="10"
                                        value={form.durationMinutes || ''}
                                        onChange={e => setForm({ ...form, durationMinutes: e.target.value })}
                                        min="1"
                                    />
                                </div>
                            </div>

                            {modal.mode === 'edit' && (
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={form.isActive !== false}
                                            onChange={e => setForm({ ...form, isActive: e.target.checked })}
                                        />
                                        <span>Active</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={form.isFeatured === true}
                                            onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
                                        />
                                        <span>Featured</span>
                                    </label>
                                </div>
                            )}

                            <div className="flex gap-2 justify-end pt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => setModal(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                    disabled={submitting || !form.title}
                                    onClick={handleSubmit}
                                >
                                    {submitting ? 'Saving...' : modal.mode === 'create' ? 'Create Game' : 'Update Game'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* USER EDIT STATUS FORM */}
                    {modal.mode === 'edit' && modal.type === 'user' && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-500">
                                Update status for <strong>{modal.data?.username}</strong>
                            </p>

                            <div>
                                <label className="form-label">Status</label>
                                <select
                                    className="form-input"
                                    value={form.isActive ? 'active' : 'inactive'}
                                    onChange={e => setForm({ ...form, isActive: e.target.value === 'active' })}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive / Suspended</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Reason</label>
                                <input
                                    className="form-input"
                                    placeholder="Reason for status change"
                                    value={form.reason || ''}
                                    onChange={e => setForm({ ...form, reason: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="form-label">Notes</label>
                                <textarea
                                    className="form-input"
                                    rows={2}
                                    placeholder="Additional notes"
                                    value={form.notes || ''}
                                    onChange={e => setForm({ ...form, notes: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-2 justify-end pt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => setModal(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                    disabled={submitting}
                                    onClick={handleSubmit}
                                >
                                    {submitting ? 'Saving...' : 'Update Status'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TRANSACTION CREATE FORM */}
                    {modal.mode === 'create' && modal.type === 'transaction' && (
                        <div className="space-y-4">
                            <div>
                                <label className="form-label">Type *</label>
                                <select
                                    className="form-input"
                                    value={form.type || 'bonus'}
                                    onChange={e => setForm({ ...form, type: e.target.value })}
                                >
                                    <option value="bonus">Bonus</option>
                                    <option value="purchase">Purchase</option>
                                    <option value="withdrawal">Withdrawal</option>
                                    <option value="refund">Refund</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Description *</label>
                                <input
                                    className="form-input"
                                    placeholder="Transaction description"
                                    value={form.description || ''}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="form-label">Points Amount *</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="Points"
                                        value={form.pointsAmount || ''}
                                        onChange={e => setForm({ ...form, pointsAmount: e.target.value })}
                                        min="0"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Amount Paid (KES)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="0.00"
                                        value={form.amountPaid || ''}
                                        onChange={e => setForm({ ...form, amountPaid: e.target.value })}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Payment Method</label>
                                <select
                                    className="form-input"
                                    value={form.paymentMethod || 'manual'}
                                    onChange={e => setForm({ ...form, paymentMethod: e.target.value })}
                                >
                                    <option value="manual">Manual</option>
                                    <option value="mpesa">M-Pesa</option>
                                    <option value="card">Card</option>
                                    <option value="wallet">Wallet</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Reference ID</label>
                                <input
                                    className="form-input"
                                    placeholder="Optional reference ID"
                                    value={form.referenceId || ''}
                                    onChange={e => setForm({ ...form, referenceId: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-2 justify-end pt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => setModal(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                    disabled={submitting || !form.type || !form.description || !form.pointsAmount}
                                    onClick={handleSubmit}
                                >
                                    {submitting ? 'Creating...' : 'Create Transaction'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* TRANSACTION EDIT STATUS FORM */}
                    {modal.mode === 'edit' && modal.type === 'transaction' && (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-500">
                                Update status for transaction <code>{modal.data?.id?.slice(0, 8)}...</code>
                            </p>

                            <div>
                                <label className="form-label">Status *</label>
                                <select
                                    className="form-input"
                                    value={form.status || modal.data?.paymentStatus || 'pending'}
                                    onChange={e => setForm({ ...form, status: e.target.value })}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="completed">Completed</option>
                                    <option value="failed">Failed</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Notes</label>
                                <input
                                    className="form-input"
                                    placeholder="Additional notes"
                                    value={form.notes || ''}
                                    onChange={e => setForm({ ...form, notes: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-2 justify-end pt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => setModal(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                    disabled={submitting}
                                    onClick={handleSubmit}
                                >
                                    {submitting ? 'Updating...' : 'Update Status'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* LEADERBOARD UPDATE SCORES FORM */}
                    {modal.mode === 'edit' && modal.type === 'leaderboard' && (
                        <div className="space-y-4">
                            <div>
                                <label className="form-label">User ID *</label>
                                <input
                                    className="form-input"
                                    placeholder="Enter user UUID"
                                    value={form.userId || ''}
                                    onChange={e => setForm({ ...form, userId: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label className="form-label">Game ID *</label>
                                <input
                                    className="form-input"
                                    placeholder="Enter game UUID"
                                    value={form.gameId || ''}
                                    onChange={e => setForm({ ...form, gameId: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="form-label">Period</label>
                                    <select
                                        className="form-input"
                                        value={form.period || 'all_time'}
                                        onChange={e => setForm({ ...form, period: e.target.value })}
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="all_time">All Time</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="form-label">Score *</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="Score"
                                        value={form.score || ''}
                                        onChange={e => setForm({ ...form, score: e.target.value })}
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="form-label">Wins</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="Wins"
                                        value={form.wins || ''}
                                        onChange={e => setForm({ ...form, wins: e.target.value })}
                                        min="0"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Losses</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        placeholder="Losses"
                                        value={form.losses || ''}
                                        onChange={e => setForm({ ...form, losses: e.target.value })}
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 justify-end pt-4">
                                <button
                                    type="button"
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                    onClick={() => setModal(null)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                                    disabled={submitting || !form.userId || !form.gameId || !form.score}
                                    onClick={handleSubmit}
                                >
                                    {submitting ? 'Updating...' : 'Update Scores'}
                                </button>
                            </div>
                        </div>
                    )}
                </Modal>
            )}

        </div>
    );
};
export default Dashboard
