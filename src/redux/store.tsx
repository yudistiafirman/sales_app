import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
import { persistReducer, persistStore } from 'redux-persist';
import authReducer from './reducers/authReducer';
import commonReducer from './reducers/commonReducer';
import cameraReducer from './reducers/cameraReducer';
import locationReducer from './reducers/locationReducer';
import modalReducer from './reducers/modalReducer';
import productivityFlowReducer from './reducers/productivityFlowReducer';
import orderReducer from './reducers/orderReducer';
import snackbarReducer from './reducers/snackbarReducer';
import SphReducer from './reducers/SphReducer';
import autoMergeLevel1 from 'redux-persist/es/stateReconciler/autoMergeLevel1';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel1,
};

const sphStatePersisted = persistReducer(persistConfig, SphReducer);

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
    sphState: sphStatePersisted,
  },
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare({ serializableCheck: false }),
});
export const persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
