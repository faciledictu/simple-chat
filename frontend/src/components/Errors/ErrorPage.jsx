import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

const ErrorPage = () => {
  const { t } = useTranslation();

  return (
    <div className="text-center m-5">
      <h1>{t('errors.notFound.title')}</h1>
      <p className="lead">{t('errors.notFound.description')}</p>
      <Button as={Link} size="lg" to="/">{t('errors.notFound.link')}</Button>
    </div>
  );
};

export default ErrorPage;
