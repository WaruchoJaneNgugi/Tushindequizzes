// services/leaderboardService.ts
const Base_API_Url = 'https://lottomotto.co.ke/chemsha/api/';

export type LeaderboardPeriod = 'daily' | 'weekly' | 'monthly' | 'all_time';

export interface LeaderboardEntry {
    rank: number;
    userId: string;
    username: string;
    score: number;
    wins: number;
    losses: number;
    winRate: number;
    totalGames: number;
    averageScore: number;
    lastPlayed: string;
    period: string;
    game: {
        id: string;
        title: string;
        slug: string;
    };
}

export interface LeaderboardResponse {
    success: boolean;
    data: LeaderboardEntry[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface LeaderboardFilters {
    gameId?: string;
    period: LeaderboardPeriod;
    page: number;
    limit: number;
}

export const leaderboardAPI = {
    // Get leaderboard for a specific game and period
    getLeaderboard: async (filters: LeaderboardFilters): Promise<LeaderboardResponse> => {
        try {
            const { gameId = 'default', period = 'weekly', page = 1, limit = 20 } = filters;

            console.log(`Fetching leaderboard for game: ${gameId}, period: ${period}, page: ${page}`);

            const url = `${Base_API_Url}/leaderboards/${gameId}/${period}?page=${page}&limit=${limit}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            console.log('Leaderboard response status:', response.status);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Game not found');
                }

                const errorText = await response.text();
                console.error('Error response:', errorText);

                let errorMessage = 'Failed to fetch leaderboard';
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    errorMessage = errorText || errorMessage;
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Leaderboard data:', data);

            return data;
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            throw error;
        }
    },

    // Get available games for leaderboard filtering
    getGames: async (): Promise<any[]> => {
        try {
            const response = await fetch(`${Base_API_Url}/games`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch games');
            }

            const data = await response.json();
            return data.data || data;
        } catch (error) {
            console.error('Error fetching games:', error);
            throw error;
        }
    },

    // Get user's rank across different periods
    getUserRank: async (userId: string, gameId: string = 'default'): Promise<any> => {
        try {
            const response = await fetch(`${Base_API_Url}/leaderboards/user/${userId}/rank?gameId=${gameId}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user rank');
            }

            const data = await response.json();
            return data.data || data;
        } catch (error) {
            console.error('Error fetching user rank:', error);
            throw error;
        }
    }
};