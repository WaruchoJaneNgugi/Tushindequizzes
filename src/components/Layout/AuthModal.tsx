import {type FC, useState, useEffect, useRef} from "react";
import {useUI} from "../../hooks/useUI";
import "../../styles/globals.css";
import {useAuthStore} from "../../Store/authStore.ts";
import {PasswordStrengthIndicator} from "./PasswordStrengthIndicator.tsx";

type AuthMode = 'login' | 'signup' | 'forgot-password' | 'otp-verification' | 'reset-password' | 'set-password';

export const AuthModal: FC = () => {
    // Use the auth store instead of useAuth hook
    const {
        // user,
        isLoggedIn,
        isLoading,
        error,
        login,
        signup,
        // logout,
        // updateUser,
        clearError
    } = useAuthStore();

    const {
        showAuthModal,
        setShowAuthModal,
        authModalMode,
        setAuthModalMode

    } = useUI();

    const [authMode, setAuthMode] = useState<AuthMode>(authModalMode || 'login');
    const [formData, setFormData] = useState({
        phoneNumber: '',
        password: '',
        username: '',
        confirmPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        countryCode: 'KE'
    });
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState<string | null>(null);
    const [timer, setTimer] = useState(60);
    const [isResendEnabled, setIsResendEnabled] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);
    const [showPassword, setShowPassword] = useState({
        password: false,
        confirmPassword: false,
        newPassword: false,
        confirmNewPassword: false
    });

    // Add this state for demo OTP
    const [demoOtp, setDemoOtp] = useState<string>('');

    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const formatPhoneNumberForAPI = (phoneNumber: string): string => {
        // Remove any non-digit characters
        const cleaned = phoneNumber.replace(/\D/g, '');
        //
        // console.log('Formatting phone number:', {
        //     input: phoneNumber,
        //     cleaned: cleaned,
        //     startsWith0: cleaned.startsWith('0'),
        //     startsWith254: cleaned.startsWith('254')
        // });

        // If phone starts with 0, replace with 254
        if (cleaned.startsWith('0')) {
            const formatted = `254${cleaned.substring(1)}`;
            // console.log('Formatted 0 to 254:', { cleaned, formatted });
            return formatted;
        }

        // If phone already starts with 254, return as is
        if (cleaned.startsWith('254')) {
            // console.log('Already starts with 254:', cleaned);
            return cleaned;
        }

        // For other formats, just return the cleaned number
        // console.log('Returning cleaned as-is:', cleaned);
        return cleaned;
    };
