import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { AchievementCard } from './AchievementCard';
import type {Achievement} from "../../types/adminTypes.ts";

interface AchievementsTabProps {
    achievements: Achievement[];
    loading: boolean;
    onCreate: () => void;
    onEdit: (achievement: Achievement) => void;
    onDelete: (achievement: Achievement) => void;
}

export const AchievementsTab = ({ achievements, loading, onCreate, onEdit, onDelete }: AchievementsTabProps) => {
    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return (
        <div className="tab-content">
            <div className="action-bar">
                <button className="primary-button yellow-button" onClick={onCreate}>
                    <PlusIcon className="icon-small"/> Create Achievement
                </button>
                <button className="secondary-button">
                    <FunnelIcon className="icon-small"/> Filter
                </button>
            </div>

            {achievements.length === 0 ? (
                <div className="no-data">No achievements found</div>
            ) : (
                <div className="achievements-grid">
                    {achievements.map((item) => (
                        <AchievementCard
                            key={item.id}
                            achievement={item}
                            onEdit={() => onEdit(item)}
                            onDelete={() => onDelete(item)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};