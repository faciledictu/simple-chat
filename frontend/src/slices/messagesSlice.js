import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const messagesAdapter = createEntityAdapter();

const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessages: messagesAdapter.addMany,
    addMessage: messagesAdapter.addOne,
  },
});

const { actions } = messagesSlice;
const selectors = messagesAdapter.getSelectors((state) => state.messages);

export { actions, selectors };
export default messagesSlice.reducer;
