import type { FC } from "react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth.ts";
import "../styles/edit-profile-overlay.css";

interface EditProfileOverlayProps {
    onClose: () => void;
    onSave: () => Promise<void>;
}

export const EditProfileOverlay: FC<EditProfileOverlayProps> = ({ onClose, onSave }) => {
    const { user, updateUser, changePassword } = useAuth();

    const [formData, setFormData] = useState({
        username: user?.username || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState("");
    const [success, setSuccess]     = useState("");
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const validateForm = () => {
        if (activeTab === 'profile') {
            if (!formData.username.trim())             { setError("Username is required"); return false; }
            if (formData.username.trim().length < 3)   { setError("Username must be at least 3 characters"); return false; }
        } else {
            if (!formData.currentPassword)             { setError("Current password is required"); return false; }
            if (!formData.newPassword)                 { setError("New password is required"); return false; }
            if (formData.newPassword.length < 6)       { setError("New password must be at least 6 characters"); return false; }
            if (formData.newPassword !== formData.confirmPassword) { setError("Passwords do not match"); return false; }
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true); setError(""); setSuccess("");
        try {
            if (activeTab === 'profile') {
                if (formData.username !== user?.username) {
                    await updateUser({ username: formData.username.trim() });
                    setSuccess("Username updated successfully!");
                }
            } else {
                await changePassword(formData.currentPassword, formData.newPassword);
                setSuccess("Password changed successfully!");
                setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
            }
            await onSave();
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Password strength
    const pwLen   = formData.newPassword.length;
    const pwStrength = pwLen === 0 ? 0 : pwLen < 6 ? 1 : pwLen < 10 ? 2 : 3;
    const pwMatch = formData.confirmPassword.length > 0 && formData.newPassword === formData.confirmPassword;
    const initial = user?.username?.charAt(0).toUpperCase() || 'U';

    return (
        <>
            <div className="ep-backdrop" onClick={onClose} />
            <div className="ep-shell">

                {/* ── TOPBAR ── */}
                <header className="ep-topbar">
                    <button className="ep-back" onClick={onClose}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Back
                    </button>
                    <div className="ep-topbar-center">
                        <span className="ep-topbar-title">Edit Profile</span>
                        <span className="ep-topbar-sub">Update your account</span>
                    </div>
                    <button className="ep-close-btn" onClick={onClose} aria-label="Close">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                    </button>
                </header>

                <div className="ep-body">

                    {/* ── USER ROW ── */}
                    <div className="ep-user-row">
                        <div className="ep-avatar">{initial}</div>
                        <div className="ep-user-info">
                            <span className="ep-user-name">{user?.username || 'User'}</span>
                            <span className="ep-user-sub">{user?.phoneNumber || '—'}</span>
                        </div>
                    </div>

                    {/* ── TABS ── */}
                    <div className="ep-tabs">
                        <button
                            className={`ep-tab ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('profile'); setError(""); setSuccess(""); }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Profile Info
                        </button>
                        <button
                            className={`ep-tab ${activeTab === 'security' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('security'); setError(""); setSuccess(""); }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            Security
                        </button>
                    </div>

                    {/* ── ALERT ── */}
                    {error   && <div className="ep-alert ep-alert--error">  <span>⚠️</span>{error}   </div>}
                    {success && <div className="ep-alert ep-alert--success"><span>✅</span>{success}</div>}

                    {/* ── FORM ── */}
                    <form className="ep-form" onSubmit={handleSubmit}>

                        {activeTab === 'profile' && (
                            <div className="ep-form-group">
                                <label className="ep-label" htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    className="ep-input"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Enter your username"
                                    disabled={loading}
                                    autoComplete="username"
                                />
                                <p className="ep-hint">3–20 characters. Letters, numbers, underscores only.</p>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <>
                                <div className="ep-form-group">
                                    <label className="ep-label" htmlFor="currentPassword">Current Password</label>
                                    <input
                                        id="currentPassword"
                                        name="currentPassword"
                                        type="password"
                                        className="ep-input"
                                        value={formData.currentPassword}
                                        onChange={handleChange}
                                        placeholder="Enter current password"
                                        disabled={loading}
                                        autoComplete="current-password"
                                    />
                                </div>

                                <div className="ep-form-group">
                                    <label className="ep-label" htmlFor="newPassword">New Password</label>
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        className={`ep-input ${formData.newPassword ? (pwStrength >= 2 ? 'ep-input--ok' : 'ep-input--warn') : ''}`}
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="Min. 6 characters"
                                        disabled={loading}
                                        autoComplete="new-password"
                                    />
                                    {/* Strength bar */}
                                    {formData.newPassword.length > 0 && (
                                        <div className="ep-strength">
                                            <div className="ep-strength-bar">
                                                {[1,2,3].map(n => (
                                                    <div key={n} className={`ep-strength-seg ${pwStrength >= n ? `ep-strength-seg--${n}` : ''}`}/>
                                                ))}
                                            </div>
                                            <span className="ep-strength-label">
                                                {pwStrength === 1 && 'Weak'}
                                                {pwStrength === 2 && 'Good'}
                                                {pwStrength === 3 && 'Strong'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="ep-form-group">
                                    <label className="ep-label" htmlFor="confirmPassword">Confirm Password</label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        className={`ep-input ${formData.confirmPassword ? (pwMatch ? 'ep-input--ok' : 'ep-input--warn') : ''}`}
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Re-enter new password"
                                        disabled={loading}
                                        autoComplete="new-password"
                                    />
                                    {formData.confirmPassword.length > 0 && (
                                        <p className={`ep-match-hint ${pwMatch ? 'ep-match-hint--ok' : 'ep-match-hint--no'}`}>
                                            {pwMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                                        </p>
                                    )}
                                </div>

                                <div className="ep-requirements">
                                    <span className={`ep-req ${formData.newPassword.length >= 6 ? 'met' : ''}`}>
                                        {formData.newPassword.length >= 6 ? '✓' : '○'} At least 6 characters
                                    </span>
                                    <span className={`ep-req ${formData.newPassword !== formData.currentPassword && formData.newPassword.length > 0 ? 'met' : ''}`}>
                                        {formData.newPassword !== formData.currentPassword && formData.newPassword.length > 0 ? '✓' : '○'} Different from current
                                    </span>
                                </div>
                            </>
                        )}

                        {/* ── ACTIONS ── */}
                        <div className="ep-actions">
                            <button type="button" className="ep-btn-cancel" onClick={onClose} disabled={loading}>
                                Cancel
                            </button>
                            <button type="submit" className="ep-btn-save" disabled={loading}>
                                {loading ? (
                                    <><span className="ep-spinner" /> Saving…</>
                                ) : (
                                    <><svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg> Save Changes</>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* ── NOTE ── */}
                    <div className="ep-note">
                        <span className="ep-note-icon">💡</span>
                        <ul className="ep-note-list">
                            <li>Username changes update within a few minutes.</li>
                            <li>After changing your password, re-login on other devices.</li>
                            <li>Contact support if you have any issues.</li>
                        </ul>
                    </div>

                </div>
            </div>
        </>
    );
};
