/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = ({
  isOpened: false,
  type: null,
  context: null,
});

const channelsSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    open: (state, { payload: { type, context = null } }) => {
      state.isOpened = true;
      state.type = type;
      state.context = context;
    },
    close: (state) => {
      state.isOpened = false;
      state.type = null;
      state.context = null;
    },
  },
});

const { actions } = channelsSlice;

export { actions };
export default channelsSlice.reducer;
