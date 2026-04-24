'use client'

import Map from '@/shared/components/map/Map'
import { MapLayerMouseEvent } from 'react-bkoi-gl'

export default function MapWrapper() {

  // map on click handler
  const handleMapClick = (e: MapLayerMouseEvent) => {
    console.log(e.lngLat)
  }

  return (
    <div className="h-screen w-screen">
      <Map onClick={handleMapClick} />
    </div>
  )
}
