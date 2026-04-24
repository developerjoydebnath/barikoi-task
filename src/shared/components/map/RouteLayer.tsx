'use client'

import { RootState } from '@/shared/store/store';
import { Layer, Source } from 'react-bkoi-gl';
import { useSelector } from 'react-redux';

export default function RouteLayer() {
  const { routeData, isDirectionMode } = useSelector((state: RootState) => state.location);

  if (!isDirectionMode || !routeData) return null;

  const geojson = {
    type: 'Feature' as const,
    properties: {},
    geometry: routeData
  };

  return (
    <Source id="route-source" type="geojson" data={geojson}>
      <Layer
        id="route-layer"
        type="line"
        layout={{
          'line-join': 'round',
          'line-cap': 'round'
        }}
        paint={{
          'line-color': '#3b82f6', // Tailwind blue-500
          'line-width': 6,
          'line-opacity': 0.8
        }}
      />
      {/* Outer border for the line to make it look better */}
      <Layer
        id="route-layer-outline"
        type="line"
        layout={{
          'line-join': 'round',
          'line-cap': 'round'
        }}
        paint={{
          'line-color': '#2563eb', // Tailwind blue-600
          'line-width': 2,
          'line-opacity': 1
        }}
      />
    </Source>
  );
}
