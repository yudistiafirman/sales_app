import { PIC } from '@/interfaces';
import React, { createContext, useReducer, Dispatch } from 'react';

interface IProvider {
  children: React.ReactNode;
}

export type DataProject = {
  id: string;
  display_name: string;
  isSelected?: string;
};

export type DataCompany = {
  id?: string;
  name?: string;
  location?: string;
  project?: DataProject[];
  pics?: PIC[];
};

type CompanyCredentials = {
  companyName: string;
  project: {
    id: string;
    name: string;
  };
  pics: PIC[];
};

export interface StepOne {
  routes: any[];
  selectedCategories: string;
  customerType: string;
  individu: CompanyCredentials;
  company: CompanyCredentials;
  location: {};
  errorProject: string;
  errorPics: string;
  errorCompany: string;
  options: {
    loading: false;
    items: any[] | null;
  };
}

export type ProjectStructPayload = {
  id: string;
  name: string;
  locationAddress: {
    line1: string;
    rural: string;
    district: string;
    postalCode: number;
    city: string;
  };
  Company: {
    id: string;
    name: string;
  };
  mainPic: {
    id: string | null;
    name: string | null;
  };
  PIC: PIC[];
};

export interface AppointmentState {
  step: number;
  stepDone: number[];
  searchQuery: string;
  stepOne: StepOne;
  isModalPicVisible: boolean;
  projectData: ProjectStructPayload[];
  selectedCustomerData: DataCompany | null;
  isModalCompanyVisible: boolean;
}

