import { useLanguage } from '../../context/LanguageContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import type { ClimateData } from '../../types';
import { Thermometer, Droplets, CloudRain, TrendingUp } from 'lucide-react';

interface Props { data: ClimateData[]; }

export default function ClimateDashboard({ data }: Props) {
  const { t, language } = useLanguage();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ft = (v: any) => [`${v}°C`, 'Temperature'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fr = (v: any) => [`${v}mm`, 'Rainfall'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fh = (v: any) => [`${v}%`, language === 'te' ? 'తేమ' : 'Humidity'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"><div className="flex items-center gap-2 mb-4"><Thermometer size={20} className="text-red-500" /><h3 className="font-bold text-gray-800">{t('temperature_trend')}</h3></div><ResponsiveContainer width="100%" height={250}><LineChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} unit="°C" /><Tooltip formatter={ft} /><Line type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: '#ef4444', r: 4 }} /></LineChart></ResponsiveContainer></div>
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"><div className="flex items-center gap-2 mb-4"><CloudRain size={20} className="text-blue-500" /><h3 className="font-bold text-gray-800">{t('rainfall_trend')}</h3></div><ResponsiveContainer width="100%" height={250}><BarChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} unit="mm" /><Tooltip formatter={fr} /><Bar dataKey="rainfall" fill="#3b82f6" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"><div className="flex items-center gap-2 mb-4"><Droplets size={20} className="text-teal-500" /><h3 className="font-bold text-gray-800">{language === 'te' ? 'తేమ' : 'Humidity'}</h3></div><ResponsiveContainer width="100%" height={250}><AreaChart data={data}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} unit="%" /><Tooltip formatter={fh} /><Area type="monotone" dataKey="humidity" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.15} strokeWidth={2.5} /></AreaChart></ResponsiveContainer></div>
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"><div className="flex items-center gap-2 mb-4"><TrendingUp size={20} className="text-amber-500" /><h3 className="font-bold text-gray-800">{t('climate_change')}</h3></div><div className="space-y-4">{data.slice(0, 6).map((d, i) => { const later = data[i + 6]; if (!later) return null; const tc = later.temperature - d.temperature; const rc = ((later.rainfall - d.rainfall) / (d.rainfall || 1) * 100); return <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"><span className="text-sm text-gray-600 w-16">{d.month} vs {later.month}</span><span className={`text-sm font-medium ${tc > 0 ? 'text-red-600' : 'text-blue-600'}`}>{tc > 0 ? '+' : ''}{tc.toFixed(1)}°C</span><span className={`text-sm font-medium ${rc > 0 ? 'text-blue-600' : 'text-amber-600'}`}>{rc > 0 ? '+' : ''}{rc.toFixed(0)}% rain</span></div>; })}</div></div>
    </div>
  );
}
