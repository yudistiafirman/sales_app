import { Address, ProjectDetail } from '@/interfaces';
import { PIC } from '@/interfaces';

export interface ICustomerListData {
  id: string;
  name: string;
  displayName?: string;
  type: 'INDIVIDU' | 'COMPANY';
  npwp?: string;
  nik?: string;
}

export interface ICustomerDeposit {
  availableDeposit?: number;
  totalDeposit?: number;
  scheduleDeposit?: number;
  usedDeposit?: number;
}

export interface ICustomerDetail {
  id: string;
  displayName?: string;
  type: 'COMPANY' | 'INDIVIDU';
  npwp?: string;
  nik?: string;
  Pic?: PIC;
  CustomerDeposit?: ICustomerDeposit;
  BillingAddress?: Address;
  Projects: ProjectDetail[];
}

export interface ICustomerState {
  customerListData?: CustomerListData[];
  isLoading: boolean;
  isRefreshing?: boolean;
  isLoadMore?: boolean;
  searchQuery?: string;
}
