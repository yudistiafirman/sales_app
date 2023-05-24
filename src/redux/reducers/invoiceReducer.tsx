import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InvoiceGlobalState {
    invoiceData: any[];
    paymentFiltered: string;
    paymentDuration: number;
    paymentCondition: string;
    issueDate: string;
    afterDueDate: string;
    isLoading: boolean;
    isLoadMore: boolean;
    size: number;
    page: number;
    totalItems: number;
}

const initialState: InvoiceGlobalState = {
    invoiceData: [],
    paymentFiltered: "",
    paymentDuration: 0,
    paymentCondition: "",
    issueDate: "",
    afterDueDate: "",
    isLoading: false,
    isLoadMore: false,
    size: 10,
    page: 1,
    totalItems: 0
};

export const invoiceSlice = createSlice({
    name: "invoiceState",
    initialState,
    reducers: {
        resetInvoiceState: () => initialState,
        setInvoceData: (state, actions: PayloadAction<{ data: any[] }>) => ({
                ...state,
                invoiceData: actions.payload.data
            }),
        setPaymentFiltered: (
            state,
            actions: PayloadAction<{ paymentFiltered: string }>
        ) => ({
                ...state,
                paymentFiltered: actions.payload.paymentFiltered
            }),
        setPaymentDuration: (
            state,
            actions: PayloadAction<{ paymentDuration: number }>
        ) => ({
                ...state,
                paymentDuration: actions.payload.paymentDuration
            }),
        setPaymentCondition: (
            state,
            actions: PayloadAction<{ paymentCondition: string }>
        ) => ({
                ...state,
                paymentCondition: actions.payload.paymentCondition
            }),
        setIssueDate: (
            state,
            actions: PayloadAction<{ issueDate: string }>
        ) => ({
                ...state,
                issueDate: actions.payload.issueDate
            }),
        setAfterDueDate: (
            state,
            actions: PayloadAction<{ afterDueDate: string }>
        ) => ({
                ...state,
                afterDueDate: actions.payload.afterDueDate
            }),
        setLoading: (state, actions: PayloadAction<{ isLoading: boolean }>) => ({
                ...state,
                isLoading: actions.payload.isLoading
            }),
        setLoadMore: (
            state,
            actions: PayloadAction<{ isLoadMore: boolean }>
        ) => ({
                ...state,
                isLoadMore: actions.payload.isLoadMore
            }),
        setPage: (state, actions: PayloadAction<{ page: number }>) => ({
                ...state,
                page: actions.payload.page
            }),
        setTotalItems: (
            state,
            actions: PayloadAction<{ totalItems: number }>
        ) => ({
                ...state,
                totalItems: actions.payload.totalItems
            })
    }
});

export const {
    resetInvoiceState,
    setInvoceData,
    setPaymentFiltered,
    setPaymentDuration,
    setPaymentCondition,
    setIssueDate,
    setAfterDueDate,
    setLoading,
    setLoadMore,
    setPage,
    setTotalItems
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
