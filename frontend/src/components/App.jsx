import { useState } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from 'react-router-dom';

import AuthContext from '../contexts/AuthContext.jsx';
import useAuth from '../hooks/useAuth.js';

import Chat from './Chat.jsx';
import ErrorPage from './ErrorPage.jsx';
import LoginForm from './LoginForm.jsx';
import NavBar from './NavBar.jsx';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('userId'));

  const logIn = (userId) => {
    localStorage.setItem('userId', JSON.stringify(userId));
    setLoggedIn(true);
  };

  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ logIn, logOut, loggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

const ChatRoute = () => {
  const auth = useAuth();
  return auth.loggedIn ? <Chat /> : <LoginForm />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<ChatRoute />} errorElement={<ErrorPage />} />
      <Route path="login" element={<LoginForm />} />
    </>,
  ),
);

const App = () => (
  <AuthProvider>
    <NavBar />
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;
