import {
  CreateDepositFirstStep,
  CreateDepositSecondStep,
  CreateDepositState,
} from '@/interfaces/CreateDeposit';
import * as React from 'react';

interface IProvider {
  children: React.ReactNode;
}

interface ActionCreateDepositState {
  type: keyof CreateDepositState;
  value: any;
  key?: keyof CreateDepositFirstStep | keyof CreateDepositSecondStep;
}

interface context {
  values: CreateDepositState;
  action: {
    updateValue: (key: keyof CreateDepositState, value: any) => void;
    updateValueOnstep: (
      step: keyof CreateDepositState,
      key: keyof CreateDepositFirstStep | keyof CreateDepositSecondStep,
      value: any
    ) => void;
  };
}

const initialData: CreateDepositState = {
  sheetIndex: -1,
  step: 0,
  stepOne: {
    deposit: undefined,
    picts: [],
  },
  stepTwo: {
    companyName: '',
    locationName: '',
    title: '',
    products: [{}],
  },
  shouldScrollView: true,
  existingDepositID: null,
};

const CreateDepositContext = React.createContext<context>({
  values: initialData,
  action: {
    updateValue: () => undefined,
    updateValueOnstep: () => undefined,
  },
});

const reducerForm = (
  state: CreateDepositState,
  action: ActionCreateDepositState
) => {
  switch (action.type) {
    case 'sheetIndex':
    case 'step':
    case 'shouldScrollView':
    case 'existingDepositID':
      return { ...state, [action.type]: action.value };
    case 'stepOne':
    case 'stepTwo':
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

const CreateDepositProvider = (props: IProvider) => {
  const { children } = props;

  const [values, dispatchValue] = React.useReducer(reducerForm, initialData);

  const updateValue = (key: keyof CreateDepositState, value: any) => {
    dispatchValue({ type: key, value: value });
  };

  const updateValueOnstep = (
    step: keyof CreateDepositState,
    key: keyof CreateDepositFirstStep | keyof CreateDepositSecondStep,
    value: any
  ) => {
    dispatchValue({
      type: step,
      value,
      key,
    });
  };

  return (
    <CreateDepositContext.Provider
      value={{
        values: values,
        action: {
          updateValue,
          updateValueOnstep,
        },
      }}
    >
      {children}
    </CreateDepositContext.Provider>
  );
};

export { CreateDepositContext, CreateDepositProvider };
