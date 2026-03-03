import type { TransactionFormData, TransactionStatusFormData, Transaction } from "../../types/adminTypes.ts";

interface TransactionFormProps {
    form: TransactionFormData | TransactionStatusFormData;
    setForm: (form: TransactionFormData | TransactionStatusFormData) => void;
    submitting: boolean;
    mode: 'create' | 'edit';
    transaction?: Transaction;
    onSubmit: () => void;
    onCancel: () => void;
}

export const TransactionForm = ({ form, setForm, submitting, mode, transaction, onSubmit, onCancel }: TransactionFormProps) => {
    if (mode === 'edit') {
        const statusForm = form as TransactionStatusFormData;
        return (
            <div className="space-y-4">
                <p className="text-sm text-gray-500">
                    Update status for transaction <code>{transaction?.id?.slice(0, 8)}...</code>
                </p>

                <div>
                    <span className="form-label">Status *</span>
                    <select
                        className="form-input"
                        value={statusForm.status || transaction?.paymentStatus || 'pending'}
                        onChange={e => setForm({ ...statusForm, status: e.target.value as TransactionStatusFormData['status'] })}
                    >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                    </select>
                </div>

                <div>
                    <span className="form-label">Notes</span>
                    <input
                        className="form-input"
                        placeholder="Additional notes"
                        value={statusForm.notes || ''}
                        onChange={e => setForm({ ...statusForm, notes: e.target.value })}
                    />
                </div>

                <div className="flex gap-2 justify-end pt-4">
                    <button
                        type="button"
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        disabled={submitting}
                        onClick={onSubmit}
                    >
                        {submitting ? 'Updating...' : 'Update Status'}
                    </button>
                </div>
            </div>
        );
    }

    // Create mode
    const createForm = form as TransactionFormData;
    return (
        <div className="space-y-4">
            <div>
                <span className="form-label">Type *</span>
                <select
                    className="form-input"
                    value={createForm.type || 'bonus'}
                    onChange={e => setForm({ ...createForm, type: e.target.value as TransactionFormData['type'] })}
                >
                    <option value="bonus">Bonus</option>
                    <option value="purchase">Purchase</option>
                    <option value="withdrawal">Withdrawal</option>
                    <option value="refund">Refund</option>
                </select>
            </div>

            <div>
                <span className="form-label">Description *</span>
                <input
                    className="form-input"
                    placeholder="Transaction description"
                    value={createForm.description || ''}
                    onChange={e => setForm({ ...createForm, description: e.target.value })}
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <span className="form-label">Points Amount *</span>
                    <input
                        type="number"
                        className="form-input"
                        placeholder="Points"
                        value={createForm.pointsAmount || ''}
                        onChange={e => setForm({ ...createForm, pointsAmount: Number(e.target.value) })}
                        min="0"
                        required
                    />
                </div>
                <div>
                    <span className="form-label">Amount Paid (KES)</span>
                    <input
                        type="number"
                        className="form-input"
                        placeholder="0.00"
                        value={createForm.amountPaid || ''}
                        onChange={e => setForm({ ...createForm, amountPaid: e.target.value ? Number(e.target.value) : undefined })}
                        min="0"
                        step="0.01"
                    />
                </div>
            </div>

            <div>
                <span className="form-label">Payment Method</span>
                <select
                    className="form-input"
                    value={createForm.paymentMethod || 'manual'}
                    onChange={e => setForm({ ...createForm, paymentMethod: e.target.value as TransactionFormData['paymentMethod'] })}
                >
                    <option value="manual">Manual</option>
                    <option value="mpesa">M-Pesa</option>
                    <option value="card">Card</option>
                    <option value="wallet">Wallet</option>
                </select>
            </div>

            <div>
                <span className="form-label">Reference ID</span>
                <input
                    className="form-input"
                    placeholder="Optional reference ID"
                    value={createForm.referenceId || ''}
                    onChange={e => setForm({ ...createForm, referenceId: e.target.value })}
                />
            </div>

            <div className="flex gap-2 justify-end pt-4">
                <button
                    type="button"
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={onCancel}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                    disabled={submitting || !createForm.type || !createForm.description || !createForm.pointsAmount}
                    onClick={onSubmit}
                >
                    {submitting ? 'Creating...' : 'Create Transaction'}
                </button>
            </div>
        </div>
    );
};