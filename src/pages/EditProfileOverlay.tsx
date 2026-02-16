import type { FC } from "react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth.ts";
import "../styles/featureoverlay.css";

interface EditProfileOverlayProps {
    onClose: () => void;
}

export const EditProfileOverlay: FC<EditProfileOverlayProps> = ({ onClose }) => {
    const { user, updateUser, changePassword } = useAuth(); // Add changePassword

    const [formData, setFormData] = useState({
        username: user?.username || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear errors when user starts typing
        if (error) setError("");
    };

    const validateForm = () => {
        if (activeTab === 'profile') {
            if (!formData.username.trim()) {
                setError("Username is required");
                return false;
            }
            if (formData.username.trim().length < 3) {
                setError("Username must be at least 3 characters");
                return false;
            }
        } else if (activeTab === 'security') {
            if (!formData.currentPassword) {
                setError("Current password is required");
                return false;
            }
            if (!formData.newPassword) {
                setError("New password is required");
                return false;
            }
            if (formData.newPassword.length < 6) {
                setError("New password must be at least 6 characters");
                return false;
            }
            if (formData.newPassword !== formData.confirmPassword) {
                setError("New passwords do not match");
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            if (activeTab === 'profile') {
                // Handle username update
                if (formData.username !== user?.username) {
                    await updateUser({ username: formData.username.trim() });
                    setSuccess("Username updated successfully!");
                } else {
                    setSuccess("No changes were made.");
                }
            } else if (activeTab === 'security') {
                // Handle password change
                await changePassword(formData.currentPassword, formData.newPassword);
                setSuccess("Password changed successfully!");

                // Reset password fields after successful change
                setFormData(prev => ({
                    ...prev,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                }));
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            setError( "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    // ... rest of your component remains the same (JSX)
    return (
        <>
            <div className="overlay-overlay-editprofile" onClick={onClose} />
            <div className="feature-overlay-editprofile">
                <div className="feature-overlay-header">
                    <div className="feature-header-left">
                        <button className="feature-back-button" onClick={onClose}>
                            <svg className="back-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <div className="feature-header-center">
                        <h2 className="feature-title">Edit Profile</h2>
                        <p className="feature-subtitle">Update your account information</p>
                    </div>
                    <div className="feature-header-right">
                        <button className="feature-action-button" onClick={onClose}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="feature-overlay-content">
                    <div className="edit-profile-container">
                        {/* Tab Navigation */}
                        <div className="edit-profile-tabs">
                            <button
                                className={`edit-profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
                                onClick={() => setActiveTab('profile')}
                            >
                                <span className="tab-icon">👤</span>
                                <span className="tab-label">Profile Info</span>
                            </button>
                            <button
                                className={`edit-profile-tab ${activeTab === 'security' ? 'active' : ''}`}
                                onClick={() => setActiveTab('security')}
                            >
                                <span className="tab-icon">🔒</span>
                                <span className="tab-label">Security</span>
                            </button>
                        </div>

                        {/* Messages */}
                        {error && (
                            <div className="edit-profile-message error">
                                <span className="message-icon">⚠️</span>
                                <span className="message-text">{error}</span>
                            </div>
                        )}

                        {success && (
                            <div className="edit-profile-message success">
                                <span className="message-icon">✅</span>
                                <span className="message-text">{success}</span>
                            </div>
                        )}

                        {/* Current User Info */}
                        <div className="current-profile-info">
                            <div className="current-avatar">
                                <div className="avatar-large">
                                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </div>
                            <div className="current-details">
                                <h3 className="current-name">{user?.username || 'User'}</h3>
                                <p className="current-email">{user?.phoneNumber || 'No phone number'}</p>
                            </div>
                        </div>

                        {/* Edit Form */}
                        <form className="edit-profile-form" onSubmit={handleSubmit}>
                            {/* Profile Tab Content */}
                            {activeTab === 'profile' && (
                                <div className="form-section">
                                    <div className="form-group">
                                        <label htmlFor="username" className="form-label">
                                            <span className="label-icon">👤</span>
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            className="form-input"
                                            placeholder="Enter your new username"
                                            disabled={loading}
                                        />
                                        <p className="form-hint">
                                            Choose a username between 3 and 20 characters. This is how others will see you.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Security Tab Content */}
                            {activeTab === 'security' && (
                                <div className="form-section">
                                    <div className="form-group">
                                        <label htmlFor="currentPassword" className="form-label">
                                            <span className="label-icon">🔑</span>
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            id="currentPassword"
                                            name="currentPassword"
                                            value={formData.currentPassword}
                                            onChange={handleChange}
                                            className="form-input"
                                            placeholder="Enter your current password"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="newPassword" className="form-label">
                                            <span className="label-icon">🔄</span>
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            className="form-input"
                                            placeholder="Enter new password (min 6 characters)"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="confirmPassword" className="form-label">
                                            <span className="label-icon">✅</span>
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="form-input"
                                            placeholder="Confirm your new password"
                                            disabled={loading}
                                        />
                                    </div>

                                    <div className="password-requirements">
                                        <h4 className="requirements-title">Password Requirements:</h4>
                                        <ul className="requirements-list">
                                            <li className={formData.newPassword.length >= 6 ? 'met' : ''}>
                                                At least 6 characters long
                                            </li>
                                            <li>Can contain letters, numbers, and symbols</li>
                                            <li>Should be different from your current password</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="btn-cancel"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-save"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="loading-spinner-small"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Important Notes */}
                        <div className="edit-profile-notes">
                            <div className="note-card">
                                <h4 className="note-title">💡 Important Notes</h4>
                                <ul className="note-list">
                                    <li>Username changes may take a few minutes to update across all systems</li>
                                    <li>After changing your password, you'll need to login again on other devices</li>
                                    <li>Keep your password secure and don't share it with anyone</li>
                                    <li>Contact support if you have any issues updating your account</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};