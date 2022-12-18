import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { object, string } from 'yup';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

const Login = () => {
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: object({
      username: string()
        .required(t('errors.required')),
      password: string()
        .required(t('errors.required')),
    }),
    onSubmit: (values) => console.log(values),
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
                    placeholder={t('login.username')}
                    value={formik.values.username}
                    required
                    onChange={formik.handleChange}
                  />
                </FloatingLabel>
                <FloatingLabel
                  controlId="password"
                  label={t('login.password')}
                  className="mb-3"
                >
                  <Form.Control
                    type="password"
                    placeholder={t('login.password')}
                    value={formik.values.password}
                    required
                    onChange={formik.handleChange}
                  />
                </FloatingLabel>
                <Button
                  variant="outline-primary"
                  type="submit"
                  size="lg"
                  className="mb-3 w-100"
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
