'use client'

import { MapComponentProps } from '@/shared/types/types';
import { FullscreenControl, GeolocateControl, Map as MapContainer, NavigationControl, ScaleControl } from 'react-bkoi-gl';
import Marker from './Marker';

export default function Map({ zoom = 12, center = [90.3938010872331, 23.821600277500405], onClick }: MapComponentProps) {
  return (
    <MapContainer
      mapStyle="/api/map/load/styles/barikoi-light/style.json"
      initialViewState={{
        longitude: center[0],
        latitude: center[1],
        zoom,
      }}
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
