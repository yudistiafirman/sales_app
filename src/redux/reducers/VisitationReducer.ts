import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Address, Competitor, PIC } from "@/interfaces";
import { COMPANY } from "@/constants/general";
import {
    getAllCustomer,
    getUserCurrentLocation
} from "../async-thunks/commonThunks";

export interface VisitationGlobalState {
    step: number;
    shouldScrollView: boolean;
    createdLocation: Address;
    locationAddress: Address;
    existingLocationId?: string;
    companyName: string;
    customerType?: "INDIVIDU" | "COMPANY";
    projectName: string;
    individu: {
        selectedCustomer: { id: string | null; title: string };
        projectName: string;
        pics: PIC[];
        customerData: {
            items: {
                id: string;
                title: string;
            }[];
            loading: "idle" | "pending";
            searchQuery: string;
        };
    };
    company: {
        selectedCustomer: { id: string | null; title: string };
        projectName: string;
        pics: PIC[];
        customerData: {
            items: {
                id: string;
                title: string;
            }[];
            loading: "idle" | "pending";
            searchQuery: string;
        };
    };
    projectId?: string;
    location: { [key: string]: any };
    pics: PIC[];
    options: {
        loading: boolean;
        items: { title: string; id: string }[] | null;
    };

    visitationId?: string;
    existingOrderNum?: number;
    stageProject?: "LAND_PREP" | "FOUNDATION" | "FORMWORK" | "FINISHING";
    typeProject?:
        | "INFRASTRUKTUR"
        | "HIGH-RISE"
        | "RUMAH"
        | "KOMERSIAL"
        | "INDUSTRIAL";
    products: any[];
    estimationDate: {
        estimationWeek: number | null;
        estimationMonth: number | null;
    };
    competitors: Competitor[];
    currentCompetitor: Competitor;
    paymentType?: "CBD" | "CREDIT";
    notes: string;
    selectedDate: any;
    images: any[];
    kategoriAlasan?: "FINISHED" | "MOU_COMPETITOR";
    alasanPenolakan: string;
    existingVisitationId: string | null;
    stepOneVisitationFinished: boolean;
    stepTwoVisitationFinished: boolean;
    stepThreeVisitationFinished: boolean;
    stepperVisitationShouldNotFocused: boolean;
    isSearchProject: boolean;
    searchQuery: string;
    useSearchedAddress: boolean;
    searchedAddress: string;
}

const initialState: VisitationGlobalState = {
    step: 0,
    shouldScrollView: true,
    customerType: "COMPANY",
    createdLocation: {
        lat: 0,
        lon: 0,
        postalId: undefined,
        formattedAddress: ""
    },
    locationAddress: {
        lat: 0,
        lon: 0,
        postalId: undefined,
        formattedAddress: "",
        line2: ""
    },
    currentCompetitor: {
        name: "",
        mou: "",
        exclusive: "",
        hope: "",
        problem: ""
    },
    existingLocationId: "",
    companyName: "",
    location: {},
    competitors: [],
    pics: [],
    projectName: "",
    individu: {
        selectedCustomer: { id: null, title: "" },
        projectName: "",
        pics: [],
        customerData: {
            items: [],
            loading: "idle",
            searchQuery: ""
        }
    },
    company: {
        selectedCustomer: { id: null, title: "" },
        projectName: "",
        pics: [],
        customerData: {
            items: [],
            loading: "idle",
            searchQuery: ""
        }
    },

    options: {
        items: null,
        loading: false
    },
    projectId: "",
    estimationDate: {
        estimationMonth: null,
        estimationWeek: null
    },
    notes: "",
    products: [],
    selectedDate: null,
    images: [{ file: null }],
    kategoriAlasan: undefined,
    alasanPenolakan: "",
    existingVisitationId: null,
    stepOneVisitationFinished: false,
    stepTwoVisitationFinished: false,
    stepThreeVisitationFinished: false,
    stepperVisitationShouldNotFocused: false,
    isSearchProject: false,
    searchQuery: "",
    useSearchedAddress: false,
    searchedAddress: ""
};

