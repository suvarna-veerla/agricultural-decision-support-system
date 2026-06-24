import type { LocationInfo, ClimateData, CropRecommendation } from '../types';

interface CropInfo {
  name: string; name_te: string; season: string;
  ideal_temp_min: number; ideal_temp_max: number;
  ideal_rainfall_min: number; ideal_rainfall_max: number;
  soil_types: string[]; yield_per_acre: number; investment_per_acre: number;
  market_price_per_tonne: number; water_requirement: 'high' | 'medium' | 'low';
}

export const CROPS: CropInfo[] = [
  { name: 'Rice', name_te: 'వరి', season: 'Kharif', ideal_temp_min: 20, ideal_temp_max: 35, ideal_rainfall_min: 150, ideal_rainfall_max: 300, soil_types: ['Clay', 'Clay Loam', 'Silt Loam'], yield_per_acre: 2.5, investment_per_acre: 25000, market_price_per_tonne: 22000, water_requirement: 'high' },
  { name: 'Cotton', name_te: 'పత్తి', season: 'Kharif', ideal_temp_min: 25, ideal_temp_max: 40, ideal_rainfall_min: 60, ideal_rainfall_max: 120, soil_types: ['Black Soil', 'Sandy Loam', 'Clay Loam'], yield_per_acre: 1.8, investment_per_acre: 30000, market_price_per_tonne: 65000, water_requirement: 'medium' },
  { name: 'Maize', name_te: 'మొక్కజొన్న', season: 'Kharif', ideal_temp_min: 18, ideal_temp_max: 32, ideal_rainfall_min: 50, ideal_rainfall_max: 100, soil_types: ['Sandy Loam', 'Loam', 'Clay Loam'], yield_per_acre: 3.0, investment_per_acre: 18000, market_price_per_tonne: 25000, water_requirement: 'medium' },
  { name: 'Groundnut', name_te: 'వేరుశనగ', season: 'Kharif', ideal_temp_min: 25, ideal_temp_max: 35, ideal_rainfall_min: 40, ideal_rainfall_max: 80, soil_types: ['Sandy Loam', 'Red Soil', 'Loamy Sand'], yield_per_acre: 1.2, investment_per_acre: 20000, market_price_per_tonne: 55000, water_requirement: 'low' },
  { name: 'Sugarcane', name_te: 'చెరకు', season: 'Kharif', ideal_temp_min: 20, ideal_temp_max: 38, ideal_rainfall_min: 100, ideal_rainfall_max: 200, soil_types: ['Loam', 'Clay Loam', 'Black Soil'], yield_per_acre: 35, investment_per_acre: 50000, market_price_per_tonne: 3500, water_requirement: 'high' },
  { name: 'Red Gram', name_te: 'కంది', season: 'Kharif', ideal_temp_min: 22, ideal_temp_max: 35, ideal_rainfall_min: 40, ideal_rainfall_max: 80, soil_types: ['Sandy Loam', 'Red Soil', 'Loam'], yield_per_acre: 0.8, investment_per_acre: 12000, market_price_per_tonne: 70000, water_requirement: 'low' },
  { name: 'Chilli', name_te: 'మిర్చి', season: 'Rabi', ideal_temp_min: 20, ideal_temp_max: 30, ideal_rainfall_min: 30, ideal_rainfall_max: 60, soil_types: ['Sandy Loam', 'Red Soil', 'Loam'], yield_per_acre: 1.5, investment_per_acre: 45000, market_price_per_tonne: 120000, water_requirement: 'medium' },
  { name: 'Turmeric', name_te: 'పసుపు', season: 'Kharif', ideal_temp_min: 20, ideal_temp_max: 30, ideal_rainfall_min: 80, ideal_rainfall_max: 150, soil_types: ['Sandy Loam', 'Clay Loam', 'Red Soil'], yield_per_acre: 3.0, investment_per_acre: 55000, market_price_per_tonne: 80000, water_requirement: 'medium' },
  { name: 'Wheat', name_te: 'గోధుమ', season: 'Rabi', ideal_temp_min: 10, ideal_temp_max: 25, ideal_rainfall_min: 20, ideal_rainfall_max: 60, soil_types: ['Loam', 'Clay Loam', 'Sandy Loam'], yield_per_acre: 2.0, investment_per_acre: 15000, market_price_per_tonne: 25000, water_requirement: 'medium' },
  { name: 'Soybean', name_te: 'సోయాబీన్', season: 'Kharif', ideal_temp_min: 20, ideal_temp_max: 35, ideal_rainfall_min: 50, ideal_rainfall_max: 100, soil_types: ['Loam', 'Sandy Loam', 'Clay Loam'], yield_per_acre: 1.2, investment_per_acre: 16000, market_price_per_tonne: 45000, water_requirement: 'medium' },
  { name: 'Bengal Gram', name_te: 'శనగ', season: 'Rabi', ideal_temp_min: 15, ideal_temp_max: 28, ideal_rainfall_min: 15, ideal_rainfall_max: 40, soil_types: ['Sandy Loam', 'Loam', 'Black Soil'], yield_per_acre: 0.9, investment_per_acre: 10000, market_price_per_tonne: 60000, water_requirement: 'low' },
  { name: 'Mango', name_te: 'మామిడి', season: 'Zaid', ideal_temp_min: 24, ideal_temp_max: 38, ideal_rainfall_min: 50, ideal_rainfall_max: 150, soil_types: ['Sandy Loam', 'Loam', 'Red Soil'], yield_per_acre: 8.0, investment_per_acre: 40000, market_price_per_tonne: 30000, water_requirement: 'low' },
];

