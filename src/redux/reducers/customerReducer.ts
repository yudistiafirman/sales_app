import { ICustomerState } from '@/models/Customer';
import { createSlice } from '@reduxjs/toolkit';

const initialState: ICustomerState = {
  customerListData: [
    {
      id: '1',
      name: 'D',
      displayName: 'PT Dadang Siberhad',
      type: 'INDIVIDU',
      ktp: '2022123456789',
      npwp: '0023.2345.34566.23456',
    },
    {
      id: '1',
      name: 'D',
      displayName: 'PT Dadang Siberhad',
      type: 'INDIVIDU',
      ktp: '2022123456789',
      npwp: '0023.2345.34566.23456',
    },
    {
      id: '1',
      name: 'D',
      displayName: 'PT Dadang Siberhad',
      type: 'INDIVIDU',
      ktp: '2022123456789',
      npwp: '0023.2345.34566.23456',
    },
    {
      id: '1',
      name: 'K',
      displayName: 'PT Kramat djati',
      type: 'Perusahaan',
      ktp: '2022123456789',
      npwp: '0023.2345.34566.23456',
    },
    {
      id: '1',
      name: 'P',
      displayName: 'PO Haryono',
      type: 'Perusahaan',
      ktp: '2022123456789',
      npwp: '0023.2345.34566.23456',
    },
  ],
  isLoading: false,
  isRefreshing: false,
  isLoadMore: false,
};

export const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    resetCustomerState: () => {
      return initialState;
    },
  },
});

export const { resetCustomerState } = customerSlice.actions;
export default customerSlice.reducer;
