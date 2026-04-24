'use client'

import { RootState } from '@/shared/store/store';
import * as React from 'react';
import { Marker as MapMarker, MarkerEvent, Popup } from 'react-bkoi-gl';
import { useSelector } from 'react-redux';

export default function Marker() {
  const { selectedLocation } = useSelector((state: RootState) => state.location);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (selectedLocation) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [selectedLocation]);

  if (!selectedLocation || !selectedLocation.longitude || !selectedLocation.latitude) return null;

  const lat = Number(selectedLocation.latitude);
  const lng = Number(selectedLocation.longitude);

  // marker click handler
  const onMarkerClick = (e: MarkerEvent<MouseEvent>) => {
    e.originalEvent.stopPropagation();
    setOpen(true);
  }

  return (
    <>
      <MapMarker onClick={onMarkerClick} longitude={lng} latitude={lat} color="red" />
      {open && (
        <Popup anchor='bottom' offset={38} longitude={lng} latitude={lat} onClose={() => setOpen(false)}>
          <div className="flex flex-col text-sm min-w-[120px] max-w-[200px]">
            <span className="font-semibold text-gray-800">{selectedLocation.address}</span>
            <span className="text-gray-500 text-[11px] mt-0.5 leading-tight">
              {[selectedLocation.area, selectedLocation.city].filter(Boolean).join(", ")}
            </span>
          </div>
        </Popup>
      )}
    </>
  )
}
