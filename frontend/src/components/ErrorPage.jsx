import { useEffect } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  console.error(error);
  useEffect(() => {
    navigate('/');
  }, []);
};

export default ErrorPage;
