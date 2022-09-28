import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Filename = string;

const initialState: Filename = "";

export const current = createSlice({
  name: "current",
  initialState,
  reducers: {
    set: (_state, action: PayloadAction<Filename>) => {
			return action.payload
    },
  },
});

// Action creators are generated for each case reducer function
export const { set } = current.actions;

export default current.reducer;
