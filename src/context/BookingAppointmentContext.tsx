import React, { createContext, useContext, useReducer } from 'react';

const initialData = {
  stepOne: {
    customerType: '',
    companyName: '',
    projectName: '',
    location: {},
    pics: [],
    options: {
      items: null,
      loading: false,
    },
  },
};

const AppoinmentContext = createContext({
  values: initialData,
  action: {
    updateValue: () => undefined,
    updateValueOnstep: () => undefined,
  },
});

const reducerForm = (state, action) => {
  console.log('ini action', action);
  switch (action.type) {
    case 'stepOne':
      return {
        ...state,
        stepOne: { ...state.stepOne, [action.key]: action.value },
      };
    default:
      return state;
  }
};

const AppointmentProvider = (props: React.ReactNode) => {
  const { children } = props;

  const [values, dispatchValue] = useReducer(reducerForm, initialData);
  const updateValue = (key, value) => {
    dispatchValue({ type: key, value: value });
  };

  const updateValueOnstep = (step, key, value: any) => {
    dispatchValue({
      type: step,
      value,
      key,
    });
  };

  return (
    <AppoinmentContext.Provider
      value={{
        values: values,
        action: {
          updateValue,
          updateValueOnstep,
        },
      }}
    >
      {children}
    </AppoinmentContext.Provider>
  );
};

export { AppoinmentContext, AppointmentProvider };
