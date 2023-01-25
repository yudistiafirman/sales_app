import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/authReducer';
import locationReducer from './reducers/locationReducer';

export const store = configureStore({
  reducer: {
    location: locationReducer,
    auth: authReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
