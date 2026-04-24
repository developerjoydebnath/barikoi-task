'use client'

import * as React from 'react';
import { Marker as MapMarker, MarkerEvent, Popup } from 'react-bkoi-gl';

export default function Marker() {
  const [open, setOpen] = React.useState(false);

  // marker click handler
  const onMarkerClick = (e: MarkerEvent<MouseEvent>) => {
    e.originalEvent.stopPropagation();
    setOpen(true);
  }


  return (
    <>
      <MapMarker onClick={onMarkerClick} longitude={90.3938010872331} latitude={23.821600277500405} color="red" />
      {open && <Popup anchor='bottom' offset={38} longitude={90.3938010872331} latitude={23.821600277500405} onClose={() => setOpen(false)}>
        Hello, Barikoi!
      </Popup>}
    </>
  )
}
