import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const channelsAdapter = createEntityAdapter();

const initialState = channelsAdapter.getInitialState();

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    addChannels: channelsAdapter.addMany,
    addChannel: channelsAdapter.addOne,
  },
});

const { actions } = channelsSlice;
const selectors = channelsAdapter.getSelectors((state) => state.channels);

export { actions, selectors };
export default channelsSlice.reducer;
