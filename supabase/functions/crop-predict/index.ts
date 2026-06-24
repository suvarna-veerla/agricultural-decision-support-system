import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CropInfo { name: string; season: string; ideal_temp_min: number; ideal_temp_max: number; ideal_rainfall_min: number; ideal_rainfall_max: number; soil_types: string[]; yield_per_acre: number; investment_per_acre: number; market_price_per_tonne: number; water_requirement: "high" | "medium" | "low"; }

const CROPS: CropInfo[] = [
  { name: "Rice", season: "Kharif", ideal_temp_min: 20, ideal_temp_max: 35, ideal_rainfall_min: 150, ideal_rainfall_max: 300, soil_types: ["Clay", "Clay Loam"], yield_per_acre: 2.5, investment_per_acre: 25000, market_price_per_tonne: 22000, water_requirement: "high" },
  { name: "Cotton", season: "Kharif", ideal_temp_min: 25, ideal_temp_max: 40, ideal_rainfall_min: 60, ideal_rainfall_max: 120, soil_types: ["Black Soil", "Sandy Loam"], yield_per_acre: 1.8, investment_per_acre: 30000, market_price_per_tonne: 65000, water_requirement: "medium" },
  { name: "Maize", season: "Kharif", ideal_temp_min: 18, ideal_temp_max: 32, ideal_rainfall_min: 50, ideal_rainfall_max: 100, soil_types: ["Sandy Loam", "Loam"], yield_per_acre: 3.0, investment_per_acre: 18000, market_price_per_tonne: 25000, water_requirement: "medium" },
  { name: "Groundnut", season: "Kharif", ideal_temp_min: 25, ideal_temp_max: 35, ideal_rainfall_min: 40, ideal_rainfall_max: 80, soil_types: ["Sandy Loam", "Red Soil"], yield_per_acre: 1.2, investment_per_acre: 20000, market_price_per_tonne: 55000, water_requirement: "low" },
  { name: "Chilli", season: "Rabi", ideal_temp_min: 20, ideal_temp_max: 30, ideal_rainfall_min: 30, ideal_rainfall_max: 60, soil_types: ["Sandy Loam", "Red Soil"], yield_per_acre: 1.5, investment_per_acre: 45000, market_price_per_tonne: 120000, water_requirement: "medium" },
  { name: "Turmeric", season: "Kharif", ideal_temp_min: 20, ideal_temp_max: 30, ideal_rainfall_min: 80, ideal_rainfall_max: 150, soil_types: ["Sandy Loam", "Red Soil"], yield_per_acre: 3.0, investment_per_acre: 55000, market_price_per_tonne: 80000, water_requirement: "medium" },
];

function predictYield(cropName: string, avgTemp: number, avgRainfall: number, soilType: string, waterAvailability: string, acres: number) {
  const crop = CROPS.find(c => c.name === cropName); if (!crop) return null;
  const tf = Math.max(0, 1 - Math.abs(avgTemp - (crop.ideal_temp_min + crop.ideal_temp_max) / 2) / 20);
  const rf = Math.max(0, 1 - Math.abs(avgRainfall - (crop.ideal_rainfall_min + crop.ideal_rainfall_max) / 2) / 100);
  const sf = crop.soil_types.includes(soilType) ? 1 : 0.6;
  const wf = waterAvailability === crop.water_requirement ? 1 : 0.7;
  const s = tf * 0.3 + rf * 0.25 + sf * 0.25 + wf * 0.2;
  const ey = Math.round(crop.yield_per_acre * s * acres * 100) / 100;
  const ic = crop.investment_per_acre * acres;
  const er = ey * crop.market_price_per_tonne;
  return { expected_yield: ey, yield_confidence: Math.min(Math.round(s * 85 + 15), 95), climate_risk_score: Math.round((1 - s) * 100), investment_cost: ic, expected_revenue: Math.round(er), profit_loss: Math.round(er - ic), roi_percentage: Math.round((er - ic) / ic * 10000) / 100, suitability_score: Math.round(s * 100) };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });
  try {
    const { crop_name, avg_temperature, avg_rainfall, soil_type, water_availability, acres, action } = await req.json();
    if (action === "predict") { const r = predictYield(crop_name, avg_temperature, avg_rainfall, soil_type, water_availability, acres); if (!r) return new Response(JSON.stringify({ error: "Crop not found" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }); return new Response(JSON.stringify(r), { headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) { return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }); }
});
