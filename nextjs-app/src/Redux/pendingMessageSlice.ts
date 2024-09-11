import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MessageState {
  pendingMessageCount: number;
}

const initialState: MessageState = {
  pendingMessageCount: 0,
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    incrementPendingMessageCount(state) {
      state.pendingMessageCount += 1;
    },
    resetPendingMessageCount(state) {
      state.pendingMessageCount = 0;
    },
    setPendingMessageCount(state, action: PayloadAction<number>) {
      state.pendingMessageCount = action.payload;
    },
  },
});

export const { incrementPendingMessageCount, resetPendingMessageCount, setPendingMessageCount } = messageSlice.actions;
export default messageSlice.reducer;
