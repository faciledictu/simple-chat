/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null,
};

const channelsSlice = createSlice({
  name: 'currentChannel',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.id = action.payload;
    },
  },
});

const { actions } = channelsSlice;

export { actions };
export default channelsSlice.reducer;
