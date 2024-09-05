// src/conversationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConversationState {
  selectedConversationId: string | null;
}

const initialState: ConversationState = {
  selectedConversationId: null,
};

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    setSelectedConversationId(state, action: PayloadAction<string | null>) {
      state.selectedConversationId = action.payload;
    },
  },
});

export const { setSelectedConversationId } = conversationSlice.actions;

export default conversationSlice.reducer;
