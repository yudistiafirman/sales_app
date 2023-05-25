import { createAsyncThunk } from "@reduxjs/toolkit";
import { postPayment } from "@/actions/FinanceActions";
import { CreatePayment } from "@/models/CreatePayment";

const postFinancePayment = createAsyncThunk<
    { deposit: CreatePayment },
    { payload: CreatePayment }
>("finance/postFinancePayment", async ({ payload }, { rejectWithValue }) => {
    try {
        const response = await postPayment(payload);
        const { data } = response;
        if (data.error) throw new Error(data);
        return data.data;
    } catch (error) {
        return rejectWithValue(error?.message);
    }
});

export default postFinancePayment;
