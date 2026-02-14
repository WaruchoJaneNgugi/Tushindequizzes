import React, { useState } from 'react';
import type { AdminUser } from '../types';
import { apiService } from '../services/api';

interface LoginProps {
  onLogin: (user: AdminUser) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  // const [otp, setOtp] = useState('');
  // const [isOTPSent, setIsOTPSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
      // Use the API service for login
      // Send phone number exactly as entered (1234567890)
      const response = await apiService.login(phoneNumber, password);

      if (!response.success) {
        setError(response.error || 'Login failed. Please check your credentials.');
        return;
      }

      // Check if response has token and user data
      if (response.data?.token && response.data?.user) {
        // Set the token in the API service
        apiService.setToken(response.data.token);

        // Extract user info from the response
        const userData = response.data.user;

        // Create admin user object
        const adminUser: AdminUser = {
          id: userData.id || 'admin-1',
          name: userData.username || 'Admin User',
          phone: userData.phoneNumber || phoneNumber,
          // role: userData.role,
          // createdAt: userData.createdAt,
        };

        // Call the onLogin callback
        onLogin(adminUser);

        // Show success message
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


  // const handleVerifyOTP = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //
  //   // if (!otp || otp.length !== 6) {
  //   //   setError('Please enter a valid 6-digit OTP code');
  //   //   return;
  //   // }
  //
  //   setLoading(true);
  //   setError('');
  //   setSuccessMessage('');
  //
  //   try {
  //     const response = await apiService.verifyOTP(phoneNumber);
  //
  //     if (!response.success) {
  //       setError(response.error || 'Invalid OTP. Please try again.');
  //       return;
  //     }
  //
  //     if (response.data?.token) {
  //       // Set the token
  //       apiService.setToken(response.data.token);
  //
  //       // Create admin user with the phone number
  //       const adminUser: AdminUser = {
  //         id: 'admin-otp-verified',
  //         name: 'Admin User',
  //         phone: phoneNumber,
  //       };
  //
  //       onLogin(adminUser);
  //       setSuccessMessage('OTP verified successfully! Redirecting...');
  //     }
  //   } catch (err) {
  //     console.error('OTP verification error:', err);
  //     setError(`OTP verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };



  return (
      <div className="login-screen">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-box">
              <svg className="icon-logo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="m-0" style={{ color: 'white', fontSize: '1.25rem' }}>QuizPro Admin</h1>
              <p className="subtitle m-0">Administrator Login</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="login-form">
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

            {successMessage && (
                <div className="success-message" style={{
                  background: 'rgba(76, 175, 80, 0.1)',
                  border: '1px solid #4CAF50',
                  color: '#4CAF50',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.875rem'
                }}>
                  {successMessage}
                </div>
            )}

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="form-input"
                  placeholder="1234567890"
                  required
                  disabled={loading}
              />
              {/*<p className="subtitle fs-xs mt-1">*/}
              {/*  Enter exactly: <strong>1234567890</strong>*/}
              {/*</p>*/}
            </div>

            {/*{!isOTPSent && (*/}
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input"
                      placeholder="password123"
                      required
                      disabled={loading}
                  />
                  {/*<p className="subtitle fs-xs mt-1">*/}
                  {/*  Enter exactly: <strong>password123</strong>*/}
                  {/*</p>*/}
                </div>
            {/*)}*/}

            {/*{isOTPSent && (*/}
            {/*    <div className="form-group">*/}
            {/*      <label className="form-label">OTP Code</label>*/}
            {/*      <input*/}
            {/*          type="text"*/}
            {/*          value={otp}*/}
            {/*          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}*/}
            {/*          className="form-input"*/}
            {/*          placeholder="Enter 6-digit OTP"*/}
            {/*          required*/}
            {/*          disabled={loading}*/}
            {/*          maxLength={6}*/}
            {/*          pattern="\d{6}"*/}
            {/*      />*/}
            {/*      <p className="subtitle fs-xs mt-1">*/}
            {/*        OTP sent to {phoneNumber}.{' '}*/}
            {/*        <button*/}
            {/*            type="button"*/}
            {/*            onClick={() => {*/}
            {/*              setIsOTPSent(false);*/}
            {/*              setOtp('');*/}
            {/*              setSuccessMessage('');*/}
            {/*            }}*/}
            {/*            className="text-primary"*/}
            {/*            style={{*/}
            {/*              background: 'none',*/}
            {/*              border: 'none',*/}
            {/*              color: 'var(--primary)',*/}
            {/*              cursor: 'pointer',*/}
            {/*              textDecoration: 'underline'*/}
            {/*            }}*/}
            {/*            disabled={loading}*/}
            {/*        >*/}
            {/*          Change number*/}
            {/*        </button>*/}
            {/*      </p>*/}
            {/*    </div>*/}
            {/*)}*/}

            <button
                type="submit"
                className="btn btn-primary btn-full"
                style={{ padding: '0.875rem' }}
                disabled={loading}
            >
              {loading && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg className="icon-sm animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Processing...
              </span>
              )}
            </button>

            {/*{!isOTPSent && (*/}
            {/*    <div className="text-center mt-4">*/}
            {/*      <button*/}
            {/*          type="button"*/}
            {/*          onClick={handleSendOTP}*/}
            {/*          className="text-primary"*/}
            {/*          style={{*/}
            {/*            background: 'none',*/}
            {/*            border: 'none',*/}
            {/*            color: 'var(--primary)',*/}
            {/*            cursor: 'pointer',*/}
            {/*            fontSize: '0.875rem',*/}
            {/*            textDecoration: 'underline'*/}
            {/*          }}*/}
            {/*          disabled={loading}*/}
            {/*      >*/}
            {/*        Login with OTP instead*/}
            {/*      </button>*/}
            {/*    </div>*/}
            {/*)}*/}

            {/* For testing: Pre-fill form with correct credentials */}
            {/*<div className="text-center mt-3">*/}
            {/*  <button*/}
            {/*      type="button"*/}
            {/*      onClick={() => {*/}
            {/*        setPhoneNumber('1234567890');*/}
            {/*        setPassword('password123');*/}
            {/*      }}*/}
            {/*      className="text-secondary"*/}
            {/*      style={{*/}
            {/*        background: 'none',*/}
            {/*        border: 'none',*/}
            {/*        color: 'var(--secondary)',*/}
            {/*        cursor: 'pointer',*/}
            {/*        fontSize: '0.75rem',*/}
            {/*        textDecoration: 'underline'*/}
            {/*      }}*/}
            {/*  >*/}
            {/*    Auto-fill test credentials*/}
            {/*  </button>*/}
            {/*</div>*/}

            {/* Optional: Direct login button for development */}
            {/*{process.env.NODE_ENV === 'development' && (*/}
            {/*    <div className="text-center mt-2">*/}
            {/*      <button*/}
            {/*          type="button"*/}
            {/*          onClick={handleLoginDirect}*/}
            {/*          className="text-secondary"*/}
            {/*          style={{*/}
            {/*            background: 'none',*/}
            {/*            border: 'none',*/}
            {/*            color: 'var(--secondary)',*/}
            {/*            cursor: 'pointer',*/}
            {/*            fontSize: '0.75rem',*/}
            {/*            textDecoration: 'underline'*/}
            {/*          }}*/}
            {/*          disabled={loading}*/}
            {/*      >*/}
            {/*        Direct Login (Dev Only)*/}
            {/*      </button>*/}
            {/*    </div>*/}
            {/*)}*/}
          </form>
        </div>
        <p className="login-footer-copy">&copy; TushindeQuizzes</p>
      </div>
  );
};

export default Login;