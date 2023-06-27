import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Dimensions } from "react-native";
import { Address } from "@/interfaces";
import {
    getCoordinateDetails,
    getUserCurrentLocation
} from "../async-thunks/commonThunks";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
export const LATITUDE_DELTA = 0.0922;
export const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

interface LocationState {
    region: {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
        PostalId: number;
        formattedAddress: string;
    };
    loading: "idle" | "pending";
    currentRequestId?: string;
    error: null | string;
}

const initialState: LocationState = {
    region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LATITUDE_DELTA,
        PostalId: 0,
        formattedAddress: ""
    },
    loading: "idle",
    currentRequestId: undefined,
    error: null
};

export const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        updateRegion: (state, action: PayloadAction<any>) => ({
            ...state,
            region: { ...state.region, ...action.payload }
        }),
        resetRegion: (state) => ({
            ...state,
            region: initialState.region
        })
    },
    extraReducers: (builder) => {
        builder.addCase(getCoordinateDetails.pending, (state) => ({
            ...state,
            loading: "pending"
        }));
        builder.addCase(
            getCoordinateDetails.fulfilled,
            (state, { payload }) => ({
                ...state,
                loading: "idle",
                region: { ...state.region, ...payload }
            })
        );
        builder.addCase(getUserCurrentLocation.pending, (state) => ({
            ...state,
            loading: "pending"
        }));
        builder.addCase(
            getUserCurrentLocation.fulfilled,
            (state, { payload }) => ({
                ...state,
                loading: "idle",
                region: { ...state.region, ...payload }
            })
        );
    }
});

export const { updateRegion, resetRegion } = locationSlice.actions;
export default locationSlice.reducer;
