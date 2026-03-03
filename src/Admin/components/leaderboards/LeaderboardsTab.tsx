// components/leaderboards/LeaderboardsTab.tsx
import { PencilIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { LeaderboardTable } from './LeaderboardTable';
import type { LeaderboardEntry } from '../../types/adminTypes';

interface LeaderboardsTabProps {
    leaderboard: LeaderboardEntry[];
    loading: boolean;
    onEdit: () => void;
    onReset: () => void;
}

export const LeaderboardsTab = ({ leaderboard, loading, onEdit, onReset }: LeaderboardsTabProps) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="action-bar">
                <button className="btn btn-primary" onClick={onEdit}>
                    <PencilIcon className="icon-sm" />
                    Update Scores
                </button>
                <button className="btn btn-danger" onClick={onReset}>
                    <ArrowPathIcon className="icon-sm" />
                    Reset Leaderboard
                </button>
            </div>

            <div className="table-wrap">
                <div className="table-head-row">
                    <div>
                        <div className="table-title">Global Leaderboard</div>
                        <div className="table-count">{leaderboard.length} ranked players</div>
                    </div>
                </div>
                {loading ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <div className="spinner" style={{ margin: '0 auto 8px' }} />
                        Loading leaderboard...
                    </div>
                ) : (
                    <LeaderboardTable leaderboard={leaderboard} />
                )}
            </div>
        </div>
    );
};
