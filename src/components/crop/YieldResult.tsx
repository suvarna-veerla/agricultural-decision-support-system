import { useLanguage } from '../../context/LanguageContext';
import type { LocationInfo } from '../../types';
import TeluguTTS from '../voice/TeluguTTS';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';
import { CROP_TE_NAMES } from '../../data/crops';

interface YieldResultProps { cropName: string; acres: number; locInfo: LocationInfo; result: { expected_yield: number; yield_confidence: number; climate_risk_score: number; investment_cost: number; expected_revenue: number; profit_loss: number; roi_percentage: number; suitability_score: number; }; }

export default function YieldResult({ cropName, acres, locInfo, result }: YieldResultProps) {
  const { t, language } = useLanguage();
  const isProfit = result.profit_loss >= 0;
  const riskLevel = result.climate_risk_score < 30 ? 'low' : result.climate_risk_score < 60 ? 'medium' : 'high';
  const riskColor = riskLevel === 'low' ? 'text-green-600 bg-green-50' : riskLevel === 'medium' ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';
  const riskLabel = riskLevel === 'low' ? t('risk_low') : riskLevel === 'medium' ? t('risk_medium') : t('risk_high');
  const cropTe = CROP_TE_NAMES[cropName] || cropName;

  const summaryEn = `Yield prediction for ${acres} acres of ${cropName}. Expected yield is ${result.expected_yield.toFixed(2)} tonnes. Your investment cost will be ${result.investment_cost.toLocaleString()} rupees. Expected revenue is ${result.expected_revenue.toLocaleString()} rupees. ${isProfit ? `You will get a profit of ${Math.abs(result.profit_loss).toLocaleString()} rupees. This is a gain for you.` : `You will face a loss of ${Math.abs(result.profit_loss).toLocaleString()} rupees. This is not profitable.`} Return on investment is ${result.roi_percentage} percent. Climate risk is ${riskLevel}.`;

  const summaryTe = `${acres} ఎకరాల ${cropTe} పంటకు దిగుబడి అంచనా. మీకు దక్కే దిగుబడి ${result.expected_yield.toFixed(2)} టన్నులు. మీ పెట్టుబడి ${result.investment_cost.toLocaleString()} రూపాయలు. వచ్చే ఆదాయం ${result.expected_revenue.toLocaleString()} రూపాయలు. ${isProfit ? `మీకు లాభం వస్తుంది. లాభం ${Math.abs(result.profit_loss).toLocaleString()} రూపాయలు. ఇది మీకు లాభదాయకమే.` : `మీకు నష్టం వస్తుంది. నష్టం ${Math.abs(result.profit_loss).toLocaleString()} రూపాయలు. ఇది లాభదాయకం కాదు.`} పెట్టుబడిపై లాభం ${result.roi_percentage} శాతం. వాతావరణ ప్రమాదం ${riskLevel === 'low' ? 'తక్కువ' : riskLevel === 'medium' ? 'మధ్యస్థం' : 'ఎక్కువ'}.`;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white"><div className="flex items-center justify-between flex-wrap gap-3"><div><h2 className="text-2xl font-bold">{t('yield_result')}</h2><p className="text-primary-100 mt-1">{cropName} - {acres} {t('acres')}</p></div><TeluguTTS text={summaryEn} teluguText={summaryTe} /></div></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MC icon={<BarChart3 size={20} className="text-primary-600" />} label={t('expected_yield')} value={`${result.expected_yield.toFixed(2)}`} unit={t('tonnes_per_acre')} bg="bg-primary-50" />
        <MC icon={<CheckCircle size={20} className="text-blue-600" />} label={t('confidence_score')} value={`${result.yield_confidence}%`} unit="" bg="bg-blue-50" />
        <MC icon={<AlertTriangle size={20} className={riskLevel === 'low' ? 'text-green-600' : riskLevel === 'medium' ? 'text-amber-600' : 'text-red-600'} />} label={t('climate_risk')} value={riskLabel} unit={`${result.climate_risk_score}%`} bg={riskColor} />
        <MC icon={isProfit ? <TrendingUp size={20} className="text-green-600" /> : <TrendingDown size={20} className="text-red-600" />} label={t('roi')} value={`${result.roi_percentage}%`} unit="" bg={isProfit ? 'bg-green-50' : 'bg-red-50'} />
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="font-bold text-gray-800 mb-4">{t('profit_loss')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-xl"><p className="text-sm text-gray-500 mb-1">{t('investment_cost')}</p><p className="text-2xl font-bold text-gray-800">{result.investment_cost.toLocaleString()}</p><p className="text-xs text-gray-400">{t('rupees')}</p></div>
          <div className="text-center p-4 bg-gray-50 rounded-xl"><p className="text-sm text-gray-500 mb-1">{t('expected_revenue')}</p><p className="text-2xl font-bold text-gray-800">{result.expected_revenue.toLocaleString()}</p><p className="text-xs text-gray-400">{t('rupees')}</p></div>
          <div className={`text-center p-4 rounded-xl ${isProfit ? 'bg-green-50' : 'bg-red-50'}`}><p className="text-sm text-gray-500 mb-1">{isProfit ? t('profit') : t('loss')}</p><p className={`text-2xl font-bold ${isProfit ? 'text-green-700' : 'text-red-700'}`}>{isProfit ? '+' : ''}{result.profit_loss.toLocaleString()}</p><p className="text-xs text-gray-400">{t('rupees')}</p></div>
        </div>
        <div className="mt-6"><div className="flex justify-between text-sm mb-2"><span className="text-gray-600">{t('roi')}</span><span className={`font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>{result.roi_percentage}%</span></div><div className="h-4 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all duration-1000 ${isProfit ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-red-400 to-red-600'}`} style={{ width: `${Math.min(Math.abs(result.roi_percentage), 100)}%` }} /></div></div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"><h3 className="font-bold text-gray-800 mb-3">{t('location')}</h3><div className="grid grid-cols-2 md:grid-cols-4 gap-3"><II label={t('soil_type')} value={locInfo.soil_type} /><II label="pH" value={locInfo.soil_ph.toFixed(1)} /><II label={t('water_availability')} value={locInfo.water_availability} /><II label={t('climate_zone')} value={locInfo.climate_zone} /></div></div>
    </div>
  );
}

function MC({ icon, label, value, unit, bg }: { icon: React.ReactNode; label: string; value: string; unit: string; bg: string }) {
  return <div className={`${bg} rounded-2xl p-4 text-center`}><div className="flex justify-center mb-2">{icon}</div><p className="text-xs text-gray-500 mb-1">{label}</p><p className="text-xl font-bold text-gray-800">{value}</p>{unit && <p className="text-xs text-gray-400">{unit}</p>}</div>;
}
function II({ label, value }: { label: string; value: string }) { return <div className="p-3 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">{label}</p><p className="font-semibold text-gray-700 text-sm">{value}</p></div>; }
