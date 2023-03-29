import {
  BrowserRouter, Routes, Route, Navigate, Outlet,
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
import routes from '../routes.js';

const PrivateOutlet = () => {
  const { loggedIn } = useAuth();
  return loggedIn ? <Outlet /> : <Navigate to={routes.loginPage()} />;
};

const PublicOutlet = () => {
  const { loggedIn } = useAuth();
  return loggedIn ? <Navigate to={routes.chatPage()} /> : <Outlet />;
};

const App = () => (
  <BrowserRouter>
    <div className="d-flex flex-column h-100">
      <NavBar />
      <Routes>
        <Route path={routes.chatPage()} element={<PrivateOutlet />}>
          <Route path="" element={<Chat />} />
        </Route>
        <Route path={routes.loginPage()} element={<PublicOutlet />}>
          <Route path="" element={<LogIn />} />
        </Route>
        <Route path={routes.signupPage()} element={<PublicOutlet />}>
          <Route path="" element={<SignUp />} />
        </Route>
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
