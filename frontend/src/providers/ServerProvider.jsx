import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import routes from '../routes.js';
import * as channelsSlice from '../slices/channelsSlice.js';
import * as messagesSlice from '../slices/messagesSlice.js';
import useAuth from '../hooks/useAuth.js';
import ServerContext from '../contexts/ServerContext.js';

const ServerProvider = ({ socket, children }) => {
  const TIMEOUT = 4000;

  const dispatch = useDispatch();
  const { getAuthHeader } = useAuth();

  const sendMessage = async (message) => {
    await socket.timeout(TIMEOUT).emitWithAck('newMessage', { ...message, timestamp: Date.now() });
  };

  const createChannel = async (name) => {
    const { data } = await socket.timeout(TIMEOUT).emitWithAck('newChannel', { name });
    dispatch(channelsSlice.actions.addChannel(data));
    dispatch(channelsSlice.actions.setCurrentChannel(data.id));
  };

  const renameChannel = async (id, newName) => {
    await socket.timeout(TIMEOUT).emitWithAck('renameChannel', { id, name: newName });
  };

  const removeChannel = async (id) => {
    await socket.timeout(TIMEOUT).emitWithAck('removeChannel', { id });
  };

  const connectSocket = () => {
    socket.connect();
    socket.on('newMessage', (message) => {
      dispatch(messagesSlice.actions.addMessage(message));
    });
    socket.on('newChannel', (channel) => {
      dispatch(channelsSlice.actions.addChannel(channel));
    });
    socket.on('renameChannel', (channel) => {
      dispatch(channelsSlice.actions.addChannel(channel));
    });
    socket.on('removeChannel', ({ id }) => {
      dispatch(channelsSlice.actions.removeChannel(id));
    });
  };

  const disconnectSocket = () => {
    socket.off();
    socket.disconnect();
  };

  const getServerData = async () => {
    const route = routes.data();
    const headers = getAuthHeader();
    const response = await axios.get(route, { headers });
    return response;
  };

  const context = useMemo(() => ({
    getServerData,
    connectSocket,
    sendMessage,
    createChannel,
    renameChannel,
    removeChannel,
    disconnectSocket,
  }));

  return (
    <ServerContext.Provider value={context}>
      {children}
    </ServerContext.Provider>
  );
};

export default ServerProvider;
