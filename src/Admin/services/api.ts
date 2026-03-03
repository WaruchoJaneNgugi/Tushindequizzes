// services/api.ts
const BASE_URL = 'https://lottomotto.co.ke/chemsha/api'; // Use consistent base URL

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
export const authApi = {
  // Login with phone number and password
  login: (phoneNumber: string, password: string) =>
      request<{
        token: string;
        user: {
          id: string;
          username: string;
          phoneNumber: string;
          role: string;
        }
      }>('POST', '/auth/login', { phoneNumber, password }, undefined),

  // Login with phone number only (for OTP flow)
  requestOTP: (phoneNumber: string) =>
      request<{ message: string }>('POST', '/auth/request-otp', { phoneNumber }, undefined),

  // Verify OTP code
  verifyOTP: (phoneNumber: string, otp: string) =>
      request<{
        token: string;
        user: {
          id: string;
          username: string;
          phoneNumber: string;
          role: string;
        }
      }>('POST', '/auth/verify-otp', { phoneNumber, otp }, undefined),

  // Register new admin (if needed)
  register: (body: {
    phoneNumber: string;
    password: string;
    username: string;
    email?: string;
  }) => request('POST', '/auth/register', body, undefined),

  // Refresh token
  refreshToken: (refreshToken: string) =>
      request<{ token: string }>('POST', '/auth/refresh', { refreshToken }, undefined),

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    return request('POST', '/auth/logout', {}, undefined);
  },

  // Change password
  changePassword: (body: {
    currentPassword: string;
    newPassword: string;
  }) => request('POST', '/auth/change-password', body),

  // Forgot password
  forgotPassword: (phoneNumber: string) =>
      request<{ message: string }>('POST', '/auth/forgot-password', { phoneNumber }, undefined),

  // Reset password
  resetPassword: (body: {
    phoneNumber: string;
    otp: string;
    newPassword: string;
  }) => request('POST', '/auth/reset-password', body, undefined),

  // Get current user profile
  getProfile: () => request('GET', '/auth/profile'),

  // Update profile
  updateProfile: (body: {
    username?: string;
    email?: string;
    avatar?: string;
  }) => request('PUT', '/auth/profile', body),
};

async function request<T>(
    method: string,
    path: string,
    body?: unknown,
    params?: Record<string, string | number | boolean>
): Promise<{ success: boolean; data?: T; message?: string; error?: string; pagination?: string }> {


  let url = `${BASE_URL}${path}`;
  if (params) {
    const query = new URLSearchParams(
        Object.entries(params)
            .filter(([, v]) => v !== undefined && v !== null)
            .map(([k, v]) => [k, String(v)])
    ).toString();
    if (query) url += `?${query}`;
  }

  try {
    const res = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    const json = await res.json();
    return json;
  } catch (err) {
    console.error(`API error [${method} ${path}]:`, err);
    return { success: false, error: String(err) };
  }
}

// ─── Achievements ────────────────────────────────────────────────────────────
export const achievementsApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
      request('GET', '/achievements', undefined, params),

  getById: (id: string) =>
      request('GET', `/achievements/${id}`),

  create: (body: {
    title: string;
    description: string;
    pointsReward: number;
    criteria: { type: string; threshold: number; gameId?: string };
    isActive: boolean;
  }) => request('POST', '/achievements', body),

  update: (id: string, body: Partial<{
    title: string;
    description: string;
    pointsReward: number;
    criteria: { type: string; threshold: number; gameId?: string };
    isActive: boolean;
  }>) => request('PUT', `/achievements/${id}`, body),

  delete: (id: string) => request('DELETE', `/achievements/${id}`),

  getUserAchievements: (userId: string) =>
      request('GET', `/achievements/user/${userId}`),

  updateUserProgress: (userId: string, achievementId: string, body: { progress: number; isUnlocked: boolean }) =>
      request('PUT', `/achievements/user/${userId}/achievement/${achievementId}`, body),

  award: (userId: string, achievementId: string) =>
      request('POST', `/achievements/award/${userId}/achievement/${achievementId}`),
};

// ─── Categories ──────────────────────────────────────────────────────────────
export const categoriesApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
      request('GET', '/categories', undefined, params),

  getById: (id: string) =>
      request('GET', `/categories/${id}`),

  create: (body: { name: string; slug: string }) =>
      request('POST', '/categories', body),

  update: (id: string, body: { name?: string; slug?: string }) =>
      request('PUT', `/categories/${id}`, body),

  delete: (id: string) => request('DELETE', `/categories/${id}`),
};

