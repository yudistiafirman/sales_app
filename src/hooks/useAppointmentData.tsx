import { useContext, Dispatch } from 'react';
import {
  AppoinmentContext,
  AppointmentAction,
  AppointmentState,
} from '@/context/AppointmentContext';

const useAppointmentData = (): [AppointmentState, Dispatch<AppointmentAction>] => {
  const [values, dispatchValue] =
    useContext<[AppointmentState, Dispatch<AppointmentAction>]>(AppoinmentContext);

  return [values, dispatchValue];
};

export default useAppointmentData;
