import React, { useState } from 'react';
import type {Category, Quiz} from '../types';
import { apiService } from '../services/api';

interface CategoriesProps {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  quizzes: Quiz[];
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
}

const Categories: React.FC<CategoriesProps> = ({ categories, setCategories, setQuizzes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({ name: category.name, description: category.description });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (editingCategory) {
        // Update category via API
        const response = await apiService.updateCategory(editingCategory.id, formData);

        if (!response.success || response.error) {
          setError(response.error || 'Failed to update category');
          return;
        }

        // Update local state
        const oldName = editingCategory.name;
        const newName = formData.name;

        setCategories(prev => prev.map(cat =>
            cat.id === editingCategory.id ? {
              ...cat,
              ...formData,
              id: editingCategory.id // Keep the original ID
            } : cat
        ));

        // Update quizzes that use this category
        if (oldName !== newName) {
          setQuizzes(prev => prev.map(q =>
              q.category === oldName ? { ...q, category: newName } : q
          ));
        }
      } else {
        // Create new category via API
        const response = await apiService.createCategory(formData);

        if (!response.success || response.error) {
          setError(response.error || 'Failed to create category');
          return;
        }

        // Add new category to local state
        const newCategory: Category = {
          id: response.data?.category?.id || `cat-${Math.random().toString(36).substr(2, 9)}`,
          name: formData.name,
          description: formData.description
        };
        setCategories(prev => [...prev, newCategory]);
      }
      closeModal();
    } catch (err) {
      setError(`Failed to save category: ${err || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this category? This will set all quizzes in this category to "Uncategorized".')) {
      try {
        const response = await apiService.deleteCategory(id);

        if (!response.success || response.error) {
          alert(`Failed to delete: ${response.error || 'Unknown error'}`);
          return;
        }

        // Update local state
        const category = categories.find(c => c.id === id);
        setCategories(prev => prev.filter(c => c.id !== id));

        if (category) {
          setQuizzes(prev => prev.map(q =>
              q.category === category.name ? { ...q, category: 'Uncategorized' } : q
          ));
        }
      } catch (err) {
        alert(`Failed to delete category: ${err || 'Unknown error'}`);
      }
    }
  };

  return (
      <div className="responsive-flex-header" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        <div className="responsive-flex-header">
          <div style={{ flex: 1 }}>
            <h1>Category Management</h1>
            <p className="subtitle">Define and organize categories for your quizzes.</p>
          </div>
          <button className="btn btn-primary" onClick={() => openModal()} style={{ alignSelf: 'flex-start' }}>
            <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Category
          </button>
        </div>

        <div className="table-wrapper">
          <table className="admin-table top-align">
            <thead>
            <tr>
              <th style={{ width: '25%' }}>Name</th>
              <th>Description</th>
              <th className="text-right" style={{ width: '120px' }}>Actions</th>
            </tr>
            </thead>
            <tbody>
            {categories.length > 0 ? categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="fw-600">{cat.name}</td>
                  <td className="text-muted" style={{ fontSize: '0.8125rem', lineHeight: '1.4', wordBreak: 'break-word', minWidth: '200px' }}>
                    {cat.description || 'No description provided.'}
                  </td>
                  <td className="text-right">
                    <div className="table-actions-group">
                      <button className="btn btn-ghost" onClick={() => openModal(cat)} title="Edit">
                        <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button className="btn btn-ghost text-danger" onClick={() => handleDelete(cat.id)}>
                        <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
            )) : (
                <tr>
                  <td colSpan={3} className="text-center" style={{ padding: '3rem' }}>
                    No categories yet. Create your first category!
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
            <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="m-0">{editingCategory ? 'Edit Category' : 'Create New Category'}</h2>
                  <button className="btn btn-ghost" onClick={closeModal}>
                    <svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleSubmit} autoComplete="off">
                  <div className="modal-body">
                    {error && (
                        <div className="error-message" style={{
                          background: 'rgba(255, 107, 107, 0.1)',
                          border: '1px solid var(--danger)',
                          color: 'var(--danger)',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          marginBottom: '1rem',
                          fontSize: '0.875rem'
                        }}>
                          {error}
                        </div>
                    )}
                    <div className="form-group">
                      <label className="form-label">Category Name *</label>
                      <input
                          type="text"
                          className="form-input"
                          required
                          name="categoryName"
                          autoComplete="off"
                          spellCheck={false}
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          disabled={loading}
                          placeholder="Enter category name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description</label>
                      <textarea
                          className="form-input"
                          rows={4}
                          name="categoryDesc"
                          autoComplete="off"
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          disabled={loading}
                          placeholder="Enter category description (optional)"
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-outline"
                        onClick={closeModal}
                        disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                      {loading ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <svg className="icon-sm animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {editingCategory ? 'Updating...' : 'Creating...'}
                          </span>
                      ) : editingCategory ? 'Update Category' : 'Create Category'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
};

export default Categories;