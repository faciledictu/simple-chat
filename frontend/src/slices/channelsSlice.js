/* eslint-disable no-param-reassign */
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const DEFAULT_CHANNEL_ID = 1;

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState({
  currentChannelId: DEFAULT_CHANNEL_ID,
});

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannels: channelsAdapter.addMany,
    addChannel: channelsAdapter.setOne,
    removeChannel: (state, { payload }) => {
      if (state.currentChannelId === payload) {
        const newCurrentChannelId = state.ids[0];
        state.currentChannelId = newCurrentChannelId;
      }

      channelsAdapter.removeOne(state, payload);
    },
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
  },
});

const { actions } = channelsSlice;

const selectors = channelsAdapter.getSelectors((state) => state.channels);
const customSelectors = {
  selectAllChannels: selectors.selectAll,
  selectAllChannelNames: (state) => selectors.selectAll(state).map(({ name }) => name),
  selectCurrentChannel: (state) => {
    const { currentChannelId } = state.channels;
    return selectors.selectById(state, currentChannelId);
  },
};

export { actions, customSelectors as selectors };
export default channelsSlice.reducer;
