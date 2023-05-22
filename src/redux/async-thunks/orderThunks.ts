import { createAsyncThunk } from "@reduxjs/toolkit";
import { postDeposit, postSchedule, postSph } from "@/actions/OrderActions";
import { postSphResponseType, sphOrderPayloadType } from "@/interfaces";
import { CreateDeposit } from "@/models/CreateDeposit";
import { CreateSchedule } from "@/models/CreateSchedule";

type ErrorType = {
    success: boolean;
    error: {
        status: number;
        code: string;
        message: string;
    };
};

export const postOrderSph = createAsyncThunk<
    { sph: postSphResponseType },
    { payload: sphOrderPayloadType }
>("order/postOrderSph", async ({ payload }, { rejectWithValue }) => {
    try {
        const response = await postSph(payload);
        const { data } = response;

        if (data.error) throw data as ErrorType;

        return data.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const postOrderDeposit = createAsyncThunk<
    { deposit: CreateDeposit },
    { payload: CreateDeposit }
>("order/postOrderDeposit", async ({ payload }, { rejectWithValue }) => {
    try {
        const response = await postDeposit(payload);
        const { data } = response;

        if (data.error) throw data as ErrorType;

        return data.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

export const postOrderSchedule = createAsyncThunk<
    { schedule: CreateSchedule },
    { payload: CreateSchedule }
>("order/postOrderSchedule", async ({ payload }, { rejectWithValue }) => {
    try {
        const response = await postSchedule(payload);
        const { data } = response;

        if (data.error) throw data as ErrorType;

        return data.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
});
