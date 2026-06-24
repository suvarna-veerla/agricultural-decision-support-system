import { useState, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Mic, MicOff, CheckCircle } from 'lucide-react';
import type { VoiceInputResult } from '../../types';
import { CROP_TE_NAMES } from '../../data/crops';

interface VoiceInputProps { onResult: (result: VoiceInputResult) => void; }

const TELUGU_CROP_MAP: Record<string, string> = { 'వరి': 'Rice', 'పత్తి': 'Cotton', 'మొక్కజొన్న': 'Maize', 'వేరుశనగ': 'Groundnut', 'చెరకు': 'Sugarcane', 'కంది': 'Red Gram', 'మిర్చి': 'Chilli', 'పసుపు': 'Turmeric', 'గోధుమ': 'Wheat', 'సోయాబీన్': 'Soybean', 'శనగ': 'Bengal Gram', 'మామిడి': 'Mango' };
const ENGLISH_CROP_NAMES = ['Rice','Cotton','Maize','Groundnut','Sugarcane','Red Gram','Chilli','Turmeric','Wheat','Soybean','Bengal Gram','Mango'];
const TELUGU_CROP_ALIASES: Record<string, string> = { 'ధాన్యం': 'Rice', 'అన్నం': 'Rice', 'కర్రపత్తి': 'Cotton', 'జొన్న': 'Maize', 'శనగపప్పు': 'Bengal Gram', 'కందిపప్పు': 'Red Gram', 'మిర్చికాయ': 'Chilli', 'ఆమ్రం': 'Mango' };

export default function VoiceInput({ onResult }: VoiceInputProps) {
  const { t, language } = useLanguage(); const [listening, setListening] = useState(false); const [transcript, setTranscript] = useState('');
  const [detectedCrop, setDetectedCrop] = useState<string | null>(null);
  const [detectedAcres, setDetectedAcres] = useState<number | null>(null);

  const startListening = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert(language === 'te' ? 'మీ బ్రౌజర్ వాయిస్ సపోర్ట్ చేయదు' : 'Browser does not support voice input'); return; }
    const recognition = new SR(); recognition.lang = language === 'te' ? 'te-IN' : 'en-IN'; recognition.continuous = false; recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript; setTranscript(text);
      const result: VoiceInputResult = { raw_text: text };
      for (const [te, en] of Object.entries(TELUGU_CROP_MAP)) { if (text.includes(te)) { result.crop_name = en; break; } }
      if (!result.crop_name) { for (const [te, en] of Object.entries(TELUGU_CROP_ALIASES)) { if (text.includes(te)) { result.crop_name = en; break; } } }
      if (!result.crop_name) { for (const crop of ENGLISH_CROP_NAMES) { if (text.toLowerCase().includes(crop.toLowerCase())) { result.crop_name = crop; break; } } }
      const acreMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:acres?|ఎకరాలు|ఎకరం|ఎకర)/i); if (acreMatch) result.acres = parseFloat(acreMatch[1]);
      for (const pat of [/(?:in|at|near|లో|దగ్గర)\s+(\w+)/i]) { const m = text.match(pat); if (m) { result.location = m[1]; break; } }
      setDetectedCrop(result.crop_name || null);
      setDetectedAcres(result.acres || null);
      onResult(result);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = () => setListening(false); recognition.onend = () => setListening(false); recognition.start();
  }, [language, onResult]);

  const cropDisplay = detectedCrop ? (language === 'te' ? CROP_TE_NAMES[detectedCrop] : detectedCrop) : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-gray-600 bg-blue-50 px-4 py-3 rounded-xl"><Mic size={20} className="text-blue-600" /><span className="text-sm font-medium">{t('voice_instruction')}</span></div>
      <button onClick={startListening} disabled={listening} className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl text-xl font-bold transition-all duration-300 ${listening ? 'bg-red-500 text-white shadow-xl animate-pulse-slow' : 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-xl hover:scale-[1.02]'}`}>
        {listening ? <><MicOff size={28} />{t('listening')}</> : <><Mic size={28} />{t('press_to_speak')}</>}
      </button>
      {transcript && <div className="p-4 bg-gray-50 rounded-xl border border-gray-200"><p className="text-sm text-gray-500 mb-1">{language === 'te' ? 'గుర్తించిన వచనం:' : 'Recognized:'}</p><p className="text-gray-800 font-medium">{transcript}</p></div>}
      {cropDisplay && <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl"><CheckCircle size={20} className="text-green-600" /><span className="font-semibold text-green-700">{language === 'te' ? 'పంట గుర్తించబడింది: ' : 'Crop detected: '}{cropDisplay}{detectedAcres ? ` — ${detectedAcres} ${language === 'te' ? 'ఎకరాలు' : 'acres'}` : ''}</span></div>}
    </div>
  );
}
