// src/utils/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/User';

interface AuthState {
  loggedIn: boolean;
  user?: User; // Optional because the user might not be available initially
}

const initialState: AuthState = {
  loggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = undefined;
    },
  },
});

export const { setLoggedIn, setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
