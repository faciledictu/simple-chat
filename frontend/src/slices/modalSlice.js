/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = ({
  type: null,
  context: null,
});

const channelsSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    open: (state, { payload: { type, context = null } }) => {
      state.type = type;
      state.context = context;
    },
    close: (state) => {
      state.type = null;
      state.context = null;
    },
  },
});

const { actions } = channelsSlice;

export { actions };
export default channelsSlice.reducer;
