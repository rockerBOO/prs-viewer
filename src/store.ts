import { configureStore } from "@reduxjs/toolkit";
import filesReducer from "./files";

export const store = configureStore({
  reducer: {
    files: filesReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
