import { configureStore } from "@reduxjs/toolkit";
import filesReducer from "./files";
import currentReducer from "./current";
import settingsReducer from "./settings";

export const store = configureStore({
	reducer: {
		files: filesReducer,
		current: currentReducer,
		settings: settingsReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
