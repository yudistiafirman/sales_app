import { LocalFileType } from "@/interfaces/LocalFileType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { makeMutable } from "react-native-reanimated";
import { postUploadFiles } from "../async-thunks/commonThunks";
import { putUpdateDeliverOrder } from "../async-thunks/orderThunks";

interface inputsValue {
    recepientName: string;
    recepientPhoneNumber: string;
    truckMixCondition: string;
}

export interface OperationProjectDetails {
    deliveryOrderId: string;
    projectName: string;
    address?: string;
    lonlat: { longitude: number, latitude: number };
    requestedQuantity: number;
    deliveryTime: string;
    doNumber: string
}

interface operationInitState {
    photoFiles: LocalFileType[]
    inputsValue: inputsValue;
    projectDetails: OperationProjectDetails
    isLoading: boolean
}

const initialState: operationInitState = {
    photoFiles: [],
    inputsValue: {
        recepientName: '',
        recepientPhoneNumber: '+62',
        truckMixCondition: ''
    },
    projectDetails: {
        deliveryOrderId: '',
        projectName: '',
        doNumber: '',
        address: '',
        lonlat: { longitude: 0, latitude: 0 },
        requestedQuantity: 0,
        deliveryTime: ''

    },
    isLoading: false
}
export const operationSlice = createSlice({
    name: 'operationState',
    initialState,
    reducers: {
        resetOperationState: () => {
            return initialState
        },
        onChangeInputValue: (state, actions: PayloadAction<{ inputType: keyof inputsValue, value: string }>) => {
            state.inputsValue = { ...state.inputsValue, [actions.payload.inputType]: actions.payload.value }
        },
        onChangeProjectDetails: (state, actions: PayloadAction<{ projectDetails: ProjectDetails }>) => {
            state.projectDetails = actions.payload.projectDetails
        },
        setOperationPhoto: (state, actions: PayloadAction<{ file: LocalFileType }>) => {
            state.photoFiles = [...state.photoFiles, actions.payload.file]
        },
    },
})

export const {
    resetOperationState,
    onChangeInputValue,
    onChangeProjectDetails,
    setOperationPhoto,
} = operationSlice.actions

export default operationSlice.reducer