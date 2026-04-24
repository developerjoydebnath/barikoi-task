'use client'

import { RootState } from '@/shared/store/store';
import { MapComponentProps } from '@/shared/types/types';
import { getDistance } from '@/shared/utils/getDistance';
import { getDuration } from '@/shared/utils/getDuration';
import { useEffect, useState } from 'react';
import { FullscreenControl, GeolocateControl, Map as MapContainer, NavigationControl, ScaleControl, useMap } from 'react-bkoi-gl';
import { useSelector } from 'react-redux';
import DirectionMarkers from './DirectionMarkers';
import Marker from './Marker';
import RouteLayer from './RouteLayer';

export default function Map({ zoom = 12, center = [90.3938010872331, 23.821600277500405], onClick }: MapComponentProps) {
  const { selectedLocation, isDirectionMode } = useSelector((state: RootState) => state.location);
  const { current: map } = useMap();

  const [viewState, setViewState] = useState({
    longitude: center[0],
    latitude: center[1],
    zoom: zoom,
  });

  const lat = selectedLocation?.latitude ? Number(selectedLocation.latitude) : null;
  const lng = selectedLocation?.longitude ? Number(selectedLocation.longitude) : null;

  const { routeData } = useSelector((state: RootState) => state.location);

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

  return (
    <MapContainer
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      mapStyle="/api/map/load/styles/barikoi-light/style.json"
      onClick={onClick}
    >
      {!isDirectionMode && <Marker />}
      <DirectionMarkers />
      <RouteLayer />
      <FullscreenControl position='bottom-right' />
      <NavigationControl position='bottom-right' />
      <GeolocateControl
        positionOptions={{ enableHighAccuracy: true }}
        showUserLocation={true}
        showAccuracyCircle={false}
        onGeolocate={(e) => flyTo(e.coords.latitude, e.coords.longitude)}
        position='bottom-right'
      />
      <ScaleControl position='bottom-left' />
    </MapContainer>
  )
}
