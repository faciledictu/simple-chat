import { useState, useMemo } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { ToastContainer, Slide } from 'react-toastify';
import axios from 'axios';

import * as channelsSlice from '../slices/channelsSlice.js';
import * as messagesSlice from '../slices/messagesSlice.js';
import AuthContext from '../contexts/AuthContext.js';
import ServerContext from '../contexts/ServerContext.js';
import useAuth from '../hooks/useAuth.js';
import routes from '../routes.js';

import Chat from './Chat.jsx';
import ErrorPage from './ErrorPage.jsx';
import LoginForm from './LoginForm.jsx';
import SignUpForm from './SignUpForm.jsx';
import NavBar from './NavBar.jsx';

import 'react-toastify/dist/ReactToastify.css';
import '../style.css';

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
  const TIMEOUT = 5000;

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

const ChatRoute = () => {
  const auth = useAuth();
  return auth.loggedIn ? <Chat /> : <LoginForm />;
};

const App = () => (
  <AuthProvider>
    <ServerProvider>
      <BrowserRouter>
        <div className="d-flex flex-column h-100">
          <NavBar />
          <Routes>
            <Route path="/" element={<ChatRoute />} />
            <Route path="login" element={<LoginForm />} />
            <Route path="signup" element={<SignUpForm />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Slide}
        />
      </BrowserRouter>
    </ServerProvider>
  </AuthProvider>
);

export default App;
