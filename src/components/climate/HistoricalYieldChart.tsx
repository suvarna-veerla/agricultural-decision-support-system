import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingDown } from 'lucide-react';

interface YieldRow { year: number; yield_per_acre: number; crop_name: string; }
interface Props { district: string; }

export default function HistoricalYieldChart({ district }: Props) {
  const { t, language } = useLanguage(); const [data, setData] = useState<YieldRow[]>([]); const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => { const { data: rows } = await supabase.from('historical_yields').select('*').ilike('district', `%${district}%`).order('year', { ascending: true }); if (rows) setData(rows as YieldRow[]); setLoading(false); })(); }, [district]);

  if (loading) return <div className="text-center py-8 text-gray-400">{t('loading')}</div>;
  if (data.length === 0) return null;

  const crops = [...new Set(data.map(d => d.crop_name))];
  const chartData = Object.values(data.reduce((acc: Record<number, Record<string, number>>, row) => { if (!acc[row.year]) acc[row.year] = { year: row.year } as Record<string, number>; acc[row.year][row.crop_name] = row.yield_per_acre; return acc; }, {}));
  const colors = ['#22c55e', '#3b82f6', '#f97316', '#ef4444', '#8b5cf6', '#14b8a6'];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center gap-2 mb-4"><TrendingDown size={20} className="text-green-600" /><h3 className="font-bold text-gray-800">{language === 'te' ? 'చారిత్రక దిగుబడి ధోరణి' : t('historical_yield')}</h3></div>
      <ResponsiveContainer width="100%" height={280}><LineChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="year" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} unit=" t/a" /><Tooltip /><Legend />{crops.map((crop, i) => <Line key={crop} type="monotone" dataKey={crop} stroke={colors[i % colors.length]} strokeWidth={2} dot={{ r: 3 }} />)}</LineChart></ResponsiveContainer>
    </div>
  );
}
