import {
    projectPayloadType,
    PIC,
    selectedCompanyInterface
} from "@/interfaces";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { COMPANY } from "@/constants/general";
import { getAllCustomer } from "../async-thunks/commonThunks";

export type DataCompany = {
    id?: string;
    name?: string;
    location?: string;
    project?: projectPayloadType;
    pics?: PIC[];
};

export interface StepOne {
    routes: IRoutes[];
    selectedCategories: string;
    customerType: string;
    individu: selectedCompanyInterface;
    company: selectedCompanyInterface;
    location: NonNullable<unknown>;
    errorProject: string;
    errorPics: string;
    errorCompany: string;
    options: {
        loading: false;
        items: any[] | null;
    };
}

interface IRoutes {
    key: string;
    title: string;
    totalItems: number;
    chipPosition: string;
}

interface SelectedDate {
    date?: Date;
    day?: string;
    prettyDate?: string;
}

interface AppointmentState {
    step: number;
    stepDone: number[];
    searchQuery: string;
    stepOne: StepOne;
    isModalPicVisible: boolean;
    selectedDate?: SelectedDate;
    selectedCustomerData?: DataCompany;
    isModalCompanyVisible: boolean;
    isSearching: boolean;
}

const initialState: AppointmentState = {
    step: 0,
    stepDone: [0],
    searchQuery: "",
    stepOne: {
        routes: [],
        selectedCategories: "",
        customerType: "",
        individu: {
            id: "",
            name: "",
            Company: {
                id: "",
                title: ""
            },
            Pics: [],
            Visitation: {
                finishDate: null,
                id: "",
                order: 1,
                visitation_id: null
            },
            locationAddress: {
                city: undefined,
                district: undefined,
                line1: undefined,
                postalCode: undefined,
                rural: undefined,
                lat: undefined,
                lon: undefined,
                formattedAddress: undefined
            },
            Pic: {},
            selectedCustomer: { id: null, title: "", paymentType: null },
            customerData: {
                items: [],
                loading: "idle",
                searchQuery: ""
            }
        },
        company: {
            id: "",
            name: "",
            Company: {
                id: "",
                title: ""
            },
            Pics: [],
            Visitation: {
                finishDate: null,
                id: "",
                order: 1,
                visitation_id: null
            },
            locationAddress: {
                city: undefined,
                district: undefined,
                line1: undefined,
                postalCode: undefined,
                rural: undefined,
                lat: 0,
                lon: 0
            },
            Pic: {},
            selectedCustomer: { id: null, title: "", paymentType: null },
            customerData: {
                items: [],
                loading: "idle",
                searchQuery: ""
            }
        },
        errorCompany: "",
        errorProject: "",
        location: {},
        errorPics: "",
        options: {
            items: null,
            loading: false
        }
    },
    selectedDate: undefined,
    selectedCustomerData: undefined,
    isModalPicVisible: false,
    isModalCompanyVisible: false,
    isSearching: false
};

