import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/useAuth.js';

const AuthButton = () => {
  const { t } = useTranslation();
  const auth = useAuth();

  if (auth.loggedIn) {
    return <Button onClick={auth.logOut}>{t('navbar.logOut')}</Button>;
  }

  return null;
};

const NavBar = () => {
  const { t } = useTranslation();
  return (
    <Navbar bg="light" expand="lg" variant="light">
      <Container>
        <Navbar.Brand href="/">{t('appName')}</Navbar.Brand>
        <AuthButton />
      </Container>
    </Navbar>
  );
};

export default NavBar;
