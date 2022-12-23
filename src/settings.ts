import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Settings = {
  gallery_size?: number;
};
const initialState: Settings = {};

export const settings = createSlice({
  name: "settings",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<Partial<Settings>>) => {
      return { ...state, ...action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { set } = settings.actions;

export default settings.reducer;
