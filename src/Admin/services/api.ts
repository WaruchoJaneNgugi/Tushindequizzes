const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

import type {
    ApiResponse,
    CategoryResponse,
    GameResponse,
    UserResponse,
    QuestionResponse,
    SessionResponse,
    GameData, Player
} from '../types';

class ApiService {
    private token: string | null = null;

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('admin_token', token);
    }

    getToken(): string | null {
        return this.token || localStorage.getItem('admin_token');
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('admin_token');
    }

    // Helper function to normalize headers
    private normalizeHeaders(headers?: HeadersInit): Record<string, string> {
        if (!headers) return {};

        const normalized: Record<string, string> = {};

        if (headers instanceof Headers) {
            headers.forEach((value, key) => {
                if (typeof value === 'string') {
                    normalized[key] = value;
                }
            });
        } else if (Array.isArray(headers)) {
            headers.forEach(([key, value]) => {
                if (typeof value === 'string') {
                    normalized[key] = value;
                }
            });
        } else if (typeof headers === 'object') {
            Object.entries(headers).forEach(([key, value]) => {
                if (typeof value === 'string') {
                    normalized[key] = value;
                }
                // else if (typeof value === 'number' || typeof value === 'boolean') {
                //     normalized[key] = value.toString();
                // }
            });
        }

        return normalized;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        // Normalize headers properly
        const baseHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        const providedHeaders = this.normalizeHeaders(options.headers);
        const headers = { ...baseHeaders, ...providedHeaders };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers,
            });

            // Check if response has content
            const contentType = response.headers.get('content-type');
            let data: any;

            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                data = text ? { message: text } : {};
            }

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || data.error || `HTTP ${response.status}`,
                    message: data.message,
                };
            }

            return {
                success: true,
                ...data
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Network error',
            };
        }
    }

    // Auth endpoints
    async login(phoneNumber: string, password: string) {
        return this.request<{ token: string; user: UserResponse }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                phoneNumber,
                password,
                role: 'admin'
            }),
        });
    }

    async verifyOTP(phoneNumber: string, otp: string) {
        return this.request<{ token: string }>('/auth/verify-otp', {
            method: 'POST',
            body: JSON.stringify({ phoneNumber, otp }),
        });
    }

    async changePassword(oldPassword: string, newPassword: string) {
        return this.request('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ oldPassword, newPassword }),
        });
    }

    // Users endpoints
    async getUsers(params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
    }) {
        const query = params ? new URLSearchParams(params as any).toString() : '';
        return this.request<{
            users: UserResponse[];
            pagination?: any
        }>(`/users?${query}`);
    }

    async getUserById(id: string) {
        return this.request<{ user: UserResponse }>(`/users/${id}`);
    }

    async updateUserStatus(id: string, status: string) {
        return this.request(`/users/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    }

    async deleteUser(id: string) {
        return this.request(`/users/${id}`, {
            method: 'DELETE',
        });
    }

    // Games endpoints
    async getGames(params?: {
        page?: number;
        limit?: number;
        category?: string;
        featured?: boolean;
    }) {
        const query = params ? new URLSearchParams(params as any).toString() : '';
        return this.request<{
            games: GameResponse[];
            pagination?: any
        }>(`/games?${query}`);
    }

    async createGame(gameData: GameData) {
        return this.request<{
            game: GameResponse
        }>('/games', {
            method: 'POST',
            body: JSON.stringify(gameData),
        });
    }

    async updateGame(id: string, gameData: Partial<GameData>) {
        return this.request<{
            game: GameResponse
        }>(`/games/${id}`, {
            method: 'PUT',
            body: JSON.stringify(gameData),
        });
    }

    async deleteGame(id: string) {
        return this.request(`/games/${id}`, {
            method: 'DELETE',
        });
    }

    // Categories endpoints
    async getCategories() {
        return this.request<{
            categories: CategoryResponse[]
        }>('/categories');
    }

    async createCategory(categoryData: { name: string; description: string }) {
        return this.request<{
            category: CategoryResponse
        }>('/categories', {
            method: 'POST',
            body: JSON.stringify(categoryData),
        });
    }

    async updateCategory(id: string, categoryData: Partial<CategoryResponse>) {
        return this.request<{
            category: CategoryResponse
        }>(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(categoryData),
        });
    }

    async deleteCategory(id: string) {
        return this.request(`/categories/${id}`, {
            method: 'DELETE',
        });
    }

    // Questions endpoints
    async getQuestions(params?: {
        gameId?: string;
        page?: number;
        limit?: number;
    }) {
        const query = params ? new URLSearchParams(params as any).toString() : '';
        return this.request<{
            questions: QuestionResponse[];
            pagination?: any
        }>(`/questions?${query}`);
    }

    async createQuestion(questionData: any) {
        return this.request<{
            question: QuestionResponse
        }>('/questions', {
            method: 'POST',
            body: JSON.stringify(questionData),
        });
    }

    async updateQuestion(id: string, questionData: any) {
        return this.request<{
            question: QuestionResponse
        }>(`/questions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(questionData),
        });
    }

    // async deleteQuestion(id: string) {
    //     return this.request(`/questions/${id}`, {
    //         method: 'DELETE',
    //     });
    // }

    // Transactions endpoints
    // async getTransactions(params?: {
    //     page?: number;
    //     limit?: number;
    //     status?: string;
    //     userId?: string;
    //     startDate?: string;
    //     endDate?: string;
    // }) {
    //     const query = params ? new URLSearchParams(params as any).toString() : '';
    //     return this.request<any>(`/transactions?${query}`);
    // }
    //
    // async getTransactionStats() {
    //     return this.request<any>('/transactions/stats');
    // }
    //
    // async getRevenueReport() {
    //     return this.request<any>('/transactions/revenue');
    // }
    //
    // async updateTransactionStatus(id: string, status: string) {
    //     return this.request(`/transactions/${id}/status`, {
    //         method: 'PUT',
    //         body: JSON.stringify({ status }),
    //     });
    // }
    //
    // async refundTransaction(id: string) {
    //     return this.request(`/transactions/${id}/refund`, {
    //         method: 'POST',
    //     });
    // }

    // Game Sessions endpoints
    async getGameSessions(params?: {
        page?: number;
        limit?: number;
        gameId?: string;
        userId?: string;
    }) {
        const query = params ? new URLSearchParams(params as any).toString() : '';
        return this.request<{
            sessions: SessionResponse[];
            pagination?: any
        }>(`/sessions/admin/all?${query}`);
    }

    // async deleteSession(id: string) {
    //     return this.request(`/sessions/${id}`, {
    //         method: 'DELETE',
    //     });
    // }
    //
    // // Leaderboards endpoints
    // async getLeaderboards(gameId?: string) {
    //     const endpoint = gameId ? `/leaderboards/game/${gameId}` : '/leaderboards';
    //     return this.request<any>(endpoint);
    // }
    //
    // async updateLeaderboard(gameId: string) {
    //     return this.request(`/leaderboards/update`, {
    //         method: 'POST',
    //         body: JSON.stringify({ gameId }),
    //     });
    // }
    //
    // async resetLeaderboard(gameId: string) {
    //     return this.request(`/leaderboards/reset`, {
    //         method: 'POST',
    //         body: JSON.stringify({ gameId }),
    //     });
    // }
    //
    // // Achievements endpoints
    // async getAchievements() {
    //     return this.request<any[]>('/achievements');
    // }
    //
    // async createAchievement(achievementData: any) {
    //     return this.request('/achievements', {
    //         method: 'POST',
    //         body: JSON.stringify(achievementData),
    //     });
    // }
    //
    // async updateAchievement(id: string, achievementData: any) {
    //     return this.request(`/achievements/${id}`, {
    //         method: 'PUT',
    //         body: JSON.stringify(achievementData),
    //     });
    // }
    //
    // async deleteAchievement(id: string) {
    //     return this.request(`/achievements/${id}`, {
    //         method: 'DELETE',
    //     });
    // }
    //
    // async awardAchievement(userId: string, achievementId: string) {
    //     return this.request(`/achievements/award/${userId}/achievement/${achievementId}`, {
    //         method: 'POST',
    //     });
    // }
    //
    // // Dashboard Stats
    // async getDashboardStats() {
    //     return this.request<{
    //         totalUsers: number;
    //         totalGames: number;
    //         totalSessions: number;
    //         activeUsers: number;
    //         revenueToday: number;
    //         revenueThisWeek: number;
    //     }>('/dashboard/stats');
    // }
}
// Helper functions for type conversion
export function convertUserResponseToPlayer(user: UserResponse): Player {
    return {
        id: user.id,
        username: user.username,
        phoneNumber: user.phoneNumber,
        // Handle backend's 'suspended' status
        status: user.status === 'suspended' ? 'disabled' : user.status,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        registrationDate: user.createdAt.split('T')[0],
        isDeleted: user.isDeleted || false
    };
}

export function convertPlayersFromResponse(users: UserResponse[]): Player[] {
    return users.map(convertUserResponseToPlayer);
}
export const apiService = new ApiService();