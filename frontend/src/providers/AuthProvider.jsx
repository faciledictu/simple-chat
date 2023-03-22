import { useMemo, useState } from 'react';
import axios from 'axios';

import routes from '../routes.js';
import AuthContext from '../contexts/AuthContext.js';

const AuthProvider = ({ children }) => {
  const userFromStorage = JSON.parse(localStorage.getItem('user'));

  const [user, setUser] = useState(userFromStorage);

  const logIn = async (userData) => {
    const { data } = await axios.post(routes.login(), userData);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const logOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const signUp = async (userData) => {
    const { data } = await axios.post(routes.signup(), userData);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const loggedIn = !!user;

  const getUserName = () => (user?.username ? user.username : null);

  const getAuthHeader = () => (user?.token ? { Authorization: `Bearer ${user.token}` } : {});

  const context = useMemo(() => ({
    logIn, logOut, signUp, loggedIn, getUserName, getAuthHeader,
  }));

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
