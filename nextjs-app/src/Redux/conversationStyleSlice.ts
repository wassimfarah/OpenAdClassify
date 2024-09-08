import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConversationStyleState {
  highlightedConversationId: number | null;
}

const initialState: ConversationStyleState = {
  highlightedConversationId: null,
};

const conversationStyleSlice = createSlice({
  name: 'conversationStyle',
  initialState,
  reducers: {
    highlightConversation(state, action: PayloadAction<number | null>) {
      state.highlightedConversationId = action.payload;
    },
  },
});

export const { highlightConversation } = conversationStyleSlice.actions;
export default conversationStyleSlice.reducer;
