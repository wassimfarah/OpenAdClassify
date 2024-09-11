// src/utils/store.ts
import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import authReducer from './authSlice';
import conversationReducer from './conversationSlice';
import pendingMessageReducer from './pendingMessageSlice'; 
import conversationStyleReducer from './conversationStyleSlice';
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    conversation: conversationReducer, 
    message: pendingMessageReducer,  
    conversationStyle: conversationStyleReducer, 
  },
});

// Type for state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
