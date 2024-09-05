// src/utils/store.ts
import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import authReducer from './authSlice';
import conversationReducer from './conversationSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    conversation: conversationReducer, 
  },
});

// Type for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
