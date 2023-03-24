import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';

import useAuth from '../hooks/useAuth.js';

import Chat from './Chat/Chat.jsx';
import ErrorPage from './Errors/ErrorPage.jsx';
import LogIn from './LogIn/LogIn.jsx';
import SignUp from './SignUp/SignUp.jsx';
import NavBar from './common/NavBar.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '../style.css';

const ChatRoute = () => {
  const { loggedIn } = useAuth();
  return loggedIn ? <Chat /> : <Navigate to="login" />;
};

const LogInRoute = () => {
  const { loggedIn } = useAuth();
  return loggedIn ? <Navigate to="/" /> : <LogIn />;
};

const SignUpRoute = () => {
  const { loggedIn } = useAuth();
  return loggedIn ? <Navigate to="/" /> : <SignUp />;
};

const App = () => (
  <BrowserRouter>
    <div className="d-flex flex-column h-100">
      <NavBar />
      <Routes>
        <Route path="/" element={<ChatRoute />} />
        <Route path="login" element={<LogInRoute />} />
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
