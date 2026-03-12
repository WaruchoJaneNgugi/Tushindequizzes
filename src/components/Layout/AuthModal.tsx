import { type FC, useState, useEffect, useRef } from "react";
import { useUI } from "../../hooks/useUI";
import { useAuthStore } from "../../Store/authStore.ts";
// import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator.tsx";
import "../../styles/AuthModal.css";

type AuthMode =
  | "login"
  | "signup"
  | "forgot-password"
  | "otp-verification"
  | "reset-password"
  | "set-password";

/* ── tiny reusable eye-icon SVG ─────────── */
const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

/* ── floating-label text / password field ─ */
interface FieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  autoComplete?: string;
  showToggle?: boolean;
  showPass?: boolean;
  onToggle?: () => void;
}
const Field: FC<FieldProps> = ({
  id, label, type = "text", value, onChange,
  disabled, autoComplete, showToggle, showPass, onToggle,
}) => (
  <div className="am-field">
    <input
      id={id}
      type={showToggle ? (showPass ? "text" : "password") : type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder=" "
      className={`am-field-input${showToggle ? " has-right" : ""}`}
      disabled={disabled}
      autoComplete={autoComplete}
    />
    <label htmlFor={id} className="am-field-label">{label}</label>
    {showToggle && (
      <button
        type="button"
        className="am-eye"
        onClick={onToggle}
        disabled={disabled}
        tabIndex={-1}
      >
        {showPass ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    )}
  </div>
);

/* ── brand left panel ─────────────────────── */
const BrandPanel = () => (
  <div className="am-brand">
    <div className="am-brand-logo">
      <div className="am-brand-icon">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="am-brand-name">TushindeQuizes</div>
    </div>

    <div className="am-brand-body">
      <h2 className="am-brand-headline">
        Play. Compete.<br />
        <span>Win Big.</span>
      </h2>
      <p className="am-brand-sub">
        Join thousands of players competing for real rewards every day.
      </p>
    </div>

    <div className="am-brand-pills">
      {[
        "100+ games to choose from",
        "Instant withdrawals",
        "24/7 live support",
      ].map((text) => (
        <div className="am-pill" key={text}>
          <div className="am-pill-dot" />
          <span>{text}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── step progress bar ───────────────────── */
const StepBar: FC<{ current: number }> = ({ current }) => {
  const steps = ["Phone", "OTP", "Password"];
  return (
    <div className="am-steps">
      {steps.map((label, i) => {
        const n = i + 1;
        const active = current === n;
        const done = current > n;
        return (
          <div className="am-step" key={label}>
            <div className={`am-step-dot${active ? " active" : done ? " done" : ""}`}>
              {done ? "✓" : n}
            </div>
            <span className="am-step-label">{label}</span>
            {i < steps.length - 1 && (
              <div className={`am-step-line${done ? " filled" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
export const AuthModal: FC = () => {
  const { isLoggedIn, isLoading, error, login, signup, clearError } = useAuthStore();
  const { showAuthModal, setShowAuthModal, authModalMode, setAuthModalMode } = useUI();

  const [authMode, setAuthMode] = useState<AuthMode>(authModalMode || "login");
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
    username: "",
    confirmPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    countryCode: "KE",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [timer, setTimer] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong" | null
  >(null);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });
  const [demoOtp, setDemoOtp] = useState("");

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ── helpers ──────────────────────────── */
  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) return `254${cleaned.substring(1)}`;
    if (cleaned.startsWith("254")) return cleaned;
    return cleaned;
  };

  const calcStrength = (pw: string): "weak" | "medium" | "strong" | null => {
    if (!pw) return null;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    if (s <= 1) return "weak";
    if (s <= 2) return "medium";
    return "strong";
  };

  const patchForm = (patch: Partial<typeof formData>) =>
    setFormData((prev) => ({ ...prev, ...patch }));

  const togglePw = (field: keyof typeof showPassword) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  const resetForm = () => {
    setFormData({
      phoneNumber: "", password: "", username: "",
      confirmPassword: "", newPassword: "", confirmNewPassword: "", countryCode: "KE",
    });
    setOtp(["", "", "", "", "", ""]);
    setOtpError(null); setTimer(60);
    setIsResendEnabled(false); setIsOtpSent(false);
    setPasswordStrength(null);
    setShowPassword({ password: false, confirmPassword: false, newPassword: false, confirmNewPassword: false });
  };

  const handleClose = () => { resetForm(); clearError(); setAuthMode("login"); setShowAuthModal(false); };

  const getCurrentStep = () => {
    if (authMode === "forgot-password") return 1;
    if (authMode === "otp-verification") return 2;
    if (authMode === "reset-password" || authMode === "set-password") return 3;
    return 1;
  };

  /* ── effects ──────────────────────────── */
  useEffect(() => { if (authModalMode) setAuthMode(authModalMode); }, [authModalMode]);
  useEffect(() => { if (isLoggedIn && showAuthModal) { resetForm(); setShowAuthModal(false); } }, [isLoggedIn]);
  useEffect(() => { if (authMode === "login" || authMode === "signup") setAuthModalMode(authMode); }, [authMode]);

  useEffect(() => {
    if (["signup", "reset-password", "set-password"].includes(authMode)) {
      const pw = authMode === "reset-password" ? formData.newPassword : formData.password;
      setPasswordStrength(calcStrength(pw));
    } else setPasswordStrength(null);
  }, [formData.password, formData.newPassword, authMode]);

  useEffect(() => {
    if (isOtpSent && timer > 0) {
      const id = setInterval(() => setTimer((p) => {
        if (p <= 1) { setIsResendEnabled(true); clearInterval(id); return 0; }
        return p - 1;
      }), 1000);
      return () => clearInterval(id);
    }
  }, [isOtpSent, timer]);

  /* ── handlers ─────────────────────────── */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); clearError(); setOtpError(null);
    try {
      await login(formatPhone(formData.phoneNumber), formData.password);
      resetForm();
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : "Login failed. Check your credentials.");
    }
  };

  const handleRequestOtp = async () => {
    if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
      setOtpError("Please enter a valid phone number (10 digits)"); return;
    }
    clearError(); setOtpError(null);
    try {
      const generated = Math.floor(100000 + Math.random() * 900000).toString();
      setDemoOtp(generated);
      await new Promise((r) => setTimeout(r, 1000));
      setIsOtpSent(true); setTimer(60); setIsResendEnabled(false);
      setAuthMode("otp-verification");
    } catch { setOtpError("Failed to send OTP. Please try again."); }
  };

  const handleVerifyOtp = async () => {
    const joined = otp.join("");
    if (joined.length !== 6) { setOtpError("Please enter all 6 digits"); return; }
    clearError(); setOtpError(null);
    try {
      if (joined !== demoOtp) throw new Error("Invalid OTP");
      setAuthMode(formData.username.trim() ? "set-password" : "reset-password");
    } catch { setOtpError("Invalid OTP. Please try again."); }
  };

  const handleResendOtp = () => {
    if (!isResendEnabled) return;
    const n = Math.floor(100000 + Math.random() * 900000).toString();
    setDemoOtp(n); handleRequestOtp();
  };

  const handleOtpChange = (i: number, v: string) => {
    if (v.length <= 1 && /^\d*$/.test(v)) {
      const next = [...otp]; next[i] = v; setOtp(next); setOtpError(null);
      if (v && i < 5) otpInputRefs.current[i + 1]?.focus();
    }
  };
  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpInputRefs.current[i - 1]?.focus();
  };
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(paste)) {
      const next = [...otp]; paste.split("").forEach((c, i) => { if (i < 6) next[i] = c; });
      setOtp(next); setOtpError(null);
    }
  };

  const handleCompleteSignup = async () => {
    if (formData.password !== formData.confirmPassword) { setOtpError("Passwords do not match"); return; }
    if (calcStrength(formData.password) === "weak") { setOtpError("Please choose a stronger password"); return; }
    try {
      await signup({
        phoneNumber: formatPhone(formData.phoneNumber),
        password: formData.password,
        username: formData.username,
        countryCode: formData.countryCode,
      });
      alert("Registration successful! You can now login.");
      resetForm(); setAuthMode("login");
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    if (formData.newPassword !== formData.confirmNewPassword) { setOtpError("Passwords do not match"); return; }
    if (calcStrength(formData.newPassword) === "weak") { setOtpError("Please choose a stronger password"); return; }
    try {
      const ph = formData.phoneNumber.startsWith("0")
        ? formData.phoneNumber.substring(1) : formData.phoneNumber;
      const res = await fetch("http://208.109.191.19:5556/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: ph, newPassword: formData.newPassword, countryCode: formData.countryCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to reset password");
      alert("Password reset successfully! You can now login.");
      resetForm(); setAuthMode("login");
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : "Failed to reset password. Please try again.");
    }
  };

  if (!showAuthModal) return null;

  const showStep = ["forgot-password", "otp-verification", "reset-password", "set-password"].includes(authMode);
  const anyError = error || otpError;

  /* ── RENDER ───────────────────────────── */
  // @ts-ignore
  return (
    <div className="am-overlay" onClick={handleClose}>
      <div className="am-shell" onClick={(e) => e.stopPropagation()}>

        {/* LEFT */}
        <BrandPanel />

        {/* RIGHT */}
        <div className="am-form-panel">
          <button className="am-close" onClick={handleClose} aria-label="Close">✕</button>

          {/* Header */}
          <div className="am-header">
            <h2 className="am-title">
              {authMode === "login" && "Welcome back"}
              {authMode === "signup" && "Create account"}
              {authMode === "forgot-password" && "Reset password"}
              {authMode === "otp-verification" && "Verify phone"}
              {authMode === "reset-password" && "New password"}
              {authMode === "set-password" && "Set password"}
            </h2>
            <p className="am-subtitle">
              {authMode === "login" && "Sign in to continue playing"}
              {authMode === "signup" && "Join our gaming community"}
              {authMode === "forgot-password" && "We'll send an OTP to your phone"}
              {authMode === "otp-verification" && "Enter the 6-digit code we sent you"}
              {authMode === "reset-password" && "Create a new secure password"}
              {authMode === "set-password" && "Almost done — set your password"}
            </p>
          </div>

          {/* Mode switcher — login / signup only */}
          {(authMode === "login" || authMode === "signup") && (
            <div className="am-mode-switch">
              {(["login", "signup"] as const).map((m) => (
                <button
                  key={m}
                  className={`am-mode-btn${authMode === m ? " active" : ""}`}
                  onClick={() => { resetForm(); setAuthMode(m); }}
                  disabled={isLoading}
                >
                  {m === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>
          )}

          {/* Step bar */}
          {showStep && <StepBar current={getCurrentStep()} />}

          {/* Error */}
          {anyError && <div className="am-error">{anyError}</div>}

          {/* ── LOGIN ──────────────────────── */}
          {authMode === "login" && (
            <form className="am-form" onSubmit={handleLogin}>
              <Field
                id="login-phone" label="Phone number" type="tel"
                value={formData.phoneNumber}
                onChange={(v) => patchForm({ phoneNumber: v })}
                disabled={isLoading} autoComplete="tel"
              />
              <Field
                id="login-pw" label="Password"
                value={formData.password}
                onChange={(v) => patchForm({ password: v })}
                showToggle showPass={showPassword.password}
                onToggle={() => togglePw("password")}
                disabled={isLoading} autoComplete="current-password"
              />
              <div className="am-row">
                <label className="am-check-label">
                  <input type="checkbox" disabled={isLoading} /> Remember me
                </label>
                <button type="button" className="am-forgot"
                  onClick={() => { resetForm(); setAuthMode("forgot-password"); }}
                  disabled={isLoading}>
                  Forgot password?
                </button>
              </div>
              <button type="submit" className="am-submit" disabled={isLoading}>
                {isLoading ? "Signing in…" : "Sign In"}
              </button>
              <p className="am-footer-text">
                No account?{" "}
                <button type="button" className="am-link"
                  onClick={() => { resetForm(); setAuthMode("signup"); }} disabled={isLoading}>
                  Sign up free
                </button>
              </p>
            </form>
          )}

          {/* ── SIGNUP ─────────────────────── */}
          {authMode === "signup" && (
            <form
              className="am-form"
              onSubmit={(e) => { e.preventDefault(); handleRequestOtp(); }}
            >
              <Field id="su-username" label="Username"
                value={formData.username}
                onChange={(v) => patchForm({ username: v })}
                disabled={isLoading} autoComplete="username"
              />
              <Field id="su-phone" label="Phone number" type="tel"
                value={formData.phoneNumber}
                onChange={(v) => patchForm({ phoneNumber: v })}
                disabled={isLoading} autoComplete="tel"
              />
              <button type="submit" className="am-submit" disabled={isLoading}>
                {isLoading ? "Sending OTP…" : "Continue →"}
              </button>
              <p className="am-footer-text">
                Already have an account?{" "}
                <button type="button" className="am-link"
                  onClick={() => { resetForm(); setAuthMode("login"); }} disabled={isLoading}>
                  Sign in
                </button>
              </p>
            </form>
          )}

          {/* ── FORGOT PASSWORD ────────────── */}
          {authMode === "forgot-password" && (
            <form className="am-form" onSubmit={(e) => { e.preventDefault(); handleRequestOtp(); }}>
              <Field id="fp-phone" label="Phone number" type="tel"
                value={formData.phoneNumber}
                onChange={(v) => patchForm({ phoneNumber: v })}
                disabled={isLoading}
              />
              <button type="submit" className="am-submit" disabled={isLoading}>
                {isLoading ? "Sending OTP…" : "Send OTP"}
              </button>
              <p className="am-footer-text">
                Remembered it?{" "}
                <button type="button" className="am-link"
                  onClick={() => { resetForm(); setAuthMode("login"); }} disabled={isLoading}>
                  Back to sign in
                </button>
              </p>
            </form>
          )}

          {/* ── OTP VERIFICATION ───────────── */}
          {authMode === "otp-verification" && (
            <div className="am-otp-block">
              {demoOtp && (
                <div className="am-demo-banner">
                  <span>🔔 Demo OTP:</span>
                  <span className="am-demo-code">{demoOtp}</span>
                </div>
              )}
              <div className="am-otp-info">
                <span className="am-otp-info-icon">📱</span>
                <span className="am-otp-info-text">
                  Enter the 6-digit code sent to <strong style={{ color: "#fff" }}>{formData.phoneNumber}</strong>
                </span>
              </div>
              <div className="am-otp-digits">
                {otp.map((digit, i) => (
                    <input
                        key={i}
                        ref={(el) => {
                          otpInputRefs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        className={`am-otp-digit${digit ? " filled" : ""}${otpError ? " err" : ""}`}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKey(i, e)}
                        onPaste={handleOtpPaste}
                    />
                ))}
              </div>
              <div className="am-otp-timer">
                {timer > 0
                  ? <>Resend in <strong>{timer}s</strong></>
                  : "Didn't receive it?"}
              </div>
              <div className="am-otp-actions">
                <button className="am-btn-verify" onClick={handleVerifyOtp}
                  disabled={isLoading || otp.join("").length < 6}>
                  {isLoading ? "Verifying…" : "Verify"}
                </button>
                <button className="am-btn-resend" onClick={handleResendOtp}
                  disabled={!isResendEnabled || isLoading}>
                  Resend
                </button>
              </div>
            </div>
          )}

          {/* ── SET-PASSWORD (after signup OTP) */}
          {authMode === "set-password" && (
            <form className="am-form" onSubmit={(e) => { e.preventDefault(); handleCompleteSignup(); }}>
              <div className="am-section-tag">🔒 Create your password</div>
              <Field id="sp-pw" label="Password"
                value={formData.password}
                onChange={(v) => patchForm({ password: v })}
                showToggle showPass={showPassword.password}
                onToggle={() => togglePw("password")}
                disabled={isLoading}
              />
              {passwordStrength && (
                <div className="am-strength">
                  <div className="am-strength-bar">
                    <div className={`am-strength-fill ${passwordStrength}`} />
                  </div>
                  <span className={`am-strength-label ${passwordStrength}`}>
                    {passwordStrength === "weak" ? "Weak password" : passwordStrength === "medium" ? "Medium strength" : "Strong password ✓"}
                  </span>
                </div>
              )}
              <Field id="sp-cpw" label="Confirm password"
                value={formData.confirmPassword}
                onChange={(v) => patchForm({ confirmPassword: v })}
                showToggle showPass={showPassword.confirmPassword}
                onToggle={() => togglePw("confirmPassword")}
                disabled={isLoading}
              />
              <button type="submit" className="am-submit" disabled={isLoading}>
                {isLoading ? "Creating account…" : "Complete Sign Up"}
              </button>
            </form>
          )}

          {/* ── RESET PASSWORD (after forgot OTP) */}
          {authMode === "reset-password" && (
            <form className="am-form" onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }}>
              <div className="am-section-tag">🔐 Create new password</div>
              <Field id="rp-pw" label="New password"
                value={formData.newPassword}
                onChange={(v) => patchForm({ newPassword: v })}
                showToggle showPass={showPassword.newPassword}
                onToggle={() => togglePw("newPassword")}
                disabled={isLoading}
              />
              {passwordStrength && (
                <div className="am-strength">
                  <div className="am-strength-bar">
                    <div className={`am-strength-fill ${passwordStrength}`} />
                  </div>
                  <span className={`am-strength-label ${passwordStrength}`}>
                    {passwordStrength === "weak" ? "Weak password" : passwordStrength === "medium" ? "Medium strength" : "Strong password ✓"}
                  </span>
                </div>
              )}
              <Field id="rp-cpw" label="Confirm new password"
                value={formData.confirmNewPassword}
                onChange={(v) => patchForm({ confirmNewPassword: v })}
                showToggle showPass={showPassword.confirmNewPassword}
                onToggle={() => togglePw("confirmNewPassword")}
                disabled={isLoading}
              />
              <div className="am-otp-actions">
                <button type="submit" className="am-btn-verify" disabled={isLoading}>
                  {isLoading ? "Resetting…" : "Reset Password"}
                </button>
                <button type="button" className="am-btn-resend"
                  onClick={() => { resetForm(); setAuthMode("login"); }} disabled={isLoading}>
                  Back to Login
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
