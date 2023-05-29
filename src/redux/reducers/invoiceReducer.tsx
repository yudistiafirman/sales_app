import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InvoiceGlobalState {
    invoiceData: any[];
    paymentMethod: string;
    paymentDuration: string | number;
    paymentStatus: string | number;
    startDateIssued: string;
    endDateIssued: string;
    dueDateDifference: string | number;
    isLoading: boolean;
    isLoadMore: boolean;
    size: number;
    page: number;
    totalItems: number;
}

interface IssueDate {
    startDateIssued: string;
    endDateIssued: string;
}

const initialState: InvoiceGlobalState = {
    invoiceData: [],
    paymentMethod: "",
    startDateIssued: "",
    endDateIssued: "",
    paymentDuration: 0,
    paymentStatus: "",
    dueDateDifference: "",
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
        setPaymentMethod: (state, actions: PayloadAction<string>) => ({
            ...state,
            paymentMethod: actions.payload
        }),
        setPaymentDuration: (
            state,
            actions: PayloadAction<string | number>
        ) => ({
            ...state,
            paymentDuration: actions.payload
        }),
        setPaymentStatus: (state, actions: PayloadAction<string | number>) => ({
            ...state,
            paymentStatus: actions.payload
        }),
        setIssueDate: (state, actions: PayloadAction<IssueDate>) => ({
            ...state,
            startDateIssued: actions.payload.startDateIssued,
            endDateIssued: actions.payload.endDateIssued
        }),
        setDueDateDifference: (
            state,
            actions: PayloadAction<string | number>
        ) => ({
            ...state,
            dueDateDifference: actions.payload
        }),
        setLoading: (
            state,
            actions: PayloadAction<{ isLoading: boolean }>
        ) => ({
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
    setPaymentMethod,
    setPaymentDuration,
    setPaymentStatus,
    setIssueDate,
    setDueDateDifference,
    setLoading,
    setLoadMore,
    setPage,
    setTotalItems
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
