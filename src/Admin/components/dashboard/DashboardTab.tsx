import { ChartBars } from './ChartBars';
import { ActivityList } from './ActivityList';
import type {StatData} from "../../types/adminTypes.ts";
import {StatsGrid} from "../common/StartsCard.tsx";

interface DashboardTabProps {
    loading: boolean;
    stats: StatData[];
    chartData: Array<{ day: string; attempts: number }>;
    recentActivity: Array<{
        id: string;
        userInitials: string;
        user: string;
        action: string;
        time: string;
        points?: number;
    }>;
}

export const DashboardTab = ({ loading, stats, chartData, recentActivity }: DashboardTabProps) => {
    if (loading) {
        return (
            <div className="loading-skeleton">
                <div className="stats-grid">
                    {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-card"></div>)}
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-content">
            <StatsGrid stats={stats} />
            <div className="charts-row">
                <ChartBars data={chartData} />
                <ActivityList activities={recentActivity} />
            </div>
        </div>
    );
};