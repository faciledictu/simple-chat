/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import fetchInitialData from './thunks.js';

const initialState = {
  serverData: 'notLoaded',
};

const loadingStatusSlice = createSlice({
  name: 'loadingStatus',
  initialState,
  reducers: {
    unload: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.pending, () => 'loading')
      .addCase(fetchInitialData.fulfilled, () => 'successful')
      .addCase(fetchInitialData.rejected, (state, action) => {
        if (action.payload === 401) {
          return 'authError';
        }
        return 'failed';
      });
  },
});

const { actions } = loadingStatusSlice;

const selectors = {
  getStatus: (state) => state.loadingStatus,
};

export { actions, selectors };
export default loadingStatusSlice.reducer;
