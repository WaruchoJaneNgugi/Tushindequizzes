import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type {PaginationState, User} from "../../types/adminTypes.ts";
import {UserTable} from "./UsersTable.tsx";


interface UsersTabProps {
    users: User[];
    loading: boolean;
    pagination?: PaginationState['users'];
    onPageChange: (page: number) => void;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

export const UsersTab = ({ users, loading, pagination, onPageChange, onEdit, onDelete }: UsersTabProps) => {
    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return (
        <div className="tab-content">
            <div className="filters-bar">
                <div className="filters-group">
                    <div className="search-wrapper small">
                        <MagnifyingGlassIcon className="search-icon"/>
                        <input type="text" placeholder="Search users..." className="search-input small"/>
                    </div>
                    <select className="filter-select">
                        <option>All Roles</option>
                        <option>admin</option>
                        <option>user</option>
                    </select>
                    <select className="filter-select">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                </div>
            </div>

            <div className="table-card">
                <UserTable users={users} onEdit={onEdit} onDelete={onDelete} />

                {pagination && (
                    <div className="table-footer">
                        <p className="showing-text">
                            Page {pagination.page} of {pagination.pages} ({pagination.total} users)
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