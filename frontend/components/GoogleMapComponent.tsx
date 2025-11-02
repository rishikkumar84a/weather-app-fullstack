'use client';

import { useEffect, useRef } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

interface GoogleMapComponentProps {
  lat: number;
  lon: number;
  city: string;
}

export default function GoogleMapComponent({ lat, lon, city }: GoogleMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !lat || !lon) return;

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);

    function initMap() {
      if (!mapRef.current) return;

      const position = { lat, lng: lon };
      
      const map = new (window as any).google.maps.Map(mapRef.current, {
        zoom: 12,
        center: position,
      });

      new (window as any).google.maps.Marker({
        position: position,
        map: map,
        title: city,
      });
    }

    return () => {
      const scripts = document.querySelectorAll(`script[src*="maps.googleapis.com"]`);
      scripts.forEach(script => script.remove());
    };
  }, [lat, lon, city]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FaMapMarkerAlt className="text-green-600" />
        Location Map
      </h2>
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg overflow-hidden border border-gray-200"
      />
      <div className="mt-3 text-sm text-gray-600">
        <span className="font-medium">Coordinates:</span> {lat.toFixed(4)}, {lon.toFixed(4)}
      </div>
    </div>
  );
}
