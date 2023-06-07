import {
    projectPayloadType,
    PIC,
    selectedCompanyInterface
} from "@/interfaces";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type DataCompany = {
    id?: string;
    name?: string;
    location?: string;
    project?: projectPayloadType;
    pics?: PIC[];
};

export interface StepOne {
    routes: Iroutes[];
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

interface Iroutes {
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
            Pic: {}
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
            Pic: {}
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
            searchQuery: actions.payload.value
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
                        title: actions.payload.value
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
                customerType: actions.payload.value,
                errorCompany: "",
                errorProject: "",
                errorPics: "",
                company: {
                    ...state.stepOne.company,
                    Company: { ...state.stepOne.company.Company }
                }
            }
        }),
        setProjectName: (
            state,
            actions: PayloadAction<{ key: keyof StepOne; value: string }>
        ) => ({
            ...state,
            stepOne: {
                ...state.stepOne,
                errorProject: "",
                [actions.payload.key]: {
                    ...(state.stepOne[actions.payload.key] as StepOne),
                    name: actions.payload.value
                }
            }
        }),
        setPics: (
            state,
            actions: PayloadAction<{ key: keyof StepOne; value: PIC }>
        ) => ({
            ...state,
            isModalPicVisible: false,
            stepOne: {
                ...state.stepOne,
                errorPics: "",
                [actions.payload.key]: {
                    ...(state.stepOne[actions.payload.key] as StepOne),
                    Pics: actions.payload.value
                }
            }
        }),
        toggleModalPics: (
            state,
            actions: PayloadAction<{ value: boolean }>
        ) => ({
            ...state,
            isModalPicVisible: actions.payload.value
        }),
        assignError: (
            state,
            actions: PayloadAction<{ key: keyof StepOne; value: string }>
        ) => ({
            ...state,
            stepOne: {
                ...state.stepOne,
                [actions.payload.key]: actions.payload.value
            }
        }),
        onPressCompany: (
            state,
            actions: PayloadAction<{ value: selectedCompanyInterface }>
        ) => ({
            ...state,
            isModalCompanyVisible: true,
            selectedCustomerData: actions.payload.value
        }),
        toggleModalCompany: (state) => ({
            ...state,
            isModalCompanyVisible: !state.isModalCompanyVisible
        }),
        selectProject: (state, actions: PayloadAction<{ value: any }>) => ({
            ...state,
            selectedCustomerData: {
                ...state.selectedCustomerData,
                project: actions.payload.value
            }
        }),
        onAddProject: (
            state,
            actions: PayloadAction<{ key: keyof StepOne; value: DataCompany }>
        ) => ({
            ...state,
            isModalCompanyVisible: false,
            isSearching: false,
            searchQuery: "",
            stepOne: {
                ...state.stepOne,
                customerType: actions.payload.key,
                errorPics: "",
                errorCompany: "",
                errorProject: "",
                [actions.payload.key as keyof StepOne]: {
                    ...(state.stepOne[actions.payload.key] as StepOne),
                    ...actions.payload.value
                }
            }
        }),
        setCategories: (state, actions: PayloadAction<{ value: number }>) => ({
            ...state,
            stepOne: {
                ...state.stepOne,
                selectedCategories:
                    state.stepOne.routes[actions.payload.value].title
            }
        }),
        selectCompany: (
            state,
            actions: PayloadAction<{ key: keyof StepOne; value: DataCompany }>
        ) => ({
            ...state,
            stepOne: {
                ...state.stepOne,
                [actions.payload.key]: {
                    ...(state.stepOne[actions.payload.key] as StepOne),
                    Company: actions.payload.value
                }
            }
        }),
        onPressProject: (
            state,
            actions: PayloadAction<{
                key: keyof StepOne;
                projectName: string;
                pics: PIC;
            }>
        ) => ({
            ...state,
            searchQuery: "",
            stepOne: {
                ...state.stepOne,
                customerType: actions.payload.key,
                [actions.payload.key as keyof StepOne]: {
                    ...(state.stepOne[
                        actions.payload.key as keyof StepOne
                    ] as StepOne),
                    Pics: actions.payload.pics,
                    projectName: actions.payload.projectName
                }
            }
        }),
        addCompanies: (state, actions) => ({
            ...state,
            stepOne: {
                ...state.stepOne,
                options: {
                    ...state.stepOne.options.items,
                    items: actions.payload.value
                }
            }
        }),
        setDate: (state, actions: PayloadAction<{ value: SelectedDate }>) => ({
            ...state,
            selectedDate: actions.payload.value
        }),
        increaseStep: (state) => ({
            ...state,
            step: state.step + 1
        }),
        decreateStep: (state) => ({
            ...state,
            step: state.step - 1
        }),
        enableSearching: (
            state,
            actions: PayloadAction<{ value: boolean }>
        ) => ({
            ...state,
            isSearching: actions.payload.value
        }),
        resetAppointmentState: () => initialState
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
    decreateStep,
    enableSearching
} = appointmentSlice.actions;