export const ANDHRA_DISTRICTS: Record<string, { lat: number; lng: number; soil: string; rainfall: number; temp: number; zone: string; water: string }> = {
  'Anantapur': { lat: 14.68, lng: 77.60, soil: 'Red Soil', rainfall: 55, temp: 29, zone: 'Rayalaseema - Dry', water: 'low' },
  'Chittoor': { lat: 13.22, lng: 79.10, soil: 'Red Soil', rainfall: 80, temp: 27, zone: 'Rayalaseema - Semi Dry', water: 'low' },
  'East Godavari': { lat: 16.98, lng: 82.25, soil: 'Clay Loam', rainfall: 180, temp: 28, zone: 'Coastal - Wet', water: 'high' },
  'Guntur': { lat: 16.31, lng: 80.44, soil: 'Black Soil', rainfall: 90, temp: 29, zone: 'Coastal - Semi Wet', water: 'medium' },
  'Krishna': { lat: 16.68, lng: 80.77, soil: 'Clay Loam', rainfall: 100, temp: 28, zone: 'Coastal - Wet', water: 'high' },
  'Kurnool': { lat: 15.83, lng: 78.05, soil: 'Black Soil', rainfall: 65, temp: 30, zone: 'Rayalaseema - Dry', water: 'low' },
  'Prakasam': { lat: 15.50, lng: 80.05, soil: 'Red Soil', rainfall: 75, temp: 29, zone: 'Coastal - Semi Dry', water: 'medium' },
  'Srikakulam': { lat: 18.30, lng: 83.90, soil: 'Sandy Loam', rainfall: 170, temp: 27, zone: 'Coastal - Wet', water: 'high' },
  'Visakhapatnam': { lat: 17.69, lng: 83.22, soil: 'Sandy Loam', rainfall: 150, temp: 27, zone: 'Coastal - Wet', water: 'high' },
  'Vizianagaram': { lat: 18.10, lng: 83.40, soil: 'Sandy Loam', rainfall: 160, temp: 27, zone: 'Coastal - Wet', water: 'high' },
  'West Godavari': { lat: 16.75, lng: 81.30, soil: 'Clay', rainfall: 190, temp: 28, zone: 'Coastal - Wet', water: 'high' },
  'Nellore': { lat: 14.45, lng: 80.00, soil: 'Sandy Loam', rainfall: 85, temp: 29, zone: 'Coastal - Semi Dry', water: 'medium' },
  'Kadapa': { lat: 14.47, lng: 78.82, soil: 'Red Soil', rainfall: 60, temp: 30, zone: 'Rayalaseema - Dry', water: 'low' },
  'Hyderabad': { lat: 17.39, lng: 78.49, soil: 'Loam', rainfall: 95, temp: 28, zone: 'Telangana - Semi Wet', water: 'medium' },
  'Warangal': { lat: 17.98, lng: 79.60, soil: 'Black Soil', rainfall: 85, temp: 29, zone: 'Telangana - Semi Dry', water: 'medium' },
};

export function getLocationInfo(lat: number, lng: number): LocationInfo {
  let closest = 'Hyderabad'; let minDist = Infinity;
  for (const [name, d] of Object.entries(ANDHRA_DISTRICTS)) {
    const dist = Math.sqrt((d.lat - lat) ** 2 + (d.lng - lng) ** 2);
    if (dist < minDist) { minDist = dist; closest = name; }
  }
  const d = ANDHRA_DISTRICTS[closest];
  return { latitude: lat, longitude: lng, soil_type: d.soil,
    soil_ph: d.soil === 'Black Soil' ? 7.8 : d.soil === 'Red Soil' ? 6.2 : d.soil === 'Clay' ? 7.5 : 6.8,
    avg_temperature: d.temp, avg_rainfall: d.rainfall, climate_zone: d.zone, water_availability: d.water };
}

export function getClosestDistrict(lat: number, lng: number): string {
  let closest = 'Hyderabad'; let minDist = Infinity;
  for (const [name, d] of Object.entries(ANDHRA_DISTRICTS)) {
    const dist = Math.sqrt((d.lat - lat) ** 2 + (d.lng - lng) ** 2);
    if (dist < minDist) { minDist = dist; closest = name; }
  }
  return closest;
}

