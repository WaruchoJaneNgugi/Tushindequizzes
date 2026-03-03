import { useState, useEffect } from 'react';
import { dashboardService, type RecentActivity, type ChartDataPoint } from '../services/dashboardServices.ts';
import type { DashboardStats } from '../types';

interface UseDashboardDataReturn {
    stats: DashboardStats | null;
    recentActivity: RecentActivity[];
    chartData: ChartDataPoint[];
    loading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
}

export const useDashboardData = (): UseDashboardDataReturn => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const data = await dashboardService.getAllDashboardData();

            setStats(data.stats);
            setRecentActivity(data.recentActivity);
            setChartData(data.chartData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
            console.error('Dashboard data error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Set up auto-refresh every 30 seconds
        const interval = setInterval(fetchData, 30000);

        return () => clearInterval(interval);
    }, []);

    return {
        stats,
        recentActivity,
        chartData,
        loading,
        error,
        refreshData: fetchData
    };
};