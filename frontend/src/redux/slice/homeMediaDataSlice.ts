import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type MediaDataType } from "../../utils/interfaces";

interface HomeMediaDataState {
  trendingMedia: MediaDataType[];
  movieMedia: MediaDataType[];
  musicMedia: MediaDataType[];
};


const initialState: HomeMediaDataState = {
  trendingMedia: [],
  movieMedia: [],
  musicMedia: [],
};

const homeMediaDataSlice = createSlice({
    name: "homeMediaData",
    initialState,
    reducers: {
        setHomeMediaData: (state, action: PayloadAction<HomeMediaDataState>) => {
            state.trendingMedia = action.payload.trendingMedia;
            state.movieMedia = action.payload.movieMedia;
            state.musicMedia = action.payload.musicMedia;
        },
    },
});

export const { setHomeMediaData } = homeMediaDataSlice.actions;

export default homeMediaDataSlice.reducer;