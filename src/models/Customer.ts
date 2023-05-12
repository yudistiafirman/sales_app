export interface ICustomerListData {
  id?: string;
  name: string;
  displayName?: string;
  type: 'INDIVIDU' | 'COMPANY';
  npwp?: string;
  nik?: string;
}

export interface ICustomerState {
  customerListData?: CustomerListData[];
  isLoading: boolean;
  isRefreshing?: boolean;
  isLoadMore?: boolean;
  searchQuery?: string;
}
