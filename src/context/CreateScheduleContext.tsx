import * as React from "react";
import {
  CreateScheduleFirstStep,
  CreateScheduleSecondStep,
  CreateScheduleState,
} from "@/interfaces/CreateSchedule";

interface IProvider {
  children: React.ReactNode;
}

interface ActionCreateScheduleState {
  type: keyof CreateScheduleState;
  value: any;
  key?: keyof CreateScheduleFirstStep | keyof CreateScheduleSecondStep;
}

interface context {
  values: CreateScheduleState;
  action: {
    updateValue: (key: keyof CreateScheduleState, value: any) => void;
    updateValueOnstep: (
      step: keyof CreateScheduleState,
      key: keyof CreateScheduleFirstStep | keyof CreateScheduleSecondStep,
      value: any
    ) => void;
  };
}

const initialData: CreateScheduleState = {
  sheetIndex: -1,
  step: 0,
  stepOne: undefined,
  stepTwo: undefined,
  shouldScrollView: true,
  existingProjectID: undefined,
  isSearchingPurchaseOrder: false,
};

const CreateScheduleContext = React.createContext<context>({
  values: initialData,
  action: {
    updateValue: () => undefined,
    updateValueOnstep: () => undefined,
  },
});

const reducerForm = (
  state: CreateScheduleState,
  action: ActionCreateScheduleState
) => {
  switch (action.type) {
    case "sheetIndex":
    case "step":
    case "shouldScrollView":
    case "isSearchingPurchaseOrder":
    case "existingProjectID":
      return { ...state, [action.type]: action.value };
    case "stepOne":
    case "stepTwo":
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

function CreateScheduleProvider(props: IProvider) {
  const { children } = props;

  const [values, dispatchValue] = React.useReducer(reducerForm, initialData);

  const updateValue = (key: keyof CreateScheduleState, value: any) => {
    dispatchValue({ type: key, value });
  };

  const updateValueOnstep = (
    step: keyof CreateScheduleState,
    key: keyof CreateScheduleFirstStep | keyof CreateScheduleSecondStep,
    value: any
  ) => {
    dispatchValue({
      type: step,
      value,
      key,
    });
  };

  return (
    <CreateScheduleContext.Provider
      value={{
        values,
        action: {
          updateValue,
          updateValueOnstep,
        },
      }}
    >
      {children}
    </CreateScheduleContext.Provider>
  );
}

export { CreateScheduleContext, CreateScheduleProvider };
