// services/achievementsService.ts
const Base_API_Url = 'https://lottomotto.co.ke/chemsha/api/';

export interface AchievementStats {
    totalAchievements: number;
    activeAchievements: number;
    totalPointsAvailable: number;
    mostCommonAchievement: Record<string, any>;
    recentAchievements: number[];
}

export interface Achievement {
    id: string | number;
    name: string;
    description: string;
    points: number;
    status?: 'claimed' | 'available' | 'locked';
    icon?: string;
    category?: string;
    progress?: number;
    maxProgress?: number;
    earnedAt?: string;
    requirements?: string[];
}

export const achievementsAPI = {
    getStats: async (): Promise<AchievementStats> => {
        try {
            console.log('Fetching achievement stats from:', `${Base_API_Url}/achievements/stats`);

            const response = await fetch(`${Base_API_Url}/achievements/stats`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);

                let errorMessage = 'Failed to fetch achievement stats';
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    // If it's not JSON, use the text
                    errorMessage = errorText || errorMessage;
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Achievement stats data:', data);

            // Handle different response structures
            if (data.success) {
                return data.data || data;
            } else if (data.data) {
                return data.data;
            } else {
                return data;
            }
        } catch (error) {
            console.error('Error fetching achievement stats:', error);
            throw error;
        }
    },

    getUserAchievements: async (token: string): Promise<Achievement[]> => {
        try {
            console.log('Fetching user achievements with token:', token ? 'Token exists' : 'No token');

            const response = await fetch(`${Base_API_Url}/achievements/user`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('User achievements response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);

                let errorMessage = 'Failed to fetch user achievements';
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    errorMessage = errorText || errorMessage;
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('User achievements data:', data);

            // Handle different response structures
            if (data.success && data.data) {
                return Array.isArray(data.data) ? data.data : [data.data];
            } else if (Array.isArray(data)) {
                return data;
            } else if (data.achievements) {
                return data.achievements;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error fetching user achievements:', error);
            throw error;
        }
    },

    claimAchievement: async (achievementId: string | number, token: string): Promise<any> => {
        try {
            console.log('Claiming achievement:', achievementId);

            const response = await fetch(`${Base_API_Url}/achievements/${achievementId}/claim`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Claim response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);

                let errorMessage = 'Failed to claim achievement';
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    errorMessage = errorText || errorMessage;
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Claim response data:', data);

            return data;
        } catch (error) {
            console.error('Error claiming achievement:', error);
            throw error;
        }
    },

    getAllAchievements: async (): Promise<Achievement[]> => {
        try {
            console.log('Fetching all achievements from:', `${Base_API_Url}/achievements`);

            const response = await fetch(`${Base_API_Url}/achievements`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            console.log('All achievements response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);

                let errorMessage = 'Failed to fetch achievements';
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    errorMessage = errorText || errorMessage;
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('All achievements data:', data);

            if (data.success && data.data) {
                return Array.isArray(data.data) ? data.data : [data.data];
            } else if (Array.isArray(data)) {
                return data;
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error fetching achievements:', error);
            throw error;
        }
    }
};