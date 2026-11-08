import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import L from 'leaflet';
import {
  MapPin,
  Search,
  Filter,
  Navigation,
  ExternalLink,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Layers,
  List,
  Compass,
  X,
  Accessibility
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { filterFacilities, getLocalizedText, calculateDistanceKm } from '../utils/rules';
import type { Facility, FacilityCategory } from '../types';

export const FacilitiesPage: React.FC = () => {
  const { lang, t, facilities } = useApp();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'ALL'
  );
  const [selectedLocality, setSelectedLocality] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [activeFacility, setActiveFacility] = useState<Facility | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Categories list
  const categories: { key: string; label: string; color: string }[] = [
    { key: 'ALL', label: t('allCategories'), color: '#0f766e' },
    { key: 'bathing_ghat', label: 'Bathing Ghats', color: '#0284c7' },
    { key: 'hospital', label: 'Hospitals', color: '#e11d48' },
    { key: 'medical_camp', label: 'Medical Camps', color: '#ef4444' },
    { key: 'drinking_water', label: 'Drinking Water', color: '#06b6d4' },
    { key: 'public_toilet', label: 'Public Toilets', color: '#10b981' },
    { key: 'police_station', label: 'Police Stations', color: '#4338ca' },
    { key: 'help_desk', label: 'Help Desks', color: '#6366f1' },
    { key: 'bus_stop', label: 'Bus Terminals', color: '#d97706' },
    { key: 'parking_area', label: 'Parking Zones', color: '#3b82f6' },
    { key: 'food_assistance', label: 'Food (Annadanam)', color: '#059669' },
    { key: 'accessibility_assistance', label: 'Accessibility / Buggy', color: '#7c3aed' },
    { key: 'lost_found_desk', label: 'Lost & Found Camp', color: '#b45309' }
  ];

  // Distinct localities
  const localities = ['ALL', ...Array.from(new Set(facilities.map((f) => f.locality)))];

  const filteredFacilities = filterFacilities(
    facilities,
    query,
    selectedCategory,
    selectedLocality,
    lang
  );

  // Check URL selected param
  useEffect(() => {
    const selectedId = searchParams.get('selected');
    if (selectedId) {
      const match = facilities.find((f) => f.id === selectedId);
      if (match) {
        setActiveFacility(match);
      }
    }
  }, [searchParams, facilities]);

  // Request browser location
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your mobile browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setLocationError(null);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([coords.lat, coords.lng], 15);
          L.circleMarker([coords.lat, coords.lng], {
            radius: 8,
            color: '#2563eb',
            fillColor: '#60a5fa',
            fillOpacity: 0.9
          })
            .addTo(mapInstanceRef.current)
            .bindPopup('<b>Your Current Location</b>')
            .openPopup();
        }
      },
      (err) => {
        setLocationError(`Location request: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (viewMode !== 'map' || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Centered at Rajahmundry Godavari riverside (approx 17.001, 81.776)
      const map = L.map(mapContainerRef.current, {
        center: [17.002, 81.775],
        zoom: 14,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear previous markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add markers for filtered facilities
    filteredFacilities.forEach((fac) => {
      // Get category color
      const catObj = categories.find((c) => c.key === fac.category);
      const markerColor = catObj ? catObj.color : '#0f766e';

      // Custom SVG Leaflet icon
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="background-color: ${markerColor}; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -26]
      });

      const marker = L.marker([fac.latitude, fac.longitude], { icon: customIcon }).addTo(map);

      const name = getLocalizedText(fac.name, lang);
      const desc = getLocalizedText(fac.description, lang);

      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 12px; max-width: 220px;">
          <strong style="color: #0f172a; font-size: 13px;">${name}</strong>
          <div style="color: #64748b; font-size: 11px; margin-top: 2px;">${fac.locality}</div>
          <p style="margin: 4px 0; color: #334155;">${desc.slice(0, 90)}...</p>
          <div style="margin-top: 6px; padding-top: 4px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 9px; font-weight: bold; background: #fef3c7; color: #92400e; padding: 2px 4px; border-radius: 4px;">
              ${fac.verificationStatus}
            </span>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${fac.latitude},${fac.longitude}" target="_blank" rel="noreferrer" style="color: #0284c7; font-weight: bold; text-decoration: none; font-size: 11px;">
              Directions &rarr;
            </a>
          </div>
        </div>
      `);

      marker.on('click', () => {
        setActiveFacility(fac);
      });

      markersRef.current.push(marker);
    });

    if (filteredFacilities.length > 0 && markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds().pad(0.15), { maxZoom: 15 });
    }
  }, [viewMode, filteredFacilities, lang]);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-4">
      {/* Title & View Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900">
              {t('navFacilities')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover {filteredFacilities.length} facilities across Rajahmundry & Kovvur for Godavari Pushkaralu 2027.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* User Location */}
          <button
            onClick={requestLocation}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-colors"
            title={t('locationPermission')}
          >
            <Compass className="w-4 h-4 text-teal-600" />
            <span className="hidden xs:inline">My Location</span>
          </button>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'map' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List ({filteredFacilities.length})</span>
            </button>
          </div>
        </div>
      </div>

      {locationError && (
        <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 p-2.5 rounded-xl flex items-center justify-between">
          <span>{locationError}</span>
          <button onClick={() => setLocationError(null)} className="text-amber-900 font-bold ml-2">
            &times;
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Text Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search facility name, address, or street..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500 font-medium"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                &times;
              </button>
            )}
          </div>

          {/* Locality Selector */}
          <div className="flex items-center gap-2">
            <select
              value={selectedLocality}
              onChange={(e) => setSelectedLocality(e.target.value)}
              className="py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none text-slate-700 font-semibold focus:border-teal-500"
              aria-label="Filter by Locality"
            >
              <option value="ALL">All Localities</option>
              {localities
                .filter((l) => l !== 'ALL')
                .map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
            </select>

            {(query || selectedCategory !== 'ALL' || selectedLocality !== 'ALL') && (
              <button
                onClick={() => {
                  setQuery('');
                  setSelectedCategory('ALL');
                  setSelectedLocality('ALL');
                }}
                className="text-xs text-red-600 hover:text-red-700 font-bold px-2 py-2 whitespace-nowrap"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Category Pills (horizontal scroll on mobile) */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`text-xs whitespace-nowrap px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.key !== 'ALL' && (
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Map or List Grid */}
      {viewMode === 'map' ? (
        <div className="relative w-full h-[520px] rounded-3xl overflow-hidden border border-slate-200 shadow-md">
          <div ref={mapContainerRef} className="w-full h-full z-10" />

          {/* Quick float card at bottom if a facility is selected */}
          {activeFacility && (
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded">
                    {activeFacility.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    {activeFacility.verificationStatus}
                  </span>
                  {userLocation && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      ~{calculateDistanceKm(userLocation.lat, userLocation.lng, activeFacility.latitude, activeFacility.longitude)} km away
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                  {getLocalizedText(activeFacility.name, lang)}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1">
                  {activeFacility.address}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${activeFacility.latitude},${activeFacility.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{t('directions')}</span>
                </a>
                <button
                  onClick={() => setActiveFacility(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                  aria-label="Close float preview"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* List View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFacilities.length === 0 ? (
            <div className="col-span-full bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="font-bold text-slate-800">No facilities found matching your criteria</h3>
              <p className="text-xs">Try clearing some filters or searching for different keywords.</p>
            </div>
          ) : (
            filteredFacilities.map((fac) => (
              <div
                key={fac.id}
                onClick={() => setActiveFacility(fac)}
                className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:border-teal-500 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] uppercase font-bold text-teal-800 bg-teal-50 border border-teal-200/60 px-2 py-0.5 rounded">
                      {fac.category.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200/60 px-1.5 py-0.5 rounded">
                      {fac.verificationStatus}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                    {getLocalizedText(fac.name, lang)}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {getLocalizedText(fac.description, lang)}
                  </p>

                  <div className="mt-3 text-xs text-slate-600 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{fac.address} ({fac.locality})</span>
                    </div>
                    {fac.contactNumber && (
                      <div className="flex items-center gap-1.5 text-teal-700">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        <a
                          href={`tel:${fac.contactNumber}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:underline font-mono"
                        >
                          {fac.contactNumber}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  {userLocation && (
                    <span className="text-[11px] text-slate-500 font-mono">
                      ~{calculateDistanceKm(userLocation.lat, userLocation.lng, fac.latitude, fac.longitude)} km
                    </span>
                  )}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${fac.latitude},${fac.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="ml-auto inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700"
                  >
                    <span>{t('directions')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Facility Detailed Modal */}
      {activeFacility && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActiveFacility(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveFacility(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase bg-teal-100 text-teal-800 px-2.5 py-1 rounded-full">
                  {activeFacility.category.replace('_', ' ')}
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  {activeFacility.verificationStatus}
                </span>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {getLocalizedText(activeFacility.name, lang)}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {activeFacility.locality} • {activeFacility.address}
                </p>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                {getLocalizedText(activeFacility.description, lang)}
              </p>

              {activeFacility.accessibilityFeatures && activeFacility.accessibilityFeatures.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Accessibility className="w-4 h-4 text-purple-600" />
                    <span>Accessibility & Mobility Support:</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeFacility.accessibilityFeatures.map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-purple-50 text-purple-800 border border-purple-200/60 px-2.5 py-0.5 rounded-lg font-medium"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeFacility.capacityEstimated && (
                <div className="text-xs text-slate-600">
                  <strong>Estimated Capacity:</strong> {activeFacility.capacityEstimated}
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                <div>
                  <strong>Data Source:</strong> {activeFacility.source}
                </div>
                <div>
                  <strong>Status Notice:</strong> {activeFacility.isDemo ? 'DEMO DATA — NOT OFFICIAL' : 'Verified by District Administration'}
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${activeFacility.latitude},${activeFacility.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open Directions</span>
                </a>
                {activeFacility.contactNumber && (
                  <a
                    href={`tel:${activeFacility.contactNumber}`}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-teal-600" />
                    <span>Call</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
