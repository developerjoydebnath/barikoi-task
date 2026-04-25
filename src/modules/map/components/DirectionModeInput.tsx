'use client'

import { DebounceInput } from '@/shared/components/custom/DebounceInput';
import { Button } from '@/shared/components/ui/button';
import { RootState } from '@/shared/store/store';
import { ArrowLeft, Circle, Square, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveInput, setOpen, setSearchedText } from '../features/locationSlice';
import { DirectionModeInputsProps } from '../types/map.types';

export default function DirectionModeInput({ toggleDirectionMode, search, setSearch }: DirectionModeInputsProps) {
  const dispatch = useDispatch();
  const { activeInput, startLocation, endLocation, distance, duration } = useSelector((state: RootState) => state.location);

  return (
    <div className="flex flex-col w-full p-2.5 gap-3">
      <div className="flex items-center gap-3">
        <Button onClick={toggleDirectionMode} variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 text-blue-600 hover:text-blue-700">
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-1 flex flex-col gap-2 relative">
          {/* Connection Line */}
          <div className="absolute left-[13px] top-[26px] bottom-[26px] w-[2px] border-l-2 border-dotted border-gray-300"></div>

          {/* Start Input */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 group focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Circle size={10} className="text-gray-400 fill-gray-400" />
            <DebounceInput
              type="text"
              placeholder="Choose start point..."
              className="flex-1 w-full h-10 bg-transparent text-sm outline-none text-gray-800"
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
              className="flex-1 w-full h-10 bg-transparent text-sm outline-none text-gray-800"
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
        <Button onClick={toggleDirectionMode} variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 text-blue-600 hover:text-blue-700" title="Close">
          <X size={20} />
        </Button>
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
  )
}
