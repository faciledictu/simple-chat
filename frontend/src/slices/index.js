import { configureStore } from '@reduxjs/toolkit';
import channelsReducer from './channelsSlice.js';
import currentChannelReducer from './currentChannelSlice.js';
import messagesReducer from './messagesSlice.js';

export default configureStore({
  reducer: {
    channels: channelsReducer,
    currentChannel: currentChannelReducer,
    messages: messagesReducer,
  },
});
