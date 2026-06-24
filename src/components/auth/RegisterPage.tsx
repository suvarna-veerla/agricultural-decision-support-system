import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const { signUp } = useAuth(); const { t, language, setLanguage } = useLanguage(); const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const update = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirmPassword) { setError(language === 'te' ? 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు' : 'Passwords do not match'); return; }
    if (form.password.length < 6) { setError(language === 'te' ? 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు' : 'Password must be 6+ characters'); return; }
    setLoading(true);
    try { await signUp(form.email, form.password, form.fullName, form.phone); navigate('/dashboard'); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : t('error')); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-600 shadow-xl shadow-primary-300/30 mb-4"><Sprout size={40} className="text-white" /></div>
          <h1 className="text-3xl font-bold text-gray-900">{t('app_name')}</h1><p className="text-gray-500 mt-1">{t('app_subtitle')}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('register')}</h2>
          {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t('full_name')}</label><div className="relative"><User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={form.fullName} onChange={e => update('fullName', e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 transition-all text-lg" required /></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t('email')}</label><div className="relative"><Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="email" value={form.email} onChange={e => update('email', e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 transition-all text-lg" required /></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t('phone')}</label><div className="relative"><Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 transition-all text-lg" /></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t('language')}</label><div className="flex gap-3"><button type="button" onClick={() => setLanguage('te')} className={`flex-1 py-3 rounded-xl border-2 font-semibold text-lg transition-all ${language === 'te' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500'}`}>తెలుగు</button><button type="button" onClick={() => setLanguage('en')} className={`flex-1 py-3 rounded-xl border-2 font-semibold text-lg transition-all ${language === 'en' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-500'}`}>English</button></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t('password')}</label><div className="relative"><Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)} className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 transition-all text-lg" required /><button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPw ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t('confirm_password')}</label><div className="relative"><Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type={showPw ? 'text' : 'password'} value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 transition-all text-lg" required /></div></div>
            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-lg transition-all disabled:opacity-50 shadow-lg shadow-primary-300/30">{loading ? t('loading') : t('register')}</button>
          </form>
          <div className="mt-6 text-center"><p className="text-gray-500">{t('has_account')} <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">{t('login')}</Link></p></div>
        </div>
      </div>
    </div>
  );
}
