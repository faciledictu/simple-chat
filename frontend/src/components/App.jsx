import { useState, useMemo } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';

import * as channelsSlice from '../slices/channelsSlice.js';
import * as messagesSlice from '../slices/messagesSlice.js';
import AuthContext from '../contexts/AuthContext.js';
import SocketContext from '../contexts/SocketContext.js';
import useAuth from '../hooks/useAuth.js';

import Chat from './Chat.jsx';
import ErrorPage from './ErrorPage.jsx';
import LoginForm from './LoginForm.jsx';
import NavBar from './NavBar.jsx';

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

  const context = socket;
  console.log('recreate socket');
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={<ChatRoute />}
        errorElement={<ErrorPage />}
      />
      <Route
        path="login"
        element={<LoginForm />}
      />
    </>,
  ),
);

const App = () => (
  <SocketProvider>
    <AuthProvider>
      <div className="d-flex flex-column h-100">
        <NavBar />
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  </SocketProvider>
);

export default App;
