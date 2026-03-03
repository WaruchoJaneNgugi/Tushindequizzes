// Store/achievementsService.ts
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
    title: string;  // Changed from 'name' to 'title' to match backend
    name?: string;  // Keep for backward compatibility
    description: string;
    pointsReward?: number;  // Changed from 'points' to match backend
    points?: number;  // Keep for backward compatibility
    status?: 'claimed' | 'available' | 'locked';
    icon?: string;
    category?: string;
    progress?: number;
    maxProgress?: number;
    earnedAt?: string;
    requirements?: string[];
    isActive?: boolean;  // Add from backend
    criteria?: any;  // Add from backend
    createdAt?: string;  // Add from backend
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
                    errorMessage = errorText || errorMessage;
                }

                throw new Error(errorMessage);
            }

            const data = await response.json();
            console.log('Achievement stats data:', data);

            // Handle different response structures
            if (data.success && data.data) {
                return data.data;
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
            console.log('User achievements raw data:', data);

            // Extract achievements array from response
            let achievementsData: any[] = [];

            if (data.success && data.data) {
                // If data.data is an array
                if (Array.isArray(data.data)) {
                    achievementsData = data.data;
                }
                // If data.data has an achievements property
                else if (data.data.achievements && Array.isArray(data.data.achievements)) {
                    achievementsData = data.data.achievements;
                }
                // If data.data is a single object
                else if (typeof data.data === 'object') {
                    achievementsData = [data.data];
                }
            } else if (Array.isArray(data)) {
                achievementsData = data;
            } else if (data.achievements && Array.isArray(data.achievements)) {
                achievementsData = data.achievements;
            } else if (typeof data === 'object') {
                // Try to find any array property that might contain achievements
                for (const key in data) {
                    if (Array.isArray(data[key]) && data[key].length > 0) {
                        // Check if the first item has achievement-like properties
                        const firstItem = data[key][0];
                        if (firstItem && (firstItem.title || firstItem.name || firstItem.description)) {
                            achievementsData = data[key];
                            break;
                        }
                    }
                }
            }

            console.log('Extracted achievements data:', achievementsData);

            // Transform achievements to match frontend expected format
            return achievementsData.map(ach => ({
                id: ach.id || ach.achievementId || '',
                title: ach.title || ach.name || 'Unknown Achievement',
                name: ach.title || ach.name || 'Unknown Achievement',
                description: ach.description || '',
                points: ach.pointsReward || ach.points || 0,
                pointsReward: ach.pointsReward || ach.points || 0,
                status: ach.status || (ach.claimed ? 'claimed' : ach.available ? 'available' : 'locked'),
                icon: ach.icon || '🏆',
                progress: ach.progress || 0,
                maxProgress: ach.maxProgress || ach.criteria?.threshold || 100,
                earnedAt: ach.claimedAt || ach.earnedAt || ach.completedAt,
                isActive: ach.isActive !== false,
                criteria: ach.criteria,
                createdAt: ach.createdAt
            }));
        } catch (error) {
            console.error('Error fetching user achievements:', error);
            return []; // Return empty array instead of throwing
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

            // Handle different response structures
            let achievementsData: any[] = [];

            if (data.success && data.data) {
                if (Array.isArray(data.data)) {
                    achievementsData = data.data;
                } else if (data.data.achievements) {
                    achievementsData = data.data.achievements;
                }
            } else if (Array.isArray(data)) {
                achievementsData = data;
            } else if (data.achievements) {
                achievementsData = data.achievements;
            }

            // Transform to frontend format
            return achievementsData.map(ach => ({
                id: ach.id,
                title: ach.title,
                name: ach.title,
                description: ach.description,
                points: ach.pointsReward || 0,
                pointsReward: ach.pointsReward || 0,
                status: ach.isActive ? 'available' : 'locked',
                icon: '🏆',
                isActive: ach.isActive,
                criteria: ach.criteria,
                createdAt: ach.createdAt
            }));
        } catch (error) {
            console.error('Error fetching achievements:', error);
            return [];
        }
    }
};