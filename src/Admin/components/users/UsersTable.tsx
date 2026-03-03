import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type {User} from "../../types/adminTypes.ts";


interface UserTableProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

export const UserTable = ({ users, onEdit, onDelete }: UserTableProps) => {
    if (users.length === 0) {
        return (
            <table className="data-table">
                <tbody>
                <tr>
                    <td colSpan={9} className="no-data">No users found</td>
                </tr>
                </tbody>
            </table>
        );
    }

    return (
        <table className="data-table">
            <thead>
            <tr>
                <th>User</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Points</th>
                <th>Level</th>
                <th>Games Played</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user: User) => (
                <tr key={user.id}>
                    <td>
                        <div className="user-profile-cell">
                            <div className="user-avatar blue-gradient">
                                {(user.username || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="user-fullname">{user.username}</p>
                                {user.countryCode && (
                                    <p className="text-xs text-gray-400">{user.countryCode}</p>
                                )}
                            </div>
                        </div>
                    </td>
                    <td className="phone">{user.phoneNumber}</td>
                    <td><span className="role-badge">{user.role}</span></td>
                    <td className="font-medium text-emerald-600">
                        {(user.pointsBalance || 0).toLocaleString()}
                    </td>
                    <td className="text-center">{user.level || 1}</td>
                    <td className="text-center">{user.totalGamesPlayed || 0}</td>
                    <td>
                            <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                    </td>
                    <td className="date">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td>
                        <div className="row-actions">
                            <button
                                className="action-icon-btn"
                                title="Update Status"
                                onClick={() => onEdit(user)}
                            >
                                <PencilIcon className="icon-small"/>
                            </button>
                            <button
                                className="action-icon-btn"
                                title="Delete User"
                                onClick={() => onDelete(user)}
                            >
                                <TrashIcon className="icon-small text-red"/>
                            </button>
                        </div>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};