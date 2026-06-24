import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabase';
import { Users, Database, BarChart3, Sprout, Shield } from 'lucide-react';

interface FarmerStat { id: string; full_name: string; email: string; phone: string; location: string; created_at: string; analysis_count: number; }

export default function AdminDashboard() {
  const { user } = useAuth(); const { t } = useLanguage();
  const [farmers, setFarmers] = useState<FarmerStat[]>([]); const [totalAnalyses, setTotalAnalyses] = useState(0); const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    const { data: profiles } = await supabase.from('profiles').select('*').eq('role', 'farmer');
    const { count } = await supabase.from('farm_analyses').select('*', { count: 'exact', head: true });
    if (profiles) { const stats = await Promise.all(profiles.map(async (p) => { const { count } = await supabase.from('farm_analyses').select('*', { count: 'exact', head: true }).eq('user_id', p.id); return { ...p, analysis_count: count || 0 }; })); setFarmers(stats); }
    setTotalAnalyses(count || 0); setLoading(false);
  }

  if (user?.role !== 'admin') return <div className="min-h-screen flex items-center justify-center"><div className="text-center"><Shield size={48} className="mx-auto text-red-400 mb-3" /><p className="text-gray-500">{t('access_denied')}</p></div></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-6 md:p-8 text-white shadow-xl"><h1 className="text-2xl md:text-3xl font-bold">{t('admin_dashboard')}</h1><p className="text-gray-300 mt-1">{t('manage_farmers')}</p></div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-2xl p-5"><Users size={22} className="text-blue-600 mb-2" /><p className="text-xs text-gray-500">{t('total_farmers')}</p><p className="text-2xl font-bold text-gray-800">{farmers.length}</p></div>
        <div className="bg-primary-50 rounded-2xl p-5"><Database size={22} className="text-primary-600 mb-2" /><p className="text-xs text-gray-500">{t('total_analyses')}</p><p className="text-2xl font-bold text-gray-800">{totalAnalyses}</p></div>
        <div className="bg-amber-50 rounded-2xl p-5"><BarChart3 size={22} className="text-amber-600 mb-2" /><p className="text-xs text-gray-500">{t('active_crops')}</p><p className="text-2xl font-bold text-gray-800">12</p></div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4">{t('farmers_list')}</h2>
        {loading ? <div className="text-center py-8 text-gray-400">{t('loading')}</div> : (
          <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-gray-100"><th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{t('name')}</th><th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{t('email')}</th><th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{t('location')}</th><th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{t('analyses')}</th><th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase">{t('joined')}</th></tr></thead><tbody>
            {farmers.map(f => (<tr key={f.id} className="border-b border-gray-50 hover:bg-gray-50"><td className="py-3 px-3 flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center"><Sprout size={14} className="text-primary-600" /></div><span className="font-medium text-gray-800">{f.full_name}</span></td><td className="py-3 px-3 text-sm text-gray-600">{f.email}</td><td className="py-3 px-3 text-sm text-gray-600">{f.location || '-'}</td><td className="py-3 px-3"><span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-medium">{f.analysis_count}</span></td><td className="py-3 px-3 text-sm text-gray-500">{new Date(f.created_at).toLocaleDateString()}</td></tr>))}
          </tbody></table></div>
        )}
      </div>
    </div>
  );
}
