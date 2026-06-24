import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import ClimateDashboard from '../components/climate/ClimateDashboard';
import HistoricalYieldChart from '../components/climate/HistoricalYieldChart';
import FarmMap from '../components/map/FarmMap';
import { getLocationInfo, generateClimateData, getClosestDistrict } from '../data/crops';
import type { ClimateData, LocationInfo } from '../types';
import { Thermometer } from 'lucide-react';

export default function ClimatePage() {
  const { t, language } = useLanguage();
  const [latitude, setLatitude] = useState(16.5); const [longitude, setLongitude] = useState(80.5);
  const [climateData, setClimateData] = useState<ClimateData[]>([]); const [locInfo, setLocInfo] = useState<LocationInfo | null>(null);

  useEffect(() => { const info = getLocationInfo(latitude, longitude); setLocInfo(info); setClimateData(generateClimateData(info)); }, [latitude, longitude]);
  const district = getClosestDistrict(latitude, longitude);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-xl"><div className="flex items-center gap-3"><Thermometer size={28} /><div><h1 className="text-2xl font-bold">{t('climate_analytics')}</h1><p className="text-blue-100">{language === 'te' ? 'మీ ప్రాంతం వాతావరణ విశ్లేషణ' : 'Climate analysis for your region'}</p></div></div></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <FarmMap latitude={latitude} longitude={longitude} onLocationSelect={(lat: number, lng: number) => { setLatitude(lat); setLongitude(lng); }} />
          {locInfo && <div className="mt-4 bg-white rounded-2xl p-5 shadow-lg border border-gray-100 space-y-3"><h3 className="font-bold text-gray-800">{t('location')} Info</h3><div className="grid grid-cols-2 gap-2"><II label={t('soil_type')} value={locInfo.soil_type} /><II label="pH" value={locInfo.soil_ph.toFixed(1)} /><II label={t('avg_temp')} value={`${locInfo.avg_temperature}°C`} /><II label={t('avg_rainfall')} value={`${locInfo.avg_rainfall}mm`} /><II label={t('water_availability')} value={locInfo.water_availability} /><II label={t('climate_zone')} value={locInfo.climate_zone} /></div></div>}
        </div>
        <div className="lg:col-span-2 space-y-6">
          {climateData.length > 0 && <ClimateDashboard data={climateData} />}
          <HistoricalYieldChart district={district} />
        </div>
      </div>
    </div>
  );
}

function II({ label, value }: { label: string; value: string }) { return <div className="p-2.5 bg-gray-50 rounded-lg"><p className="text-xs text-gray-500">{label}</p><p className="font-semibold text-gray-700 text-sm">{value}</p></div>; }
