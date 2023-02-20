import { useState, useMemo } from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from 'react-router-dom';

import AuthContext from '../contexts/AuthContext.jsx';
import useAuth from '../hooks/useAuth.js';
import useUserId from '../hooks/useUserId.js';

import Chat from './Chat.jsx';
import ErrorPage from './ErrorPage.jsx';
import LoginForm from './LoginForm.jsx';
import NavBar from './NavBar.jsx';

const AuthProvider = ({ children }) => {
  const currentloggedInState = !!useUserId();
  const [loggedIn, setLoggedIn] = useState(currentloggedInState);

  const logIn = (userId) => {
    localStorage.setItem('userId', JSON.stringify(userId));
    setLoggedIn(true);
  };

  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  const context = useMemo(() => ({ logIn, logOut, loggedIn }));

  return (
    <AuthContext.Provider value={context}>
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
  <AuthProvider>
    <div className="d-flex flex-column h-100">
      <NavBar />
      <RouterProvider router={router} />
    </div>
  </AuthProvider>
);

export default App;
