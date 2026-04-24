'use client'

import { RootState } from '@/shared/store/store';
import { MapComponentProps } from '@/shared/types/types';
import { getDistance } from '@/shared/utils/getDistance';
import { getDuration } from '@/shared/utils/getDuration';
import { useEffect, useState } from 'react';
import { FullscreenControl, GeolocateControl, Map as MapContainer, NavigationControl, ScaleControl, useMap } from 'react-bkoi-gl';
import { useSelector } from 'react-redux';
import Marker from './Marker';

export default function Map({ zoom = 12, center = [90.3938010872331, 23.821600277500405], onClick }: MapComponentProps) {
  const { selectedLocation } = useSelector((state: RootState) => state.location);
  const { current: map } = useMap();

  const [viewState, setViewState] = useState({
    longitude: center[0],
    latitude: center[1],
    zoom: zoom,
  });

  const lat = selectedLocation?.latitude ? Number(selectedLocation.latitude) : null;
  const lng = selectedLocation?.longitude ? Number(selectedLocation.longitude) : null;

  // sync map view when selectedLocation changes with smooth transition
  useEffect(() => {
    if (lat !== null && lng !== null && !isNaN(lat) && !isNaN(lng) && map) {
      const currentCenter = map.getCenter();

      // get selected location distance from current location
      const distance = getDistance(
        currentCenter.lat,
        currentCenter.lng,
        lat,
        lng
      );

      // get dynamic duration based on distance
      const dynamicDuration = getDuration(distance);


      // fly to selected location with smooth transition
      map.flyTo({
        center: [lng, lat],
        duration: dynamicDuration,
        essential: true,
        zoom: 18
      });
    }
  }, [lat, lng, map]);

  return (
    <MapContainer
      {...viewState}
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
