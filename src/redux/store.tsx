import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-community/async-storage";
import { persistReducer, persistStore } from "redux-persist";
import autoMergeLevel1 from "redux-persist/es/stateReconciler/autoMergeLevel1";
import authReducer from "./reducers/authReducer";
import commonReducer from "./reducers/commonReducer";
import cameraReducer, { CameraGlobalState } from "./reducers/cameraReducer";
import locationReducer from "./reducers/locationReducer";
import modalReducer from "./reducers/modalReducer";
import productivityFlowReducer from "./reducers/productivityFlowReducer";
import orderReducer from "./reducers/orderReducer";
import snackbarReducer from "./reducers/snackbarReducer";
import { createXStateMiddleware } from "./middleware/createXStateMiddleware";
import purchaseOrderReducer, {
  purchaseOrderSlice,
} from "./reducers/purchaseOrder";
import SphReducer from "./reducers/SphReducer";
import VisitationReducer, {
  VisitationGlobalState,
} from "./reducers/VisitationReducer";
import { SphStateInterface } from "@/interfaces";
import operationReducer, {
  operationInitState,
} from "./reducers/operationReducer";
import salesOrderReducer, { SOGlobalState } from "./reducers/salesOrder";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel1,
};

const rootReducer = combineReducers({
  location: locationReducer,
  auth: authReducer,
  modal: modalReducer,
  productivity: productivityFlowReducer,
  common: commonReducer,
  order: orderReducer,
  snackbar: snackbarReducer,
  purchaseOrder: purchaseOrderReducer,
  operation: persistReducer<operationInitState, any>(
    persistConfig,
    operationReducer
  ),
  salesOrder: persistReducer<SOGlobalState, any>(
    persistConfig,
    salesOrderReducer
  ),
  sph: persistReducer<SphStateInterface, any>(persistConfig, SphReducer),
  visitation: persistReducer<VisitationGlobalState, any>(
    persistConfig,
    VisitationReducer
  ),
  camera: persistReducer<CameraGlobalState, any>(persistConfig, cameraReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleWare) =>
    getDefaultMiddleWare({
      immutableCheck: false,
      serializableCheck: false,
    }).concat([createXStateMiddleware(purchaseOrderSlice)]),
});

export const persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
