'use client'

import Map from '@/shared/components/map/Map';
import { useLazyGetReverseGeocodeQuery, useLazyGetRouteOverviewQuery } from '@/shared/features/locations/locationApi';
import { setActiveInput, setEndLocation, setOpen, setRouteData, setRouteInfo, setSearchedText, setSelectedLocation, setStartLocation } from '@/shared/features/locations/locationSlice';
import { RootState } from '@/shared/store/store';
import { LineStringGeometry } from '@/shared/types/types';
import { useEffect } from 'react';
import { MapLayerMouseEvent, MapProvider } from 'react-bkoi-gl';
import { useDispatch, useSelector } from 'react-redux';

export default function MapWrapper() {
  const dispatch = useDispatch();
  const { isDirectionMode, activeInput, startLocation, endLocation } = useSelector((state: RootState) => state.location);
  const [triggerGeocode] = useLazyGetReverseGeocodeQuery();
  const [triggerRoute] = useLazyGetRouteOverviewQuery();

  // map on click handler
  const handleMapClick = async (e: MapLayerMouseEvent) => {
    const lat = e.lngLat.lat;
    const lng = e.lngLat.lng;
    const initialText = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;

    if (isDirectionMode && activeInput) {
      const preliminaryPlace = {
        latitude: lat,
        longitude: lng,
        address: initialText
      };

      if (activeInput === 'start') {
        dispatch(setStartLocation(preliminaryPlace));
        dispatch(setActiveInput('end'));
      } else {
        dispatch(setEndLocation(preliminaryPlace));
        dispatch(setActiveInput(null));
      }
      dispatch(setOpen(false));

      try {
        const response = await triggerGeocode({ lat: lat.toString(), lng: lng.toString() }, true).unwrap();
        if (response && response.place) {
          const finalPlace = { ...response.place, latitude: lat, longitude: lng };
          if (activeInput === 'start') {
            dispatch(setStartLocation(finalPlace));
          } else {
            dispatch(setEndLocation(finalPlace));
          }
        }
      } catch (err) {
        console.error("Geocode failed:", err);
      }
    } else if (!isDirectionMode) {
      // Immediately set a "preliminary" location so marker and map update instantly
      dispatch(setSearchedText(initialText));
      dispatch(setSelectedLocation({
        latitude: lat,
        longitude: lng,
        address: initialText
      }));
      dispatch(setOpen(false));

      try {
        // Trigger reverse geocode API call for address info
        const response = await triggerGeocode({ lat: lat.toString(), lng: lng.toString() }, true).unwrap();

        if (response && response.place) {
          const place = response.place;
          // Update with full place data (including address)
          dispatch(setSearchedText(place.address || initialText));
          dispatch(setSelectedLocation({
            ...place,
            latitude: lat,
            longitude: lng
          }));
        }
      } catch (error) {
        console.error("Reverse geocoding failed:", error);
      }
    }
  }

  // Fetch route when both points are available
  useEffect(() => {
    const fetchRoute = async () => {
      if (isDirectionMode && startLocation?.latitude && endLocation?.latitude) {
        const start = `${startLocation.longitude},${startLocation.latitude}`;
        const end = `${endLocation.longitude},${endLocation.latitude}`;

        try {
          const res = await triggerRoute({
            start,
            end,
            profile: 'car',
            geometries: 'geojson'
          }).unwrap();

          if (res && res.routes && res.routes.length > 0) {
            const route = res.routes[0];
            dispatch(setRouteData(route.geometry as LineStringGeometry));
            dispatch(setRouteInfo({
              distance: route.distance || 0,
              duration: route.duration || 0
            }));
          }
        } catch (err) {
          console.error("Route fetch failed:", err);
        }
      }
    };

    fetchRoute();
  }, [startLocation, endLocation, isDirectionMode, triggerRoute, dispatch]);

  return (
    <div className="h-screen w-screen">
      <MapProvider>
        <Map onClick={handleMapClick} />
      </MapProvider>
    </div>
  )
}
