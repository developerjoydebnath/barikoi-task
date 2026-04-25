'use client'

import { setOpen, setSearchedText, setSelectedLocation } from '@/modules/map/features/locationSlice';
import { DebounceInput } from '@/shared/components/custom/DebounceInput';
import { Button } from '@/shared/components/ui/button';
import { RootState } from '@/shared/store/store';
import { CornerUpRight, Search, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchModeInputProps } from '../types/map.types';


export default function SearchModeInput({ toggleDirectionMode, search, setSearch, onSearch }: SearchModeInputProps) {
  const dispatch = useDispatch();
  const { selectedLocation } = useSelector((state: RootState) => state.location);

  return (
    <div className="relative flex items-center w-full h-14 overflow-hidden shrink-0">
      <DebounceInput
        type="text"
        placeholder="Search Barikoi Maps"
        className="flex-1 h-full w-full px-4 text-[15px] outline-none text-gray-800 placeholder:text-gray-500 font-sans bg-transparent"
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
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onSearch();
          }
        }}
      />

      <div className="flex items-center pr-2 h-full gap-0.5">
        <Button
          onClick={onSearch}
          className="rounded-full hover:bg-blue-50 text-blue-600 hover:text-blue-700"
          variant="ghost"
          size="icon"
          title="Search"
        >
          <Search size={20} />
        </Button>
        {search && (
          <Button
            onClick={() => {
              setSearch("");
              dispatch(setSearchedText(""));
              dispatch(setSelectedLocation(null));
              dispatch(setOpen(false));
            }}
            variant="ghost"
            size="icon"
            title="Clear"
            className="rounded-full hover:bg-red-50 text-red-600 hover:text-red-700"
          >
            <X size={18} />
          </Button>
        )}
        <div className="w-[1px] h-6 bg-gray-200 mx-1"></div>
        <Button
          onClick={toggleDirectionMode}
          variant="ghost"
          size="icon"
          title="Direction Mode"
          className="rounded-full hover:bg-blue-50 text-blue-600 hover:text-blue-700"
        >
          <CornerUpRight size={18} />
        </Button>
      </div>
    </div>
  )
}
