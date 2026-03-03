import type {StatData} from "../../types/adminTypes.ts";

interface StatsGridProps {
    stats: StatData[];
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
    return (
        <div className="stats-grid">
            {stats.map((stat: StatData) => {
                const Icon = stat.icon;
                return (
                    <div key={stat.label} className="stat-card">
                        <div className="stat-header">
                            <div className={`stat-icon-wrapper ${stat.bgColor}`}>
                                <Icon className={`stat-icon bg-gradient-to-br ${stat.color}`}/>
                            </div>
                        </div>
                        <p className="stat-value">{stat.value}</p>
                        <p className="stat-label">{stat.label}</p>
                        {stat.active && <p className="stat-active">{stat.active}</p>}
                    </div>
                );
            })}
        </div>
    );
};