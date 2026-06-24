import { useState, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Volume2, VolumeX } from 'lucide-react';

interface TeluguTTSProps { text: string; teluguText: string; }

export default function TeluguTTS({ text, teluguText }: TeluguTTSProps) {
  const { language, t } = useLanguage(); const [speaking, setSpeaking] = useState(false);

  const speak = useCallback(() => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const isTelugu = language === 'te';
    const u = new SpeechSynthesisUtterance(isTelugu ? teluguText : text);
    u.lang = isTelugu ? 'te-IN' : 'en-IN';
    u.rate = isTelugu ? 0.75 : 0.9;
    u.pitch = 1;
    u.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    // Try to find a matching voice: exact lang match first, then prefix match
    const preferredLang = isTelugu ? 'te' : 'en';
    const exactVoice = voices.find(v => v.lang === (isTelugu ? 'te-IN' : 'en-IN'));
    const prefixVoice = voices.find(v => v.lang.startsWith(preferredLang));
    // For Telugu, also try Hindi as fallback since it shares some phonetics
    const hindiFallback = isTelugu ? voices.find(v => v.lang.startsWith('hi')) : null;

    if (exactVoice) u.voice = exactVoice;
    else if (prefixVoice) u.voice = prefixVoice;
    else if (hindiFallback) u.voice = hindiFallback;

    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }, [language, text, teluguText]);

  const stop = useCallback(() => { window.speechSynthesis.cancel(); setSpeaking(false); }, []);

  return <button onClick={speaking ? stop : speak} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${speaking ? 'bg-red-100 text-red-700' : 'bg-primary-100 text-primary-700 hover:bg-primary-200'}`}>{speaking ? <VolumeX size={16} /> : <Volume2 size={16} />}{speaking ? t('speaking') : t('play_audio')}</button>;
}
