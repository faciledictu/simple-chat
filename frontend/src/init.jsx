import { useMemo, useState } from 'react';
import { useDispatch, Provider } from 'react-redux';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import Rollbar from 'rollbar';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import axios from 'axios';
import { io } from 'socket.io-client';

import AuthContext from './contexts/AuthContext.js';
import ServerContext from './contexts/ServerContext.js';
import routes from './routes.js';
import * as channelsSlice from './slices/channelsSlice.js';
import * as messagesSlice from './slices/messagesSlice.js';
import useAuth from './hooks/useAuth.js';

import App from './components/App.jsx';
import resources from './locales/index.js';
import store from './slices/index.js';

const DEFAULT_LANGUAGE = 'ru';

const AuthProvider = ({ children }) => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  const currentloggedInState = !!userId;
  const [loggedIn, setLoggedIn] = useState(currentloggedInState);

  const logIn = async (userData) => {
    const { data } = await axios.post(routes.login(), userData);
    localStorage.setItem('userId', JSON.stringify(data));
    setLoggedIn(true);
  };

  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  const signUp = async (userData) => {
    const { data } = await axios.post(routes.signup(), userData);
    localStorage.setItem('userId', JSON.stringify(data));
    setLoggedIn(true);
  };

  const context = useMemo(() => ({
    logIn, signUp, logOut, loggedIn, userId,
  }));

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
};

const ServerProvider = ({ children }) => {
  const TIMEOUT = 4000;

  const getAuthHeader = (userId) => {
    if (userId.token) {
      return { Authorization: `Bearer ${userId.token}` };
    }

    return {};
  };

  const dispatch = useDispatch();
  const { userId } = useAuth();

  const socket = io('/', { autoConnect: false });

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

  const fetchData = async () => {
    const route = routes.data();
    const headers = getAuthHeader(userId);
    const { data } = await axios.get(route, { headers });
    dispatch(channelsSlice.actions.addChannels(data.channels));
    dispatch(messagesSlice.actions.addMessages(data.messages));
    dispatch(channelsSlice.actions.setCurrentChannel(data.currentChannelId));
  };

  const context = useMemo(() => ({
    fetchData,
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

const init = async () => {
  const rollbar = new Rollbar({
    accessToken: 'c3ffc3965ed246f392ac08ff37c8bd46',
    environment: process.env.NODE_ENV,
  });

  const i18n = i18next.createInstance();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: DEFAULT_LANGUAGE,
      fallbackLng: ['en', 'ru'],
    });

  return (
    <RollbarProvider instance={rollbar}>
      <ErrorBoundary>
        <I18nextProvider i18n={i18n}>
          <Provider store={store}>
            <AuthProvider>
              <ServerProvider>
                <App />
              </ServerProvider>
            </AuthProvider>
          </Provider>
        </I18nextProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};

export default init;
