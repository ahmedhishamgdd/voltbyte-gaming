import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Eye, EyeOff, Mail, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type RegisterStep = 'form' | 'verify';

export default function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth();
  const [step, setStep] = useState<RegisterStep>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [sentCode, setSentCode] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError(t('register.nameRequired'));
      return false;
    }
    if (!formData.email.includes('@')) {
      setError(t('register.validEmail'));
      return false;
    }
    if (formData.password.length < 6) {
      setError(t('register.passwordLength'));
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('register.passwordMatch'));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    // Simulate email verification code generation
    setTimeout(() => {
      const code = Math.random().toString().slice(2, 8);
      setSentCode(code);
      setStep('verify');
      setLoading(false);
    }, 1000);
  };

  const handleVerify = async () => {
    if (verificationCode !== sentCode) {
      setError(t('register.invalidCode'));
      return;
    }

    setLoading(true);
    // Simulate account creation
    setTimeout(() => {
      login({
        id: Math.random().toString(),
        email: formData.email,
        name: formData.name,
        role: 'user',
      });
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center pt-20 pb-20">
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto">
                <Mail size={32} />
              </div>
              <h2 className="text-3xl font-bold">{t('register.verifyEmail')}</h2>
              <p className="text-gray-400">
                {t('register.codeMessage')} {formData.email}
              </p>
            </div>

            <div className="bg-gray-800 bg-opacity-50 backdrop-blur border border-gray-700 rounded-lg p-8 space-y-6">
              {error && (
                <div className="p-3 bg-red-600/20 border border-red-600 rounded-lg text-red-200 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold mb-2">{t('register.verificationCode')}</label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value.toUpperCase());
                    setError('');
                  }}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <p className="text-xs text-gray-400 mt-2">{t('register.testCode')}: {sentCode}</p>
              </div>

              <button
                onClick={handleVerify}
                disabled={loading || verificationCode.length !== 6}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    {t('register.verifying')}
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    {t('register.verify')}
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setStep('form');
                  setVerificationCode('');
                }}
                className="w-full px-6 py-2 border-2 border-gray-600 text-gray-300 rounded-lg font-bold hover:bg-gray-700 transition-colors"
              >
                {t('register.back')}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center pt-20 pb-20">
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
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white font-bold mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          {t('register.back')}
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">
              🎮 Join
              <span className="text-red-600"> VoltByte</span>
            </h1>
            <p className="text-gray-400">{t('register.createAccount')}</p>
          </div>

          <div className="bg-gray-800 bg-opacity-50 backdrop-blur border border-gray-700 rounded-lg p-8 space-y-6">
            {error && (
              <div className="p-3 bg-red-600/20 border border-red-600 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-bold mb-2">{t('register.fullName')}</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="John Gamer"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold mb-2">{t('register.email')}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="john@gaming.com"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-bold mb-2">{t('register.password')}</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-bold mb-2">{t('register.confirmPassword')}</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleFormChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                  required
                />
              </div>

              {/* Terms */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" required className="w-4 h-4 rounded" />
                <span className="text-sm">
                  {t('register.agreeTerms')}{' '}
                  <button type="button" className="text-red-600 hover:text-red-500 font-bold">
                    {t('register.terms')}
                  </button>
                </span>
              </label>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg font-bold transition-colors"
              >
                {loading ? t('register.creating') : t('register.createAccount')}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="text-center pt-4 border-t border-gray-700">
              <p className="text-gray-400">
                {t('register.haveAccount')}{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-red-600 hover:text-red-500 font-bold transition-colors"
                >
                  {t('register.signIn')}
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
