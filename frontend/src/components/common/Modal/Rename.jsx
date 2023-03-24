import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import { toast } from 'react-toastify';

import { object, string } from 'yup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import useServer from '../../../hooks/useServer.js';
import useAutoFocus from '../../../hooks/useAutoFocus';
import { selectors as channelsSelectors } from '../../../slices/channelsSlice.js';
import { selectors as modalSelectors } from '../../../slices/modalSlice.js';

const Rename = ({ handleClose }) => {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const { renameChannel } = useServer();

  const inputRef = useAutoFocus();

  const { channelId, channelName } = useSelector(modalSelectors.getModalContext);

  const otherChannelNames = useSelector(channelsSelectors.selectAllChannelNames)
    .filter((name) => name !== channelName);

  const validationSchema = object({
    name: string()
      .trim()
      .required('errors.required')
      .notOneOf(otherChannelNames, 'errors.notUnique')
      .min(3, 'errors.outOfLenght')
      .max(20, 'errors.outOfLenght'),
  });

  const formik = useFormik({
    initialValues: { name: channelName },
    validationSchema,
    onSubmit: async ({ name }) => {
      try {
        await renameChannel(channelId, name);
        toast.success(t('modals.renameSuccess'));
        handleClose();
      } catch (error) {
        rollbar.error('Rename', error);
        toast.error(t('errors.noConnection'));
      }
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  const nameIsInvalid = formik.errors.name && formik.values.name !== '';

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.renameTitle')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit} autoComplete="off">
          <Form.Group className="mb-3" controlId="name">
            <Form.Control isInvalid={nameIsInvalid} type="text" value={formik.values.name} onChange={formik.handleChange} ref={inputRef} disabled={formik.isSubmitting} />
            <Form.Label className="visually-hidden">
              {t('modals.channelName')}
            </Form.Label>
            <Form.Control.Feedback type="invalid">{t(formik.errors.name)}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="d-flex gap-2 col-12 justify-content-end">
            <Button variant="outline-primary" onClick={handleClose} className="col-3">
              {t('modals.cancel')}
            </Button>
            <Button variant="primary" type="submit" className="col-3" disabled={formik.isSubmitting}>
              {t('modals.send')}
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
};

export default Rename;