//
// // Helper function to get country code prefix
//     const getCountryCodePrefix = (countryCode: string): string => {
//         const prefixes: Record<string, string> = {
//             'KE': '254',
//             'UG': '256',
//             'TZ': '255',
//             'RW': '250'
//         };
//         return prefixes[countryCode] || '254';
//     };

    useEffect(() => {
        if (isOtpSent && timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => {
                    if (prev <= 1) {
                        setIsResendEnabled(true);
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isOtpSent, timer]);
// Update the useEffect to handle both cases properly
    useEffect(() => {
        if (authMode === 'signup' || authMode === 'reset-password' || authMode === 'set-password') {
            let password = '';

            // Determine which password field to check based on authMode
            if (authMode === 'reset-password') {
                password = formData.newPassword;
            } else if (authMode === 'set-password' || authMode === 'signup') {
                password = formData.password;
            }

            const strength = calculatePasswordStrength(password);
            setPasswordStrength(strength);
        } else {
            setPasswordStrength(null);
        }
    }, [formData.password, formData.newPassword, authMode]);

// Also fix the reset-password form to use the correct onChange handler
// You have it correct in your code, but let me verify
    // useEffect(() => {
    //     if (authMode === 'signup' || authMode === 'reset-password' || authMode === 'set-password') {
    //         const password = formData.newPassword || formData.password;
    //         const strength = calculatePasswordStrength(password);
    //         setPasswordStrength(strength);
    //     }
    //
    // }, [formData.password, formData.newPassword, authMode]);

    useEffect(() => {
        if (authModalMode) {
            setAuthMode(authModalMode);
        }
    }, [authModalMode]);

    // Redirect to dashboard when logged in
    useEffect(() => {
        if (isLoggedIn && showAuthModal) {
            resetForm();
            setShowAuthModal(false);
            // You might want to redirect or show a success message here
        }
    }, [isLoggedIn, showAuthModal]);

    useEffect(() => {
        if (authMode === 'login' || authMode === 'signup') {
            setAuthModalMode(authMode);
        }
    }, [authMode, setAuthModalMode]);
    const calculatePasswordStrength = (password: string): 'weak' | 'medium' | 'strong' | null => {
        if (!password) return null;

        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        if (strength <= 1) return 'weak';
        if (strength <= 2) return 'medium';
        return 'strong';
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            setOtpError(null);

            // Auto-focus next input
            if (value && index < 5) {
                otpInputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 6);
        if (/^\d+$/.test(pasteData)) {
            const newOtp = [...otp];
            pasteData.split('').forEach((char, i) => {
                if (i < 6) newOtp[i] = char;
            });
            setOtp(newOtp);
            setOtpError(null);
        }
    };

    const handleRequestOtp = async () => {
        if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
            setOtpError("Please enter a valid phone number (10 digits)");
            return;
        }

        clearError();
        setOtpError(null);

        try {
            // In demo mode, generate a random OTP
            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
            setDemoOtp(generatedOtp);

            // Simulate OTP request delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            setIsOtpSent(true);
            setTimer(60);
            setIsResendEnabled(false);
            setAuthMode('otp-verification');

            // console.log('Demo OTP for testing:', generatedOtp);

        } catch (error) {
            setOtpError(`Failed to send OTP. Please try again.${error}`);
        }
    };

    const handleVerifyOtp = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setOtpError("Please enter the complete 6-digit OTP");
            return;
        }

        clearError();
        setOtpError(null);

        try {
            // For demo purposes, validate against demoOtp
            if (otpString !== demoOtp) {
                throw new Error('Invalid OTP');
            }

            // Determine next step based on flow
            if (formData.username && formData.username.trim() !== '') {
                // We're in signup flow - go to set password
                setAuthMode('set-password');
            } else {
                // We're in forgot password flow - go to reset password
                setAuthMode('reset-password');
            }

        } catch (error) {
            setOtpError(`Invalid OTP. Please try again.${error}`);
        }
    };

    const handleResendOtp = () => {
        if (isResendEnabled) {
            const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
            setDemoOtp(newOtp);
            // console.log('New Demo OTP:', newOtp);
            handleRequestOtp();
        }
    };

    const handleResetPassword = async () => {
        // if (formData.newPassword !== formData.confirmNewPassword) {
        //     setOtpError("New passwords do not match");
        //     return;
        // }
        //
        // const passwordStrength = calculatePasswordStrength(formData.newPassword);

        if (formData.newPassword !== formData.confirmNewPassword) {
            setOtpError("New passwords do not match");
            return;
        }

        const passwordStrength = calculatePasswordStrength(formData.newPassword);
        if (passwordStrength === 'weak') {
            setOtpError("Please choose a stronger password");
            return;
        }

        try {
            // IMPORTANT: Send phone number WITHOUT leading 0
            const phoneNumberToSend = formData.phoneNumber.startsWith('0')
                ? formData.phoneNumber.substring(1)
                : formData.phoneNumber;

            // console.log('Reset password with phone:', {
            //     original: formData.phoneNumber,
            //     formatted: phoneNumberToSend
            // });

            // Call the reset password API
            const response = await fetch('http://208.109.191.19:5556/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber: phoneNumberToSend, // Send WITHOUT leading 0
                    newPassword: formData.newPassword,
                    countryCode: formData.countryCode
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }

            // Show success message
            setOtpError(null);
            alert('Password reset successfully! You can now login with your new password.');

            resetForm();
            setAuthMode('login');

        } catch (error) {
            setOtpError(error instanceof Error ? error.message : 'Failed to reset password. Please try again.');
        }
    };

    // UPDATED: Now using auth store's login function
    // const handleLogin = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     clearError();
    //     setOtpError(null);
    //
    //     try {
    //         console.log('Attempting login with:', {
    //             phoneNumber: formData.phoneNumber, // WITH leading 0
    //             password: formData.password
    //         });
    //
    //         // Use the auth store's login function
    //         await login(formData.phoneNumber, formData.password);
    //
    //         // No need to manually set localStorage - the auth store handles it
    //         console.log('Login successful via auth store');
    //
    //         resetForm();
    //         // The modal will be closed by the useEffect when isLoggedIn becomes true
    //
    //     } catch (error) {
    //         console.error('Login error via auth store:', error);
    //         // Error is already set in the auth store, but we can also show it in the modal
    //         setOtpError(error instanceof Error ? error.message : 'Login failed. Please check your credentials.');
    //     }
    // };
