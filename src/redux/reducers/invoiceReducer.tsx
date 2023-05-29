import { InvoiceListData } from "@/models/Invoice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InvoiceGlobalState {
    paymentMethod: string;
    paymentDuration: string | number;
    paymentStatus: string | number;
    startDateIssued: string;
    endDateIssued: string;
    dueDateDifference: string | number;
    invoiceData: InvoiceListData[];
    isLoading: boolean;
    isLoadMore: boolean;
    isRefreshing: boolean;
    searchQuery: string;
    size: number;
    page: number;
    totalPages: number;
    totalItems: number;
    errorMessage: string | unknown;
}

interface IssueDate {
    startDateIssued: string;
    endDateIssued: string;
}

const initialState: InvoiceGlobalState = {
    searchQuery: "",
    invoiceData: [],
    paymentMethod: "",
    startDateIssued: "",
    endDateIssued: "",
    paymentDuration: 0,
    paymentStatus: "",
    dueDateDifference: "",
    isLoading: false,
    isLoadMore: false,
    isRefreshing: false,
    size: 10,
    page: 1,
    totalPages: 0,
    totalItems: 0,
    errorMessage: ""
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
        setRefreshing: (
            state,
            actions: PayloadAction<{ refreshing: boolean }>
        ) => ({ ...state, isRefreshing: actions.payload.refreshing }),
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
        }),
        setInvoiceSearchQuery: (
            state,
            actions: PayloadAction<{ queryValue: string }>
        ) => ({
            ...state,
            searchQuery: actions.payload.queryValue
        }),
        setErrorMessage: (
            state,
            actions: PayloadAction<{ message: string | unknown }>
        ) => ({
            ...state,
            errorMessage: actions.payload.message
        }),
        setTotalPage: (
            state,
            actions: PayloadAction<{ totalPage: number }>
        ) => ({
            ...state,
            totalPages: actions.payload.totalPage
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
    setTotalItems,
    setInvoiceSearchQuery,
    setErrorMessage,
    setRefreshing,
    setTotalPage
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
