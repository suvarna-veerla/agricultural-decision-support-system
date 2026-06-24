import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import FarmMap from '../components/map/FarmMap';
import VoiceInput from '../components/voice/VoiceInput';
import YieldResult from '../components/crop/YieldResult';
import CropRecommendations from '../components/crop/CropRecommendations';
import { getLocationInfo, predictYield, getRecommendations, getCropNames } from '../data/crops';
import { supabase } from '../lib/supabase';
import type { VoiceInputResult, LocationInfo } from '../types';
import { Mic2, FormInput, ArrowRight, ArrowLeft, Save, Sprout, MapPin } from 'lucide-react';

type Step = 'input' | 'location' | 'result';

export default function AnalysisPage() {
  const { user } = useAuth(); const { t, language } = useLanguage();
  const [step, setStep] = useState<Step>('input');
  const [cropName, setCropName] = useState(''); const [acres, setAcres] = useState('');
  const [latitude, setLatitude] = useState(0); const [longitude, setLongitude] = useState(0);
  const [locInfo, setLocInfo] = useState<LocationInfo | null>(null);
  const [yieldResult, setYieldResult] = useState<ReturnType<typeof predictYield>>(null);
  const [recommendations, setRecommendations] = useState<ReturnType<typeof getRecommendations>>([]);
  const [saving, setSaving] = useState(false); const [inputMode, setInputMode] = useState<'form' | 'voice'>('voice'); const [saved, setSaved] = useState(false);
  const cropOptions = getCropNames(language);

  const handleVoiceResult = useCallback((result: VoiceInputResult) => { if (result.crop_name) setCropName(result.crop_name); if (result.acres) setAcres(String(result.acres)); }, []);
  const handleLocationSelect = useCallback((lat: number, lng: number) => { setLatitude(lat); setLongitude(lng); }, []);

  const handlePredict = () => {
    if (!latitude || !longitude || !cropName || !acres) return;
    const info = getLocationInfo(latitude, longitude); setLocInfo(info);
    setYieldResult(predictYield(cropName, info, parseFloat(acres)));
    setRecommendations(getRecommendations(info, cropName)); setStep('result');
  };

  const handleSave = async () => {
    if (!user || !yieldResult || !locInfo) return; setSaving(true);
    try { const { error } = await supabase.from('farm_analyses').insert({ user_id: user.id, crop_name: cropName, location: locInfo.climate_zone, latitude, longitude, acres: parseFloat(acres), soil_type: locInfo.soil_type, expected_yield: yieldResult.expected_yield, yield_confidence: yieldResult.yield_confidence, climate_risk_score: yieldResult.climate_risk_score, investment_cost: yieldResult.investment_cost, expected_revenue: yieldResult.expected_revenue, profit_loss: yieldResult.profit_loss, roi_percentage: yieldResult.roi_percentage, recommendations }); if (error) throw error; setSaved(true); }
    catch (err) { console.error('Save error:', err); } finally { setSaving(false); }
  };

  const startNew = () => { setStep('input'); setCropName(''); setAcres(''); setLatitude(0); setLongitude(0); setLocInfo(null); setYieldResult(null); setRecommendations([]); setSaved(false); };

  const steps: { key: Step; label: string; icon: React.ReactNode }[] = [
    { key: 'input', label: inputMode === 'voice' ? t('voice_input') : t('enter_details'), icon: inputMode === 'voice' ? <Mic2 size={18} /> : <FormInput size={18} /> },
    { key: 'location', label: t('select_location'), icon: <MapPin size={18} /> },
    { key: 'result', label: t('yield_result'), icon: <Sprout size={18} /> },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-center gap-2">
        {steps.map((s, i) => (<div key={s.key} className="flex items-center"><div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${step === s.key ? 'bg-primary-600 text-white' : (step === 'result' && i < 2) || (step === 'location' && i === 0) ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-400'}`}>{s.icon}<span className="hidden sm:inline">{s.label}</span></div>{i < 2 && <ArrowRight size={16} className="mx-1 text-gray-300" />}</div>))}
      </div>

      {step === 'input' && (<div className="space-y-6">
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl"><button onClick={() => setInputMode('voice')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all ${inputMode === 'voice' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500'}`}><Mic2 size={18} />{t('voice_input')}</button><button onClick={() => setInputMode('form')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm transition-all ${inputMode === 'form' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500'}`}><FormInput size={18} />Form</button></div>
        {inputMode === 'voice' && <VoiceInput onResult={handleVoiceResult} />}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t('crop_name')}</label><select value={cropName} onChange={e => setCropName(e.target.value)} className="w-full py-3 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 transition-all text-lg bg-white"><option value="">{t('select_crop')}</option>{cropOptions.map(c => <option key={c.value} value={c.value}>{c.label} ({c.season})</option>)}</select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">{t('acres')}</label><input type="number" value={acres} onChange={e => setAcres(e.target.value)} className="w-full py-3 px-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 transition-all text-lg" placeholder={t('enter_acres')} min="0.1" step="0.1" /></div>
        </div>
        <button onClick={() => setStep('location')} disabled={!cropName || !acres} className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg transition-all disabled:opacity-40 shadow-lg shadow-primary-300/30">{t('select_location')} <ArrowRight size={20} /></button>
      </div>)}

      {step === 'location' && (<div className="space-y-6">
        <FarmMap latitude={latitude} longitude={longitude} onLocationSelect={handleLocationSelect} />
        {latitude && longitude && (() => { const info = getLocationInfo(latitude, longitude); return <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100"><h3 className="font-bold text-gray-800 mb-3">{t('location_details')}</h3><div className="grid grid-cols-2 gap-3"><DI label={t('soil_type')} value={info.soil_type} /><DI label="pH" value={info.soil_ph.toString()} /><DI label={t('avg_temp')} value={`${info.avg_temperature}°C`} /><DI label={t('avg_rainfall')} value={`${info.avg_rainfall}mm`} /><DI label={t('water_availability')} value={info.water_availability} /><DI label={t('climate_zone')} value={info.climate_zone} /></div></div>; })()}
        <div className="flex gap-3"><button onClick={() => setStep('input')} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-50"><ArrowLeft size={18} />{t('back')}</button><button onClick={handlePredict} disabled={!latitude || !longitude} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg transition-all disabled:opacity-40 shadow-lg shadow-primary-300/30"><Sprout size={20} />{t('predict_yield')}</button></div>
      </div>)}

      {step === 'result' && yieldResult && locInfo && (<div className="space-y-6">
        <YieldResult cropName={cropName} acres={parseFloat(acres)} locInfo={locInfo} result={yieldResult} />
        {recommendations.length > 0 && <CropRecommendations recommendations={recommendations} />}
        <div className="flex gap-3"><button onClick={startNew} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-50"><ArrowLeft size={18} />{t('new_analysis_btn')}</button><button onClick={handleSave} disabled={saving || saved} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-lg transition-all shadow-lg ${saved ? 'bg-green-600 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'} disabled:opacity-50`}><Save size={20} />{saved ? (language === 'te' ? 'సేవ్ అయింది!' : 'Saved!') : saving ? t('loading') : t('save_analysis')}</button></div>
      </div>)}
    </div>
  );
}

function DI({ label, value }: { label: string; value: string }) { return <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">{label}</p><p className="font-semibold text-gray-700">{value}</p></div>; }
