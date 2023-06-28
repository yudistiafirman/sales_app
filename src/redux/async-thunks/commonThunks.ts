import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    allVisitationGetAction,
    uploadFileImage,
    projectByUserGetAction,
    projectGetOneById,
    getSphDocuments,
    getAddressSuggestion,
    postProjectDoc,
    getLocationCoordinates,
    getAllCustomers
} from "@/actions/CommonActions";
import { Region, projectResponseType } from "@/interfaces";
import Geolocation from "react-native-geolocation-service";
import { COMPANY } from "@/constants/general";

type ErrorType = {
    success: boolean;
    error: {
        status: number;
        code: string;
        message: string;
    };
};
interface CoordinateDetails {
    latitude: number | undefined;
    longitude: number | undefined;
    lat: number;
    lon: number;
    formattedAddress: string | undefined;
    PostalId: string | undefined;
    distance: number | undefined;
}

interface CustomerData {
    id: string;
    displayName: string;
    paymentType: null | "CREDIT";
}
export const postUploadFiles = createAsyncThunk<
    any,
    { files: any[]; from: string }
>("common/postUploadFiles", async ({ files, from }, { rejectWithValue }) => {
    try {
        const response = await uploadFileImage(files, from);

        const { data } = response;
        if (data?.error) throw new Error(data);
        return data?.data;
    } catch (error) {
        let errorData = error?.message;
        if (error?.response?.data) {
            errorData = error?.response?.data;
        }
        return rejectWithValue(errorData);
    }
});

export const getAllProject = createAsyncThunk<
    any,
    { search?: string; selectedBPId?: string }
>(
    "common/getAllProject",
    async ({ search, selectedBPId }, { rejectWithValue }) => {
        try {
            const response = await allVisitationGetAction(search, selectedBPId);
            const data = response?.data?.data?.data;
            if (data?.error) throw new Error(data);
            return data;
        } catch (error) {
            return rejectWithValue(error?.message);
        }
    }
);

export const getOneProjectById = createAsyncThunk<any, { projectId: string }>(
    "common/getOneProjectById",
    async ({ projectId }, { rejectWithValue }) => {
        try {
            const response = await projectGetOneById(projectId);
            const { data } = response;
            if (data?.error) throw new Error(data);
            return data;
        } catch (error) {
            return rejectWithValue(error?.message);
        }
    }
);

export const fetchSphDocuments = createAsyncThunk(
    "common/fetchSphDocuments",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getSphDocuments();
            const { data } = response;
            if (data?.error) throw new Error(data);
            return data;
        } catch (error) {
            return rejectWithValue(error?.message);
        }
    }
);
export const fetchAddressSuggestion = createAsyncThunk<
    any,
    { search: string; page: number }
>(
    "common/fetchAddressSuggestion",
    async ({ search, page }, { rejectWithValue }) => {
        try {
            const response = await getAddressSuggestion(search, page);
            const { data } = response;
            if (data?.error) throw new Error(data);
            return data;
        } catch (error) {
            return rejectWithValue(error?.message);
        }
    }
);
export const postProjectDocByprojectId = createAsyncThunk<
    any,
    {
        payload: {
            projectId: string;
            documentId: string;
            fileId: string;
        };
    }
>(
    "common/postProjectDocByprojectId",
    async ({ payload }, { rejectWithValue }) => {
        try {
            const response = await postProjectDoc(payload);
            const { data } = response;
            if (data?.error) throw new Error(data);
            return data;
        } catch (error) {
            let errorData = error?.message;
            if (error?.response?.data) {
                errorData = error?.response?.data;
            }
            return rejectWithValue(errorData);
        }
    }
);

export const getCoordinateDetails = createAsyncThunk<
    CoordinateDetails,
    { coordinate: Region; selectedBatchingPlant: string }
>(
    "common/getLocationCoordinates",
    async (
        { coordinate, selectedBatchingPlant },
        { signal, rejectWithValue }
    ) => {
        try {
            const response = await getLocationCoordinates(
                coordinate?.longitude as unknown as number,
                coordinate?.latitude as unknown as number,
                selectedBatchingPlant,
                signal
            );

            const result = response?.data?.result;

            const coordinateToSet = {
                latitude: result?.lat,
                longitude: result?.lon,
                lat: 0,
                lon: 0,
                formattedAddress: result?.formattedAddress,
                PostalId: result?.PostalId,
                distance: result?.distance?.value
            };

            if (typeof result?.lon === "string") {
                coordinateToSet.longitude = Number(result.lon);
                coordinateToSet.lon = Number(result.lon);
            }

            if (typeof result?.lat === "string") {
                coordinateToSet.latitude = Number(result.lat);
                coordinateToSet.lat = Number(result.lat);
            }
            return coordinateToSet;
        } catch (error) {
            let errorData = error?.message;
            if (error?.response?.data) {
                errorData = error?.response?.data;
            }
            return rejectWithValue(errorData);
        }
    }
);

export const getUserCurrentLocation = createAsyncThunk(
    "common/getUserCurrentLocation",
    async (selectedBatchingPlant: string, { signal, rejectWithValue }) => {
        try {
            const opt = {
                showLocationDialog: true,
                forceRequestLocation: true
            };
            const position = await new Promise((resolve, error) =>
                Geolocation.getCurrentPosition(resolve, error, opt)
            );
            const coords = position?.coords;
            const latitude = coords?.latitude;
            const longitude = coords?.longitude;
            const response = await getLocationCoordinates(
                longitude,
                latitude,
                selectedBatchingPlant,
                signal
            );
            const result = response?.data?.result;
            const coordinate = {
                longitude: Number(result?.lon),
                latitude: Number(result?.lat),
                formattedAddress: result?.formattedAddress,
                PostalId: result?.PostalId
            };

            return coordinate;
        } catch (error) {
            let errorData = error?.message;
            if (error?.response?.data) {
                errorData = error?.response?.data;
            }
            return rejectWithValue(errorData);
        }
    }
);

export const getAllCustomer = createAsyncThunk(
    "common/getAllCustomer",
    async (searchQuery: string, { rejectWithValue }) => {
        try {
            const response = await getAllCustomers("", searchQuery, 0);

            return response.data.data.data;
        } catch (error) {
            let errorData = error?.message;
            if (error?.response?.data) {
                errorData = error?.response?.data;
            }
            return rejectWithValue(errorData);
        }
    }
);
