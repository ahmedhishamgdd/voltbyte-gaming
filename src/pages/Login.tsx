import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEMO_ACCOUNTS = [
  { email: 'admin@voltbyte.com', password: 'admin123', role: 'Admin' },
  { email: 'john@gaming.com', password: 'user123', role: 'User' },
];

export default function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate login API call
    setTimeout(() => {
      const user = DEMO_ACCOUNTS.find(
        (acc) => acc.email === formData.email && acc.password === formData.password
      );

      if (user) {
        login({
          id: Math.random().toString(),
          email: user.email,
          name: user.email.split('@')[0],
          role: user.role as 'admin' | 'user',
        });
        navigate('/');
      } else {
        setError(t('login.invalidCredentials'));
      }
      setLoading(false);
    }, 1500);
  };

  const handleDemoLogin = (email: string, password: string) => {
    setFormData({ email, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center pt-20 pb-20">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute w-full h-full opacity-10"
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid slice"
        >
          <g>
            <circle cx="100" cy="100" r="3" fill="#dc2626" className="animate-pulse" />
            <circle cx="1100" cy="500" r="3" fill="#dc2626" className="animate-pulse" />
            <circle cx="600" cy="300" r="3" fill="#dc2626" className="animate-pulse" />
            <line x1="100" y1="100" x2="600" y2="300" stroke="#dc2626" strokeWidth="1" opacity="0.3" />
            <line x1="600" y1="300" x2="1100" y2="500" stroke="#dc2626" strokeWidth="1" opacity="0.3" />
          </g>
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Header */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white font-bold mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          {t('login.back')}
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">
              ⚡ VoltByte
              <span className="text-red-600"> Gaming</span>
            </h1>
            <p className="text-gray-400">{t('login.welcomeBack')}</p>
          </div>

          {/* Login Form */}
          <div className="bg-gray-800 bg-opacity-50 backdrop-blur border border-gray-700 rounded-lg p-8 space-y-6">
            {error && (
              <div className="p-3 bg-red-600/20 border border-red-600 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-bold mb-2">{t('login.email')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@voltbyte.com"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-bold mb-2">{t('login.password')}</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span>{t('login.rememberMe')}</span>
                </label>
                <button type="button" onClick={() => navigate('/forgot-password')} className="text-red-600 hover:text-red-500 font-bold">
                  {t('login.forgotPassword')}
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {t('login.signing')}
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    {t('login.signIn')}
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center pt-4 border-t border-gray-700">
              <p className="text-gray-400">
                {t('login.noAccount')}{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-red-600 hover:text-red-500 font-bold transition-colors"
                >
                  {t('login.signUp')}
                </button>
              </p>
            </div>
          </div>

          {/* Demo Accounts */}
          <div className="space-y-3">
            <p className="text-center text-gray-400 text-sm">{t('login.demoAccounts')}</p>
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                onClick={() => handleDemoLogin(account.email, account.password)}
                className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-white transition-colors text-sm"
              >
                <div className="font-bold">{account.role} Account</div>
                <div className="text-xs text-gray-400">{account.email}</div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
