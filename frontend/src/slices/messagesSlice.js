import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import * as channelsSlice from './channelsSlice.js';

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessages: messagesAdapter.addMany,
    addMessage: messagesAdapter.addOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelsSlice.actions.removeChannel, (state, { payload }) => {
        const restMessages = Object.values(state.entities).filter((e) => e.channelId !== payload);
        messagesAdapter.setAll(state, restMessages);
      });
  },
});

const { actions } = messagesSlice;
const selectors = messagesAdapter.getSelectors((state) => state.messages);

export { actions, selectors };
export default messagesSlice.reducer;
