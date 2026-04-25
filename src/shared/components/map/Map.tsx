'use client'

import { useLazyGetReverseGeocodeQuery } from '@/modules/map/features/locationApi';
import { setActiveInput, setEndLocation, setOpen, setStartLocation } from '@/modules/map/features/locationSlice';
import { RootState } from '@/shared/store/store';
import { MapComponentProps } from '@/shared/types/types';
import { getDistance } from '@/shared/utils/getDistance';
import { getDuration } from '@/shared/utils/getDuration';
import { useEffect, useState } from 'react';
import { FullscreenControl, GeolocateControl, Map as MapContainer, NavigationControl, ScaleControl, useMap } from 'react-bkoi-gl';
import { useDispatch, useSelector } from 'react-redux';
import DirectionMarkers from './DirectionMarkers';
import Marker from './Marker';
import RouteLayer from './RouteLayer';
import SearchResultsMarkers from './SearchResultsMarkers';

export default function Map({ zoom = 12, center = [90.3938010872331, 23.821600277500405], onClick }: MapComponentProps) {
  const { selectedLocation, isDirectionMode, activeInput } = useSelector((state: RootState) => state.location);
  const { current: map } = useMap();
  const dispatch = useDispatch();
  const [triggerReverseGeocode] = useLazyGetReverseGeocodeQuery();

  const [viewState, setViewState] = useState({
    longitude: center[0],
    latitude: center[1],
    zoom: zoom,
  });

  const lat = selectedLocation?.latitude ? Number(selectedLocation.latitude) : null;
  const lng = selectedLocation?.longitude ? Number(selectedLocation.longitude) : null;

  const { routeData, searchResults } = useSelector((state: RootState) => state.location);

  // Fit bounds when search results are available
  useEffect(() => {
    if (searchResults && searchResults.length > 0 && map && !isDirectionMode) {
      let minLng = 180, minLat = 90, maxLng = -180, maxLat = -90;
      let hasValidCoords = false;

      searchResults.forEach(place => {
        const lat = Number(place.latitude);
        const lng = Number(place.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          hasValidCoords = true;
          if (lng < minLng) minLng = lng;
          if (lng > maxLng) maxLng = lng;
          if (lat < minLat) minLat = lat;
          if (lat > maxLat) maxLat = lat;
        }
      });

      if (hasValidCoords) {
        map.fitBounds(
          [[minLng, minLat], [maxLng, maxLat]],
          { padding: 100, duration: 2000 }
        );
      }
    }
  }, [searchResults, map, isDirectionMode]);

  // Fit bounds when route data is available
  useEffect(() => {
    if (routeData && map && routeData.coordinates && routeData.coordinates.length > 0) {
      const coords = routeData.coordinates;
      let minLng = coords[0][0];
      let minLat = coords[0][1];
      let maxLng = coords[0][0];
      let maxLat = coords[0][1];

      for (const [lng, lat] of coords) {
        if (lng < minLng) minLng = lng;
        if (lng > maxLng) maxLng = lng;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      }

      map.fitBounds(
        [[minLng, minLat], [maxLng, maxLat]],
        { padding: 100, duration: 2000 }
      );
    }
  }, [routeData, map]);


  const flyTo = (lat: number, lng: number) => {
    if (!map) return;

    const currentCenter = map.getCenter();

    const distance = getDistance(
      currentCenter.lat,
      currentCenter.lng,
      lat,
      lng
    );

    const duration = getDuration(distance);

    map.flyTo({
      center: [lng, lat],
      duration,
      essential: true,
      zoom: 18,
    });
  };

  // sync map view when selectedLocation changes with smooth transition
  useEffect(() => {
    if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && map) {
      flyTo(lat, lng);
    }
  }, [lat, lng, map]);

  // Handle geolocate event
  const handleGeoLocate = async (e: GeolocationPosition) => {
    const lat = e.coords.latitude;
    const lng = e.coords.longitude;
    flyTo(lat, lng);

    if (isDirectionMode && activeInput) {
      const preliminaryPlace = {
        latitude: lat,
        longitude: lng,
        address: "My Location"
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
        const response = await triggerReverseGeocode({
          lat: lat.toString(),
          lng: lng.toString()
        }).unwrap();

        if (response && response.place) {
          const finalPlace = {
            ...response.place,
            latitude: lat,
            longitude: lng,
            address: response.place.address || "My Location"
          };

          if (activeInput === 'start') {
            dispatch(setStartLocation(finalPlace));
          } else {
            dispatch(setEndLocation(finalPlace));
          }
        }
      } catch (err) {
        console.error("Geolocate update failed:", err);
      }
    }
  }

  return (
    <MapContainer
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      mapStyle="/api/map/load/styles/barikoi-light/style.json"
      onClick={onClick}
    >
      {!isDirectionMode && <Marker />}
      {!isDirectionMode && <SearchResultsMarkers />}
      <DirectionMarkers />
      <RouteLayer />
      <FullscreenControl position='bottom-right' />
      <NavigationControl position='bottom-right' />
      <GeolocateControl
        positionOptions={{ enableHighAccuracy: true }}
        showUserLocation={true}
        showAccuracyCircle={false}
        onGeolocate={handleGeoLocate}
        position='bottom-right'
      />
      <ScaleControl position='bottom-left' />
    </MapContainer>
  )
}
