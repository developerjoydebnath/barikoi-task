'use client'

import { useGetLocationsQuery } from "@/shared/features/locations/locationApi";
import { Loader2, MapPin, Menu, Navigation, X } from "lucide-react";
import { useEffect, useState } from "react";
import { DebounceInput } from "@/shared/components/custom/DebounceInput";

// Interface for Barikoi Place
interface Place {
  id?: number;
  longitude?: string | number;
  latitude?: string | number;
  address?: string;
  address_bn?: string;
  city?: string;
  city_bn?: string;
  area?: string;
  area_bn?: string;
  postCode?: string | number;
  pType?: string;
  uCode?: string;
}

export default function SearchComponent() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (search.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [search]);

  const { data, isFetching, isError } = useGetLocationsQuery(search, {
    skip: search.length < 2,
  });

  const places: Place[] = (data?.places as Place[]) || [];

  return (
    <div className="absolute top-6 left-6 z-50 w-full bg-white max-w-[400px] flex flex-col shadow-lg rounded-2xl border border-gray-100 transition-all duration-300">
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
          onChange={setSearch}
          debounceTimeout={400}
          onFocus={() => {
            if (search.length > 0 || places.length > 0) setOpen(true);
          }}
        />

        {/* Action Buttons */}
        <div className="flex items-center pr-2 h-full gap-0.5">
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setOpen(false);
              }}
              className="flex items-center justify-center w-10 h-10 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={18} />
            </button>
          )}
          <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
          <button className="flex items-center justify-center w-10 h-10 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors">
            <Navigation size={18} className="rotate-45 relative right-[1px] bottom-[1px]" />
          </button>
        </div>
      </div>

      {/* location search results */}
      {open && (
        <div className="flex flex-col border-t border-gray-100 max-h-[400px] overflow-y-auto w-full pb-2">
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

          {!isFetching && !isError && places.map((place) => (
            <button
              key={place.id}
              className="group flex items-start px-4 py-3 hover:bg-gray-50 transition-colors w-full text-left border-b border-gray-50 last:border-0"
              onClick={() => {
                // Handle place selection
                setSearch(place.address || "");
                setOpen(false);
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
        </div>
      )}
    </div>
  )
}
