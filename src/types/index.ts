export interface User {
  id: string; email: string; full_name: string; phone?: string;
  location?: string; language: 'en' | 'te'; role: 'farmer' | 'admin'; created_at: string;
}

export interface FarmAnalysis {
  id: string; user_id: string; crop_name: string; location: string;
  latitude: number; longitude: number; acres: number; soil_type: string;
  expected_yield: number; yield_confidence: number; climate_risk_score: number;
  investment_cost: number; expected_revenue: number; profit_loss: number;
  roi_percentage: number; recommendations: CropRecommendation[]; created_at: string;
}

export interface CropRecommendation {
  crop_name: string; suitability_score: number; reason: string;
  expected_yield: number; water_requirement: string;
}

export interface ClimateData {
  month: string; temperature: number; rainfall: number; humidity: number;
}

export interface LocationInfo {
  latitude: number; longitude: number; soil_type: string; soil_ph: number;
  avg_temperature: number; avg_rainfall: number; climate_zone: string;
  water_availability: string;
}

export interface VoiceInputResult {
  crop_name?: string; location?: string; acres?: number; raw_text: string;
}
