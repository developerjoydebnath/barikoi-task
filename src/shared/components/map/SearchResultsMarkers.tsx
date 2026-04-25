'use client'

import { setSearchedText, setSelectedLocation } from '@/modules/map/features/locationSlice';
import { RootState } from '@/shared/store/store';
import { Place } from '@/shared/types/types';
import * as React from 'react';
import { Marker as MapMarker, MarkerEvent, Popup } from 'react-bkoi-gl';
import { useDispatch, useSelector } from 'react-redux';

export default function SearchResultsMarkers() {
  const { searchResults, isDirectionMode } = useSelector((state: RootState) => state.location);
  const dispatch = useDispatch();

  if (isDirectionMode || !searchResults || searchResults.length === 0) {
    return null;
  }

  const handleMarkerClick = (e: MarkerEvent<MouseEvent>, place: Place) => {
    e.originalEvent.stopPropagation();

    // Set this place as the selected location
    dispatch(setSelectedLocation(place));

    // Update the search input text
    if (place.address) {
      dispatch(setSearchedText(place.address));
    }

    // Note: searchResults is automatically cleared in the setSelectedLocation reducer
  };

  return (
    <>
      {searchResults.map((place, index) => {
        const lat = place.latitude !== undefined && place.latitude !== null ? Number(place.latitude) : null;
        const lng = place.longitude !== undefined && place.longitude !== null ? Number(place.longitude) : null;

        if (lat === null || lng === null || isNaN(lat) || isNaN(lng)) return null;

        return (
          <React.Fragment key={place.id || `${lat}-${lng}-${index}`}>
            <MapMarker
              longitude={lng}
              latitude={lat}
              color="blue"
              onClick={(e) => handleMarkerClick(e, place)}
            />
            <Popup
              anchor='bottom'
              offset={38}
              longitude={lng}
              latitude={lat}
              closeButton={false}
              closeOnClick={false}
              className="cursor-pointer z-10"
            >
              <div
                className="flex flex-col text-sm max-w-[150px] cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => {
                  handleMarkerClick({ originalEvent: { stopPropagation: () => { } } } as MarkerEvent<MouseEvent>, place);
                }}
              >
                <span className="font-semibold text-gray-800 truncate">{place.address}</span>
              </div>
            </Popup>
          </React.Fragment>
        );
      })}
    </>
  );
}
