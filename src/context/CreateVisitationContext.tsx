import React from 'react';
import {
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
  key?: keyof CreateVisitationSecondStep | keyof CreateVisitationThirdStep;
}

interface context {
  values: CreateVisitationState;
  action: {
    updateValue: (key: keyof CreateVisitationState, value: any) => void;
    updateValueOnstep: (
      step: keyof CreateVisitationState,
      key: keyof CreateVisitationSecondStep | keyof CreateVisitationThirdStep,
      value: any
    ) => void;
  };
}

const initialData: CreateVisitationState = {
  sheetIndex: -1,
  step: 1,
  stepOne: {},
  stepTwo: {
    companyName: '',
    customerType: '',
    location: {},
    pics: [],
    projectName: '',
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
      return { ...state, [action.type]: action.value };
    case 'stepOne':
    case 'stepTwo':
    case 'stepThree':
      return {
        ...state,
        [action.type]: {
          ...state[action.type],
          [action.key!]: action.value,
        },
      };
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
    key: keyof CreateVisitationSecondStep | keyof CreateVisitationThirdStep,
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
