import React, { createContext, useReducer, Dispatch } from "react";
import { DateData } from "react-native-calendars";
import { Address, PIC, selectedCompanyInterface } from "@/interfaces";

interface IProvider {
    children: React.ReactNode;
}

export type DataCompany = {
    id?: string;
    name?: string;
    location?: string;
    project?: DataProject[];
    pics?: PIC[];
};

export interface StepOne {
    routes: any[];
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

export interface AppointmentState {
    step: number;
    stepDone: number[];
    searchQuery: string;
    stepOne: StepOne;
    isModalPicVisible: boolean;
    selectedDate: DateData | null;
    selectedCustomerData: DataCompany | null;
    isModalCompanyVisible: boolean;
    isSearching: boolean;
}

const initialData: AppointmentState = {
    step: 0,
    stepDone: [0],
    searchQuery: "",
    stepOne: {
        routes: [
            {
                key: "second",
                title: "Proyek",
                totalItems: 3,
                chipPosition: "right"
            }
        ],
        selectedCategories: "",
        customerType: "",
        individu: {
            id: "",
            name: "",
            Company: {
                id: "",
                title: ""
            },
            PIC: [],
            Visitation: {
                finish_date: null,
                id: "",
                order: 1,
                visitation_id: null
            },
            locationAddress: {
                city: undefined,
                district: undefined,
                line1: undefined,
                postalCode: undefined,
                rural: undefined
            },
            mainPic: {
                id: null,
                name: null
            }
        },
        company: {
            id: "",
            name: "",
            Company: {
                id: "",
                title: ""
            },
            PIC: [],
            Visitation: {
                finish_date: null,
                id: "",
                order: 1,
                visitation_id: null
            },
            locationAddress: {
                city: undefined,
                district: undefined,
                line1: undefined,
                postalCode: undefined,
                rural: undefined
            },
            mainPic: {
                id: null,
                name: null
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
    selectedDate: null,
    selectedCustomerData: null,
    isModalPicVisible: false,
    isModalCompanyVisible: false,
    isSearching: false
};

type ActionMap<M extends { [index: string]: any }> = {
    [Key in keyof M]: M[Key] extends undefined
        ? {
              type: Key;
          }
        : {
              type: Key;
              key?: keyof StepOne;
              value?: any;
          };
};

export enum AppointmentActionType {
    SEARCH_QUERY = "SEARCH_QUERY",
    SET_CUSTOMER_TYPE = "SET_CUSTOMER_TYPE",
    SET_PROJECT_NAME = "SET_PROJECT_NAME",
    SET_PICS = "SET_PICS",
    TOGGLE_MODAL_PICS = "TOGGLE_MODAL_PICS",
    ASSIGN_ERROR = "ASSIGN_ERROR",
    ON_PRESS_COMPANY = "ON_PRESS_COMPANY",
    TOGGLE_MODAL_COMPANY = "TOGGLE_MODAL_COMPANY",
    SELECT_PROJECT = "SELECT_PROJECT",
    ON_ADD_PROJECT = "ON_ADD_PROJECT",
    SET_CATEGORIES = "SET_CATEGORIES",
    SELECT_COMPANY = "SELECT_COMPANY",
    ON_PRESS_PROJECT = "ON_PRESS_PROJECT",
    ADD_COMPANIES = "ADD_COMPANIES",
    SET_COMPANIES_NAME = "SET_COMPANIES_NAME",
    SET_DATE = "SET_DATE",
    INCREASE_STEP = "INCREASE_STEP",
    DECREASE_STEP = "DECREASE_STEP",
    RESET_STATE = "RESET_STATE",
    ENABLE_SEARCHING = "ENABLE_SEARCHING"
}

type AppointmentPayload = {
    [AppointmentActionType.SEARCH_QUERY]: {
        value: string;
    };
    [AppointmentActionType.SET_CUSTOMER_TYPE]: {
        value: string;
    };
    [AppointmentActionType.SET_PROJECT_NAME]: {
        key: keyof StepOne;
        value: string;
    };
    [AppointmentActionType.SET_PICS]: {
        key: keyof StepOne;
        value: string;
    };
    [AppointmentActionType.TOGGLE_MODAL_PICS]: Record<string, never>;
    [AppointmentActionType.ASSIGN_ERROR]: {
        key: keyof StepOne;
        value: string;
    };
    [AppointmentActionType.ON_PRESS_COMPANY]: {
        value: [];
    };
    [AppointmentActionType.TOGGLE_MODAL_COMPANY]: Record<string, never>;
    [AppointmentActionType.SELECT_PROJECT]: {
        value: [];
    };
    [AppointmentActionType.ON_ADD_PROJECT]: {
        key: string;
        value: Record<string, never>;
    };
    [AppointmentActionType.SET_CATEGORIES]: {
        value: number;
    };
    [AppointmentActionType.SELECT_COMPANY]: {
        key: keyof StepOne;
        value: Record<string, never>;
    };
    [AppointmentActionType.ON_PRESS_PROJECT]: {
        key: string;
        value: Record<string, never>;
    };
    [AppointmentActionType.ADD_COMPANIES]: {
        value: [];
    };
    [AppointmentActionType.SET_COMPANIES_NAME]: {
        value: string;
    };
    [AppointmentActionType.SET_DATE]: {
        value: DateData;
    };
    [AppointmentActionType.INCREASE_STEP]: Record<string, never>;
    [AppointmentActionType.DECREASE_STEP]: Record<string, never>;
    [AppointmentActionType.RESET_STATE]: Record<string, never>;
    [AppointmentActionType.ENABLE_SEARCHING]: {
        value: boolean;
    };
};

export type AppointmentAction =
    ActionMap<AppointmentPayload>[keyof ActionMap<AppointmentPayload>];

const AppoinmentContext = createContext<
    [AppointmentState, Dispatch<AppointmentAction>]
>([initialData, () => {}]);

const reducerForm = (state: AppointmentState, action: AppointmentAction) => {
    switch (action.type) {
        case AppointmentActionType.SEARCH_QUERY:
            return { ...state, searchQuery: action.value };
        case AppointmentActionType.SET_COMPANIES_NAME:
            return {
                ...state,
                stepOne: {
                    ...state.stepOne,
                    errorCompany: "",
                    company: {
                        ...state.stepOne.company,
                        Company: {
                            ...state.stepOne.company.Company,
                            title: action.value
                        }
                    }
                }
            };
        case AppointmentActionType.SET_CUSTOMER_TYPE:
            return {
                ...state,
                stepOne: {
                    ...state.stepOne,
                    customerType: action.value,
                    errorCompany: "",
                    errorProject: "",
                    errorPics: "",
                    company: {
                        ...state.stepOne.company,
                        Company: { ...state.stepOne.company.Company }
                    }
                }
            };
        case AppointmentActionType.SET_PROJECT_NAME:
            return {
                ...state,
                stepOne: {
                    ...state.stepOne,
                    errorProject: "",
                    [action.key as keyof StepOne]: {
                        ...(state.stepOne[
                            action.key as keyof StepOne
                        ] as StepOne),
                        name: action.value
                    }
                }
            };
        case AppointmentActionType.SET_PICS:
            return {
                ...state,
                isModalPicVisible: false,
                stepOne: {
                    ...state.stepOne,
                    errorPics: "",
                    [action.key as keyof StepOne]: {
                        ...(state.stepOne[
                            action.key as keyof StepOne
                        ] as StepOne),
                        PIC: action.value
                    }
                }
            };
        case AppointmentActionType.TOGGLE_MODAL_PICS:
            return {
                ...state,
                isModalPicVisible: !state.isModalPicVisible
            };
        case AppointmentActionType.ASSIGN_ERROR:
            return {
                ...state,
                stepOne: {
                    ...state.stepOne,
                    [action.key as keyof StepOne]: action.value
                }
            };
        case AppointmentActionType.ON_PRESS_COMPANY:
            return {
                ...state,
                isModalCompanyVisible: true,
                selectedCustomerData: action.value
            };
        case AppointmentActionType.TOGGLE_MODAL_COMPANY: {
            return {
                ...state,
                isModalCompanyVisible: !state.isModalCompanyVisible
            };
        }
        case AppointmentActionType.SELECT_PROJECT: {
            return {
                ...state,
                selectedCustomerData: {
                    ...state.selectedCustomerData,
                    project: action.value
                }
            };
        }
        case AppointmentActionType.ON_ADD_PROJECT: {
            return {
                ...state,
                isModalCompanyVisible: false,
                isSearching: false,
                searchQuery: "",
                stepOne: {
                    ...state.stepOne,
                    customerType: action.key,
                    errorPics: "",
                    errorCompany: "",
                    errorProject: "",
                    [action.key as keyof StepOne]: {
                        ...(state.stepOne[
                            action.key as keyof StepOne
                        ] as StepOne),
                        ...action.value
                    }
                }
            };
        }
        case AppointmentActionType.SET_CATEGORIES: {
            return {
                ...state,
                stepOne: {
                    ...state.stepOne,
                    selectedCategories: state.stepOne.routes[action.value].title
                }
            };
        }
        case AppointmentActionType.SELECT_COMPANY: {
            return {
                ...state,
                stepOne: {
                    ...state.stepOne,
                    [action.key as keyof StepOne]: {
                        ...(state.stepOne[
                            action.key as keyof StepOne
                        ] as StepOne),
                        Company: action.value
                    }
                }
            };
        }
        case AppointmentActionType.ON_PRESS_PROJECT: {
            return {
                ...state,
                searchQuery: "",
                stepOne: {
                    ...state.stepOne,
                    customerType: action.key,
                    [action.key as keyof StepOne]: {
                        ...(state.stepOne[
                            action.key as keyof StepOne
                        ] as StepOne),
                        pics: action.value.pics,
                        projectName: action.value.projectName
                    }
                }
            };
        }
        case AppointmentActionType.ADD_COMPANIES: {
            return {
                ...state,
                stepOne: {
                    ...state.stepOne,
                    options: {
                        ...state.stepOne.options.items,
                        items: action.value
                    }
                }
            };
        }
        case AppointmentActionType.SET_DATE: {
            return {
                ...state,
                selectedDate: action.value
            };
        }
        case AppointmentActionType.INCREASE_STEP: {
            return {
                ...state,
                step: state.step + 1
            };
        }
        case AppointmentActionType.DECREASE_STEP: {
            return {
                ...state,
                step: state.step - 1
            };
        }
        case AppointmentActionType.RESET_STATE: {
            return initialData;
        }
        case AppointmentActionType.ENABLE_SEARCHING: {
            return {
                ...state,
                isSearching: action.value
            };
        }
        default:
            return state;
    }
};

function AppointmentProvider(props: IProvider) {
    const { children } = props;

    const [values, dispatchValue] = useReducer(reducerForm, initialData);

    function renderView() {
        return (
            <AppoinmentContext.Provider value={[values, dispatchValue]}>
                {children}
            </AppoinmentContext.Provider>
        );
    }

    return renderView();
}

export { AppoinmentContext, AppointmentProvider };
