import React from 'react';
import { SphContextInterface } from '@/interfaces';

export const SphContext = React.createContext<SphContextInterface | []>([]);
