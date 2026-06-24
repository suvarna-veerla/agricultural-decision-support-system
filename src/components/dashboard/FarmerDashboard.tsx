import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabase';
import type { FarmAnalysis } from '../../types';
import { Sprout, PlusCircle, BarChart3, TrendingUp, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FarmerDashboard() {
  const { user } = useAuth(); const { t } = useLanguage(); const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<FarmAnalysis[]>([]); const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) fetchAnalyses(); }, [user]);

  async function fetchAnalyses() {
    const { data } = await supabase.from('farm_analyses').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(10);
    if (data) setAnalyses(data as FarmAnalysis[]); setLoading(false);
  }

  const totalProfit = analyses.reduce((s, a) => s + (a.profit_loss || 0), 0);
  const totalInvestment = analyses.reduce((s, a) => s + (a.investment_cost || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-2xl p-6 md:p-8 text-white shadow-xl shadow-primary-300/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div><h1 className="text-2xl md:text-3xl font-bold">{t('welcome_back')}, {user?.full_name}!</h1><p className="text-primary-100 mt-1">{t('app_subtitle')}</p></div>
          <button onClick={() => navigate('/analysis')} className="flex items-center gap-2 px-6 py-3 bg-white text-primary-700 rounded-xl font-bold text-lg hover:bg-primary-50 transition-all shadow-lg"><PlusCircle size={22} />{t('new_analysis')}</button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Sprout size={22} className="text-primary-600" />} label={t('total_analyses')} value={String(analyses.length)} bg="bg-primary-50" />
        <StatCard icon={<TrendingUp size={22} className={totalProfit >= 0 ? 'text-green-600' : 'text-red-600'} />} label={t('net_pl')} value={`${totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString()}`} bg={totalProfit >= 0 ? 'bg-green-50' : 'bg-red-50'} />
        <StatCard icon={<BarChart3 size={22} className="text-blue-600" />} label={t('total_investment')} value={totalInvestment.toLocaleString()} bg="bg-blue-50" />
        <StatCard icon={<MapPin size={22} className="text-amber-600" />} label={t('districts')} value={String(new Set(analyses.map(a => a.location)).size)} bg="bg-amber-50" />
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-100/50 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{t('recent_analyses')}</h2>
        {loading ? <div className="text-center py-8 text-gray-400">{t('loading')}</div> : analyses.length === 0 ? (
          <div className="text-center py-12"><Sprout size={48} className="mx-auto text-gray-300 mb-3" /><p className="text-gray-400">{t('no_analyses')}</p><button onClick={() => navigate('/analysis')} className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700">{t('new_analysis')}</button></div>
        ) : <div className="space-y-3">{analyses.map(a => (<div key={a.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center"><Sprout size={18} className="text-primary-600" /></div><div><p className="font-semibold text-gray-800">{a.crop_name} - {a.acres} {t('acres')}</p><p className="text-sm text-gray-500">{a.location} | {new Date(a.created_at).toLocaleDateString()}</p></div></div><div className="text-right"><p className={`font-bold ${(a.profit_loss||0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{(a.profit_loss||0) >= 0 ? '+' : ''}{(a.profit_loss||0).toLocaleString()}</p><p className="text-xs text-gray-400">{t('rupees')}</p></div></div>))}</div>}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bg }: { icon: React.ReactNode; label: string; value: string; bg: string }) {
  return <div className={`${bg} rounded-2xl p-4 md:p-5`}><div className="mb-2">{icon}</div><p className="text-xs text-gray-500 mb-0.5">{label}</p><p className="text-lg md:text-xl font-bold text-gray-800 truncate">{value}</p></div>;
}
