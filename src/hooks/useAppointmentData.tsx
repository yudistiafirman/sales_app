import {
  AppoinmentContext,
  AppointmentAction,
  AppointmentState,
} from '@/context/AppointmentContext';
import { useContext, Dispatch } from 'react';

const useAppointmentData = (): [
  AppointmentState,
  Dispatch<AppointmentAction>
] => {
  const [values, dispatchValue] =
    useContext<[AppointmentState, Dispatch<AppointmentAction>]>(
      AppoinmentContext
    );

  return [values, dispatchValue];
};

export default useAppointmentData;
