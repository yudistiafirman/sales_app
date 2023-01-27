import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import cameraReducer from './reducers/cameraReducer';
import locationReducer from './reducers/locationReducer';

export const store = configureStore({
  reducer: {
    location: locationReducer,
    auth: authReducer,
    camera: cameraReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
