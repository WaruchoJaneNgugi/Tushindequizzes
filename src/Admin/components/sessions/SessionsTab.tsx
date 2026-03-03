import { SessionsTable } from './SessionsTable';
import type {GameSession} from "../../types/adminTypes.ts";

interface SessionsTabProps {
    sessions: GameSession[];
    loading: boolean;
    pagination?: {
        page: number;
        pages: number;
        total: number;
    };
    onPageChange: (page: number) => void;
    showToast: (message: string, type?: 'success' | 'error') => void;
    fetchSessions: () => void;
}

export const SessionsTab = ({ sessions, loading, pagination, onPageChange, showToast, fetchSessions }: SessionsTabProps) => {
    return (
        <div className="tab-content">
            <div className="filters-bar">
                <div className="filters-group">
                    <select className="filter-select" onChange={() => fetchSessions()}>
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="abandoned">Abandoned</option>
                    </select>
                </div>
            </div>

            <div className="table-card">
                <div className="table-header">
                    <h3 className="table-title">Game Sessions</h3>
                    <p className="text-sm text-gray-500">
                        {pagination ? `${pagination.total} total sessions` : ''}
                    </p>
                </div>

                <SessionsTable
                    sessions={sessions}
                    loading={loading}
                    showToast={showToast}
                    fetchSessions={fetchSessions}
                />

                {pagination && (
                    <div className="table-footer">
                        <p className="showing-text">
                            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                        </p>
                        <div className="pagination">
                            <button
                                className="pagination-btn"
                                disabled={pagination.page <= 1}
                                onClick={() => onPageChange(pagination.page - 1)}
                            >
                                Previous
                            </button>
                            <button
                                className="pagination-btn"
                                disabled={pagination.page >= pagination.pages}
                                onClick={() => onPageChange(pagination.page + 1)}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};