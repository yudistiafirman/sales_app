import { createAsyncThunk } from "@reduxjs/toolkit";
import {
    getVisitations,
    postVisitations,
    oneGetVisitation,
    putVisitation
} from "@/actions/ProductivityActions";
import { visitationListResponse, payloadPostType } from "@/interfaces";

type ParamType = {
    month: number;
    year: number;
};

type ErrorType = {
    success: boolean;
    error: {
        status: number;
        code: string;
        message: string;
    };
};

export const getVisitationsList = createAsyncThunk<
    visitationListResponse[],
    ParamType,
    {
        rejectValue: ErrorType | string;
    }
>(
    "productivityFlow/getVisitations",
    async ({ month, year }, { rejectWithValue }) => {
        try {
            const { data } = await getVisitations({ month, year });
            return data.data as visitationListResponse[];
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const postVisitation = createAsyncThunk<
    any,
    { payload: payloadPostType },
    {
        rejectValue: string;
    }
>(
    "productivityFlow/postVisitation",
    async ({ payload }, { rejectWithValue }) => {
        try {
            const { data } = await postVisitations({ payload });
            return data.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data || "error66");
        }
    }
);

export const getOneVisitation = createAsyncThunk<
    any,
    { visitationId: string },
    {
        rejectValue: string;
    }
>(
    "productivityFlow/getOneVisitation",
    async ({ visitationId }, { rejectWithValue }) => {
        try {
            //
            const { data } = await oneGetVisitation({ visitationId });
            return data.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data || "error66");
        }
    }
);
// putVisitation
export const putVisitationFlow = createAsyncThunk<
    any,
    { payload: payloadPostType; visitationId: string },
    {
        rejectValue: string;
    }
>(
    "productivityFlow/putVisitationFlow",
    async ({ payload, visitationId }, { rejectWithValue }) => {
        try {
            const { data } = await putVisitation({ payload, visitationId });
            return data.data;
        } catch (error) {
            return rejectWithValue(error?.response?.data || "error109");
        }
    }
);
