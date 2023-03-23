import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';

import useAuth from '../hooks/useAuth.js';

import Chat from './Chat.jsx';
import ErrorPage from './ErrorPage.jsx';
import LoginForm from './LoginForm.jsx';
import SignUpForm from './SignUpForm.jsx';
import NavBar from './NavBar.jsx';

import 'react-toastify/dist/ReactToastify.css';
import '../style.css';

const ChatRoute = () => {
  const { loggedIn } = useAuth();
  return loggedIn ? <Chat /> : <Navigate to="login" />;
};

const LoginRoute = () => {
  const { loggedIn } = useAuth();
  return loggedIn ? <Navigate to="/" /> : <LoginForm />;
};

const SignUpRoute = () => {
  const { loggedIn } = useAuth();
  return loggedIn ? <Navigate to="/" /> : <SignUpForm />;
};

const App = () => (
  <BrowserRouter>
    <div className="d-flex flex-column h-100">
      <NavBar />
      <Routes>
        <Route path="/" element={<ChatRoute />} />
        <Route path="login" element={<LoginRoute />} />
        <Route path="signup" element={<SignUpRoute />} />
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
);

export default App;
