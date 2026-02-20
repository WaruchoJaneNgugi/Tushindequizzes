// types/adminTypes.ts

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    pagination?: Pagination;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

// User Types
export interface User {
    id: string;
    phoneNumber: string;
    username: string;
    avatarUrl?: string;
    countryCode?: string;
    isActive: boolean;
    role: 'admin' | 'user' | 'moderator';
    pointsBalance: number;
    level: number;
    totalGamesPlayed: number;
    totalPointsEarned: number;
    achievementsCount: number;
    lastLogin?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface UserDetails extends User {
    achievements?: UserAchievement[];
    recentGames?: GameSession[];
    transactionStats?: {
        totalPurchases: number;
        totalSpent: number;
        lastPurchase?: string;
    };
    statusHistory?: StatusHistoryEntry[];
}

export interface StatusHistoryEntry {
    isActive: boolean;
    reason?: string;
    changedAt: string;
}

// Achievement Types
export interface Achievement {
    id: string;
    title: string;
    description: string;
    pointsReward: number;
    criteria: AchievementCriteria;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface AchievementCriteria {
    type: 'games_played' | 'consecutive_wins' | 'score_threshold' | 'total_points';
    threshold: number;
    gameId?: string;
}

export interface UserAchievement {
    achievementId: string;
    title: string;
    description: string;
    pointsReward: number;
    unlockedAt?: string;
    progress: number;
    isUnlocked: boolean;
}

export interface UserAchievementProgress {
    userId: string;
    achievementId: string;
    progress: number;
    isUnlocked: boolean;
    unlockedAt?: string;
}

// Category Types
export interface Category {
    id: string;
    name: string;
    slug: string;
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
}

// Game Types
export interface Game {
    id: string;
    title: string;
    slug: string;
    description: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    entryFee: number;
    rewardPoints: number;
    durationMinutes: number;
    isActive: boolean;
    isFeatured: boolean;
    metadata?: GameMetadata;
    createdAt: string;
    updatedAt?: string;
}

export interface GameMetadata {
    instructions?: string;
    questionsCount?: number;
    timePerQuestion?: number;
    [key: string]: any;
}

// Session Types
export interface GameSession {
    id: string;
    userId: string;
    gameId: string;
    status: 'active' | 'completed' | 'abandoned';
    score?: number;
    pointsEarned?: number;
    durationSeconds?: number;
    startedAt: string;
    completedAt?: string;
    user?: {
        id: string;
        username: string;
        phoneNumber: string;
    };
    game?: {
        id: string;
        title: string;
        slug: string;
    };
}

// Leaderboard Types
export interface LeaderboardEntry {
    userId: string;
    username?: string;
    score: number;
    rank?: number;
    wins?: number;
    losses?: number;
    period: 'daily' | 'weekly' | 'monthly' | 'all_time';
    user?: {
        id: string;
        username: string;
    };
}

export interface LeaderboardUpdateResult {
    userId: string;
    gameId: string;
    period: string;
    newScore: number;
    newRank: number;
    previousRank: number;
    rankChange: number;
}

export interface LeaderboardResetResult {
    resetCount: number;
    resetPeriods: string[];
    resetGames: string[];
    timestamp: string;
}

// Transaction Types
export interface Transaction {
    id: string;
    userId: string;
    type: 'purchase' | 'game_earning' | 'bonus' | 'withdrawal' | 'refund';
    pointsAmount: number;
    amountPaid?: number;
    paymentMethod?: 'mpesa' | 'card' | 'wallet' | 'manual';
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
    description: string;
    referenceId?: string;
    metadata?: Record<string, any>;
    user?: {
        id: string;
        username: string;
        phoneNumber: string;
    };
    createdAt: string;
    updatedAt?: string;
}

export interface TransactionStats {
    totalTransactions: number;
    totalPointsPurchased: number;
    totalPointsEarned: number;
    totalPointsWithdrawn: number;
    totalRevenue: number;
    averagePurchaseAmount: number;
    transactionTypes: {
        purchase: number;
        game_earning: number;
        bonus: number;
        withdrawal: number;
        refund: number;
    };
    paymentStatuses: {
        completed: number;
        pending: number;
        failed: number;
        refunded: number;
    };
    dailyAverage: number;
    topUsers: Array<{
        userId: string;
        username: string;
        totalPointsPurchased: number;
        totalSpent: number;
    }>;
}

export interface DailyTransactionSummary {
    date: string;
    totalTransactions: number;
    totalPoints: number;
    totalRevenue: number;
    averagePoints: number;
    transactionCounts: {
        purchase: number;
        game_earning: number;
        bonus: number;
        withdrawal: number;
        refund: number;
    };
}

export interface RevenueReport {
    totalRevenue: number;
    revenueByPeriod: Array<{
        period: string;
        revenue: number;
        transactionCount: number;
        averageTransactionValue: number;
    }>;
    revenueByPaymentMethod: {
        mpesa: number;
        card: number;
        wallet: number;
    };
    topRevenueDays: Array<{
        date: string;
        revenue: number;
        transactions: number;
    }>;
    revenueGrowth: {
        periodOverPeriod: number;
        monthOverMonth: number;
        yearOverYear: number;
    };
}

export interface TransactionRefundResult {
    originalTransaction: {
        id: string;
        paymentStatus: string;
    };
    refundTransaction: {
        id: string;
        type: string;
        pointsAmount: number;
        amountPaid: number;
        description: string;
    };
}

// Dashboard Types
export interface DashboardStats {
    totalUsers: number;
    totalQuizzes: number;
    totalAttempts: number;
    averageScore: number;
    activeQuizzes: number;
    attemptsToday: number;
}

export interface RecentActivity {
    id: string;
    user: string;
    userInitials: string;
    action: string;
    time: string;
    points?: number;
}

export interface ChartDataPoint {
    day: string;
    attempts: number;
}

// UI Types
export interface Tab {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

export interface StatData {
    label: string;
    value: string;
    // change: string;
    changeType: 'increase' | 'decrease';
    active?: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
}

export interface ModalState {
    type: 'achievement' | 'category' | 'game' | 'leaderboard' | 'transaction' | 'user';
    mode: 'create' | 'edit' | 'delete' | 'view';
    data?: any;
}

export interface FormData {
    [key: string]: any;
}

export interface ToastState {
    message: string;
    type: 'success' | 'error';
}

export interface LoadingStates {
    users: boolean;
    games: boolean;
    transactions: boolean;
    achievements: boolean;
    categories: boolean;
    sessions: boolean;
    leaderboards: boolean;
    [key: string]: boolean;
}

export interface PaginationState {
    users?: Pagination;
    games?: Pagination;
    transactions?: Pagination;
    achievements?: Pagination;
    categories?: Pagination;
    sessions?: Pagination;
    [key: string]: Pagination | undefined;
}

// types/adminTypes.ts - Add these interfaces

// Achievement Form Types
export interface AchievementFormData {
    title: string;
    description: string;
    pointsReward: number;
    criteriaType: 'games_played' | 'consecutive_wins' | 'score_threshold' | 'total_points';
    threshold: number;
    gameId?: string;
    isActive: boolean;
}

// Category Form Types
export interface CategoryFormData {
    name: string;
    slug: string;
}

// Game Form Types
export interface GameFormData {
    title: string;
    slug: string;
    description: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    entryFee: number;
    rewardPoints: number;
    durationMinutes: number;
    isActive?: boolean;
    isFeatured?: boolean;
    metadata?: {
        instructions?: string;
        questionsCount?: number;
        timePerQuestion?: number;
    };
}

// User Form Types
export interface UserFormData {
    isActive: boolean;
    reason?: string;
    notes?: string;
}

// Transaction Form Types
export interface TransactionFormData {
    type: 'bonus' | 'purchase' | 'withdrawal' | 'refund';
    pointsAmount: number;
    amountPaid?: number;
    paymentMethod?: 'mpesa' | 'card' | 'wallet' | 'manual';
    description: string;
    referenceId?: string;
    metadata?: Record<string, any>;
}

// Transaction Status Form
export interface TransactionStatusFormData {
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    notes?: string;
}

// Leaderboard Form Types
export interface LeaderboardScoreFormData {
    userId: string;
    gameId: string;
    period: 'daily' | 'weekly' | 'monthly' | 'all_time';
    score: number;
    wins?: number;
    losses?: number;
}

export interface LeaderboardResetFormData {
    gameId: string;
    period: 'daily' | 'weekly' | 'monthly' | 'all_time';
    excludeAllTime?: boolean;
}

// Delete Form
export interface DeleteFormData {
    reason?: string;
    deleteData?: boolean;
}