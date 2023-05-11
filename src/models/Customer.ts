export interface ICustomerListData {
  id?: string;
  name: string;
  displayName?: string;
  type: 'INDIVIDUAL' | 'COMPANY';
  npwp?: string;
  ktp?: string;
}

export interface ICustomerState {
  customerListData?: CustomerListData[];
  isLoading: boolean;
  isRefreshing?: boolean;
  isLoadMore?: boolean;
}
