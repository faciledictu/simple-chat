import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root from './routes/root';
import ErrorPage from './ErrorPage';
import Login from './routes/login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'login',
    element: <Login />,
  },
]);

const App = () => (
  <RouterProvider router={router} />
);

export default App;
