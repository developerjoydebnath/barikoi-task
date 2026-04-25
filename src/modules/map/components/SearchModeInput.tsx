'use client'

import { setOpen, setSearchedText, setSelectedLocation } from '@/modules/map/features/locationSlice';
import { DebounceInput } from '@/shared/components/custom/DebounceInput';
import { RootState } from '@/shared/store/store';
import { CornerUpRight, Search, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchModeInputProps } from '../types/map.types';


export default function SearchModeInput({ toggleDirectionMode, search, setSearch }: SearchModeInputProps) {
  const dispatch = useDispatch();
  const { selectedLocation } = useSelector((state: RootState) => state.location);

  return (
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
  )
}
