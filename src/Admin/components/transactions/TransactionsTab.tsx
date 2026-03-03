import { PlusIcon, CurrencyDollarIcon, CircleStackIcon, TrophyIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import type {Transaction, TransactionStats} from "../../types/adminTypes.ts";
import {TransactionTable} from "./TransactionTable.tsx";

interface TransactionsTabProps {
    transactions: Transaction[];
    stats: TransactionStats | null;
    loading: boolean;
    pagination?: {
        page: number;
        pages: number;
        total: number;
    };
    onPageChange: (page: number) => void;
    onEdit: (transaction: Transaction) => void;
    onCreate: () => void;
    showToast: (message: string, type?: 'success' | 'error') => void;
    fetchTransactions: () => void;
}

export const TransactionsTab = ({
                                    transactions,
                                    stats,
                                    loading,
                                    pagination,
                                    onPageChange,
                                    onEdit,
                                    onCreate,
                                    showToast,
                                    fetchTransactions
                                }: TransactionsTabProps) => {

    const statCards = [
        {
            label: 'Total Revenue',
            value: stats ? `KES ${(stats.totalRevenue || 0).toLocaleString()}` : '—',
            icon: CurrencyDollarIcon
        },
        {
            label: 'Total Transactions',
            value: stats ? (stats.totalTransactions || 0).toLocaleString() : '—',
            icon: CircleStackIcon
        },
        {
            label: 'Points Purchased',
            value: stats ? (stats.totalPointsPurchased || 0).toLocaleString() : '—',
            icon: TrophyIcon
        },
        {
            label: 'Pending',
            value: stats?.paymentStatuses?.pending?.toString() || '0',
            icon: ArrowPathIcon
        },
    ];

    return (
        <div className="tab-content">
            {/* Stats mini cards */}
            <div className="stats-grid-small">
                {statCards.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="stat-card-small">
                            <div className="stat-small-header">
                                <div className="stat-small-icon emerald-bg">
                                    <Icon className="icon-small emerald-text" />
                                </div>
                            </div>
                            <p className="stat-small-value">{stat.value}</p>
                            <p className="stat-small-label">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            <div className="table-card">
                <div className="table-header">
                    <h3 className="table-title">All Transactions</h3>
                    <div className="table-actions">
                        <button className="primary-button small" onClick={onCreate}>
                            <PlusIcon className="icon-small" /> New Transaction
                        </button>
                    </div>
                </div>

                <TransactionTable
                    transactions={transactions}
                    loading={loading}
                    onEdit={onEdit}
                    showToast={showToast}
                    fetchTransactions={fetchTransactions}
                />

                {pagination && (
                    <div className="table-footer">
                        <p className="showing-text">
                            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
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