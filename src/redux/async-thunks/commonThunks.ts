import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    allVisitationGetAction,
    uploadFileImage,
    projectByUserGetAction,
    projectGetOneById,
    getSphDocuments,
    getAddressSuggestion,
    postProjectDoc,
    getLocationCoordinates
} from "@/actions/CommonActions";
import { Region, projectResponseType } from "@/interfaces";
import axios from "axios";

type ErrorType = {
    success: boolean;
    error: {
        status: number;
        code: string;
        message: string;
    };
};

export const postUploadFiles = createAsyncThunk<
    any,
    { files: any[]; from: string }
>("common/postUploadFiles", async ({ files, from }, { rejectWithValue }) => {
    try {
        const response = await uploadFileImage(files, from);

        const { data } = response;
        if (data.error) throw new Error(data);
        return data.data;
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
            const { data } = response.data.data;
            if (data.error) throw new Error(data);
            return data;
        } catch (error) {
            return rejectWithValue(error?.message);
        }
    }
);

// export const getProjectsByUserThunk = createAsyncThunk<
//     projectResponseType,
//     { search?: string }
// >("common/getProjectsByUserThunk", async ({ search }, { rejectWithValue }) => {
//     // projectByUserGetAction
//     try {
//         const response = await projectByUserGetAction(search);
//         const { data } = response;
//         if (data.error) throw new Error(data);
//         return data;
//     } catch (error) {
//         return rejectWithValue(error?.message);
//     }
// });
// projectGetOneById
export const getOneProjectById = createAsyncThunk<any, { projectId: string }>(
    "common/getOneProjectById",
    async ({ projectId }, { rejectWithValue }) => {
        try {
            const response = await projectGetOneById(projectId);
            const { data } = response;
            if (data.error) throw new Error(data);
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
            if (data.error) throw new Error(data);
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
            if (data.error) throw new Error(data);
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
            if (data.error) throw new Error(data);
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

export const getCoordinateDetails = createAsyncThunk(
    "common/getLocationCoordinates",
    async (coordinate: Region, { signal, rejectWithValue }) => {
        try {
            const response = await getLocationCoordinates(
                coordinate.longitude as unknown as number,
                coordinate.latitude as unknown as number,
                "",
                signal
            );

            const { result } = response.data;
            const coordinateToSet = {
                latitude: result?.lat,
                longitude: result?.lon,
                lat: 0,
                lon: 0,
                formattedAddress: result?.formattedAddress,
                PostalId: result?.PostalId
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
