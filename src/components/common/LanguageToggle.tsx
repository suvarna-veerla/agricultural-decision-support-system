import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  return (
    <button onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-sm font-medium">
      <Globe size={16} /> <span>{language === 'en' ? 'తెలుగు' : 'English'}</span>
    </button>
  );
}
