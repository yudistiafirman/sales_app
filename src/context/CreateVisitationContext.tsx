import React from 'react';
import {
  CreateVisitationFirstStep,
  CreateVisitationFourthStep,
  CreateVisitationSecondStep,
  CreateVisitationState,
  CreateVisitationThirdStep,
} from '@/interfaces';

interface IProvider {
  children: React.ReactNode;
}

interface ActionCreateVisitationState {
  type: keyof CreateVisitationState;
  value: any;
  key?:
    | keyof CreateVisitationFirstStep
    | keyof CreateVisitationSecondStep
    | keyof CreateVisitationThirdStep
    | keyof CreateVisitationFourthStep;
}

interface context {
  values: CreateVisitationState;
  action: {
    updateValue: (key: keyof CreateVisitationState, value: any) => void;
    updateValueOnstep: (
      step: keyof CreateVisitationState,
      key:
        | keyof CreateVisitationFirstStep
        | keyof CreateVisitationSecondStep
        | keyof CreateVisitationThirdStep
        | keyof CreateVisitationFourthStep,
      value: any
    ) => void;
  };
}

const initialData: CreateVisitationState = {
  sheetIndex: -1,
  step: 0,
  stepOne: {
    createdLocation: {
      lat: 0,
      lon: 0,
      postalId: undefined,
      formattedAddress: '',
    },
    locationAddress: {
      lat: 0,
      lon: 0,
      postalId: undefined,
      formattedAddress: '',
      line2: '',
    },
    existingLocationId: '',
  },
  stepTwo: {
    companyName: '',
    customerType: '',
    location: {},
    pics: [],
    selectedPic: null,
    projectName: '',
    options: {
      items: null,
      loading: false,
    },
    projectId: '',
  },
  stepThree: {
    estimationDate: {
      estimationMonth: null,
      estimationWeek: null,
    },
    notes: '',
    paymentType: '',
    products: [],
    stageProject: '',
  },
  stepFour: {
    selectedDate: null,
    images: [],
    kategoriAlasan: null,
    alasanPenolakan: '',
  },
  shouldScrollView: true,
  existingVisitationId: null,
};

const createVisitationContext = React.createContext<context>({
  values: initialData,
  action: {
    updateValue: () => undefined,
    updateValueOnstep: () => undefined,
  },
});

const reducerForm = (
  state: CreateVisitationState,
  action: ActionCreateVisitationState
) => {
  switch (action.type) {
    case 'sheetIndex':
    case 'step':
    case 'shouldScrollView':
    case 'existingVisitationId':
      return { ...state, [action.type]: action.value };
    case 'stepOne':
    case 'stepTwo':
    case 'stepThree':
    case 'stepFour':
      return {
        ...state,
        [action.type]: {
          ...state[action.type],
          [action.key!]: action.value,
        },
      };

    //   return { ...state, [action.type]: action.value };
    default:
      return state;
  }
};

const CreateVisitationProvider = (props: IProvider) => {
  const { children } = props;

  const [values, dispatchValue] = React.useReducer(reducerForm, initialData);

  const updateValue = (key: keyof CreateVisitationState, value: any) => {
    dispatchValue({ type: key, value: value });
  };

  const updateValueOnstep = (
    step: keyof CreateVisitationState,
    key:
      | keyof CreateVisitationFirstStep
      | keyof CreateVisitationSecondStep
      | keyof CreateVisitationThirdStep
      | keyof CreateVisitationFourthStep,
    value: any
  ) => {
    dispatchValue({
      type: step,
      value,
      key,
    });
  };

  return (
    <createVisitationContext.Provider
      value={{
        values: values,
        action: {
          updateValue,
          updateValueOnstep,
        },
      }}
    >
      {children}
    </createVisitationContext.Provider>
  );
};

export { createVisitationContext, CreateVisitationProvider };
