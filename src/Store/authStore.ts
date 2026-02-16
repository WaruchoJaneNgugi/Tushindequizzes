// store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    id: string;
    username: string;
    email?: string;
    phoneNumber: string;
    avatarInitials: string;
    pointsBalance: number;
    smartPoints: number;
    createdAt?: Date;
    token?: string;
}

export interface AuthState {
    user: User | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string | null;
    token: string | null;

    // Actions
    login: (phoneNumber: string, password: string) => Promise<void>;
    signup: (userData: { phoneNumber: string; password: string; username: string; countryCode: string }) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (updates: Partial<User>) => Promise<void>;
    changePassword: (currentPassword: string, newPassword: string) => Promise<void>; // Add this to interface
    clearError: () => void;
}

const Base_API_Url = 'https://lottomotto.co.ke/chemsha/api/';

const authAPI = {
    login: async (phoneNumber: string, password: string): Promise<any> => {
        const response = await fetch(`${Base_API_Url}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber,
                password
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Login failed');
        }

        return response.json();
    },

    signup: async (userData: { phoneNumber: string; password: string; username: string; countryCode: string }): Promise<any> => {
        const response = await fetch(`${Base_API_Url}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber: userData.phoneNumber,
                password: userData.password,
                username: userData.username,
                countryCode: userData.countryCode
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Signup failed');
        }

        return response.json();
    },

    logout: async (token: string): Promise<void> => {
        try {
            await fetch(`${Base_API_Url}/auth/logout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            // console.error('Logout API error:', error);
        }
    },

    getUser: async (token: string): Promise<any> => {
        const response = await fetch(`${Base_API_Url}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }

        return response.json();
    },

    // ✅ CORRECT: changePassword belongs in authAPI object
    changePassword: async (currentPassword: string, newPassword: string, token: string): Promise<any> => {
        const response = await fetch(`${Base_API_Url}/auth/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                currentPassword,
                newPassword
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Password change failed');
        }

        return response.json();
    },

    updateUser: async (userId: string, updates: any, token: string): Promise<any> => {
        const response = await fetch(`${Base_API_Url}/users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updates)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Update failed');
        }

        return response.json();
    }
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isLoggedIn: false,
            isLoading: false,
            error: null,
            token: null,

            login: async (phoneNumber: string, password: string) => {
                set({ isLoading: true, error: null });

                try {
                    const data = await authAPI.login(phoneNumber, password);

                    if (data.success && data.data && data.data.user) {
                        const userData = data.data.user;
                        set({
                            user: {
                                id: userData.id,
                                username: userData.username || '',
                                phoneNumber: userData.phoneNumber || phoneNumber,
                                avatarInitials: userData.username?.charAt(0) || 'U',
                                pointsBalance: userData.pointsBalance || 0,
                                smartPoints: userData.smartPoints || 0,
                                email: userData.email,
                                createdAt: userData.createdAt ? new Date(userData.createdAt) : undefined
                            },
                            token: data.data.token || data.token || null,
                            isLoggedIn: true,
                            isLoading: false,
                            error: null,
                        });
                    } else {
                        throw new Error(data.message || 'Invalid response from server');
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Login failed',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            signup: async (userData) => {
                set({ isLoading: true, error: null });

                try {
                    const data = await authAPI.signup(userData);

                    if (data.success) {
                        if (data.data && data.data.user) {
                            const userData = data.data.user;
                            set({
                                user: {
                                    id: userData.id,
                                    username: userData.username || userData.username,
                                    phoneNumber: userData.phoneNumber || userData.phoneNumber,
                                    avatarInitials: userData.username?.charAt(0) || 'U',
                                    pointsBalance: userData.pointsBalance || 0,
                                    smartPoints: userData.smartPoints || 0,
                                    email: userData.email,
                                    createdAt: userData.createdAt ? new Date(userData.createdAt) : undefined
                                },
                                token: data.data.token || data.token || null,
                                isLoggedIn: true,
                                isLoading: false,
                                error: null,
                            });
                        } else if (data.user) {
                            set({
                                user: {
                                    id: data.user.id,
                                    username: data.user.username,
                                    phoneNumber: data.user.phoneNumber,
                                    avatarInitials: data.user.username?.charAt(0) || 'U',
                                    pointsBalance: data.user.pointsBalance || 0,
                                    smartPoints: data.user.smartPoints || 0,
                                    email: data.user.email,
                                    createdAt: data.user.createdAt ? new Date(data.user.createdAt) : undefined
                                },
                                token: data.token || null,
                                isLoggedIn: true,
                                isLoading: false,
                                error: null,
                            });
                        } else {
                            set({
                                isLoading: false,
                                error: null,
                            });
                        }
                    } else {
                        throw new Error(data.message || 'Signup failed');
                    }
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Signup failed',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            // ✅ CORRECT: changePassword function in the store implementation
            changePassword: async (currentPassword: string, newPassword: string) => {
                const { token } = get();

                if (!token) {
                    throw new Error('Not authenticated');
                }

                set({ isLoading: true, error: null });

                try {
                    await authAPI.changePassword(currentPassword, newPassword, token);

                    set({
                        isLoading: false,
                        error: null
                    });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Password change failed',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            logout: async () => {
                const { token } = get();
                try {
                    if (token) {
                        await authAPI.logout(token);
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                } catch (error) {
                    // console.error('Logout error:', error);
                } finally {
                    set({
                        user: null,
                        token: null,
                        isLoggedIn: false,
                        error: null,
                    });
                }
            },

            updateUser: async (updates) => {
                const { user, token } = get();
                if (!user || !token) {
                    throw new Error('Not authenticated');
                }

                set({ isLoading: true, error: null });

                try {
                    const data = await authAPI.updateUser(user.id, updates, token);

                    set({
                        user: { ...user, ...data.user || data },
                        isLoading: false,
                    });
                } catch (error) {
                    set({
                        error: error instanceof Error ? error.message : 'Update failed',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isLoggedIn: state.isLoggedIn
            }),
        }
    )
);