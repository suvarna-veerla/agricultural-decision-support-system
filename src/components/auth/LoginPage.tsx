import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { signIn } = useAuth(); const { t } = useLanguage(); const navigate = useNavigate();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try { await signIn(email, password); navigate('/dashboard'); }
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
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{t('login')}</h2>
          {error && <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t('email')}</label><div className="relative"><Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-lg" required /></div></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t('password')}</label><div className="relative"><Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-12 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-lg" required /><button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPw ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-lg transition-all disabled:opacity-50 shadow-lg shadow-primary-300/30">{loading ? t('loading') : t('login')}</button>
          </form>
          <div className="mt-6 text-center"><p className="text-gray-500">{t('no_account')} <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">{t('register')}</Link></p></div>
        </div>
      </div>
    </div>
  );
}