export function generateClimateData(locInfo: LocationInfo): ClimateData[] {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return months.map((m, i) => {
    const isMonsoon = i >= 5 && i <= 8; const isWinter = i <= 1 || i >= 11;
    const baseTemp = locInfo.avg_temperature;
    const temp = isWinter ? baseTemp - 5 + Math.random()*3 : isMonsoon ? baseTemp - 2 + Math.random()*2 : baseTemp + 3 + Math.random()*2;
    const baseRain = locInfo.avg_rainfall / 12;
    const rain = isMonsoon ? baseRain * 4 + Math.random()*30 : baseRain * 0.2 + Math.random()*5;
    return { month: m, temperature: Math.round(temp*10)/10, rainfall: Math.round(rain), humidity: Math.round(isMonsoon ? 80 + Math.random()*15 : 40 + Math.random()*20) };
  });
}

export function predictYield(cropName: string, locInfo: LocationInfo, acres: number) {
  const crop = CROPS.find(c => c.name === cropName); if (!crop) return null;
  const tempFit = Math.max(0, 1 - Math.abs(locInfo.avg_temperature - (crop.ideal_temp_min+crop.ideal_temp_max)/2)/20);
  const rainFit = Math.max(0, 1 - Math.abs(locInfo.avg_rainfall - (crop.ideal_rainfall_min+crop.ideal_rainfall_max)/2)/100);
  const soilFit = crop.soil_types.includes(locInfo.soil_type) ? 1 : 0.6;
  const waterFit = locInfo.water_availability === crop.water_requirement ? 1 : crop.water_requirement === 'high' && locInfo.water_availability === 'medium' ? 0.7 : 0.8;
  const suitability = tempFit*0.3 + rainFit*0.25 + soilFit*0.25 + waterFit*0.2;
  const climateRisk = Math.round((1-suitability)*100);
  const expectedYield = Math.round(crop.yield_per_acre * suitability * acres * 100)/100;
  const confidence = Math.min(Math.round(suitability*85 + 10 + Math.random()*5), 95);
  const investmentCost = crop.investment_per_acre * acres;
  const expectedRevenue = expectedYield * crop.market_price_per_tonne;
  const profitLoss = expectedRevenue - investmentCost;
  const roi = Math.round((profitLoss / investmentCost)*10000)/100;
  return { expected_yield: expectedYield, yield_confidence: confidence, climate_risk_score: climateRisk,
    investment_cost: investmentCost, expected_revenue: Math.round(expectedRevenue), profit_loss: Math.round(profitLoss),
    roi_percentage: roi, suitability_score: Math.round(suitability*100) };
}

export function getRecommendations(locInfo: LocationInfo, excludeCrop?: string): CropRecommendation[] {
  return CROPS.filter(c => c.name !== excludeCrop).map(crop => {
    const tempFit = Math.max(0, 1 - Math.abs(locInfo.avg_temperature - (crop.ideal_temp_min+crop.ideal_temp_max)/2)/20);
    const rainFit = Math.max(0, 1 - Math.abs(locInfo.avg_rainfall - (crop.ideal_rainfall_min+crop.ideal_rainfall_max)/2)/100);
    const soilFit = crop.soil_types.includes(locInfo.soil_type) ? 1 : 0.6;
    const waterFit = locInfo.water_availability === crop.water_requirement ? 1 : 0.7;
    const score = Math.round((tempFit*0.3 + rainFit*0.25 + soilFit*0.25 + waterFit*0.2)*100);
    const reasons: string[] = [];
    if (soilFit === 1) reasons.push(`${locInfo.soil_type} soil ideal`);
    if (tempFit > 0.7) reasons.push('Temperature suitable');
    if (rainFit > 0.7) reasons.push('Rainfall adequate');
    return { crop_name: crop.name, suitability_score: score, reason: reasons.join(', ') || 'Moderately suitable',
      expected_yield: Math.round(crop.yield_per_acre * (score/100) * 10)/10, water_requirement: crop.water_requirement };
  }).sort((a, b) => b.suitability_score - a.suitability_score).slice(0, 5);
}

export function getCropNames(lang: 'en' | 'te' = 'en') {
  return CROPS.map(c => ({ value: c.name, label: lang === 'te' ? c.name_te : c.name, season: c.season }));
}

export const CROP_TE_NAMES: Record<string, string> = {
  'Rice': 'వరి', 'Cotton': 'పత్తి', 'Maize': 'మొక్కజొన్న', 'Groundnut': 'వేరుశనగ',
  'Sugarcane': 'చెరకు', 'Red Gram': 'కంది', 'Chilli': 'మిర్చి', 'Turmeric': 'పసుపు',
  'Wheat': 'గోధుమ', 'Soybean': 'సోయాబీన్', 'Bengal Gram': 'శనగ', 'Mango': 'మామిడి',
};
