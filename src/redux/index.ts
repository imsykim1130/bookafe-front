import { configureStore } from '@reduxjs/toolkit';
import { userSlice } from './userSlice.ts';

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});
