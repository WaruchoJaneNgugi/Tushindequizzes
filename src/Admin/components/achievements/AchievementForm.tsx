// components/achievements/AchievementForm.tsx
import type { AchievementFormData } from '../../types/adminTypes';

interface AchievementFormProps {
    form: AchievementFormData;
    setForm: (form: AchievementFormData) => void;
    submitting: boolean;
    mode: 'create' | 'edit';
    onSubmit: () => void;
    onCancel: () => void;
}

export const AchievementForm = ({ form, setForm, submitting, mode, onSubmit, onCancel }: AchievementFormProps) => {
    return (
        <div className="form-stack">
            <div className="form-group">
                <span className="form-label-admin">Title *</span>
                <input
                    type="text"
                    className="form-input-admin"
                    placeholder="e.g. First Victory"
                    value={form.title || ''}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    required
                />
            </div>

            <div className="form-group">
                <span className="form-label-admin">Description *</span>
                <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Describe what the player must do to earn this achievement"
                    value={form.description || ''}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    required
                />
            </div>

            <div className="form-row form-row-2">
                <div className="form-group">
                    <span className="form-label-admin">Points Reward *</span>
                    <input
                        type="number"
                        className="form-input-admin"
                        placeholder="100"
                        value={form.pointsReward || ''}
                        onChange={e => setForm({ ...form, pointsReward: Number(e.target.value) })}
                        min="0"
                        required
                    />
                </div>
                <div className="form-group">
                    <span className="form-label-admin">Criteria Type</span>
                    <select
                        className="form-select"
                        value={form.criteriaType || 'games_played'}
                        onChange={e => setForm({ ...form, criteriaType: e.target.value as AchievementFormData['criteriaType'] })}
                    >
                        <option value="games_played">Games Played</option>
                        <option value="consecutive_wins">Consecutive Wins</option>
                        <option value="score_threshold">Score Threshold</option>
                        <option value="total_points">Total Points</option>
                    </select>
                </div>
            </div>

            <div className="form-row form-row-2">
                <div className="form-group">
                    <span className="form-label-admin">Threshold *</span>
                    <input
                        type="number"
                        className="form-input-admin"
                        placeholder="e.g. 10"
                        value={form.threshold || ''}
                        onChange={e => setForm({ ...form, threshold: Number(e.target.value) })}
                        min="1"
                        required
                    />
                </div>
                <div className="form-group">
                    <span className="form-label-admin">Game ID (Optional)</span>
                    <input
                        className="form-input-admin"
                        placeholder="UUID for specific game"
                        value={form.gameId || ''}
                        onChange={e => setForm({ ...form, gameId: e.target.value })}
                    />
                </div>
            </div>

            <span className="checkbox-row">
                <input
                    type="checkbox"
                    checked={form.isActive !== false}
                    onChange={e => setForm({ ...form, isActive: e.target.checked })}
                />
                <span className="checkbox-label">Active</span>
            </span>

            <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
                    Cancel
                </button>
                <button
                    type="button"
                    className="btn btn-yellow"
                    disabled={submitting || !form.title || !form.description || !form.pointsReward}
                    onClick={onSubmit}
                >
                    {submitting
                        ? 'Saving...'
                        : mode === 'create' ? 'Create Achievement' : 'Update Achievement'}
                </button>
            </div>
        </div>
    );
};
