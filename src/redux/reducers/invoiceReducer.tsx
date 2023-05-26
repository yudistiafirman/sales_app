import { InvoiceListData } from "@/models/Invoice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InvoiceGlobalState {
    invoiceData: InvoiceListData[];
    paymentFiltered: string;
    paymentDuration: number;
    paymentStatus: string;
    issueDate: string;
    dueDateDifference: string;
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

const initialState: InvoiceGlobalState = {
    searchQuery: "",
    invoiceData: [],
    paymentFiltered: "",
    paymentDuration: 0,
    paymentStatus: "",
    issueDate: "",
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
        setPaymentStatus: (
            state,
            actions: PayloadAction<{ paymentStatus: string }>
        ) => ({
            ...state,
            paymentStatus: actions.payload.paymentStatus
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
            actions: PayloadAction<{ dueDateDifference: string }>
        ) => ({
            ...state,
            dueDateDifference: actions.payload.dueDateDifference
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
    setPaymentFiltered,
    setPaymentDuration,
    setPaymentStatus,
    setIssueDate,
    setAfterDueDate,
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
