import React, { useState, useEffect } from 'react';
import type { AdminUser } from '../types';
import { apiService } from '../services/api';
import { useStore } from '../store/useStore';
import "../assets/login.css"

interface LoginProps {
  onLogin: (user: AdminUser) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Get theme from store
  const { isDarkMode } = useStore();

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber || !password) {
      setError('Please enter phone number and password');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await apiService.login(phoneNumber, password);

      if (!response.success) {
        setError(response.error || 'Login failed. Please check your credentials.');
        return;
      }

      if (response.data?.token && response.data?.user) {
        apiService.setToken(response.data.token);

        const userData = response.data.user;
        const adminUser: AdminUser = {
          id: userData.id || 'admin-1',
          name: userData.username || 'Admin User',
          phone: userData.phoneNumber || phoneNumber,
        };

        onLogin(adminUser);
        setSuccessMessage('Login successful! Redirecting...');
      } else {
        setError('Invalid response from server. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(`Login failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
      <div className="login-screen">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-box">
              <svg className="icon-logo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="m-0">QuizPro Admin</h1>
              <p className="subtitle m-0">Administrator Login</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {error && (
                <div className="error-message">
                  {error}
                </div>
            )}

            {successMessage && (
                <div className="success-message">
                  {successMessage}
                </div>
            )}

            <div className="form-group-admin">
              <label className="form-label-admin">Phone Number</label>
              <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="form-input-admin"
                  placeholder="Enter your phone number"
                  required
                  disabled={loading}
              />
            </div>

            <div className="form-group-admin password-field">
              <label className="form-label-admin">Password</label>
              <div className="password-input-wrapper">
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input-admin password-input"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                />
                <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={toggleShowPassword}
                    disabled={loading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                      <svg className="password-toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                  ) : (
                      <svg className="password-toggle-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7-1.275 4.057-5.065 7-9.543 7-4.477 0-8.268-2.943-9.543-7z" />
                      </svg>
                  )}
                </button>
              </div>
            </div>

            <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loading}
            >
              {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg className="icon-sm animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Processing...
              </span>
              ) : (
                  'Sign In'
              )}
            </button>
          </form>
        </div>
        <p className="login-footer-copy">&copy; {new Date().getFullYear()} TushindeQuizzes. All rights reserved.</p>
      </div>
  );
};

export default Login;