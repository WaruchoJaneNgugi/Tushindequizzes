import type {GameSession} from "../../types/adminTypes.ts";

interface SessionsTableProps {
    sessions: GameSession[];
    loading: boolean;
    showToast: (message: string, type?: 'success' | 'error') => void;
    fetchSessions: () => void;
}

export const SessionsTable = ({ sessions, loading, showToast, fetchSessions }: SessionsTableProps) => {

    const handleAbandon = async (sessionId: string) => {
        try {
            const response = await fetch(`/api/admin/sessions/${sessionId}/abandon`, {
                method: 'POST',
            });
            const res = await response.json();

            if (res.success) {
                showToast('Session abandoned');
                fetchSessions();
            } else {
                showToast('Failed to abandon session', 'error');
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            showToast('Failed to abandon session', 'error');
        }
    };

    if (loading) {
        return (
            <div className="table-responsive">
                <table className="data-table">
                    <tbody>
                    <tr>
                        <td colSpan={9} className="loading-cell">Loading...</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="data-table">
                <thead>
                <tr>
                    <th>Session ID</th>
                    <th>Player</th>
                    <th>Game</th>
                    <th>Score</th>
                    <th>Points Earned</th>
                    <th>Status</th>
                    <th>Duration</th>
                    <th>Started</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {sessions.length === 0 ? (
                    <tr>
                        <td colSpan={9} className="no-data">No sessions found</td>
                    </tr>
                ) : sessions.map((session: GameSession) => (
                    <tr key={session.id}>
                        <td className="transaction-id text-xs">{session.id?.slice(0, 8)}…</td>
                        <td>
                            <div className="user-cell">
                                <div className="user-avatar-small indigo-gradient">
                                    {(session.user?.username || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{session.user?.username || 'Unknown'}</p>
                                    <p className="text-xs text-gray-400">{session.user?.phoneNumber || ''}</p>
                                </div>
                            </div>
                        </td>
                        <td className="text-sm">{session.game?.title || '—'}</td>
                        <td><strong>{session.score ?? '—'}</strong></td>
                        <td className="text-emerald-600 font-medium">+{session.pointsEarned ?? 0}</td>
                        <td>
                                <span className={`status-badge ${
                                    session.status === 'completed' ? 'active' :
                                        session.status === 'abandoned' ? 'inactive' : 'pending'
                                }`}>
                                    {session.status}
                                </span>
                        </td>
                        <td className="text-sm text-gray-500">
                            {session.durationSeconds ?
                                `${Math.floor(session.durationSeconds / 60)}m ${session.durationSeconds % 60}s` :
                                '—'
                            }
                        </td>
                        <td className="date text-xs">
                            {session.startedAt ? new Date(session.startedAt).toLocaleString() : '—'}
                        </td>
                        <td>
                            {session.status === 'active' && (
                                <button
                                    className="link-button text-red-500"
                                    onClick={() => handleAbandon(session.id)}
                                >
                                    Abandon
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};