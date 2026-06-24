import { useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { MapPin } from 'lucide-react';
import L from 'leaflet';

interface FarmMapProps { latitude: number; longitude: number; onLocationSelect: (lat: number, lng: number) => void; }

export default function FarmMap({ latitude, longitude, onLocationSelect }: FarmMapProps) {
  const { t } = useLanguage(); const mapRef = useRef<HTMLDivElement>(null); const mapInstance = useRef<L.Map | null>(null); const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
    mapInstance.current = L.map(mapRef.current).setView([16.5, 80.5], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 18 }).addTo(mapInstance.current);
    mapInstance.current.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng; onLocationSelect(lat, lng);
      if (markerRef.current) markerRef.current.setLatLng([lat, lng]); else markerRef.current = L.marker([lat, lng]).addTo(mapInstance.current!);
    });
    if (latitude && longitude) { markerRef.current = L.marker([latitude, longitude]).addTo(mapInstance.current); mapInstance.current.setView([latitude, longitude], 12); }
    return () => { if (mapInstance.current) { mapInstance.current.remove(); mapInstance.current = null; markerRef.current = null; } };
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !latitude || !longitude) return;
    if (markerRef.current) markerRef.current.setLatLng([latitude, longitude]); else markerRef.current = L.marker([latitude, longitude]).addTo(mapInstance.current);
    mapInstance.current.setView([latitude, longitude], 12);
  }, [latitude, longitude]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-gray-600 bg-amber-50 px-4 py-3 rounded-xl"><MapPin size={20} className="text-amber-600" /><span className="text-sm font-medium">{t('map_instruction')}</span></div>
      <div ref={mapRef} className="w-full h-80 md:h-96 rounded-xl overflow-hidden border-2 border-gray-200 shadow-inner" />
      {latitude && longitude && <div className="flex gap-3 text-sm text-gray-600"><span className="px-3 py-1.5 bg-gray-100 rounded-lg">Lat: {latitude.toFixed(4)}</span><span className="px-3 py-1.5 bg-gray-100 rounded-lg">Lng: {longitude.toFixed(4)}</span></div>}
    </div>
  );
}
