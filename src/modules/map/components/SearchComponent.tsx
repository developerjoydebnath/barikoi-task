'use client'

import { DebounceInput } from "@/shared/components/custom/DebounceInput";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { useGetLocationsQuery, useGetReverseGeocodeQuery } from "@/shared/features/locations/locationApi";
import { setOpen, setSearchedText, setSelectedLocation } from "@/shared/features/locations/locationSlice";
import useOutsideClick from "@/shared/hooks/useOutSideClick";
import { RootState } from "@/shared/store/store";
import { Place } from "@/shared/types/types";
import { Loader2, MapPin, Menu, X } from "lucide-react";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function SearchComponent() {
  const { open, selectedLocation } = useSelector((state: RootState) => state.location);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useOutsideClick(containerRef, () => {
    if (open) {
      dispatch(setOpen(false));
    }
  });

  // check if search query is valid latitude and longitude
  const latLngMatch = search.trim().match(/^([+-]?\d{1,2}(?:\.\d+)?)\s*[, ]\s*([+-]?\d{1,3}(?:\.\d+)?)$/);
  const isLatLng = !!latLngMatch;
  const lat = isLatLng ? latLngMatch[1] : "";
  const lng = isLatLng ? latLngMatch[2] : "";

  // get autocomplete results
  const { data: autoCompleteData, isFetching: isFetchingAuto, isError: isErrorAuto } = useGetLocationsQuery(search, {
    skip: isLatLng || search.length < 2,
  });

  // get reverse geocode results
  const { data: reverseGeocodeData, isFetching: isFetchingReverse, isError: isErrorReverse } = useGetReverseGeocodeQuery(
    { lat, lng },
    { skip: !isLatLng }
  );


  // handle fetching and error states
  const isFetching = isLatLng ? isFetchingReverse : isFetchingAuto;
  const isError = isLatLng ? isErrorReverse : isErrorAuto;

  // handle places
  const places: Place[] = isLatLng
    ? (reverseGeocodeData?.place ? [reverseGeocodeData.place] : [])
    : (autoCompleteData?.places || []);

  return (
    <div ref={containerRef} className="absolute top-6 left-6 z-50 w-full bg-white max-w-[400px] flex flex-col shadow-lg rounded-2xl border border-gray-100 transition-all duration-300">
      {/* Google Maps Style Search Box */}
      <div className="relative flex items-center w-full h-14 rounded-2xl overflow-hidden shrink-0">
        {/* Menu Button */}
        <button className="flex items-center justify-center w-14 h-full text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
          <Menu size={22} />
        </button>

        {/* Input Field */}
        <DebounceInput
          type="text"
          placeholder="Search Barikoi Maps"
          className="flex-1 h-full px-1 text-[15px] outline-none text-gray-800 placeholder:text-gray-500 font-sans bg-transparent"
          value={search}
          onChange={(val) => {
            setSearch(val);
            dispatch(setSearchedText(val));
          }}
          debounceTimeout={400}
          onInput={() => {
            if (selectedLocation) {
              dispatch(setSelectedLocation(null));
            }
            dispatch(setOpen(true));
          }}
          onFocus={() => {
            if (!selectedLocation && search.length > 0) {
              dispatch(setOpen(true));
            }
          }}
        />

        {/* Action Buttons */}
        <div className="flex items-center pr-2 h-full gap-0.5">
          {search && (
            <button
              onClick={() => {
                setSearch("");
                dispatch(setSearchedText(""));
                dispatch(setSelectedLocation(null));
                dispatch(setOpen(false));
              }}
              className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* location search results */}
      {open && (
        <ScrollArea className="flex flex-col border-t border-gray-100 max-h-[400px] overflow-y-auto w-full pb-2">
          {isFetching && (
            <div className="flex items-center justify-center p-6 text-gray-500">
              <Loader2 className="animate-spin" size={24} />
            </div>
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
              onClick={() => {
                // Handle place selection
                setSearch(place.address || "");
                dispatch(setSearchedText(place.address || ""));
                dispatch(setSelectedLocation(place));
                dispatch(setOpen(false));
              }}
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
      )}
    </div>
  )
}
