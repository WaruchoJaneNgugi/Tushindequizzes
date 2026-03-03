import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import type {Category} from "../../types/adminTypes.ts";

interface CategoriesTabProps {
    categories: Category[];
    loading: boolean;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    onCreate?: () => void;
}

export const CategoriesTab = ({ categories, loading, onEdit, onDelete, onCreate }: CategoriesTabProps) => {
    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return (
        <div className="tab-content">
            <div className="action-bar">
                {onCreate && (
                    <button className="primary-button" onClick={onCreate}>
                        <PlusIcon className="icon-small" /> Create Category
                    </button>
                )}
            </div>

            <div className="table-card">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Slug</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {categories.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="no-data">No categories found</td>
                        </tr>
                    ) : categories.map((cat: Category) => (
                        <tr key={cat.id}>
                            <td><strong>{cat.name}</strong></td>
                            <td>
                                <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">
                                    {cat.slug}
                                </code>
                            </td>
                            <td>
                                    <span className={`status-badge ${cat.isActive ? 'active' : 'inactive'}`}>
                                        {cat.isActive ? 'Active' : 'Inactive'}
                                    </span>
                            </td>
                            <td className="date">
                                {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : '—'}
                            </td>
                            <td>
                                <div className="row-actions">
                                    <button
                                        className="action-icon-btn"
                                        onClick={() => onEdit(cat)}
                                    >
                                        <PencilIcon className="icon-small" />
                                    </button>
                                    <button
                                        className="action-icon-btn"
                                        onClick={() => onDelete(cat)}
                                    >
                                        <TrashIcon className="icon-small text-red" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};