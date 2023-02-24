import { useState, useMemo } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { ToastContainer, Slide } from 'react-toastify';

import * as channelsSlice from '../slices/channelsSlice.js';
import * as messagesSlice from '../slices/messagesSlice.js';
import AuthContext from '../contexts/AuthContext.js';
import SocketContext from '../contexts/SocketContext.js';
import useAuth from '../hooks/useAuth.js';

import Chat from './Chat.jsx';
import ErrorPage from './ErrorPage.jsx';
import LoginForm from './LoginForm.jsx';
import SignUpForm from './SignUpForm.jsx';
import NavBar from './NavBar.jsx';

import 'react-toastify/dist/ReactToastify.css';

const AuthProvider = ({ children }) => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  const currentloggedInState = !!userId;
  const [loggedIn, setLoggedIn] = useState(currentloggedInState);

  const logIn = (userData) => {
    localStorage.setItem('userId', JSON.stringify(userData));
    setLoggedIn(true);
  };

  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  const context = useMemo(() => ({
    logIn, logOut, loggedIn, userId,
  }));

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
};

const SocketProvider = ({ children }) => {
  const TIMEOUT = 5000;

  const socket = io('/', { autoConnect: false });
  const dispatch = useDispatch();

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

  const connect = () => {
    socket.connect();
  };

  const disconnect = () => {
    socket.off();
    socket.disconnect();
  };

  const context = useMemo(() => ({
    connect, disconnect, sendMessage, createChannel, renameChannel, removeChannel,
  }));

  return (
    <SocketContext.Provider value={context}>
      {children}
    </SocketContext.Provider>
  );
};

const ChatRoute = () => {
  const auth = useAuth();
  return auth.loggedIn ? <Chat /> : <LoginForm />;
};

const App = () => (
  <SocketProvider>
    <AuthProvider>
      <BrowserRouter>
        <div className="d-flex flex-column h-100">
          <NavBar />
          <Routes>
            <Route path="/" element={<ChatRoute />} errorElement={<ErrorPage />} />
            <Route path="login" element={<LoginForm />} />
            <Route path="signup" element={<SignUpForm />} />
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
    </AuthProvider>
  </SocketProvider>
);

export default App;
