import { InvoiceListData } from "@/models/Invoice";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MarkedDates } from "react-native-calendars/src/types";

export interface InvoiceGlobalState {
    filter: InvoiceFilter;
    invoiceData: InvoiceListData[];
    isLoading: boolean;
    isLoadMore: boolean;
    isRefreshing: boolean;
    size: number;
    totalPages: number;
    totalItems: number;
    search: SearchInvoice;
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

interface SearchInvoice {
    page: number;
    searchQuery: string;
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
    search: {
        page: 1,
        searchQuery: ""
    },
    invoiceData: [],
    isLoading: false,
    isLoadMore: false,
    isRefreshing: false,
    size: 10,
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
            invoiceData: actions.payload?.data
        }),
        setPaymentMethod: (state, actions: PayloadAction<string>) => ({
            ...state,
            filter: { ...state.filter, paymentMethod: actions?.payload }
        }),
        setPaymentDuration: (
            state,
            actions: PayloadAction<string | number>
        ) => ({
            ...state,
            filter: { ...state.filter, paymentDuration: actions?.payload }
        }),
        setPaymentStatus: (state, actions: PayloadAction<string | number>) => ({
            ...state,
            filter: { ...state.filter, paymentStatus: actions?.payload }
        }),
        setIssueDate: (state, actions: PayloadAction<IssueDate>) => ({
            ...state,
            filter: {
                ...state.filter,
                startDateIssued: actions.payload?.startDateIssued,
                endDateIssued: actions.payload?.endDateIssued
            }
        }),
        setDueDateDifference: (
            state,
            actions: PayloadAction<string | number>
        ) => ({
            ...state,
            filter: { ...state.filter, dueDateDifference: actions?.payload }
        }),
        setMarkedDates: (state, actions: PayloadAction<MarkedDates>) => ({
            ...state,
            filter: { ...state.filter, markedDates: actions?.payload }
        }),
        setLoading: (
            state,
            actions: PayloadAction<{ isLoading: boolean }>
        ) => ({
            ...state,
            isLoading: actions.payload?.isLoading
        }),
        setLoadMore: (
            state,
            actions: PayloadAction<{ isLoadMore: boolean }>
        ) => ({
            ...state,
            isLoadMore: actions.payload?.isLoadMore
        }),
        setRefreshing: (
            state,
            actions: PayloadAction<{ refreshing: boolean }>
        ) => ({ ...state, isRefreshing: actions.payload?.refreshing }),
        setPage: (state, actions: PayloadAction<{ page: number }>) => ({
            ...state,
            search: { ...state.search, page: actions.payload?.page }
        }),
        setTotalItems: (
            state,
            actions: PayloadAction<{ totalItems: number }>
        ) => ({
            ...state,
            totalItems: actions.payload?.totalItems
        }),
        setInvoiceSearchQuery: (
            state,
            actions: PayloadAction<{ queryValue: string }>
        ) => ({
            ...state,
            search: {
                ...state.search,
                searchQuery: actions.payload?.queryValue
            }
        }),
        setSearch: (state, actions: PayloadAction<SearchInvoice>) => ({
            ...state,
            search: {
                ...state.search,
                searchQuery: actions.payload?.searchQuery,
                page: actions.payload?.page
            }
        }),
        setErrorMessage: (
            state,
            actions: PayloadAction<{ message: string | unknown }>
        ) => ({
            ...state,
            errorMessage: actions.payload?.message
        }),
        setTotalPage: (
            state,
            actions: PayloadAction<{ totalPage: number }>
        ) => ({
            ...state,
            totalPages: actions.payload?.totalPage
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
    setTotalPage,
    setSearch
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
