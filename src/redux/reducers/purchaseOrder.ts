import POMachine from '@/machine/PoMachine';
import { createXStateSlice } from '../customSlice/createXStateSlice';

export const purchaseOrderSlice = createXStateSlice({
  // Pass in a unique, descriptive name for the slice
  name: 'purchaseorder',
  // Pass in the machine
  machine: POMachine,
  /**
   * Get the state we want to pass from the machine
   * to Redux.
   */
  getSelectedState: state => ({
    currentState: state,
  }),
});

export default purchaseOrderSlice.reducer;