// ─── Games ───────────────────────────────────────────────────────────────────
export const gamesApi = {
  getAll: (params?: { page?: number; limit?: number; category?: string; difficulty?: string }) =>
      request('GET', '/games', undefined, params),

  getById: (id: string) =>
      request('GET', `/games/${id}`),

  create: (body: {
    title: string;
    slug: string;
    description: string;
    category: string;
    difficulty: string;
    entryFee: number;
    rewardPoints: number;
    durationMinutes: number;
    metadata?: {
      instructions?: string;
      questionsCount?: number;
      timePerQuestion?: number;
    };
  }) => request('POST', '/games', body),

  update: (id: string, body: Partial<{
    title: string;
    slug: string;
    description: string;
    category: string;
    difficulty: string;
    entryFee: number;
    rewardPoints: number;
    durationMinutes: number;
    isActive: boolean;
    isFeatured: boolean;
    metadata: Record<string, string>;
  }>) => request('PUT', `/games/${id}`, body),

  delete: (id: string) => request('DELETE', `/games/${id}`),
};

// ─── Leaderboards ────────────────────────────────────────────────────────────
export const leaderboardsApi = {
  get: (gameId: string, period: string) =>
      request('GET', `/leaderboards/${gameId}/${period}`),

  getGlobal: (period: string) =>
      request('GET', `/leaderboards/global/${period}`),

  getTop: (gameId: string) =>
      request('GET', `/leaderboards/top/${gameId}`),

  updateScores: (body: {
    userId: string;
    gameId: string;
    period: string;
    score: number;
    rank?: number;
    wins?: number;
    losses?: number;
  }) => request('POST', '/leaderboards/update', body),

  reset: (body: { gameId: string; period: string; excludeAllTime?: boolean }) =>
      request('POST', '/leaderboards/reset', body),
};

// ─── Sessions ────────────────────────────────────────────────────────────────
export const sessionsApi = {
  getAll: (params?: { page?: number; limit?: number; status?: string; gameId?: string }) =>
      request('GET', '/sessions/admin/all', undefined, params),

  getById: (id: string) =>
      request('GET', `/sessions/${id}`),

  abandon: (sessionId: string) =>
      request('POST', `/sessions/${sessionId}/abandon`),
};

// ─── Transactions ────────────────────────────────────────────────────────────
export const transactionsApi = {
  getAll: (params?: { page?: number; limit?: number; type?: string; status?: string }) =>
      request('GET', '/transactions', undefined, params),

  getUserTransactions: (userId: string, params?: { page?: number; limit?: number }) =>
      request('GET', `/transactions/user/${userId}`, undefined, params),

  getById: (id: string) =>
      request('GET', `/transactions/${id}`),

  create: (body: {
    type: string;
    pointsAmount: number;
    amountPaid?: number;
    paymentMethod?: string;
    description: string;
    referenceId?: string;
    metadata?: Record<string, string>;
  }) => request('POST', '/transactions', body),

  getStats: (params?: { startDate?: string; endDate?: string }) =>
      request('GET', '/transactions/stats', undefined, params),

  getDailySummary: () => request('GET', '/transactions/daily'),

  getRevenue: () => request('GET', '/transactions/revenue'),

  updateStatus: (id: string, body: { status: string; notes?: string }) =>
      request('PUT', `/transactions/${id}/status`, body),

  refund: (id: string, body: { refundAmount: number; reason: string; notes?: string }) =>
      request('POST', `/transactions/${id}/refund`, body),
};

// ─── Users ───────────────────────────────────────────────────────────────────
export const usersApi = {
  getAll: (params?: { page?: number; limit?: number; role?: string; isActive?: boolean; search?: string }) =>
      request('GET', '/users', undefined, params),

  getById: (id: string) => request('GET', `/users/${id}`),

  delete: (id: string, body?: { reason?: string; deleteData?: boolean }) =>
      request('DELETE', `/users/${id}`, body),

  updateStatus: (id: string, body: { isActive: boolean; reason?: string; notes?: string }) =>
      request('PUT', `/users/${id}/status`, body),
};

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
export const dashboardApi = {
  getStats: () => request('GET', '/dashboard/stats'),
};

export const apiService = {
  login: (phoneNumber: string, password: string) => authApi.login(phoneNumber, password),
  requestOTP: (phoneNumber: string) => authApi.requestOTP(phoneNumber),
  verifyOTP: (phoneNumber: string, otp: string) => authApi.verifyOTP(phoneNumber, otp),
  logout: () => authApi.logout(),
  getProfile: () => authApi.getProfile(),
  setToken: (token: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('token', token);
  },

  getUsers: (params?: any) => usersApi.getAll(params),
  getGames: (params?: any) => gamesApi.getAll(params),
  getGameSessions: (params?: any) => sessionsApi.getAll(params),
  getDashboardStats: () => dashboardApi.getStats(),
};