import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { object, string, ref } from 'yup';

import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';

import useAuth from '../hooks/useAuth.js';

const Login = () => {
  const { t } = useTranslation();
  const [authFailed, setAuthFailed] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const validationSchema = object({
    username: string()
      .trim()
      .required('errors.required')
      .min(3, 'errors.outOfLenght')
      .max(20, 'errors.outOfLenght'),
    password: string()
      .required('errors.required')
      .min(6, 'errors.min6chars'),
    confirmPassword: string()
      .oneOf([ref('password')], 'errors.notSame'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await auth.signUp(values);
        navigate('/');
      } catch (error) {
        formik.setSubmitting(false);
        if (error.isAxiosError && error.response.status === 409) {
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
            <Card.Body className="row p-5">
              <Col xs={12} md={6} className="d-flex align-items-center justify-content-center">
                <Image src={`${process.env.PUBLIC_URL}/images/signup.jpg`} roundedCircle alt={t('signUp.header')} />
              </Col>
              <Form noValidate onSubmit={formik.handleSubmit} className="col-12 col-12 col-md-6">
                <h1 className="text-center mb-4 h3">{t('signUp.header')}</h1>

                <FloatingLabel controlId="username" label={t('signUp.username')} className="mb-3">
                  <Form.Control
                    type="text"
                    value={formik.values.username}
                    placeholder={t('signUp.username')}
                    name="username"
                    isInvalid={!!formik.errors.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoFocus
                    disabled={formik.isSubmitting}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>{t(formik.errors.username)}</Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel controlId="password" label={t('signUp.password')} className="mb-3">
                  <Form.Control
                    type="password"
                    value={formik.values.password}
                    placeholder={t('signUp.password')}
                    name="password"
                    isInvalid={!!formik.errors.password && formik.touched.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>{t(formik.errors.password)}</Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel controlId="confirmPassword" label={t('signUp.confirmPassword')} className="mb-3">
                  <Form.Control
                    type="password"
                    value={formik.values.confirmPassword}
                    placeholder={t('signUp.confirmPassword')}
                    name="confirmPassword"
                    isInvalid={!!formik.errors.confirmPassword && formik.touched.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>{t(formik.errors.confirmPassword)}</Form.Control.Feedback>
                </FloatingLabel>

                {authFailed ? <Alert variant="danger">{t('errors.userExists')}</Alert> : null}

                <Button
                  variant="outline-primary"
                  type="submit"
                  size="lg"
                  className="mb-3 w-100"
                  disabled={formik.isSubmitting || !formik.isValid}
                >
                  {t('login.signIn')}
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
