import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import LocalFileType from "@/interfaces/LocalFileType";

export interface SOGlobalState {
    photoFiles: LocalFileType[];
    selectedPONumber: string;
    selectedID: string;
    isLoading: boolean;
}

const initialState: SOGlobalState = {
    photoFiles: [],
    selectedPONumber: "",
    selectedID: "",
    isLoading: false
};

export const salesOrderSlice = createSlice({
    name: "salesOrderReducer",
    initialState,
    reducers: {
        resetSOState: () => initialState,
        onUpdateSONumber: (
            state,
            actions: PayloadAction<{ number: string }>
        ) => ({
            ...state,
            selectedPONumber: actions.payload.number
        }),
        onUpdateSOID: (state, actions: PayloadAction<{ id: string }>) => ({
            ...state,
            selectedID: actions.payload.id
        }),
        setSOPhoto: (
            state,
            actions: PayloadAction<{ file: LocalFileType }>
        ) => {
            const currentImages = [...state.photoFiles];
            currentImages.push(actions.payload.file);
            return {
                ...state,
                photoFiles: [...currentImages]
            };
        },
        setAllSOPhoto: (
            state,
            actions: PayloadAction<{ file: LocalFileType[] }>
        ) => ({
            ...state,
            photoFiles: [...actions.payload.file]
        }),
        removeSOPhoto: (state, actions: PayloadAction<{ index: number }>) => {
            let currentImages = [...state.photoFiles];
            currentImages = currentImages.filter((it) => it.file !== null);
            currentImages.splice(actions.payload.index, 1);
            currentImages.unshift({ file: null });
            return {
                ...state,
                photoFiles: [...currentImages]
            };
        }
    }
});

export const {
    resetSOState,
    onUpdateSONumber,
    onUpdateSOID,
    setSOPhoto,
    setAllSOPhoto,
    removeSOPhoto
} = salesOrderSlice.actions;

export default salesOrderSlice.reducer;