export const visitationSlice = createSlice({
    name: "visitation",
    initialState,
    reducers: {
        resetVisitationState: () => initialState,
        resetFocusedStepperFlag: (state) => ({
            ...state,
            stepperVisitationShouldNotFocused: false
        }),
        setStepperFocused: (state, { payload }) => {
            switch (payload) {
                case 1:
                    return {
                        ...state,
                        stepperVisitationShouldNotFocused: true,
                        stepOneVisitationFinished: true
                    };
                case 2:
                    return {
                        ...state,
                        stepperVisitationShouldNotFocused: true,
                        stepTwoVisitationFinished: true
                    };
                case 3:
                    return {
                        ...state,
                        stepperVisitationShouldNotFocused: true,
                        stepThreeVisitationFinished: true
                    };
                default:
                    return {
                        ...state
                    };
            }
        },
        resetAllStepperFocused: (state) => ({
            ...state,
            stepperVisitationShouldNotFocused: true,
            stepOneVisitationFinished: false,
            stepTwoVisitationFinished: false,
            stepThreeVisitationFinished: false
        }),
        resetStepperFocused: (state, { payload }) => {
            switch (payload) {
                case 1:
                    return {
                        ...state,
                        stepperVisitationShouldNotFocused: true,
                        stepOneVisitationFinished: true
                    };
                case 2:
                    return {
                        ...state,
                        stepperVisitationShouldNotFocused: true,
                        stepTwoVisitationFinished: true
                    };
                case 3:
                    return {
                        ...state,
                        stepperVisitationShouldNotFocused: true,
                        stepThreeVisitationFinished: true
                    };
                default:
                    return {
                        ...state
                    };
            }
        },
        updateShouldScrollView: (state, { payload }: { payload: boolean }) => ({
            ...state,
            shouldScrollView: payload
        }),
        updateExistingVisitationID: (
            state,
            { payload }: { payload: string }
        ) => ({
            ...state,
            existingVisitationId: payload
        }),
        updateCurrentStep: (state, { payload }) => ({
            ...state,
            step: payload
        }),
        setSearchProject: (state, { payload }) => ({
            ...state,
            isSearchProject: payload
        }),
        setSearchQuery: (state, { payload }) => ({
            ...state,
            searchQuery: payload
        }),
        deleteImagesVisitation: (
            state,
            actions: PayloadAction<{ value: number }>
        ) => {
            let filteredImages = [...state.images];
            filteredImages = filteredImages?.filter(
                (v, i) => i !== actions.payload?.value
            );
            return {
                ...state,
                images: filteredImages
            };
        },
        setUseSearchedAddress: (
            state,
            actions: PayloadAction<{ value: boolean }>
        ) => ({
            ...state,
            useSearchedAddress: actions.payload?.value
        }),
        setSearchedAddress: (
            state,
            actions: PayloadAction<{ value: string }>
        ) => ({
            ...state,
            searchedAddress: actions.payload?.value
        }),
        setProjectName: (
            state,
            actions: PayloadAction<{
                customerType: "company" | "individu";
                value: string;
            }>
        ) => ({
            ...state,
            [actions.payload.customerType]: {
                ...state[actions.payload.customerType],
                projectName: actions.payload.value
            }
        }),
        setPics: (
            state,
            actions: PayloadAction<{
                customerType: "company" | "individu";
                value: PIC[];
            }>
        ) => ({
            ...state,
            [actions.payload.customerType]: {
                ...state[actions.payload.customerType],
                pics: actions.payload.value
            }
        }),
        setCustomerSearchQuery: (
            state,
            actions: PayloadAction<{
                value: string;
                customerType: "company" | "individu";
            }>
        ) => ({
            ...state,
            [actions.payload.customerType]: {
                ...state[actions.payload.customerType],
                customerData: {
                    ...state[actions.payload.customerType].customerData,
                    searchQuery: actions.payload.value
                }
            }
        }),
        setCustomerData: (
            state,
            actions: PayloadAction<{
                value: any;
                customerType: "company" | "individu";
            }>
        ) => ({
            ...state,
            [actions.payload.customerType]: {
                ...state[actions.payload.customerType],
                customerData: {
                    ...state[actions.payload.customerType].customerData,
                    items: actions.payload.value
                }
            }
        }),
        setSelectedCustomerData: (
            state,
            actions: PayloadAction<{
                customerType: "company" | "individu";
                value: {
                    id: string | null;
                    title: string;
                    paymentType: string;
                };
            }>
        ) => ({
            ...state,
            [actions.payload.customerType]: {
                ...state[actions.payload.customerType],
                selectedCustomer: actions.payload.value
            }
        }),
        updateDataVisitation: (
            state,
            { payload }: { payload: { type: any; value: any } }
        ) => {
            switch (payload?.type) {
                case "createdLocation":
                    return {
                        ...state,
                        createdLocation: payload?.value
                    };
                case "locationAddress":
                    return {
                        ...state,
                        locationAddress: payload?.value
                    };
                case "existingLocationId":
                    return {
                        ...state,
                        existingLocationId: payload?.value
                    };
                case "companyName":
                    return {
                        ...state,
                        companyName: payload?.value
                    };
                case "customerType":
                    return {
                        ...state,
                        customerType: payload?.value
                    };
                case "projectName":
                    return {
                        ...state,
                        projectName: payload?.value
                    };
                case "projectId":
                    return {
                        ...state,
                        projectId: payload?.value
                    };
                case "location":
                    return {
                        ...state,
                        location: payload?.value
                    };
                case "pics":
                    return {
                        ...state,
                        pics: payload?.value
                    };
                case "competitors":
                    return {
                        ...state,
                        competitors: payload?.value
                    };
                case "currentCompetitor":
                    return {
                        ...state,
                        currentCompetitor: payload?.value
                    };
                case "options":
                    return {
                        ...state,
                        options: payload?.value
                    };
                case "visitationId":
                    return {
                        ...state,
                        visitationId: payload?.value
                    };
                case "existingOrderNum":
                    return {
                        ...state,
                        existingOrderNum: payload?.value
                    };
                case "stageProject":
                    return {
                        ...state,
                        stageProject: payload?.value
                    };
                case "typeProject":
                    return {
                        ...state,
                        typeProject: payload?.value
                    };
                case "products":
                    return {
                        ...state,
                        products: payload?.value
                    };
                case "estimationDate":
                    return {
                        ...state,
                        estimationDate: payload?.value
                    };
                case "paymentType":
                    return {
                        ...state,
                        paymentType: payload?.value
                    };
                case "notes":
                    return {
                        ...state,
                        notes: payload?.value
                    };
                case "selectedDate":
                    return {
                        ...state,
                        selectedDate: payload?.value
                    };
                case "images":
                    return {
                        ...state,
                        images: payload?.value
                    };
                case "kategoriAlasan":
                    return {
                        ...state,
                        kategoriAlasan: payload?.value
                    };
                case "alasanPenolakan":
                    return {
                        ...state,
                        alasanPenolakan: payload?.value
                    };
                default:
                    return {
                        ...state
                    };
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(
            getUserCurrentLocation.fulfilled,
            (state, { payload }) => ({
                ...state,
                createdLocation: payload
            })
        );
        builder.addCase(getAllCustomer.pending, (state, { payload }) => ({
            ...state,
            [state.customerType === COMPANY ? "company" : "individu"]: {
                ...state[
                    state.customerType === COMPANY ? "company" : "individu"
                ],
                customerData: {
                    ...state[
                        state.customerType === COMPANY ? "company" : "individu"
                    ].customerData,
                    loading: "pending"
                }
            }
        }));
        builder.addCase(getAllCustomer.fulfilled, (state, { payload }) => {
            const items = payload.map((v) => ({
                id: v.id,
                title: v.displayName,
                chipTitle: v.type === COMPANY ? "Perusahaan" : "Individu",
                subtitle:
                    v.npwp.length > 0 ? `npwp : ${v.npwp}` : `nik: ${v.nik}`,
                paymentType: v.paymentType
            }));

            const selectedCustomerType =
                state.customerType === COMPANY ? "company" : "individu";

            return {
                ...state,
                [selectedCustomerType]: {
                    ...state[selectedCustomerType],
                    customerData: {
                        ...state[selectedCustomerType].customerData,
                        items:
                            items.length > 0
                                ? items
                                : [
                                      {
                                          id: null,
                                          title: state[selectedCustomerType]
                                              .customerData.searchQuery,
                                          subtitle:
                                              state.customerType === "COMPANY"
                                                  ? "npwp : -"
                                                  : "nik : -",
                                          chipTitle:
                                              state.customerType === "COMPANY"
                                                  ? "Perusahaan"
                                                  : "Individu",
                                          paymentType: ""
                                      }
                                  ],
                        loading: "idle"
                    }
                }
            };
        });
    }
});

export const {
    resetVisitationState,
    updateShouldScrollView,
    updateExistingVisitationID,
    updateCurrentStep,
    updateDataVisitation,
    resetFocusedStepperFlag,
    setStepperFocused,
    resetStepperFocused,
    resetAllStepperFocused,
    setSearchProject,
    setSearchQuery,
    deleteImagesVisitation,
    setSearchedAddress,
    setUseSearchedAddress,
    setProjectName,
    setPics,
    setCustomerSearchQuery,
    setCustomerData,
    setSelectedCustomerData
} = visitationSlice.actions;
export default visitationSlice.reducer;
