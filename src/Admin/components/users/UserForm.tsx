// components/users/UserForm.tsx
import type { UserFormData, User } from '../../types/adminTypes';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface UserFormProps {
    form: UserFormData;
    setForm: (form: UserFormData) => void;
    submitting: boolean;
    mode: 'edit' | 'delete';
    user?: User;
    onSubmit: () => void;
    onCancel: () => void;
}

export const UserForm = ({ form, setForm, submitting, mode, user, onSubmit, onCancel }: UserFormProps) => {
    if (mode === 'delete') {
        return (
            <div className="form-stack">
                <div className="delete-box">
                    <ExclamationTriangleIcon />
                    <p className="delete-box-text">
                        Are you sure you want to delete <strong>{user?.username}</strong>? This action cannot be undone.
                    </p>
                </div>

                <div className="form-group">
                    <span className="form-label">Reason for deletion</span>
                    <input
                        className="form-input-admin"
                        placeholder="Enter reason"
                        value={form.reason || ''}
                        onChange={e => setForm({ ...form, reason: e.target.value })}
                    />
                </div>

                <span className="checkbox-row">
                    <input
                        type="checkbox"
                        checked={form.deleteData || false}
                        onChange={e => setForm({ ...form, deleteData: e.target.checked })}
                    />
                    <span className="checkbox-label">Permanently delete all user data</span>
                </span>

                <div className="form-actions">
                    <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger"
                        style={{ background: 'var(--danger)', color: '#fff' }}
                        disabled={submitting}
                        onClick={onSubmit}
                    >
                        {submitting ? 'Deleting...' : 'Delete User'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="form-stack">
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Update account status for <strong style={{ color: 'var(--text-primary)' }}>{user?.username}</strong>
            </p>

            <div className="form-group">
                <span className="form-label">Status</span>
                <select
                    className="form-select"
                    value={form.isActive ? 'active' : 'inactive'}
                    onChange={e => setForm({ ...form, isActive: e.target.value === 'active' })}
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive / Suspended</option>
                </select>
            </div>

            <div className="form-group">
                <span className="form-label">Reason</span>
                <input
                    className="form-input-admin"
                    placeholder="Reason for status change"
                    value={form.reason || ''}
                    onChange={e => setForm({ ...form, reason: e.target.value })}
                />
            </div>

            <div className="form-group">
                <span className="form-label">Notes</span>
                <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="Additional notes..."
                    value={form.notes || ''}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                />
            </div>

            <div className="form-actions">
                <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
                    Cancel
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    disabled={submitting}
                    onClick={onSubmit}
                >
                    {submitting ? 'Saving...' : 'Update Status'}
                </button>
            </div>
        </div>
    );
};
