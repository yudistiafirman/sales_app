import * as React from "react";
import {
    CreateDepositFirstStep,
    CreateDepositSecondStep,
    CreateDepositState
} from "@/interfaces/CreateDeposit";

interface IProvider {
    children: React.ReactNode;
}

interface ActionCreateDepositState {
    type: keyof CreateDepositState;
    value: any;
    key?: keyof CreateDepositFirstStep | keyof CreateDepositSecondStep;
}

interface Context {
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
    stepOne: undefined,
    stepTwo: undefined,
    shouldScrollView: true,
    existingProjectID: undefined,
    isSearchingPurchaseOrder: false
};

const CreateDepositContext = React.createContext<Context>({
    values: initialData,
    action: {
        updateValue: () => undefined,
        updateValueOnstep: () => undefined
    }
});

const reducerForm = (
    state: CreateDepositState,
    action: ActionCreateDepositState
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
                    [action.key!]: action.value
                }
            };

        default:
            return state;
    }
};

function CreateDepositProvider(props: IProvider) {
    const { children } = props;

    const [values, dispatchValue] = React.useReducer(reducerForm, initialData);

    const updateValue = (key: keyof CreateDepositState, value: any) => {
        dispatchValue({ type: key, value });
    };

    const updateValueOnstep = (
        step: keyof CreateDepositState,
        key: keyof CreateDepositFirstStep | keyof CreateDepositSecondStep,
        value: any
    ) => {
        dispatchValue({
            type: step,
            value,
            key
        });
    };

    const renderView = () => (
        <CreateDepositContext.Provider
            value={{
                values,
                action: {
                    updateValue,
                    updateValueOnstep
                }
            }}
        >
            {children}
        </CreateDepositContext.Provider>
    );

    return renderView;
}

export { CreateDepositContext, CreateDepositProvider };
