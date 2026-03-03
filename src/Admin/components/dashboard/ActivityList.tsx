interface ActivityItem {
    id: string;
    userInitials: string;
    user: string;
    action: string;
    time: string;
    points?: number;
}

interface ActivityListProps {
    activities: ActivityItem[];
}

export const ActivityList = ({ activities }: ActivityListProps) => {
    return (
        <div className="activity-card">
            <h3 className="activity-title">Recent Activity</h3>
            <div className="activity-list">
                {activities.length === 0 ? (
                    <p className="no-data">No recent activity</p>
                ) : activities.map(item => (
                    <div key={item.id} className="activity-item">
                        <div className="activity-avatar">{item.userInitials}</div>
                        <div className="activity-details">
                            <p className="activity-text">{item.user} {item.action}</p>
                            <p className="activity-time">{item.time}</p>
                        </div>
                        {item.points != null && item.points > 0 && (
                            <span className="activity-points">+{item.points} pts</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};