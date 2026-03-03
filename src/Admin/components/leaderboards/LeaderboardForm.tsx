import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import type { LeaderboardScoreFormData, LeaderboardResetFormData } from "../../types/adminTypes.ts";

interface LeaderboardFormProps {
    form: LeaderboardScoreFormData | LeaderboardResetFormData;
    setForm: (form: LeaderboardScoreFormData | LeaderboardResetFormData) => void;
    submitting: boolean;
    mode: 'edit' | 'delete';
    onSubmit: () => void;
    onCancel: () => void;
}

export const LeaderboardForm = ({ form, setForm, submitting, mode, onSubmit, onCancel }: LeaderboardFormProps) => {
    if (mode === 'delete') {
        const resetForm = form as LeaderboardResetFormData;
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Reset leaderboard data. This will clear scores for the selected game and period.
                    </p>
                </div>

                <div>
                    <span className="form-label">Game ID *</span>
                    <input
                        className="form-input-admin"
                        placeholder="Enter game UUID"
                        value={resetForm.gameId || ''}
                        onChange={e => setForm({ ...resetForm, gameId: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <span className="form-label">Period</span>
                    <select
                        className="form-input-admin"
                        value={resetForm.period || 'daily'}
                        onChange={e => setForm({ ...resetForm, period: e.target.value as LeaderboardResetFormData['period'] })}
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="all_time">All Time</option>
                    </select>
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="excludeAllTime"
                        checked={resetForm.excludeAllTime || false}
                        onChange={e => setForm({ ...resetForm, excludeAllTime: e.target.checked })}
                    />
                    <span  className="text-sm">
                        Exclude all-time leaderboard from reset
                    </span>
                </div>
            </div>
        );
    }

    // Edit mode - Update Scores
    const scoreForm = form as LeaderboardScoreFormData;
    return (
        <div className="space-y-4">
            <div>
                <span className="form-label">User ID *</span>
                <input
                    className="form-input-admin"
                    placeholder="Enter user UUID"
                    value={scoreForm.userId || ''}
                    onChange={e => setForm({ ...scoreForm, userId: e.target.value })}
                    required
                />
            </div>

            <div>
                <span className="form-label">Game ID *</span>
                <input
                    className="form-input-admin"
                    placeholder="Enter game UUID"
                    value={scoreForm.gameId || ''}
                    onChange={e => setForm({ ...scoreForm, gameId: e.target.value })}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <span className="form-label">Period</span>
                    <select
                        className="form-input-admin"
                        value={scoreForm.period || 'all_time'}
                        onChange={e => setForm({ ...scoreForm, period: e.target.value as LeaderboardScoreFormData['period'] })}
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="all_time">All Time</option>
                    </select>
                </div>
                <div>
                    <span className="form-label">Score *</span>
                    <input
                        type="number"
                        className="form-input-admin"
                        placeholder="Score"
                        value={scoreForm.score || ''}
                        onChange={e => setForm({ ...scoreForm, score: Number(e.target.value) })}
                        min="0"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <span className="form-label">Wins</span>
                    <input
                        type="number"
                        className="form-input-admin"
                        placeholder="Wins"
                        value={scoreForm.wins || ''}
                        onChange={e => setForm({ ...scoreForm, wins: e.target.value ? Number(e.target.value) : undefined })}
                        min="0"
                    />
                </div>
                <div>
                    <span className="form-label">Losses</span>
                    <input
                        type="number"
                        className="form-input-admin"
                        placeholder="Losses"
                        value={scoreForm.losses || ''}
                        onChange={e => setForm({ ...scoreForm, losses: e.target.value ? Number(e.target.value) : undefined })}
                        min="0"
                    />
                </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
                <button
                    type="button"
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    disabled={submitting || !scoreForm.userId || !scoreForm.gameId || !scoreForm.score}
                    onClick={onSubmit}
                >
                    {submitting ? 'Updating...' : 'Update Scores'}
                </button>
            </div>
        </div>
    );
};