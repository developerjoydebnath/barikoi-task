'use client'

import { useGetLocationsQuery, useGetReverseGeocodeQuery } from "@/modules/map/features/locationApi";
import { resetDirection, setActiveInput, setDirectionMode, setEndLocation, setOpen, setSearchedText, setSelectedLocation, setStartLocation } from "@/modules/map/features/locationSlice";
import useOutsideClick from "@/shared/hooks/useOutSideClick";
import { RootState } from "@/shared/store/store";
import { Place } from "@/shared/types/types";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DirectionModeInput from "./DirectionModeInput";
import SearchModeInput from "./SearchModeInput";
import SearchResults from "./SearchResults";

export default function SearchComponent() {
  const { open, selectedLocation, searchedText, isDirectionMode, activeInput } = useSelector((state: RootState) => state.location);
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

  // place selection
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
        <SearchModeInput toggleDirectionMode={toggleDirectionMode} search={search} setSearch={setSearch} />
      ) : (
        <DirectionModeInput toggleDirectionMode={toggleDirectionMode} search={search} setSearch={setSearch} />
      )}

      {/* location search results */}
      {open && (
        <SearchResults
          isFetching={isFetching}
          isError={isError}
          places={places}
          search={search}
          activeInput={activeInput}
          handleSelectPlace={handleSelectPlace}
        />
      )}
    </div>
  )
}
