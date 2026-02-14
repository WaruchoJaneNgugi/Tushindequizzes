
import React from 'react';
import type {Category} from '../types';

interface CategorySelectionProps {
    categories: Category[];
    selectedCategory: Category;
    onSelect: (category: Category) => void;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ categories, selectedCategory, onSelect }) => {
    return (
        <div className="selection-group">
            <label>CATEGORY</label>
            <div className="category-list">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        className={`category-item ${selectedCategory.id === cat.id ? 'active' : ''}`}
                        onClick={() => onSelect(cat)}
                    >
                        <span className="cat-icon">{cat.icon}</span>
                        <div className="cat-meta">
                            <span className="cat-name">{cat.name}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategorySelection;
