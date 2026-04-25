'use client'

import { useGetLocationsQuery, useGetReverseGeocodeQuery } from "@/modules/map/features/locationApi";
import { resetDirection, setActiveInput, setDirectionMode, setEndLocation, setOpen, setSearchedText, setSelectedLocation, setStartLocation } from "@/modules/map/features/locationSlice";
import { DebounceInput } from "@/shared/components/custom/DebounceInput";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import useOutsideClick from "@/shared/hooks/useOutSideClick";
import { RootState } from "@/shared/store/store";
import { Place } from "@/shared/types/types";
import { ArrowLeft, ArrowRightLeft, Circle, CornerUpRight, Loader2, MapPin, Search, Square, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function SearchComponent() {
  const { open, selectedLocation, searchedText, isDirectionMode, startLocation, endLocation, activeInput, distance, duration } = useSelector((state: RootState) => state.location);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync local state with redux searchedText
  useEffect(() => {
    if (searchedText !== undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearch(searchedText);
    }
  }, [searchedText]);

  // Handle mode switching
  const toggleDirectionMode = () => {
    if (isDirectionMode) {
      dispatch(resetDirection());
      setSearch("");
      dispatch(setSearchedText(""));
    } else {
      dispatch(setDirectionMode(true));
      setSearch("");
      dispatch(setSearchedText(""));

      if (selectedLocation) {
        dispatch(setStartLocation(selectedLocation));
        dispatch(setActiveInput("end"));
      } else {
        dispatch(setActiveInput("start"));
      }
    }
  };

  // close dropdown when clicking outside
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

  const handleSelectPlace = (place: Place) => {
    if (isDirectionMode) {
      if (activeInput === "start") {
        dispatch(setStartLocation(place));
        dispatch(setActiveInput("end"));
        setSearch("");
        dispatch(setSearchedText(""));
      } else {
        dispatch(setEndLocation(place));
        dispatch(setActiveInput(null));
        setSearch(place.address || "");
        dispatch(setSearchedText(place.address || ""));
      }
    } else {
      setSearch(place.address || "");
      dispatch(setSearchedText(place.address || ""));
      dispatch(setSelectedLocation(place));
    }
    dispatch(setOpen(false));
  };

  return (
    <div ref={containerRef} className={`absolute top-6 left-6 z-50 w-full bg-white max-w-[400px] flex flex-col shadow-lg rounded-2xl border border-gray-100 transition-all duration-300 ${isDirectionMode ? 'rounded-xl' : 'rounded-2xl'}`}>
      {!isDirectionMode ? (
        <div className="relative flex items-center w-full h-14 overflow-hidden shrink-0">
          <div className="flex items-center justify-center w-14 h-full text-gray-600 transition-colors z-40">
            <Search size={20} />
          </div>

          <DebounceInput
            type="text"
            placeholder="Search Barikoi Maps"
            className="flex-1 h-full px-1 text-[15px] outline-none text-gray-800 placeholder:text-gray-500 font-sans bg-transparent"
            value={search}
            onChange={(val) => {
              setSearch(val);
              dispatch(setSearchedText(val));
            }}
            debounceTimeout={500}
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
            <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
            <button
              onClick={toggleDirectionMode}
              className="flex items-center justify-center w-10 h-10 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
            >
              <CornerUpRight size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full p-4 gap-3">
          <div className="flex items-center gap-3">
            <button onClick={toggleDirectionMode} className="text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft size={22} />
            </button>
            <div className="flex-1 flex flex-col gap-2 relative">
              {/* Connection Line */}
              <div className="absolute left-[13px] top-[26px] bottom-[26px] w-[2px] border-l-2 border-dotted border-gray-300"></div>

              {/* Start Input */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 group focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Circle size={10} className="text-gray-400 fill-gray-400" />
                <DebounceInput
                  type="text"
                  placeholder="Choose start point..."
                  className="flex-1 h-10 bg-transparent text-sm outline-none text-gray-800"
                  value={activeInput === 'start' ? search : (startLocation?.address || "")}
                  onChange={(val) => {
                    if (activeInput === 'start') {
                      setSearch(val);
                      dispatch(setSearchedText(val));
                    }
                  }}
                  onFocus={() => {
                    dispatch(setActiveInput('start'));
                    setSearch(startLocation?.address || "");
                    dispatch(setOpen(true));
                  }}
                />
              </div>

              {/* End Input */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 group focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Square size={10} className="text-blue-600 fill-blue-600" />
                <DebounceInput
                  type="text"
                  placeholder="Choose destination..."
                  className="flex-1 h-10 bg-transparent text-sm outline-none text-gray-800"
                  value={activeInput === 'end' ? search : (endLocation?.address || "")}
                  onChange={(val) => {
                    if (activeInput === 'end') {
                      setSearch(val);
                      dispatch(setSearchedText(val));
                    }
                  }}
                  onFocus={() => {
                    dispatch(setActiveInput('end'));
                    setSearch(endLocation?.address || "");
                    dispatch(setOpen(true));
                  }}
                />
              </div>
            </div>
            <button className="text-gray-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 transition-all">
              <ArrowRightLeft size={20} className="rotate-90" />
            </button>
          </div>

          {/* Route Summary */}
          {distance !== null && duration !== null && (
            <div className="flex items-center gap-4 mt-1 px-1 py-1 animate-in fade-in slide-in-from-top-1 duration-300">
              <div className="flex items-center justify-between w-full gap-2">
                <span className="text-lg text-gray-500 font-medium">
                  {(distance / 1000).toFixed(1)} km
                </span>
                <span className="text-lg font-medium text-green-600">
                  {Math.round(duration / 60)} min
                </span>
              </div>
            </div>
          )}
        </div>
      )}

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
      )}
    </div>
  )
}