const initialData: AppointmentState = {
  step: 0,
  stepDone: [0],
  searchQuery: '',
  stepOne: {
    routes: [
      {
        key: 'second',
        title: 'Proyek',
        totalItems: 3,
        chipPosition: 'right',
      },
    ],
    selectedCategories: '',
    customerType: '',
    individu: {
      companyName: '',
      project: {
        id: '',
        name: '',
      },
      pics: [],
    },
    company: {
      companyName: '',
      project: {
        id: '',
        name: '',
      },
      pics: [],
    },
    errorCompany: '',
    errorProject: '',
    location: {},
    errorPics: '',
    options: {
      items: null,
      loading: false,
    },
  },
  projectData: [
    {
      id: 'a03943ca-b564-5f56-8a12-adb53f181481',
      name: 'project asik',
      locationAddress: {
        line1: 'bendi besar',
        rural: 'AIK KETEKOK',
        district: 'TANJUNG PANDAN',
        postalCode: 33411,
        city: 'BELITUNG',
      },
      Company: {
        id: '512a5be8-8b84-50b7-b523-b22383ad2e99',
        name: 'WIKI',
      },
      mainPic: {
        id: null,
        name: null,
      },
      PIC: [
        {
          id: 'ccb66bb5-86d6-5319-a400-b7cdfbce5318',
          name: 'udin bapri',
          position: 'ceo',
          phone: '81220656999',
          email: null,
        },
      ],
      Visitation: {
        id: '1c389677-914a-5354-b62f-6a987d355c79',
        order: 1,
        finish_date: null,
        visitation_id: null,
      },
    },
  ],
  selectedCustomerData: null,
  isModalPicVisible: false,
  isModalCompanyVisible: false,
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
  SEARCH_QUERY = 'SEARCH_QUERY',
  SET_CUSTOMER_TYPE = 'SET_CUSTOMER_TYPE',
  SET_PROJECT_NAME = 'SET_PROJECT_NAME',
  SET_PICS = 'SET_PICS',
  TOGGLE_MODAL_PICS = 'TOGGLE_MODAL_PICS',
  ASSIGN_ERROR = 'ASSIGN_ERROR',
  ON_PRESS_COMPANY = 'ON_PRESS_COMPANY',
  TOGGLE_MODAL_COMPANY = 'TOGGLE_MODAL_COMPANY',
  SELECT_PROJECT = 'SELECT_PROJECT',
  ON_ADD_PROJECT = 'ON_ADD_PROJECT',
  SET_CATEGORIES = 'SET_CATEGORIES',
  SELECT_COMPANY = 'SELECT_COMPANY',
  ON_PRESS_PROJECT = 'ON_PRESS_PROJECT',
  INCREASE_STEP = 'INCREASE_STEP',
  DECREASE_STEP = 'DECREASE_STEP',
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
  [AppointmentActionType.TOGGLE_MODAL_PICS]: {};
  [AppointmentActionType.ASSIGN_ERROR]: {
    key: keyof StepOne;
    value: string;
  };
  [AppointmentActionType.ON_PRESS_COMPANY]: {
    value: [];
  };
  [AppointmentActionType.TOGGLE_MODAL_COMPANY]: {};
  [AppointmentActionType.SELECT_PROJECT]: {
    value: [];
  };
  [AppointmentActionType.ON_ADD_PROJECT]: {
    key: string;
    value: {};
  };
  [AppointmentActionType.SET_CATEGORIES]: {
    value: number;
  };
  [AppointmentActionType.SELECT_COMPANY]: {
    key: keyof StepOne;
    value: {};
  };
  [AppointmentActionType.ON_PRESS_PROJECT]: {
    key: string;
    value: {};
  };
  [AppointmentActionType.INCREASE_STEP]: {};
  [AppointmentActionType.DECREASE_STEP]: {};
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
    case AppointmentActionType.SET_CUSTOMER_TYPE:
      return {
        ...state,
        stepOne: {
          ...state.stepOne,
          customerType: action.value,
          errorCompany: '',
          errorProject: '',
          errorPics: '',
        },
      };
    case AppointmentActionType.SET_PROJECT_NAME:
      return {
        ...state,
        stepOne: {
          ...state.stepOne,
          [action.key as keyof StepOne]: {
            ...(state.stepOne[action.key as keyof StepOne] as StepOne),
            project: { name: action.value },
          },
        },
      };
    case AppointmentActionType.SET_PICS:
      return {
        ...state,
        stepOne: {
          ...state.stepOne,
          [action.key as keyof StepOne]: {
            ...(state.stepOne[action.key as keyof StepOne] as StepOne),
            pics: action.value,
          },
        },
      };
    case AppointmentActionType.TOGGLE_MODAL_PICS:
      return {
        ...state,
        isModalPicVisible: !state.isModalPicVisible,
      };
    case AppointmentActionType.ASSIGN_ERROR:
      return {
        ...state,
        stepOne: {
          ...state.stepOne,
          [action.key as keyof StepOne]: action.value,
        },
      };
    case AppointmentActionType.ON_PRESS_COMPANY:
      return {
        ...state,
        isModalCompanyVisible: true,
        selectedCustomerData: action.value,
      };
    case AppointmentActionType.TOGGLE_MODAL_COMPANY: {
      return {
        ...state,
        isModalCompanyVisible: !state.isModalCompanyVisible,
      };
    }
    case AppointmentActionType.SELECT_PROJECT: {
      return {
        ...state,
        selectedCustomerData: {
          ...state.selectedCustomerData,
          project: action.value,
        },
      };
    }
    case AppointmentActionType.ON_ADD_PROJECT: {
      return {
        ...state,
        isModalCompanyVisible: false,
        searchQuery: '',
        stepOne: {
          ...state.stepOne,
          customerType: action.key,
          [action.key as keyof StepOne]: {
            ...(state.stepOne[action.key as keyof StepOne] as StepOne),
            pics: action.value.pics,
            companyName: action.value.companyName,
            project: action.value.project,
          },
        },
      };
    }
    case AppointmentActionType.SET_CATEGORIES: {
      return {
        ...state,
        stepOne: {
          ...state.stepOne,
          selectedCategories: state.stepOne.routes[action.value].title,
        },
      };
    }
    case AppointmentActionType.SELECT_COMPANY: {
      return {
        ...state,
        stepOne: {
          ...state.stepOne,
          [action.key as keyof StepOne]: {
            ...(state.stepOne[action.key as keyof StepOne] as StepOne),
            companyName: action.value,
          },
        },
      };
    }
    case AppointmentActionType.ON_PRESS_PROJECT: {
      return {
        ...state,
        searchQuery: '',
        stepOne: {
          ...state.stepOne,
          customerType: action.key,
          [action.key as keyof StepOne]: {
            ...(state.stepOne[action.key as keyof StepOne] as StepOne),
            pics: action.value.pics,
            projectName: action.value.projectName,
          },
        },
      };
    }
    case AppointmentActionType.INCREASE_STEP: {
      return {
        ...state,
        step: state.step + 1,
      };
    }
    case AppointmentActionType.DECREASE_STEP: {
      return {
        ...state,
        step: state.step - 1,
      };
    }
    default:
      return state;
  }
};

const AppointmentProvider = (props: IProvider) => {
  const { children } = props;

  const [values, dispatchValue] = useReducer(
    reducerForm,
    initialData as AppointmentState
  );
  return (
    <AppoinmentContext.Provider value={[values, dispatchValue]}>
      {children}
    </AppoinmentContext.Provider>
  );
};

export { AppoinmentContext, AppointmentProvider };
