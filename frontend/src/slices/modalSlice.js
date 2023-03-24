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
    },
  },
});

const { actions } = channelsSlice;
const selectors = {
  getModalType: (state) => state.modal.type,
  isModalOpened: (state) => state.modal.isOpened,
  getModalContext: (state) => state.modal.context,
};

export { actions, selectors };
export default channelsSlice.reducer;
