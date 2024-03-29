import { useFormik } from 'formik';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import { object, string } from 'yup';
import { toast } from 'react-toastify';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';

import { useAuth } from '../../providers/AuthProvider.jsx';

const LogIn = () => {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const [authFailed, setAuthFailed] = useState(false);
  const auth = useAuth();

  const validationSchema = object({
    username: string().required('errors.required'),
    password: string().required('errors.required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await auth.logIn(values);
      } catch (error) {
        formik.setSubmitting(false);
        if (error.isAxiosError && error.response.status === 401) {
          setAuthFailed(true);
          return;
        }
        toast.error(t('errors.noConnection'));
        rollbar.error('LogIn', error);
      }
    },
  });

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-items-center h-100">
        <Col xs={12} md={8} xxl={6}>
          <Card>
            <Card.Body className="row p-5">
              <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                <Image src={`${process.env.PUBLIC_URL}/images/login.jpg`} roundedCircle alt={t('logIn.header')} />
              </Col>
              <Form onSubmit={formik.handleSubmit} className="col-12 col-12 col-md-6">
                <h1 className="text-center mb-4 h3">{t('logIn.header')}</h1>

                <FloatingLabel controlId="username" label={t('logIn.username')} className="mb-3">
                  <Form.Control
                    type="text"
                    value={formik.values.username}
                    placeholder={t('logIn.username')}
                    name="username"
                    isInvalid={authFailed}
                    onChange={formik.handleChange}
                    required
                    autoFocus
                    disabled={formik.isSubmitting}
                  />
                </FloatingLabel>

                <FloatingLabel controlId="password" label={t('logIn.password')} className="mb-3">
                  <Form.Control
                    type="password"
                    value={formik.values.password}
                    placeholder={t('logIn.password')}
                    name="password"
                    isInvalid={authFailed}
                    onChange={formik.handleChange}
                    required
                    disabled={formik.isSubmitting}
                  />
                </FloatingLabel>

                {authFailed ? <Alert variant="danger">{t('errors.authFailed')}</Alert> : null}

                <Button
                  variant="outline-primary"
                  type="submit"
                  size="lg"
                  className="mb-3 w-100"
                  disabled={formik.isSubmitting}
                >
                  {t('logIn.signIn')}
                </Button>
              </Form>
            </Card.Body>
            <Card.Footer className="p-4">
              <div className="text-muted text-center">
                <span>{t('logIn.noAccount')}</span>
                {' '}
                <Link to="/signup">{t('logIn.createOne')}</Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LogIn;
