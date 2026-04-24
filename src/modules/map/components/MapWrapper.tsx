'use client'

import Map from '@/shared/components/map/Map';
import { useLazyGetReverseGeocodeQuery } from '@/shared/features/locations/locationApi';
import { setOpen, setSearchedText, setSelectedLocation } from '@/shared/features/locations/locationSlice';
import { MapLayerMouseEvent, MapProvider } from 'react-bkoi-gl';
import { useDispatch } from 'react-redux';

export default function MapWrapper() {
  const dispatch = useDispatch();
  const [trigger] = useLazyGetReverseGeocodeQuery();

  // map on click handler
  const handleMapClick = async (e: MapLayerMouseEvent) => {
    const lat = e.lngLat.lat;
    const lng = e.lngLat.lng;

    // Immediately set a "preliminary" location so marker and map update instantly
    const initialText = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    dispatch(setSearchedText(initialText));
    dispatch(setSelectedLocation({
      latitude: lat,
      longitude: lng,
      address: initialText
    }));
    dispatch(setOpen(false));

    try {
      // Trigger reverse geocode API call for address info
      const response = await trigger({ lat: lat.toString(), lng: lng.toString() }, true).unwrap();

      if (response && response.place) {
        const place = response.place;
        // Update with full place data (including address)
        dispatch(setSearchedText(place.address || initialText));
        dispatch(setSelectedLocation({
          ...place,
          // Ensure we keep the exact clicked coordinates if the API returns slightly shifted ones
          latitude: lat,
          longitude: lng
        }));
      }
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
    }
  }

  return (
    <div className="h-screen w-screen">
      <MapProvider>
        <Map onClick={handleMapClick} />
      </MapProvider>
    </div>
  )
}
