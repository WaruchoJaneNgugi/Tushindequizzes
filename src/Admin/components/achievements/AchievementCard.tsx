import { TrophyIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type {Achievement} from "../../types/adminTypes.ts";

interface AchievementCardProps {
    achievement: Achievement;
    onEdit: () => void;
    onDelete: () => void;
}

export const AchievementCard = ({ achievement, onEdit, onDelete }: AchievementCardProps) => {
    return (
        <div className="achievement-card">
            <div className="achievement-header">
                <div className="achievement-icon-wrapper yellow-bg">
                    <TrophyIcon className="achievement-icon yellow-text"/>
                </div>
                <div className="achievement-actions">
                    <button className="action-icon-btn" onClick={onEdit}>
                        <PencilIcon className="icon-small"/>
                    </button>
                    <button className="action-icon-btn" onClick={onDelete}>
                        <TrashIcon className="icon-small text-red"/>
                    </button>
                </div>
            </div>
            <h4 className="achievement-title">{achievement.title}</h4>
            <p className="achievement-description">{achievement.description}</p>
            <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">Points: {achievement.pointsReward}</span>
                <span className={`status-badge ${achievement.isActive ? 'active' : 'inactive'}`}>
                    {achievement.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>
        </div>
    );
};