'use client'

import { ScrollArea } from '@/shared/components/ui/scroll-area'
import { Loader2, MapPin, Navigation } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { useLazyGetReverseGeocodeQuery } from '../features/locationApi'
import { setActiveInput, setEndLocation, setOpen, setStartLocation } from '../features/locationSlice'
import { SearchResultsProps } from '../types/map.types'

export default function SearchResults({ isFetching, isError, places, search, activeInput, handleSelectPlace }: SearchResultsProps) {
  const [isLocating, setIsLocating] = React.useState(false);
  const [triggerReverseGeocode] = useLazyGetReverseGeocodeQuery();
  const dispatch = useDispatch();

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        // Set preliminary location
        const preliminaryPlace = {
          latitude,
          longitude,
          address: "My Location",
        };

        if (activeInput === "start") {
          dispatch(setStartLocation(preliminaryPlace));
          dispatch(setActiveInput("end"));
        } else if (activeInput === "end") {
          dispatch(setEndLocation(preliminaryPlace));
          dispatch(setActiveInput(null));
        }

        dispatch(setOpen(false));
        setIsLocating(false);

        try {
          const response = await triggerReverseGeocode({
            lat: latitude.toString(),
            lng: longitude.toString()
          }).unwrap();

          if (response && response.place) {
            const finalPlace = {
              ...response.place,
              latitude,
              longitude,
              address: response.place.address || "My Location"
            };

            if (activeInput === "start") {
              dispatch(setStartLocation(finalPlace));
            } else if (activeInput === "end") {
              dispatch(setEndLocation(finalPlace));
            }
          }
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
        }
      },
      (error) => {
        setIsLocating(false);
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location");
      },
      { enableHighAccuracy: true }
    );
  };
  return (
    <ScrollArea className="flex flex-col border-t border-gray-100 max-h-[400px] overflow-y-auto w-full pb-2">
      {isLocating && (
        <div className="flex items-center justify-center p-6 text-gray-500">
          <Loader2 className="animate-spin mr-2" size={20} />
          <span className="text-sm">Locating...</span>
        </div>
      )}

      {isFetching && !isLocating && (
        <div className="flex items-center justify-center p-6 text-gray-500">
          <Loader2 className="animate-spin" size={24} />
        </div>
      )}

      {!isFetching && !isLocating && (activeInput === 'start' || activeInput === 'end') && search.length === 0 && (
        <button
          className="group flex items-start px-4 py-3 hover:bg-gray-50 transition-colors w-full text-left border-b border-gray-50 last:border-0"
          onClick={handleUseMyLocation}
        >
          <div className="flex items-center justify-center mt-1 w-8 h-8 rounded-full bg-blue-50 text-blue-600 shrink-0 mr-3 group-hover:bg-blue-100 transition-colors">
            <Navigation size={16} className="fill-blue-600" />
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-[15px] font-medium text-blue-600 truncate">
              Your location
            </span>
            <span className="text-[12px] text-gray-400 truncate">
              Use current GPS location
            </span>
          </div>
        </button>
      )}

      {!isFetching && isError && (
        <div className="flex items-center justify-center p-6 text-red-500 text-sm">
          Failed to load locations. Please try again.
        </div>
      )}

      {!isFetching && !isError && search.length > 0 && places.length === 0 && search.length >= 2 && (
        <div className="flex items-center justify-center p-6 text-gray-500 text-sm">
          No locations found for &quot;{search}&quot;
        </div>
      )}

      {!isFetching && !isError && search.length < 2 && search.length > 0 && (
        <div className="flex items-center justify-center p-6 text-gray-500 text-sm">
          Type at least 2 characters to search
        </div>
      )}

      {!isFetching && !isError && places.map((place, index) => (
        <button
          key={place.id || `${place.latitude}-${place.longitude}-${index}`}
          className="group flex items-start px-4 py-3 hover:bg-gray-50 transition-colors w-full text-left border-b border-gray-50 last:border-0"
          onClick={() => handleSelectPlace(place)}
        >
          <div className="flex items-center justify-center mt-1 w-8 h-8 rounded-full bg-gray-100 text-gray-500 shrink-0 mr-3 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <MapPin size={16} />
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-[15px] font-medium text-gray-800 truncate">
              {place.address}
            </span>
            <span className="text-[13px] text-gray-500 truncate mt-0.5">
              {[place.area, place.city].filter(Boolean).join(", ")}
            </span>
          </div>
        </button>
      ))}
    </ScrollArea>
  )
}
