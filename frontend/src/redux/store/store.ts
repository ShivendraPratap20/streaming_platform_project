import { configureStore } from "@reduxjs/toolkit";
import tabReducer from "../slice/slice";
import homeMediaDataReducer from "../slice/homeMediaDataSlice";

export const store = configureStore({
  reducer: {
    tabs: tabReducer,
    homeMediaData: homeMediaDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;