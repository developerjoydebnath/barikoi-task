'use client'

import { RootState } from '@/shared/store/store';
import { MapComponentProps } from '@/shared/types/types';
import { useEffect, useRef, useState } from 'react';
import { FullscreenControl, GeolocateControl, Map as MapContainer, MapRef, NavigationControl, ScaleControl } from 'react-bkoi-gl';
import { useSelector } from 'react-redux';
import Marker from './Marker';

export default function Map({ zoom = 12, center = [90.3938010872331, 23.821600277500405], onClick }: MapComponentProps) {
  const { selectedLocation } = useSelector((state: RootState) => state.location);
  const mapRef = useRef<MapRef>(null);

  const [viewState, setViewState] = useState({
    longitude: center[0],
    latitude: center[1],
    zoom: zoom,
  });

  const lat = selectedLocation?.latitude ? Number(selectedLocation.latitude) : null;
  const lng = selectedLocation?.longitude ? Number(selectedLocation.longitude) : null;

  // sync map view when selectedLocation changes with smooth transition
  useEffect(() => {
    if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng)) {
      mapRef.current?.flyTo({
        center: [lng, lat],
        duration: 2000,
        essential: true
      });
    }
  }, [lat, lng]);

  return (
    <MapContainer
      {...viewState}
      ref={mapRef}
      onMove={evt => setViewState(evt.viewState)}
      mapStyle="/api/map/load/styles/barikoi-light/style.json"
      onClick={onClick}
    >
      <Marker />
      <FullscreenControl position='bottom-right' />
      <NavigationControl position='bottom-right' />
      <GeolocateControl position='bottom-right' />
      <ScaleControl position='bottom-left' />
    </MapContainer>
  )
}
