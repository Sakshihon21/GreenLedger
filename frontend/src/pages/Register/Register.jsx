import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  Briefcase, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  Activity,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { registerUser, loginUser } from '../../services/authService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ORGANIZATION',
  });
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!EMAIL_REGEX.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the protocols and terms.';
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
      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role
      });

      // Automatically authenticate the newly registered user
      try {
        const loginRes = await loginUser({
          email: formData.email.trim(),
          password: formData.password
        });
        const token = loginRes.data?.access_token || loginRes.token;
        const user = loginRes.data?.user || { 
          name: formData.name.trim(), 
          email: formData.email.trim(), 
          role: formData.role 
        };
        login(user, token);
        navigate('/dashboard');
      } catch {
        navigate('/login', { state: { registeredEmail: formData.email.trim() } });
      }
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between font-sans overflow-x-hidden selection:bg-emerald-500 selection:text-white">
      {/* FULL PAGE BACKGROUND IMAGE */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: "url('/background.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/35 via-white/10 to-black/15 pointer-events-none"></div>
      </div>

      {/* TOP HEADER */}
      <header className="relative z-10 w-full px-6 sm:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3.5 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-12 h-12 rounded-2xl bg-white shadow-md flex items-center justify-center p-1.5 border border-white/90 group-hover:scale-105 transition-transform shrink-0">
            <img 
              src="/logo-1.png" 
              alt="GreenLedger Logo" 
              className="w-full h-full object-contain filter drop-shadow-sm" 
            />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-slate-900 flex items-center">
              GreenLedger
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 block -mt-0.5 font-mono">
              Registration Portal
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-1.5 px-4 py-1.5 rounded-2xl border border-emerald-300/80 bg-white/90 text-emerald-800 text-xs font-semibold backdrop-blur-xl shadow-sm">
            <span>ENTERPRISE ONBOARDING</span>
            <span className="text-slate-900 font-bold">Starts Here ↗</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-6 sm:px-12 py-4 lg:py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* LEFT COLUMN: HERO CONTENT */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-white/90 backdrop-blur-md border border-emerald-300 text-emerald-800 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Verified Climate Ledger</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black tracking-tight leading-[1.15] text-slate-900 drop-shadow-sm">
              Turn Climate Action Into <br />
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600">
                Verified Value
                <svg className="absolute -bottom-1 left-0 w-full h-2.5 text-emerald-500" viewBox="0 0 300 12" fill="none">
                  <path d="M2 9C75 2 225 2 298 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="text-sm sm:text-base font-semibold leading-relaxed text-slate-800 drop-shadow-xs max-w-xl">
              Join leading enterprises, verification bodies, and credit traders pioneering real-time, sensor-driven carbon accountability.
            </p>
          </div>

          {/* 2x2 FEATURE GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
            <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition group cursor-default">
              <div className="flex items-center space-x-2.5 mb-1">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 group-hover:scale-105 transition-transform">
                  <Activity className="w-4 h-4" />
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide">Automated Ingestion</h2>
              </div>
              <p className="text-[11px] sm:text-xs font-medium text-slate-600 leading-snug">Direct IoT telemetry removes manual tampering risks</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/90 shadow-sm hover:shadow-md hover:border-teal-300 transition group cursor-default">
              <div className="flex items-center space-x-2.5 mb-1">
                <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600 border border-teal-200 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide">Deterministic Engine</h2>
              </div>
              <p className="text-[11px] sm:text-xs font-medium text-slate-600 leading-snug">Mathematical baselining and transparent credit minting</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition group cursor-default">
              <div className="flex items-center space-x-2.5 mb-1">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide">Multi-Role Portal</h2>
              </div>
              <p className="text-[11px] sm:text-xs font-medium text-slate-600 leading-snug">Role-tailored dashboards for producers, traders & auditors</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/90 shadow-sm hover:shadow-md hover:border-green-300 transition group cursor-default">
              <div className="flex items-center space-x-2.5 mb-1">
                <div className="p-1.5 rounded-lg bg-green-50 text-green-600 border border-green-200 group-hover:scale-105 transition-transform">
                  <Award className="w-4 h-4" />
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 tracking-wide">Audit Protocols</h2>
              </div>
              <p className="text-[11px] sm:text-xs font-medium text-slate-600 leading-snug">Institutional-grade tamper-evident compliance logs</p>
            </div>
          </div>

          {/* QUOTE FOOTER */}
          <div className="max-w-2xl px-3.5 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-white/80 text-[11px] sm:text-xs flex items-center justify-between text-slate-700 shadow-xs">
            <span className="italic">“Measure emissions accurately, verify autonomously, trade transparently.”</span>
            <span className="font-bold text-emerald-700 not-italic shrink-0 ml-3">— GreenLedger</span>
          </div>
        </div>

        {/* RIGHT COLUMN: REGISTER FORM CARD */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/90 shadow-2xl space-y-3.5">
            
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">Set up your GreenLedger credentials today.</p>
            </div>

            {apiError && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-50/80 border rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 transition focus:outline-none focus:bg-white focus:ring-2 ${
                      errors.name 
                        ? 'border-red-300 focus:ring-red-100' 
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                    }`}
                    placeholder="Jane Doe"
                  />
                </div>
                {errors.name && <p className="mt-1 text-xs font-medium text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Email Address <span className="text-red-500">*</span>
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
                    className={`w-full pl-10 pr-4 py-2 bg-slate-50/80 border rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 transition focus:outline-none focus:bg-white focus:ring-2 ${
                      errors.email 
                        ? 'border-red-300 focus:ring-red-100' 
                        : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                    }`}
                    placeholder="name@company.com"
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs font-medium text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Account Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 transition focus:outline-none focus:bg-white focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/20 cursor-pointer"
                  >
                    <option value="ORGANIZATION">Enterprise Organization (Emitter/Producer)</option>
                    <option value="SELLER">Credit Seller (Project Developer)</option>
                    <option value="BUYER">Credit Buyer (Trader/Corporation)</option>
                    <option value="MONITORING_AUTHORITY">Auditor / Monitoring Authority (Verifier)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-8 py-2 bg-slate-50/80 border rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 transition focus:outline-none focus:bg-white focus:ring-2 ${
                        errors.password 
                          ? 'border-red-300 focus:ring-red-100' 
                          : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-8 py-2 bg-slate-50/80 border rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 transition focus:outline-none focus:bg-white focus:ring-2 ${
                        errors.confirmPassword 
                          ? 'border-red-300 focus:ring-red-100' 
                          : 'border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.confirmPassword}</p>}
                </div>
              </div>

              <div className="pt-0.5">
                <label className="flex items-start space-x-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-3.5 h-3.5 mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 transition cursor-pointer" 
                  />
                  <span className="text-xs font-medium text-slate-600 group-hover:text-slate-800 transition leading-tight">
                    I agree to GreenLedger's <span className="font-bold text-emerald-700">Verification Protocols</span> and <span className="font-bold text-emerald-700">Terms of Service</span>.
                  </span>
                </label>
                {errors.terms && <p className="mt-1 text-[11px] font-medium text-red-500">{errors.terms}</p>}
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
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="relative my-2.5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-[10px] font-bold tracking-wider">
                  <span className="px-2 bg-white text-slate-400 uppercase">OR</span>
                </div>
              </div>

              <p className="text-center text-xs font-medium text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700 transition">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>

      </main>

      {/* SUBTLE BRAND FOOTER */}
      <footer className="relative z-10 w-full px-6 sm:px-12 py-2 flex items-center justify-between text-[11px] text-slate-600 font-semibold shrink-0">
        <p>© 2026 GreenLedger Inc. All rights reserved.</p>
        <p className="text-emerald-700">Building Sustainable Futures Together</p>
      </footer>
    </div>
  );
};

export default Register;
