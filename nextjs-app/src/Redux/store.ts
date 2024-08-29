// src/utils/store.ts
import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import authReducer from './authSlice'; // Import the new auth slice

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer, // Add the auth slice to the store
  },
});

// Type for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;