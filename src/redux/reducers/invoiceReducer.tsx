import { InvoiceListData } from "@/models/Invoice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MarkedDates } from "react-native-calendars/src/types";

export interface InvoiceGlobalState {
    filter: InvoiceFilter;
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

interface InvoiceFilter {
    paymentMethod: string;
    paymentDuration: string | number;
    paymentStatus: string | number;
    startDateIssued: string;
    endDateIssued: string;
    dueDateDifference: string | number;
    markedDates: MarkedDates;
}

interface IssueDate {
    startDateIssued: string;
    endDateIssued: string;
}

const initialState: InvoiceGlobalState = {
    filter: {
        paymentMethod: "",
        startDateIssued: "",
        endDateIssued: "",
        paymentDuration: 0,
        paymentStatus: "",
        dueDateDifference: "",
        markedDates: {}
    },
    searchQuery: "",
    invoiceData: [],
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
            filter: { ...state.filter, paymentMethod: actions.payload }
        }),
        setPaymentDuration: (
            state,
            actions: PayloadAction<string | number>
        ) => ({
            ...state,
            filter: { ...state.filter, paymentDuration: actions.payload }
        }),
        setPaymentStatus: (state, actions: PayloadAction<string | number>) => ({
            ...state,
            filter: { ...state.filter, paymentStatus: actions.payload }
        }),
        setIssueDate: (state, actions: PayloadAction<IssueDate>) => ({
            ...state,
            filter: {
                ...state.filter,
                startDateIssued: actions.payload.startDateIssued,
                endDateIssued: actions.payload.endDateIssued
            }
        }),
        setDueDateDifference: (
            state,
            actions: PayloadAction<string | number>
        ) => ({
            ...state,
            filter: { ...state.filter, dueDateDifference: actions.payload }
        }),
        setMarkedDates: (state, actions: PayloadAction<MarkedDates>) => ({
            ...state,
            filter: { ...state.filter, markedDates: actions.payload }
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
    setMarkedDates,
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
