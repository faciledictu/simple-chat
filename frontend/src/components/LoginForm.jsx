import axios from 'axios';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import useAuth from '../hooks/useAuth.js';
import routes from '../routes.js';

const AuthError = () => {
  const { t } = useTranslation();
  return <Alert variant="danger">{t('errors.authFailed')}</Alert>;
};

const Login = () => {
  const { t } = useTranslation();
  const [authFailed, setAuthFailed] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const validationSchema = object({
    username: string()
      .required(t('errors.required')),
    password: string()
      .required(t('errors.required')),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(routes.login(), values);
        console.log(auth);
        auth.logIn(data);
        navigate('/');
      } catch (error) {
        formik.setSubmitting(false);
        if (error.isAxiosError && error.response.status === 401) {
          setAuthFailed(true);
          return;
        }
        throw error;
      }
    },
  });

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card>
            <Card.Body as={Row} className="p-5">
              <Form onSubmit={formik.handleSubmit}>
                <h1 className="mb-4 h4">{t('login.header')}</h1>

                <FloatingLabel
                  controlId="username"
                  label={t('login.username')}
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    value={formik.values.username}
                    placeholder={t('login.username')}
                    name="username"
                    isInvalid={authFailed}
                    onChange={formik.handleChange}
                    required
                    autoFocus
                    disabled={formik.isSubmitting}
                  />
                </FloatingLabel>

                <FloatingLabel
                  controlId="password"
                  label={t('login.password')}
                  className="mb-3"
                >
                  <Form.Control
                    type="password"
                    value={formik.values.password}
                    placeholder={t('login.password')}
                    name="password"
                    isInvalid={authFailed}
                    onChange={formik.handleChange}
                    required
                    disabled={formik.isSubmitting}
                  />
                </FloatingLabel>

                {authFailed ? <AuthError /> : null}

                <Button
                  variant="outline-primary"
                  type="submit"
                  size="lg"
                  className="mb-3 w-100"
                  disabled={formik.isSubmitting}
                >
                  {t('login.login')}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
