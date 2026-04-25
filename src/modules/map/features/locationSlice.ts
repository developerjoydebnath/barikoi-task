import { Place, LineStringGeometry } from "@/shared/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LocationState {
  selectedLocation: Place | null;
  searchedText: string;
  open: boolean;
  isDirectionMode: boolean;
  startLocation: Place | null;
  endLocation: Place | null;
  activeInput: "start" | "end" | null;
  routeData: LineStringGeometry | null;
  distance: number | null;
  duration: number | null;
  searchResults: Place[];
}

const initialState: LocationState = {
  selectedLocation: null,
  searchedText: "",
  open: false,
  isDirectionMode: false,
  startLocation: null,
  endLocation: null,
  activeInput: null,
  routeData: null,
  distance: null,
  duration: null,
  searchResults: [],
}

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setSelectedLocation: (state, action: PayloadAction<Place | null>) => {
      state.selectedLocation = action.payload;
      state.searchResults = [];
    },
    setSearchedText: (state, action: PayloadAction<string>) => {
      state.searchedText = action.payload;
    },
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
    setDirectionMode: (state, action: PayloadAction<boolean>) => {
      state.isDirectionMode = action.payload;
    },
    setStartLocation: (state, action: PayloadAction<Place | null>) => {
      state.startLocation = action.payload;
    },
    setEndLocation: (state, action: PayloadAction<Place | null>) => {
      state.endLocation = action.payload;
    },
    setActiveInput: (state, action: PayloadAction<"start" | "end" | null>) => {
      state.activeInput = action.payload;
    },
    setRouteData: (state, action: PayloadAction<LineStringGeometry | null>) => {
      state.routeData = action.payload;
    },
    setRouteInfo: (state, action: PayloadAction<{ distance: number; duration: number } | null>) => {
      state.distance = action.payload?.distance ?? null;
      state.duration = action.payload?.duration ?? null;
    },
    setSearchResults: (state, action: PayloadAction<Place[]>) => {
      state.searchResults = action.payload;
    },
    resetDirection: (state) => {
      state.isDirectionMode = false;
      state.startLocation = null;
      state.endLocation = null;
      state.activeInput = null;
      state.routeData = null;
      state.distance = null;
      state.duration = null;
      state.selectedLocation = null;
      state.searchResults = [];
    }
  },
});

export const { 
  setSelectedLocation, 
  setSearchedText, 
  setOpen, 
  setDirectionMode, 
  setStartLocation, 
  setEndLocation, 
  setActiveInput,
  setRouteData,
  setRouteInfo,
  setSearchResults,
  resetDirection
} = locationSlice.actions;
export default locationSlice.reducer;