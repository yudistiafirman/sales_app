import * as React from 'react';
import { CreateScheduleContextInterface } from '@/interfaces';

export const CreateScheduleContext = React.createContext<
  CreateScheduleContextInterface | []
>([]);
