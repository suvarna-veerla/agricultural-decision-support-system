import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import LanguageToggle from '../common/LanguageToggle';
import { LogOut, Sprout, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { user, signOut } = useAuth(); const { t } = useLanguage();
  const navigate = useNavigate(); const location = useLocation(); const [open, setOpen] = useState(false);

  const navItems = user?.role === 'admin'
    ? [{ path: '/admin', label: t('admin_dashboard') }]
    : [{ path: '/dashboard', label: t('dashboard') }, { path: '/analysis', label: t('farm_analysis') }, { path: '/climate', label: t('climate_analytics') }];

  const handleSignOut = async () => { await signOut(); navigate('/login'); };

  return (
    <nav className="bg-gradient-to-r from-primary-800 to-primary-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <button onClick={() => navigate(user ? '/dashboard' : '/login')} className="flex items-center gap-2 hover:opacity-90"><Sprout size={28} className="text-primary-200" /><span className="text-xl font-bold">{t('app_name')}</span></button>
        <div className="hidden md:flex items-center gap-1">
          {user && navItems.map(item => (<button key={item.path} onClick={() => navigate(item.path)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === item.path ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'}`}>{item.label}</button>))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle />
          {user && <div className="flex items-center gap-3"><span className="text-sm text-white/70">{user.full_name}</span><button onClick={handleSignOut} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-red-500/30 transition-all text-sm"><LogOut size={16} />{t('logout')}</button></div>}
        </div>
        <button className="md:hidden text-white p-2" onClick={() => setOpen(!open)}>{open ? <X size={24} /> : <Menu size={24} />}</button>
      </div>
      {open && <div className="md:hidden bg-primary-900/95 border-t border-white/10 px-4 py-3 space-y-2">
        {user && navItems.map(item => (<button key={item.path} onClick={() => { navigate(item.path); setOpen(false); }} className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium ${location.pathname === item.path ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'}`}>{item.label}</button>))}
        <div className="flex items-center justify-between pt-2 border-t border-white/10"><LanguageToggle />{user && <button onClick={handleSignOut} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/30 text-sm"><LogOut size={16} />{t('logout')}</button>}</div>
      </div>}
    </nav>
  );
}
