import { PencilIcon } from '@heroicons/react/24/outline';
import type {Transaction} from "../../types/adminTypes.ts";

interface TransactionTableProps {
    transactions: Transaction[];
    loading: boolean;
    onEdit: (transaction: Transaction) => void;
    showToast: (message: string, type?: 'success' | 'error') => void;
    fetchTransactions: () => void;
}

export const TransactionTable = ({ transactions, loading, onEdit, showToast, fetchTransactions }: TransactionTableProps) => {

    const handleRefund = async (tx: Transaction) => {
        const reason = window.prompt('Refund reason?');
        if (!reason) return;

        try {
            const response = await fetch(`/api/admin/transactions/${tx.id}/refund`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refundAmount: tx.amountPaid || 0, reason })
            });
            const res = await response.json();

            if (res.success) {
                showToast('Refund processed');
                fetchTransactions();
            } else {
                showToast(res.error || 'Refund failed', 'error');
            }
        } catch (error) {
            showToast('Refund failed', 'error');
        }
    };

    if (loading) {
        return (
            <div className="table-responsive">
                <table className="data-table">
                    <tbody>
                    <tr>
                        <td colSpan={9} className="loading-cell">Loading...</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="table-responsive">
            <table className="data-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Type</th>
                    <th>Points</th>
                    <th>Amount (KES)</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {transactions.length === 0 ? (
                    <tr>
                        <td colSpan={9} className="no-data">No transactions found</td>
                    </tr>
                ) : transactions.map((tx: Transaction) => (
                    <tr key={tx.id}>
                        <td className="transaction-id text-xs">{tx.id?.slice(0, 8)}…</td>
                        <td>
                            <div className="user-cell">
                                <div className="user-avatar-small purple-gradient">
                                    {(tx.user?.username || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm">{tx.user?.username || '—'}</p>
                                    <p className="text-xs text-gray-400">{tx.user?.phoneNumber || ''}</p>
                                </div>
                            </div>
                        </td>
                        <td><span className="role-badge">{tx.type}</span></td>
                        <td className="font-medium">{tx.pointsAmount?.toLocaleString()}</td>
                        <td className="amount">{tx.amountPaid?.toFixed(2) ?? '—'}</td>
                        <td>{tx.paymentMethod || '—'}</td>
                        <td>
                                <span className={`status-badge ${
                                    tx.paymentStatus === 'completed' ? 'active' :
                                        tx.paymentStatus === 'failed' ? 'inactive' : 'pending'
                                }`}>
                                    {tx.paymentStatus}
                                </span>
                        </td>
                        <td className="date text-xs">
                            {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '—'}
                        </td>
                        <td>
                            <div className="row-actions">
                                <button
                                    className="action-icon-btn"
                                    title="Update Status"
                                    onClick={() => onEdit(tx)}
                                >
                                    <PencilIcon className="icon-small" />
                                </button>
                                {tx.paymentStatus === 'completed' && (
                                    <button
                                        className="link-button text-xs text-red-500"
                                        onClick={() => handleRefund(tx)}
                                    >
                                        Refund
                                    </button>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};