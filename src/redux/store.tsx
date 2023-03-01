import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import commonReducer from './reducers/commonReducer';
import cameraReducer from './reducers/cameraReducer';
import locationReducer from './reducers/locationReducer';
import modalReducer from './reducers/modalReducer';
import productivityFlowReducer from './reducers/productivityFlowReducer';
import orderReducer from './reducers/orderReducer';
import snackbarReducer from './reducers/snackbarReducer';
import { createXStateMiddleware } from './middleware/createXStateMiddleware';
import purchaseOrderReducer, {
  purchaseOrderSlice,
} from './reducers/purchaseOrder';

export const store = configureStore({
  reducer: {
    location: locationReducer,
    auth: authReducer,
    modal: modalReducer,
    productivity: productivityFlowReducer,
    common: commonReducer,
    camera: cameraReducer,
    order: orderReducer,
    snackbar: snackbarReducer,
    purchaseOrder: purchaseOrderReducer,
  },
  middleware: [createXStateMiddleware(purchaseOrderSlice)],
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
