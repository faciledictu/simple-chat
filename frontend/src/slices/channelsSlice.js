/* eslint-disable no-param-reassign */
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { actions as loadingStatusActions } from './loadingStatusSlice.js';
import fetchInitialData from './thunks.js';

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState({
  currentChannelId: null,
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.fulfilled, (state, { payload }) => {
        channelsAdapter.setAll(state, payload.channels);
        state.currentChannelId = payload.currentChannelId;
      })
      .addCase(loadingStatusActions.unload, () => initialState);
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