// UPDATED: Now using auth store's login function with formatted phone number
//     const handleLogin = async (e: React.FormEvent) => {
//         e.preventDefault();
//         clearError();
//         setOtpError(null);
//
//         try {
//             // CRITICAL: Use EXACTLY as shown in your screenshot
//             // const phoneNumberToSend = formData.phoneNumber;
//             const formattedPhoneNumber = formatPhoneNumberForAPI(formData.phoneNumber);
//
//             const passwordToSend = formData.password;
//
//             console.log('DEBUG - Login attempt with:', {
//                 phoneNumber: formattedPhoneNumber,
//                 passwordLength: passwordToSend.length,
//                 rawPhone: JSON.stringify(formattedPhoneNumber),
//                 rawPassword: JSON.stringify(passwordToSend)
//             });
//
//             // Direct API call for debugging
//             const debugResponse = await fetch('http://208.109.191.19:5556/api/auth/login', {
//                 method: 'POST',
//                 headers: {'Content-Type': 'application/json'},
//                 body: JSON.stringify({
//                     phoneNumber: formattedPhoneNumber,
//                     password: passwordToSend
//                 })
//             });
//
//             const debugData = await debugResponse.json();
//             console.log('DEBUG - Direct API Response:', {
//                 status: debugResponse.status,
//                 data: debugData,
//                 ok: debugResponse.ok
//             });
//
//             if (!debugResponse.ok) {
//                 throw new Error(debugData.message || 'Login failed');
//             }
//
//             // Now try with auth store
//             console.log('DEBUG - Now trying auth store login...');
//             await login(formattedPhoneNumber, passwordToSend);
//
//             console.log('Login successful via auth store');
//             resetForm();
//
//         } catch (error) {
//             console.error('Login error:', error);
//             setOtpError(error instanceof Error ? error.message : 'Login failed. Please check your credentials.');
//         }
//     };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        setOtpError(null);

        try {
            // Format phone number for API (07... → 2547...)
            const formattedPhoneNumber = formatPhoneNumberForAPI(formData.phoneNumber);

            // console.log('🔍 LOGIN DEBUG INFO:');
            // console.log('1. User entered:', formData.phoneNumber);
            // console.log('2. After formatting:', formattedPhoneNumber);
            // console.log('3. Password length:', formData.password.length);
            // console.log('4. Expected format:', '2547XXXXXXXX');
            // console.log('5. Is it 2547...?', formattedPhoneNumber.startsWith('2547'));

            // Use the auth store's login function with formatted phone number
            await login(formattedPhoneNumber, formData.password);

            // console.log('Login successful via auth store');
            resetForm();

        } catch (error) {
            // console.error('Login error via auth store:', error);
            setOtpError(error instanceof Error ? error.message : 'Login failed. Please check your credentials.');
        }
    };
    const resetForm = () => {
        setFormData({
            phoneNumber: '',
            password: '',
            username: '',
            confirmPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            countryCode: 'KE'
        });
        setOtp(['', '', '', '', '', '']);
        setOtpError(null);
        setTimer(60);
        setIsResendEnabled(false);
        setIsOtpSent(false);
        setPasswordStrength(null);
        setShowPassword({
            password: false,
            confirmPassword: false,
            newPassword: false,
            confirmNewPassword: false
        });
    };

    const handleCloseModal = () => {
        resetForm();
        clearError(); // Clear any auth errors
        setAuthMode('login');
        setShowAuthModal(false);
    };

    // UPDATED: Now using auth store's signup function
    // UPDATED: Now using auth store's signup function with formatted phone number
    // const handleCompleteSignup = async () => {
    //     try {
    //         if (formData.password !== formData.confirmPassword) {
    //             setOtpError("Passwords do not match");
    //             return;
    //         }
    //
    //         const passwordStrength = calculatePasswordStrength(formData.password);
    //         if (passwordStrength === 'weak') {
    //             setOtpError("Please choose a stronger password");
    //             return;
    //         }
    //
    //         // Format phone number for API (07... → 2547...)
    //         const formattedPhoneNumber = formatPhoneNumberForAPI(formData.phoneNumber);
    //
    //         console.log('Registering with phone:', {
    //             original: formData.phoneNumber, // User entered (07...)
    //             formatted: formattedPhoneNumber, // For API (2547...)
    //             username: formData.username,
    //             countryCode: formData.countryCode
    //         });
    //
    //         // Prepare signup data according to your API format
    //         const signupData = {
    //             phoneNumber: formattedPhoneNumber, // Send WITH 254 prefix
    //             password: formData.password,
    //             username: formData.username,
    //             countryCode: formData.countryCode
    //         };
    //
    //         // Use the auth store's signup function
    //         await signup(signupData);
    //
    //         console.log('Registration successful via auth store');
    //
    //         // Show success message
    //         alert('Registration successful! You can now login.');
    //
    //         resetForm();
    //         setAuthMode('login');
    //
    //     } catch (error) {
    //         console.error('Signup error via auth store:', error);
    //         setOtpError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    //     }
    // };
    const handleCompleteSignup = async () => {
        try {
            // console.log('🔍 SIGNUP DEBUG - Starting signup process');

            if (formData.password !== formData.confirmPassword) {
                setOtpError("Passwords do not match");
                return;
            }

            const passwordStrength = calculatePasswordStrength(formData.password);
            if (passwordStrength === 'weak') {
                setOtpError("Please choose a stronger password");
                return;
            }

            // Format phone number for API (07... → 2547...)
            const formattedPhoneNumber = formatPhoneNumberForAPI(formData.phoneNumber);

            // console.log('🔍 SIGNUP DEBUG - Data to send:', {
            //     originalPhone: formData.phoneNumber,
            //     formattedPhone: formattedPhoneNumber,
            //     username: formData.username,
            //     countryCode: formData.countryCode,
            //     passwordLength: formData.password.length,
            //     passwordStartsWith: formData.password.substring(0, 3) + '...'
            // });

            // Prepare signup data according to your API format
            const signupData = {
                phoneNumber: formattedPhoneNumber, // Send WITH 254 prefix
                password: formData.password,
                username: formData.username,
                countryCode: formData.countryCode
            };

            // console.log('🔍 SIGNUP DEBUG - Calling auth store signup with:', signupData);

            // Use the auth store's signup function
            await signup(signupData);

            // console.log('🔍 SIGNUP DEBUG - Registration successful via auth store');

            // Show success message
            alert('Registration successful! You can now login.');

            resetForm();
            setAuthMode('login');

        } catch (error) {
            // console.error('🔍 SIGNUP DEBUG - Signup error:', error);
            setOtpError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
        }
    };

    const togglePasswordVisibility = (field: keyof typeof showPassword) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    if (!showAuthModal) return null;

    const getCurrentStep = () => {
        switch (authMode) {
            case 'login':
            case 'signup':
                return 1;
            case 'forgot-password':
            case 'otp-verification':
                return 2;
            case 'reset-password':
            case 'set-password':
                return 3;
            default:
                return 1;
        }
    };


    return (
        <div className="modal-auth-overlay" onClick={handleCloseModal}>
            <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={handleCloseModal}>
                    ×
                </button>

                <div className="modal-header-main">
                    <h2>
                        {authMode === 'login' && 'Welcome Back'}
                        {authMode === 'signup' && 'Create Account'}
                        {authMode === 'forgot-password' && 'Reset Password'}
                        {authMode === 'otp-verification' && 'Verify OTP'}
                        {authMode === 'reset-password' && 'Set New Password'}
                        {authMode === 'set-password' && 'Set Your Password'}
                    </h2>
                    <p className="modal-subtitle">
                        {authMode === 'login' && 'Login to continue playing'}
                        {authMode === 'signup' && 'Join our gaming community'}
                        {authMode === 'forgot-password' && 'Enter your phone number to receive OTP'}
                        {authMode === 'otp-verification' && 'Enter the 6-digit code sent to your phone'}
                        {authMode === 'reset-password' && 'Create a new secure password'}
                        {authMode === 'set-password' && 'Create a secure password for your account'}
                    </p>
                </div>

                {/* Step Indicator */}
                {(authMode === 'forgot-password' || authMode === 'otp-verification' || authMode === 'reset-password' || authMode === 'set-password') && (
                    <div className="auth-steps">
                        <div className="auth-step">
                            <div className={`step-circle ${getCurrentStep() >= 1 ? 'active' : ''}`}>
                                1
                            </div>
                            <div className="step-label">Phone</div>
                        </div>
                        <div className="auth-step">
                            <div
                                className={`step-circle ${getCurrentStep() >= 2 ? 'active' : ''} ${getCurrentStep() > 2 ? 'completed' : ''}`}>
                                2
                            </div>
                            <div className="step-label">OTP</div>
                        </div>
                        <div className="auth-step">
                            <div className={`step-circle ${getCurrentStep() >= 3 ? 'active' : ''}`}>
                                3
                            </div>
                            <div className="step-label">Password</div>
                        </div>
                    </div>
                )}

                {/* Display error from auth store */}
                {error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}

                {authMode === 'login' && (
                    <>
                        <div className="auth-tabs">
                            <button
                                className={`auth-tab active`}
                                disabled={isLoading}
                            >
                                Login
                            </button>
                            <button
                                className={`auth-tab`}
                                onClick={() => {
                                    resetForm();
                                    setAuthMode('signup');
                                }}
                                disabled={isLoading}
                            >
                                Sign Up
                            </button>
                        </div>

                        <form className="auth-form" onSubmit={handleLogin}>
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <div className="phone-input-container">
                                    <input
                                        type="tel"
                                        id="phone"
                                        placeholder="07XXXXXXXX"
                                        className="form-input phone-input"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData(prev => ({...prev, phoneNumber: e.target.value}))}
                                        required
                                        disabled={isLoading}
                                        pattern="[0-9]{10}"
                                        title="Enter a phone number starting with 07 (e.g., 07XXXXXXXX)"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showPassword.password ? "text" : "password"}
                                        id="password"
                                        placeholder="Enter your password"
                                        className="form-input"
                                        value={formData.password}
                                        onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => togglePasswordVisibility('password')}
                                        disabled={isLoading}
                                    >
                                        {showPassword.password ? (
                                            <svg className="password-icon" viewBox="0 0 24 24" fill="none"
                                                 stroke="currentColor" strokeWidth="2">
                                                <path
                                                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        ) : (
                                            <svg className="password-icon" viewBox="0 0 24 24" fill="none"
                                                 stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="form-options">
                                <label className="checkbox-label">
                                    <input type="checkbox" disabled={isLoading}/>
                                    <span>Remember me</span>
                                </label>
                                <button
                                    type="button"
                                    className="forgot-password"
                                    onClick={() => {
                                        resetForm();
                                        setAuthMode('forgot-password');
                                    }}
                                    disabled={isLoading}
                                >
                                    Forgot password?
                                </button>
                            </div>

                            {otpError && (
                                <div className="auth-error">
                                    {otpError}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn-submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Loading...' : 'Sign In'}
                            </button>

                            <p className="auth-footer">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    className="auth-switch"
                                    onClick={() => {
                                        resetForm();
                                        setAuthMode('signup');
                                    }}
                                    disabled={isLoading}
                                >
                                    Sign Up
                                </button>
                            </p>
                        </form>
                    </>
                )}

                {authMode === 'signup' && (
                    <>
                        <div className="auth-tabs">
                            <button
                                className={`auth-tab`}
                                onClick={() => {
                                    resetForm();
                                    setAuthMode('login');
                                }}
                                disabled={isLoading}
                            >
                                Login
                            </button>
                            <button
                                className={`auth-tab active`}
                                disabled={isLoading}
                            >
                                Sign Up
                            </button>
                        </div>

                        <form className="auth-form" onSubmit={(e) => {
                            e.preventDefault();
                            handleRequestOtp();
                        }}>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    placeholder="Enter your username"
                                    className="form-input"
                                    value={formData.username}
                                    onChange={(e) => setFormData(prev => ({...prev, username: e.target.value}))}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <div className="phone-input-container">
                                    <input
                                        type="tel"
                                        id="phone"
                                        placeholder="07XXXXXXXX"
                                        className="form-input phone-input"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData(prev => ({...prev, phoneNumber: e.target.value}))}
                                        required
                                        disabled={isLoading}
                                        pattern="[0-9]{10}"
                                        title="Enter a 10-digit phone number starting with 0 (e.g., 07XXXXXXXX)"
                                    />
                                </div>
                                <small className="phone-hint">
                                    Enter phone number with leading 0 (e.g., 07XXXXXXXX)
                                </small>
                            </div>

                            <button
                                type="submit"
                                className="btn-submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending OTP...' : 'Continue with OTP'}
                            </button>

                            <p className="auth-footer">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    className="auth-switch"
                                    onClick={() => {
                                        resetForm();
                                        setAuthMode('login');
                                    }}
                                    disabled={isLoading}
                                >
                                    Login
                                </button>
                            </p>
                        </form>
                    </>
                )}

                {authMode === 'forgot-password' && (
                    <div className="auth-form">
                        <div className="otp-section">
                            <div className="otp-header">
                                <span className="otp-icon">📱</span>
                                <h3 className="otp-title">Reset Your Password</h3>
                            </div>

                            <p className="otp-message">
                                Enter your phone number to receive a verification code. We'll send a 6-digit OTP to
                                reset your password.
                            </p>

                            <div className="form-group">
                                <label htmlFor="resetPhone">Phone Number</label>
                                <div className="phone-input-container">
                                    <select
                                        className="country-code-select"
                                        value={formData.countryCode}
                                        onChange={(e) => setFormData(prev => ({...prev, countryCode: e.target.value}))}
                                        disabled={isLoading}
                                    >
                                        <option value="KE">KE (+254)</option>
                                        <option value="UG">UG (+256)</option>
                                        <option value="TZ">TZ (+255)</option>
                                        <option value="RW">RW (+250)</option>
                                    </select>

                                    <input
                                        type="tel"
                                        id="resetPhone"
                                        placeholder="07XXXXXXXX"
                                        className="form-input phone-input"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData(prev => ({...prev, phoneNumber: e.target.value}))}
                                        required
                                        disabled={isLoading}
                                        pattern="[0-9]{10}"
                                        title="Enter a 10-digit phone number starting with 0 (e.g., 07XXXXXXXX)"
                                    />

                                </div>
                                <small className="phone-hint">
                                    Enter phone number with leading 0 (e.g., 07XXXXXXXX)
                                </small>
                            </div>

                            <div className="otp-actions">
                                <button
                                    type="button"
                                    className="otp-btn verify"
                                    onClick={handleRequestOtp}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Sending...' : 'Send OTP'}
                                </button>

                                <button
                                    type="button"
                                    className="auth-switch"
                                    onClick={() => {
                                        resetForm();
                                        setAuthMode('login');
                                    }}
                                    disabled={isLoading}
                                >
                                    Back to Login
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {authMode === 'otp-verification' && (
                    <div className="auth-form">
                        <div className="otp-section">
                            <div className="otp-header">
                                <span className="otp-icon">🔒</span>
                                <h3 className="otp-title">Enter Verification Code</h3>
                            </div>
                            <div className="demo-otp-notice">
                                <div className="demo-otp-banner">
                                    <span className="demo-icon">🚧</span>
                                    <strong>DEMO MODE</strong>
                                    <span>Use this OTP:</span>
                                    <span className="demo-otp-code">{demoOtp || '123456'}</span>
                                </div>
                            </div>

                            <p className="otp-message">
                                We've sent a 6-digit code to <strong>{formData.phoneNumber}</strong>. Enter it below to
                                continue.
                            </p>

                            {otpError && (
                                <div className="auth-error">
                                    {otpError}
                                </div>
                            )}

                            <div className="otp-input-group">
                                <div className="otp-input-container">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={el => {
                                                otpInputRefs.current[index] = el;
                                            }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            className={`otp-input ${digit ? 'filled' : ''} ${otpError ? 'error' : ''}`}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            onPaste={index === 0 ? handleOtpPaste : undefined}
                                            disabled={isLoading}
                                        />
                                    ))}
                                </div>

                                <div className="otp-timer">
                                    {timer > 0 ? (
                                        <>Code expires in <strong>{timer}s</strong></>
                                    ) : (
                                        <>Didn't receive the code?</>
                                    )}
                                </div>
                            </div>

                            <div className="otp-actions">
                                <button
                                    type="button"
                                    className="otp-btn verify"
                                    onClick={handleVerifyOtp}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                                </button>

                                <button
                                    type="button"
                                    className="otp-btn resend"
                                    onClick={handleResendOtp}
                                    disabled={!isResendEnabled || isLoading}
                                >
                                    Resend Code
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {authMode === 'set-password' && (
                    <form className="auth-form" onSubmit={(e) => {
                        e.preventDefault();
                        handleCompleteSignup();
                    }}>
                        <div className="reset-form">
                            <h3 className="reset-title">
                                <span className="reset-title-icon">🔐</span>
                                Set Your Password
                            </h3>

                            {/* In set-password form - Password field */}
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showPassword.password ? "text" : "password"}
                                        id="password"
                                        placeholder="Enter your password"
                                        className="form-input"
                                        value={formData.password}
                                        onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => togglePasswordVisibility('password')}
                                        disabled={isLoading}
                                    >
                                        {showPassword.password ? (
                                            <svg className="password-icon" viewBox="0 0 24 24" fill="none"
                                                 stroke="currentColor" strokeWidth="2">
                                                <path
                                                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        ) : (
                                            <svg className="password-icon" viewBox="0 0 24 24" fill="none"
                                                 stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        )}                                    </button>
                                </div>
                            </div>
                            <PasswordStrengthIndicator strength={passwordStrength} />

                            {/* In set-password form - Confirm Password field */}
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showPassword.confirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        placeholder="Confirm your password"
                                        className="form-input"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            confirmPassword: e.target.value
                                        }))}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => togglePasswordVisibility('confirmPassword')}
                                        disabled={isLoading}
                                    >
                                        {showPassword.password ? (
                                            <svg className="password-icon" viewBox="0 0 24 24" fill="none"
                                                 stroke="currentColor" strokeWidth="2">
                                                <path
                                                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        ) : (
                                            <svg className="password-icon" viewBox="0 0 24 24" fill="none"
                                                 stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        )}                                    </button>
                                </div>
                            </div>

                            {/*<div className="form-group">*/}
                            {/*    <label htmlFor="confirmPassword">Confirm Password</label>*/}
                            {/*    <PasswordInput*/}
                            {/*        name="password"*/}
                            {/*        id="confirmPassword"*/}
                            {/*        value={formData.confirmPassword}*/}
                            {/*        onChange={(e) => {*/}
                            {/*            console.log('Confirm password input changed:', e.target.value); // Add this for debugging*/}
                            {/*            setFormData(prev => ({...prev, confirmPassword: e.target.value}));*/}
                            {/*        }}*/}
                            {/*        placeholder="Confirm your password"*/}
                            {/*        showPassword={showPassword.confirmPassword}*/}
                            {/*        toggleVisibility={() => togglePasswordVisibility('confirmPassword')}*/}
                            {/*        disabled={isLoading}*/}

                            {/*    />*/}
                            {/*</div>*/}

                            {otpError && (
                                <div className="auth-error">
                                    {otpError}
                                </div>
                            )}

                            <div className="otp-actions">
                                <button
                                    type="submit"
                                    className="otp-btn verify"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Completing Signup...' : 'Complete Signup'}
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {authMode === 'reset-password' && (
                    <form className="auth-form" onSubmit={(e) => {
                        e.preventDefault();
                        handleResetPassword();
                    }}>
                        <div className="reset-form">
                            <h3 className="reset-title">
                                <span className="reset-title-icon">🔐</span>
                                Create New Password
                            </h3>

                            {/* In reset-password form - New Password field */}
                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showPassword.newPassword ? "text" : "password"}
                                        id="newPassword"
                                        placeholder="Enter new password"
                                        className="form-input"
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData(prev => ({...prev, newPassword: e.target.value}))}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => togglePasswordVisibility('newPassword')}
                                        disabled={isLoading}
                                    >
                                        {showPassword.password ? (
                                            <svg className="password-icon" viewBox="0 0 24 24" fill="none"
                                                 stroke="currentColor" strokeWidth="2">
                                                <path
                                                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        ) : (
                                            <svg className="password-icon" viewBox="0 0 24 24" fill="none"
                                                 stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        )}                                    </button>
                                </div>
                            </div>
                            <PasswordStrengthIndicator strength={passwordStrength} />

                            {/* In reset-password form - Confirm New Password field */}
                            <div className="form-group">
                                <label htmlFor="confirmNewPassword">Confirm New Password</label>
                                <div className="password-input-container">
                                    <input
                                        type={showPassword.confirmNewPassword ? "text" : "password"}
                                        id="confirmNewPassword"
                                        placeholder="Confirm new password"
                                        className="form-input"
                                        value={formData.confirmNewPassword}
                                        onChange={(e) => setFormData(prev => ({
                                            ...prev,
                                            confirmNewPassword: e.target.value
                                        }))}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => togglePasswordVisibility('confirmNewPassword')}
                                        disabled={isLoading}
                                    >
                                        {showPassword.password ? (
                                            <svg className="password-icon" viewBox="0 0 24 24" fill="none"
                                                 stroke="currentColor" strokeWidth="2">
                                                <path
                                                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                                <line x1="1" y1="1" x2="23" y2="23"></line>
                                            </svg>
                                        ) : (
                                            <svg className="password-icon" viewBox="0 0 24 24" fill="none"
                                                 stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        )}                                    </button>
                                </div>
                            </div>

                            {otpError && (
                                <div className="auth-error">
                                    {otpError}
                                </div>
                            )}

                            <div className="otp-actions">
                                <button
                                    type="submit"
                                    className="otp-btn verify"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Resetting...' : 'Reset Password'}
                                </button>

                                <button
                                    type="button"
                                    className="otp-btn resend"
                                    onClick={() => {
                                        resetForm();
                                        setAuthMode('login');
                                    }}
                                    disabled={isLoading}
                                >
                                    Back to Login
                                </button>
                            </div>
                        </div>
                    </form>
                )}

            </div>
        </div>
    );
};
