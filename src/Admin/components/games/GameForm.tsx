// components/games/GameForm.tsx
import type { GameFormData } from '../../types/adminTypes';

interface GameFormProps {
    form: GameFormData;
    setForm: (form: GameFormData) => void;
    submitting: boolean;
    mode: 'create' | 'edit';
    onSubmit: () => void;
    onCancel: () => void;
}

export const GameForm = ({ form, setForm, submitting, mode, onSubmit, onCancel }: GameFormProps) => {
    return (
        <div className="form-stack">
            <div className="form-row form-row-2">
                <div className="form-group">
                    <span className="form-label">Title *</span>
                    <input
                        type="text"
                        className="form-input-admin"
                        placeholder="e.g. World Geography"
                        value={form.title || ''}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <span className="form-label">Slug</span>
                    <input
                        type="text"
                        className="form-input-admin"
                        placeholder="auto-generated"
                        value={form.slug || ''}
                        onChange={e => setForm({ ...form, slug: e.target.value })}
                    />
                </div>
            </div>

            <div className="form-group">
                <span className="form-label">Description</span>
                <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Describe this game..."
                    value={form.description || ''}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                />
            </div>

            <div className="form-row form-row-2">
                <div className="form-group">
                    <span className="form-label">Category</span>
                    <input
                        type="text"
                        className="form-input-admin"
                        placeholder="e.g. Geography"
                        value={form.category || ''}
                        onChange={e => setForm({ ...form, category: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <span className="form-label">Difficulty</span>
                    <select
                        className="form-select"
                        value={form.difficulty || 'medium'}
                        onChange={e => setForm({ ...form, difficulty: e.target.value as GameFormData['difficulty'] })}
                    >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="expert">Expert</option>
                    </select>
                </div>
            </div>

            <div className="form-row form-row-3">
                <div className="form-group">
                    <span className="form-label">Entry Fee (pts)</span>
                    <input
                        type="number"
                        className="form-input-admin"
                        placeholder="0"
                        value={form.entryFee || ''}
                        onChange={e => setForm({ ...form, entryFee: Number(e.target.value) })}
                        min="0"
                    />
                </div>
                <div className="form-group">
                    <span className="form-label">Reward (pts)</span>
                    <input
                        type="number"
                        className="form-input-admin"
                        placeholder="100"
                        value={form.rewardPoints || ''}
                        onChange={e => setForm({ ...form, rewardPoints: Number(e.target.value) })}
                        min="0"
                    />
                </div>
                <div className="form-group">
                    <span className="form-label">Duration (min)</span>
                    <input
                        type="number"
                        className="form-input-admin"
                        placeholder="10"
                        value={form.durationMinutes || ''}
                        onChange={e => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                        min="1"
                    />
                </div>
            </div>

            {mode === 'edit' && (
                <div style={{ display: 'flex', gap: '20px' }}>
                    <span className="checkbox-row">
                        <input
                            type="checkbox"
                            checked={form.isActive !== false}
                            onChange={e => setForm({ ...form, isActive: e.target.checked })}
                        />
                        <span className="checkbox-label">Active</span>
                    </span>
                    <span className="checkbox-row">
                        <input
                            type="checkbox"
                            checked={form.isFeatured === true}
                            onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
                        />
                        <span className="checkbox-label">Featured</span>
                    </span>
                </div>
            )}

            <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
                    Cancel
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    disabled={submitting || !form.title}
                    onClick={onSubmit}
                >
                    {submitting
                        ? 'Saving...'
                        : mode === 'create' ? 'Create Game' : 'Update Game'}
                </button>
            </div>
        </div>
    );
};
