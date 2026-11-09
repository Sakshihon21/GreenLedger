import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  Activity,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  X,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loginUser, resetPassword } from '../../services/authService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEMO_ACCOUNTS = [
  { role: 'Enterprise Org', email: 'org@greenledger.org', pass: 'password123' },
  { role: 'Credit Seller', email: 'seller@greenledger.org', pass: 'password123' },
  { role: 'Credit Buyer', email: 'buyer@greenledger.org', pass: 'password123' },
  { role: 'Auditor', email: 'authority@greenledger.org', pass: 'password123' },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ 
    email: 'kunalvadkte2006@gmail.com', 
    password: '' 
  });
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const handleQuickFill = (acc) => {
    setFormData({ email: acc.email, password: acc.pass });
    setErrors({});
    setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setApiError('');
    try {
      const response = await loginUser({ email: formData.email.trim(), password: formData.password });
      const token = response.data?.access_token || response.token || 'demo_token';
      const user = response.data?.user || { email: formData.email.trim(), role: 'ORGANIZATION' };
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const openForgotModal = (e) => {
    e.preventDefault();
    setForgotEmail(formData.email || '');
    setNewPassword('');
    setConfirmNewPassword('');
    setForgotError('');
    setForgotSuccess('');
    setShowForgotModal(true);
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');

    if (!forgotEmail.trim() || !EMAIL_REGEX.test(forgotEmail.trim())) {
      setForgotError('Please enter a valid registered email address.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setForgotError('Passwords do not match.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await resetPassword({
        email: forgotEmail.trim(),
        new_password: newPassword
      });
      setForgotSuccess(res.message || 'Password reset successfully! You can now log in.');
      setFormData(prev => ({ ...prev, email: forgotEmail.trim(), password: newPassword }));
      setTimeout(() => {
        setShowForgotModal(false);
      }, 1500);
    } catch (err) {
      setForgotError(err.message || 'Unable to reset password. Please verify your email.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="h-screen max-h-screen w-screen max-w-full overflow-hidden flex flex-col justify-between relative font-sans select-none selection:bg-emerald-500 selection:text-white">
      {/* FULL PAGE SCENIC BACKGROUND */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: "url('/background.png')" }}
      >
        {/* Balanced atmospheric overlay tailored to background.png - keeps colors vibrant and text razor-sharp */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/35 via-white/10 to-black/15 pointer-events-none"></div>
      </div>

      {/* TOP HEADER */}
      <header className="relative z-10 w-full px-6 sm:px-12 py-3 flex items-center justify-between shrink-0">
        <div 
          onClick={() => navigate('/')}
          className="flex items-center space-x-3 px-3.5 py-1.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/90 shadow-md text-slate-900 hover:scale-[1.02] transition cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center p-1 border border-white/90 shrink-0">
            <img 
              src="/logo-1.png" 
              alt="GreenLedger Logo" 
              className="w-full h-full object-contain" 
            />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900 leading-none block">
              GreenLedger
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 block mt-0.5 font-mono">
              Carbon Verification Portal
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1.5 px-4 py-1.5 rounded-2xl border border-emerald-300/80 bg-white/95 text-emerald-800 text-xs font-semibold backdrop-blur-xl shadow-sm">
            <span>YOUR SUSTAINABILITY PATHWAY</span>
            <span className="text-slate-900 font-bold">Starts Here ↗</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA - DUAL CARD FLEXBOX, ZERO SCROLL */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 sm:px-10 py-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 min-h-0 overflow-hidden">
        
        {/* LEFT COLUMN: CLEAN TEXT & FEATURES (NO CURVED BOX) */}
        <div className="w-full lg:w-7/12 flex flex-col justify-center space-y-4 pr-0 lg:pr-4">
          <div className="space-y-2.5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-white/90 backdrop-blur-md border border-emerald-300 text-emerald-800 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Autonomous Climate Intelligence</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight leading-[1.12] text-slate-900 drop-shadow-sm">
              Turn Climate Action Into <br />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600">
                Real Opportunities
                <svg className="absolute -bottom-1 left-0 w-full h-2.5 text-emerald-500" viewBox="0 0 300 12" fill="none">
                  <path d="M2 9C75 2 225 2 298 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p 
              className="text-sm sm:text-base font-bold leading-relaxed text-slate-950 max-w-xl"
              style={{ textShadow: '0 1px 4px rgba(255, 255, 255, 0.95), 0 0 12px rgba(255, 255, 255, 0.85)' }}
            >
              Autonomous IoT telemetry and deterministic AI validation delivering bankable, audit-grade carbon offset verification.
            </p>
          </div>

          {/* 2x2 FEATURE GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="p-3 sm:p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition group cursor-default">
              <div className="flex items-center space-x-2.5 mb-1">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 group-hover:scale-105 transition-transform">
                  <Activity className="w-4 h-4" />
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide">IoT Telemetry</h2>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-700 leading-snug">Real-time edge sensors & immutable stream ingestion</p>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/90 shadow-sm hover:shadow-md hover:border-teal-300 transition group cursor-default">
              <div className="flex items-center space-x-2.5 mb-1">
                <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600 border border-teal-200 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide">AI Verification</h2>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-700 leading-snug">Deterministic machine learning anomaly detection</p>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition group cursor-default">
              <div className="flex items-center space-x-2.5 mb-1">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide">Track Progress</h2>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-700 leading-snug">Continuous baselining & transparent emission reductions</p>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/90 shadow-sm hover:shadow-md hover:border-green-300 transition group cursor-default">
              <div className="flex items-center space-x-2.5 mb-1">
                <div className="p-1.5 rounded-lg bg-green-50 text-green-600 border border-green-200 group-hover:scale-105 transition-transform">
                  <Award className="w-4 h-4" />
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide">Registry Ready</h2>
              </div>
              <p className="text-[11px] sm:text-xs font-semibold text-slate-700 leading-snug">Certified carbon offset credits ready for global trade</p>
            </div>
          </div>

          {/* QUOTE FOOTER */}
          <div className="px-3.5 py-2 rounded-xl bg-white/85 backdrop-blur-md border border-white/80 text-[11px] sm:text-xs flex items-center justify-between text-slate-800 shadow-xs">
            <span className="italic font-medium">“Measure emissions accurately, verify autonomously, trade transparently.”</span>
            <span className="font-bold text-emerald-700 not-italic shrink-0 ml-3">— GreenLedger</span>
          </div>
        </div>

        {/* RIGHT COLUMN: SLEEK LOGIN FORM CARD */}
        <div className="w-full lg:w-5/12 max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-white/90 shadow-2xl space-y-3">
          
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Login to your account</h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">Enter your credentials to access the platform.</p>
          </div>

          {/* QUICK DEMO FILL PILLS */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demo Role Accounts</span>
              <span className="text-[10px] font-semibold text-emerald-600">Quick fill</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleQuickFill(acc)}
                  className={`px-2 py-1.5 text-xs font-semibold rounded-lg border text-left truncate transition cursor-pointer ${
                    formData.email === acc.email
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  {acc.role}
                </button>
              ))}
            </div>
          </div>

          {apiError && (
            <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{apiError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 bg-slate-50 border rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 transition focus:outline-none focus:bg-white focus:ring-2 ${
                    errors.email 
                      ? 'border-red-300 focus:ring-red-100' 
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                  }`}
                  placeholder="kunalvadkte2006@gmail.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs font-medium text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-2 bg-slate-50 border rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 transition focus:outline-none focus:bg-white focus:ring-2 ${
                    errors.password 
                      ? 'border-red-300 focus:ring-red-100' 
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs font-medium text-red-500">{errors.password}</p>}
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 transition cursor-pointer" 
                />
                <span className="text-xs font-medium text-slate-600 group-hover:text-slate-800 transition">
                  Remember Me
                </span>
              </label>
              <button
                type="button"
                onClick={openForgotModal}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 sm:py-3 mt-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-bold tracking-wider">
                <span className="px-2 bg-white text-slate-400 uppercase">OR</span>
              </div>
            </div>

            <p className="text-center text-xs font-medium text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-700 transition">
                Create Account
              </Link>
            </p>
          </form>
        </div>

      </main>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/40 relative">
            
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Reset Password</h3>
                <p className="text-xs text-slate-500 font-medium">Update your GreenLedger account credentials</p>
              </div>
            </div>

            {forgotError && (
              <div className="mb-3 p-2.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess && (
              <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Registered Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="kunalvadkte2006@gmail.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Minimum 6 characters"
                    className="w-full pl-10 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    placeholder="Re-enter new password"
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="w-1/2 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-1/2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-md shadow-emerald-600/30 transition flex items-center justify-center space-x-1.5 disabled:opacity-70 cursor-pointer"
                >
                  {forgotLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span>Save Password</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBTLE BRAND FOOTER */}
      <footer 
        className="relative z-10 w-full px-6 sm:px-12 py-2 flex items-center justify-between text-[11px] text-white font-semibold shrink-0"
        style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.9), 0 0 8px rgba(0, 0, 0, 0.8)' }}
      >
        <p>© 2026 GreenLedger Inc. All rights reserved.</p>
        <p className="text-emerald-300 font-bold">Building Sustainable Futures Together</p>
      </footer>
    </div>
  );
};

export default Login;