export const appointmentSlice = createSlice({
    name: "appointment",
    initialState,
    reducers: {
        setSearchQuery: (state, actions: PayloadAction<{ value: string }>) => ({
            ...state,
            searchQuery: actions.payload?.value
        }),
        setCompanyName: (state, actions: PayloadAction<{ value: string }>) => ({
            ...state,
            stepOne: {
                ...state.stepOne,
                errorCompany: "",
                company: {
                    ...state.stepOne.company,
                    Company: {
                        ...state.stepOne.company.Company,
                        title: actions.payload?.value
                    }
                }
            }
        }),
        setCustomerType: (
            state,
            actions: PayloadAction<{ value: string }>
        ) => ({
            ...state,
            stepOne: {
                ...state.stepOne,
                customerType: actions.payload?.value
            }
        }),
        setProjectName: (
            state,
            actions: PayloadAction<{ key: keyof StepOne; value: string }>
        ) => {
            if (actions.payload?.key) {
                return {
                    ...state,
                    stepOne: {
                        ...state.stepOne,
                        errorProject: "",
                        [actions.payload.key]: {
                            ...(state.stepOne[actions.payload.key] as StepOne),
                            name: actions.payload?.value
                        }
                    }
                };
            }
            return {
                ...state,
                stepOne: {
                    ...state.stepOne,
                    errorProject: ""
                }
            };
        },
        setPics: (
            state,
            actions: PayloadAction<{ key: keyof StepOne; value: PIC }>
        ) => {
            if (actions.payload?.key) {
                return {
                    ...state,
                    isModalPicVisible: false,
                    stepOne: {
                        ...state.stepOne,
                        errorPics: "",
                        [actions.payload.key]: {
                            ...(state.stepOne[actions.payload.key] as StepOne),
                            Pics: actions.payload?.value
                        }
                    }
                };
            }
            return {
                ...state,
                isModalPicVisible: false,
                stepOne: {
                    ...state.stepOne,
                    errorPics: ""
                }
            };
        },
        toggleModalPics: (
            state,
            actions: PayloadAction<{ value: boolean }>
        ) => ({
            ...state,
            isModalPicVisible: actions.payload?.value
        }),
        assignError: (
            state,
            actions: PayloadAction<{ key: keyof StepOne; value: string }>
        ) => {
            if (actions.payload?.key) {
                return {
                    ...state,
                    stepOne: {
                        ...state.stepOne,
                        [actions.payload.key]: actions.payload?.value
                    }
                };
            }
            return {
                ...state,
                stepOne: {
                    ...state.stepOne
                }
            };
        },
        onPressCompany: (
            state,
            actions: PayloadAction<{ value: selectedCompanyInterface }>
        ) => ({
            ...state,
            isModalCompanyVisible: true,
            selectedCustomerData: actions.payload?.value
        }),
        toggleModalCompany: (state) => ({
            ...state,
            isModalCompanyVisible: !state?.isModalCompanyVisible
        }),
        selectProject: (state, actions: PayloadAction<{ value: any }>) => ({
            ...state,
            selectedCustomerData: {
                ...state.selectedCustomerData,
                project: actions.payload?.value
            }
        }),
        onAddProject: (
            state,
            actions: PayloadAction<{ key: keyof StepOne; value: DataCompany }>
        ) => {
            if (actions.payload?.key) {
                return {
                    ...state,
                    isModalCompanyVisible: false,
                    isSearching: false,
                    searchQuery: "",
                    stepOne: {
                        ...state.stepOne,
                        customerType: actions.payload?.key,
                        errorPics: "",
                        errorCompany: "",
                        errorProject: "",
                        [actions.payload.key as keyof StepOne]: {
                            ...(state.stepOne[actions.payload.key] as StepOne),
                            ...actions.payload?.value
                        }
                    }
                };
            }
            return {
                ...state,
                isModalCompanyVisible: false,
                isSearching: false,
                searchQuery: "",
                stepOne: {
                    ...state.stepOne,
                    errorPics: "",
                    errorCompany: "",
                    errorProject: ""
                }
            };
        },
        setCategories: (state, actions: PayloadAction<{ value: number }>) => {
            if (actions.payload?.value) {
                return {
                    ...state,
                    stepOne: {
                        ...state.stepOne,
                        selectedCategories:
                            state?.stepOne?.routes[actions?.payload?.value]
                                ?.title
                    }
                };
            }
            return {
                ...state,
                stepOne: {
                    ...state.stepOne
                }
            };
        },
        selectCompany: (
            state,
            actions: PayloadAction<{ key: keyof StepOne; value: DataCompany }>
        ) => {
            if (actions.payload?.key) {
                return {
                    ...state,
                    stepOne: {
                        ...state.stepOne,
                        [actions.payload.key]: {
                            ...(state.stepOne[actions.payload.key] as StepOne),
                            Company: actions.payload?.value
                        }
                    }
                };
            }
            return {
                ...state,
                stepOne: {
                    ...state.stepOne
                }
            };
        },
        onPressProject: (
            state,
            actions: PayloadAction<{
                key: keyof StepOne;
                projectName: string;
                pics: PIC;
            }>
        ) => {
            if (actions.payload?.key) {
                return {
                    ...state,
                    searchQuery: "",
                    stepOne: {
                        ...state.stepOne,
                        customerType: actions.payload.key,
                        [actions.payload.key as keyof StepOne]: {
                            ...(state.stepOne[
                                actions.payload.key as keyof StepOne
                            ] as StepOne),
                            Pics: actions.payload?.pics,
                            projectName: actions.payload?.projectName
                        }
                    }
                };
            }
            return {
                ...state,
                searchQuery: "",
                stepOne: {
                    ...state.stepOne
                }
            };
        },
        addCompanies: (state, actions) => ({
            ...state,
            stepOne: {
                ...state.stepOne,
                options: {
                    ...state.stepOne.options.items,
                    items: actions.payload?.value
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
            stepOne: {
                ...state.stepOne,
                [actions.payload.customerType]: {
                    ...state.stepOne[actions.payload.customerType],
                    customerData: {
                        ...state.stepOne[actions.payload.customerType]
                            .customerData,
                        items: actions.payload.value
                    }
                }
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
            stepOne: {
                ...state.stepOne,
                [actions.payload.customerType]: {
                    ...state.stepOne[actions.payload.customerType],
                    customerData: {
                        ...state.stepOne[actions.payload.customerType]
                            .customerData,
                        searchQuery: actions.payload.value
                    }
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
            stepOne: {
                ...state.stepOne,
                [actions.payload.customerType]: {
                    ...state.stepOne[actions.payload.customerType],
                    selectedCustomer: actions.payload.value
                }
            }
        }),
        setDate: (state, actions: PayloadAction<{ value: SelectedDate }>) => ({
            ...state,
            selectedDate: actions.payload?.value
        }),
        increaseStep: (state) => ({
            ...state,
            step: (state?.step || 0) + 1
        }),
        decreaseStep: (state) => ({
            ...state,
            step: (state?.step || 0) - 1
        }),
        enableSearching: (
            state,
            actions: PayloadAction<{ value: boolean }>
        ) => ({
            ...state,
            isSearching: actions.payload?.value
        }),
        resetAppointmentState: () => initialState
    },
    extraReducers: (builder) => {
        builder.addCase(getAllCustomer.pending, (state, { payload }) => ({
            ...state,
            stepOne: {
                ...state.stepOne,
                [state.stepOne.customerType === COMPANY.toLowerCase()
                    ? "company"
                    : "individu"]: {
                    ...state.stepOne[
                        state.stepOne.customerType === COMPANY.toLowerCase()
                            ? "company"
                            : "individu"
                    ],
                    customerData: {
                        ...state.stepOne[
                            state.stepOne.customerType === COMPANY.toLowerCase()
                                ? "company"
                                : "individu"
                        ].customerData,
                        loading: "pending"
                    }
                }
            }
        }));
        builder.addCase(getAllCustomer.fulfilled, (state, { payload }) => {
            const items = payload.map((v) => ({
                id: v.id,
                title: v.displayName,
                chipTitle:
                    v.type === COMPANY.toLowerCase()
                        ? "Perusahaan"
                        : "Individu",
                subtitle:
                    v.npwp.length > 0 ? `npwp : ${v.npwp}` : `nik: ${v.nik}`,
                paymentType: v.paymentType
            }));

            const selectedCustomerType =
                state.stepOne.customerType === COMPANY.toLowerCase()
                    ? "company"
                    : "individu";

            return {
                ...state,
                stepOne: {
                    ...state.stepOne,
                    [selectedCustomerType]: {
                        ...state.stepOne[selectedCustomerType],
                        customerData: {
                            ...state.stepOne[selectedCustomerType].customerData,
                            items,
                            loading: "idle"
                        }
                    }
                }
            };
        });
    }
});

export const {
    resetAppointmentState,
    setSearchQuery,
    setCompanyName,
    setCustomerType,
    setProjectName,
    setPics,
    toggleModalPics,
    assignError,
    onPressCompany,
    toggleModalCompany,
    selectProject,
    onAddProject,
    setCategories,
    selectCompany,
    onPressProject,
    addCompanies,
    setDate,
    increaseStep,
    decreaseStep,
    enableSearching,
    setCustomerSearchQuery,
    setSelectedCustomerData,
    setCustomerData
} = appointmentSlice.actions;

export default appointmentSlice.reducer;
