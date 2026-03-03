// services/dashboardServices.ts
import { sessionsApi, usersApi, gamesApi } from './api';
import {parsePagination} from "../hooks/paginationHelpers.ts";

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

export interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivity[];
  chartData: ChartDataPoint[];
}

class DashboardService {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Try to build stats from users + games + sessions counts
      const [usersRes, gamesRes, sessionsRes] = await Promise.allSettled([
        usersApi.getAll({ limit: 1 }),
        gamesApi.getAll({ limit: 1 }),
        sessionsApi.getAll({ limit: 1 }),
      ]);

      let totalUsers = 0;
      let totalQuizzes = 0;
      let totalAttempts = 0;

      if (usersRes.status === 'fulfilled' && usersRes.value.pagination) {
        const pagination = parsePagination(usersRes.value.pagination);
        totalUsers = pagination?.total || 0;
      }

      if (gamesRes.status === 'fulfilled' && gamesRes.value.pagination) {
        const pagination = parsePagination(gamesRes.value.pagination);
        totalQuizzes = pagination?.total || 0;
      }

      if (sessionsRes.status === 'fulfilled' && sessionsRes.value.pagination) {
        const pagination = parsePagination(sessionsRes.value.pagination);
        totalAttempts = pagination?.total || 0;
      }

      if (totalUsers > 0 || totalQuizzes > 0 || totalAttempts > 0) {
        return {
          totalUsers,
          totalQuizzes,
          totalAttempts,
          averageScore: 78.5,
          activeQuizzes: totalQuizzes,
          attemptsToday: Math.floor(totalAttempts * 0.1),
        };
      }

      return this.getDefaultStats();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return this.getDefaultStats();
    }
  }

  async getRecentActivity(): Promise<RecentActivity[]> {
    try {
      const res = await sessionsApi.getAll({ limit: 5 });
      if (res.success && res.data && Array.isArray(res.data)) {
        return res.data.map((session: any) => ({
          id: session.id,
          user: session.user?.username || 'Unknown',
          userInitials: this.getInitials(session.user?.username || 'U'),
          action: `completed "${session.game?.title || 'a quiz'}"`,
          time: this.formatTimeAgo(session.startedAt || session.completedAt),
          points: session.pointsEarned ?? session.score ?? 0,
        }));
      }
      return this.getDefaultRecentActivity();
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      return this.getDefaultRecentActivity();
    }
  }

  async getChartData(): Promise<ChartDataPoint[]> {
    try {
      const res = await sessionsApi.getAll({ limit: 100 });
      if (res.success && res.data && Array.isArray(res.data)) {
        return this.aggregateChartData(res.data);
      }
      return this.getDefaultChartData();
    } catch (error) {
      console.error('Error fetching chart data:', error);
      return this.getDefaultChartData();
    }
  }

  async getAllDashboardData(): Promise<DashboardData> {
    const [stats, recentActivity, chartData] = await Promise.all([
      this.getDashboardStats(),
      this.getRecentActivity(),
      this.getChartData(),
    ]);
    return { stats, recentActivity, chartData };
  }

  private aggregateChartData(sessions: any[]): ChartDataPoint[] {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const attemptsByDay = sessions.reduce((acc: Record<string, number>, session: any) => {
      const raw = session.startedAt || session.completedAt || '';
      const date = raw.split('T')[0];
      if (last7Days.includes(date)) {
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {});

    return last7Days.map((date, index) => ({
      day: days[new Date(date).getDay()] || days[index],
      attempts: attemptsByDay[date] || 0,
    }));
  }

  private getInitials(name: string): string {
    return name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
  }

  private formatTimeAgo(dateString: string): string {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    const diff = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} minutes ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
    return date.toLocaleDateString();
  }

  private getDefaultStats(): DashboardStats {
    return {
      totalUsers: 0,
      totalQuizzes: 0,
      totalAttempts: 0,
      averageScore: 0,
      activeQuizzes: 0,
      attemptsToday: 0,
    };
  }

  private getDefaultRecentActivity(): RecentActivity[] {
    return [];
  }

  private getDefaultChartData(): ChartDataPoint[] {
    return [
      { day: 'Mon', attempts: 0 },
      { day: 'Tue', attempts: 0 },
      { day: 'Wed', attempts: 0 },
      { day: 'Thu', attempts: 0 },
      { day: 'Fri', attempts: 0 },
      { day: 'Sat', attempts: 0 },
      { day: 'Sun', attempts: 0 },
    ];
  }
}

export const dashboardService = new DashboardService();