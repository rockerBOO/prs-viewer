import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Files {
  [key: string]: Dir;
}

export type Dir = string[];

const initialState: Files = {};

export const filesSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<{ dir: string; file: string }>) => {
      let dir = state[action.payload["dir"]];

      if (dir) {
        dir.push(action.payload["file"]);
      } else {
        dir = [action.payload["file"]];
      }
      state[action.payload["dir"]] = dir;
    },
    addBatch: (
      state,
      action: PayloadAction<{ dir: string; file: string }[]>
    ) => {
      action.payload.forEach((data) => {
        let dir = state[data["dir"]];

        if (dir) {
          dir.push(data["file"]);
        } else {
          dir = [data["file"]];
        }
        state[data["dir"]] = dir;
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const { add, addBatch } = filesSlice.actions;

export default filesSlice.reducer;
