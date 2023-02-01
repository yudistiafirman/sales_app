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

type IndividuInput = {
  projectName: string;
  pics: PIC[];
};

type CompanyInput = {
  companyName: string;
};

export interface StepOne {
  routes: any[];
  selectedCategories: string;
  customerType: string;
  individu: IndividuInput;
  company: IndividuInput & CompanyInput;
  location: {};
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
  customerData: any[];
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
        key: 'first',
        title: 'Perusahaan',
        totalItems: 2,
        chipPosition: 'right',
      },
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
      projectName: '',
      pics: [],
    },
    company: {
      companyName: '',
      projectName: '',
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
  customerData: [
    {
      id: '1',
      name: 'PT Guna Sakti',
      location: 'Cibeunying Kidul',
      project: [
        {
          id: '1',
          display_name: 'Kebun Binatang',
        },
      ],
      pics: [
        {
          name: 'Jajang Sukandar',
          jabatan: 'Supervisor',
          phone: '+6289321456',
          email: 'jajang@gmail.com',
        },
      ],
    },
    {
      id: '2',
      name: 'PT Guna Rambo',
      location: 'Cibeunying Wetan',
      project: [
        {
          id: '2',
          display_name: 'Kuburan',
        },
        {
          id: '3',
          display_name: 'Tana Kusir',
        },
      ],
      pics: [
        {
          name: 'Amin Mahfudin',
          jabatan: 'Manager',
          phone: '+62893214569',
          email: 'Amin@gmail.com',
        },
      ],
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
            projectName: action.value,
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
            projectName: action.value.projectName,
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
          company: {
            ...state.stepOne.company,
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
