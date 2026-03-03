// components/categories/CategoryForm.tsx
import type { CategoryFormData } from '../../types/adminTypes';

interface CategoryFormProps {
    form: CategoryFormData;
    setForm: (form: CategoryFormData) => void;
    submitting: boolean;
    mode: 'create' | 'edit';
    onSubmit: () => void;
    onCancel: () => void;
}

export const CategoryForm = ({ form, setForm, submitting, mode, onSubmit, onCancel }: CategoryFormProps) => {
    return (
        <div className="form-stack">
            <div className="form-group">
                <span className="form-label">Name *</span>
                <input
                    type="text"
                    className="form-input-admin"
                    placeholder="e.g. Sports Trivia"
                    value={form.name || ''}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                />
            </div>

            <div className="form-group">
                <span className="form-label">Slug</span>
                <input
                    type="text"
                    className="form-input-admin"
                    placeholder="e.g. sports-trivia"
                    value={form.slug || ''}
                    onChange={e => setForm({ ...form, slug: e.target.value })}
                />
                <p className="form-hint">Leave empty to auto-generate from name</p>
            </div>

            <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
                    Cancel
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    disabled={submitting || !form.name}
                    onClick={onSubmit}
                >
                    {submitting
                        ? 'Saving...'
                        : mode === 'create' ? 'Create Category' : 'Update Category'}
                </button>
            </div>
        </div>
    );
};
