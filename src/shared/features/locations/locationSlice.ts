import { Place } from "@/shared/types/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface LocationState {
  selectedLocation: Place | null;
  searchedText: string;
  open: boolean;
}

const initialState: LocationState = {
  selectedLocation: null,
  searchedText: "",
  open: false
}

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setSelectedLocation: (state, action: PayloadAction<Place | null>) => {
      state.selectedLocation = action.payload;
    },
    setSearchedText: (state, action: PayloadAction<string>) => {
      state.searchedText = action.payload;
    },
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    }
  },
});

export const { setSelectedLocation, setSearchedText, setOpen } = locationSlice.actions;
export default locationSlice.reducer;