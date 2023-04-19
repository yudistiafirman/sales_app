import { createSlice } from '@reduxjs/toolkit';
import { postOrderSph } from '../async-thunks/orderThunks';
import { postUploadFiles } from '../async-thunks/commonThunks';

const initialState = {
  isOrderLoading: false,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(postUploadFiles.pending, (state) => {
      state.isOrderLoading = true;
    });
    builder.addCase(postUploadFiles.rejected, (state) => {
      state.isOrderLoading = false;
    });
    builder.addCase(postOrderSph.pending, (state) => {
      state.isOrderLoading = true;
    });
    builder.addCase(postOrderSph.fulfilled, (state) => {
      state.isOrderLoading = false;
    });
    builder.addCase(postOrderSph.rejected, (state) => {
      state.isOrderLoading = false;
    });
  },
});

export default orderSlice.reducer;
