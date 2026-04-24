'use client'

import { RootState } from '@/shared/store/store';
import { Marker as MapMarker } from 'react-bkoi-gl';
import { useSelector } from 'react-redux';
import { Circle, Square } from 'lucide-react';

export default function DirectionMarkers() {
  const { isDirectionMode, startLocation, endLocation } = useSelector((state: RootState) => state.location);

  if (!isDirectionMode) return null;

  return (
    <>
      {startLocation && startLocation.latitude && startLocation.longitude && (
        <MapMarker 
          latitude={Number(startLocation.latitude)} 
          longitude={Number(startLocation.longitude)}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border-2 border-gray-400">
             <Circle size={14} className="text-gray-600 fill-gray-600" />
          </div>
        </MapMarker>
      )}

      {endLocation && endLocation.latitude && endLocation.longitude && (
        <MapMarker 
          latitude={Number(endLocation.latitude)} 
          longitude={Number(endLocation.longitude)}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border-2 border-blue-500">
             <Square size={14} className="text-blue-600 fill-blue-600" />
          </div>
        </MapMarker>
      )}
    </>
  );
}
