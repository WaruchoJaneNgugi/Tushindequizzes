// store/useStore.ts
import { create } from 'zustand';

interface ApiEndpoint {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
}

interface AdminStore {
    // Theme state
    isDarkMode: boolean;
    toggleTheme: () => void;

    // API Endpoints
    endpoints: {
        achievements: {
            create: ApiEndpoint;
            update: (id: string) => ApiEndpoint;
            delete: (id: string) => ApiEndpoint;
            updateUserProgress: (userId: string) => ApiEndpoint;
            manuallyAward: (userId: string) => ApiEndpoint;
        };
        categories: {
            create: ApiEndpoint;
            update: (id: string) => ApiEndpoint;
            delete: (id: string) => ApiEndpoint;
        };
        games: {
            create: ApiEndpoint;
            update: (id: string) => ApiEndpoint;
            delete: (id: string) => ApiEndpoint;
        };
        leaderboards: {
            updateScores: ApiEndpoint;
            reset: ApiEndpoint;
        };
        sessions: {
            getAll: ApiEndpoint;
            abandon: (sessionId: string) => ApiEndpoint;
        };
        transactions: {
            getUserTransactions: (userId: string) => ApiEndpoint;
            getAll: ApiEndpoint;
            create: ApiEndpoint;
            getStats: ApiEndpoint;
            getDailySummary: ApiEndpoint;
            getRevenueReport: ApiEndpoint;
            getById: (id: string) => ApiEndpoint;
            updateStatus: (id: string) => ApiEndpoint;
            refund: (id: string) => ApiEndpoint;
        };
        users: {
            getAll: ApiEndpoint;
            getById: (id: string) => ApiEndpoint;
            delete: (id: string) => ApiEndpoint;
            updateStatus: (id: string) => ApiEndpoint;
        };
    };

    // Active tab state
    activeTab: string;
    setActiveTab: (tab: string) => void;
}



const baseUrl ="https://lottomotto.co.ke/chemsha/api";

export const useStore = create<AdminStore>((set) => ({
    isDarkMode: false,
    toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

    endpoints: {
        achievements: {
            create: { url: `${baseUrl}/achievements`, method: 'POST' },
            update: (id: string) => ({ url: `${baseUrl}/achievements/${id}`, method: 'PUT' }),
            delete: (id: string) => ({ url: `${baseUrl}/achievements/${id}`, method: 'DELETE' }),
            updateUserProgress: (userId: string) => ({
                url: `${baseUrl}/achievements/user/${userId}/progress`,
                method: 'PATCH'
            }),
            manuallyAward: (userId: string) => ({
                url: `${baseUrl}/achievements/user/${userId}/award`,
                method: 'POST'
            }),
        },
        categories: {
            create: { url: `${baseUrl}/categories`, method: 'POST' },
            update: (id: string) => ({ url: `${baseUrl}/categories/${id}`, method: 'PUT' }),
            delete: (id: string) => ({ url: `${baseUrl}/categories/${id}`, method: 'DELETE' }),
        },
        games: {
            create: { url: `${baseUrl}/games`, method: 'POST' },
            update: (id: string) => ({ url: `${baseUrl}/games/${id}`, method: 'PUT' }),
            delete: (id: string) => ({ url: `${baseUrl}/games/${id}`, method: 'DELETE' }),
        },
        leaderboards: {
            updateScores: { url: `${baseUrl}/leaderboards/scores`, method: 'PATCH' },
            reset: { url: `${baseUrl}/leaderboards/reset`, method: 'POST' },
        },
        sessions: {
            getAll: { url: `${baseUrl}/sessions`, method: 'GET' },
            abandon: (sessionId: string) => ({
                url: `${baseUrl}/sessions/${sessionId}/abandon`,
                method: 'POST'
            }),
        },
        transactions: {
            getUserTransactions: (userId: string) => ({
                url: `${baseUrl}/transactions/user/${userId}`,
                method: 'GET'
            }),
            getAll: { url: `${baseUrl}/transactions`, method: 'GET' },
            create: { url: `${baseUrl}/transactions`, method: 'POST' },
            getStats: { url: `${baseUrl}/transactions/stats`, method: 'GET' },
            getDailySummary: { url: `${baseUrl}/transactions/daily-summary`, method: 'GET' },
            getRevenueReport: { url: `${baseUrl}/transactions/revenue`, method: 'GET' },
            getById: (id: string) => ({ url: `${baseUrl}/transactions/${id}`, method: 'GET' }),
            updateStatus: (id: string) => ({
                url: `${baseUrl}/transactions/${id}/status`,
                method: 'PATCH'
            }),
            refund: (id: string) => ({
                url: `${baseUrl}/transactions/${id}/refund`,
                method: 'POST'
            }),
        },
        users: {
            getAll: { url: `${baseUrl}/users`, method: 'GET' },
            getById: (id: string) => ({ url: `${baseUrl}/users/${id}`, method: 'GET' }),
            delete: (id: string) => ({ url: `${baseUrl}/users/${id}`, method: 'DELETE' }),
            updateStatus: (id: string) => ({
                url: `${baseUrl}/users/${id}/status`,
                method: 'PATCH'
            }),
        },
    },

    activeTab: 'dashboard',
    setActiveTab: (tab) => set({ activeTab: tab }),
}));