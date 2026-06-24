import { useLanguage } from '../../context/LanguageContext';
import { CROP_TE_NAMES } from '../../data/crops';
import type { CropRecommendation } from '../../types';
import TeluguTTS from '../voice/TeluguTTS';
import { Star, Droplets, TrendingUp } from 'lucide-react';

interface Props { recommendations: CropRecommendation[]; }

export default function CropRecommendations({ recommendations }: Props) {
  const { t, language } = useLanguage();
  const recEn = recommendations.map(r => `${r.crop_name} ${r.suitability_score}%`).join('. ');
  const recTe = recommendations.map(r => `${CROP_TE_NAMES[r.crop_name] || r.crop_name} ${r.suitability_score}%`).join('. ');

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3"><div><h3 className="font-bold text-gray-800 text-lg">{t('suitable_crops')}</h3><p className="text-sm text-gray-500">{t('recommendation_note')}</p></div><TeluguTTS text={recEn} teluguText={recTe} /></div>
      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <div key={rec.crop_name} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl font-bold text-sm ${idx === 0 ? 'bg-primary-100 text-primary-700' : idx === 1 ? 'bg-blue-100 text-blue-700' : idx === 2 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>#{idx + 1}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2"><h4 className="font-bold text-gray-800">{language === 'te' ? (CROP_TE_NAMES[rec.crop_name] || rec.crop_name) : rec.crop_name}</h4><span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">{rec.water_requirement}</span></div>
              <p className="text-sm text-gray-500 truncate">{rec.reason}</p>
              <div className="flex items-center gap-4 mt-1"><span className="text-xs text-gray-400 flex items-center gap-1"><TrendingUp size={12} /> {rec.expected_yield} t/a</span><span className="text-xs text-gray-400 flex items-center gap-1"><Droplets size={12} /> {rec.water_requirement}</span></div>
            </div>
            <div className="text-right"><div className="flex items-center gap-1"><Star size={14} className="text-amber-500 fill-amber-500" /><span className="font-bold text-gray-800">{rec.suitability_score}%</span></div><div className="w-20 h-2 bg-gray-200 rounded-full mt-1 overflow-hidden"><div className={`h-full rounded-full ${rec.suitability_score >= 70 ? 'bg-green-500' : rec.suitability_score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${rec.suitability_score}%` }} /></div></div>
          </div>
        ))}
      </div>
    </div>
  );
}
