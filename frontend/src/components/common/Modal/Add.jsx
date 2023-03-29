import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import { toast } from 'react-toastify';

import { object, string } from 'yup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import { useServer } from '../../../providers/ServerProvider.jsx';
import { selectors as channelsSelectors } from '../../../slices/channelsSlice.js';

const Add = ({ handleClose }) => {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const { createChannel } = useServer();

  const existingChannelNames = useSelector(channelsSelectors.selectAllChannelNames);

  const validationSchema = object({
    name: string()
      .trim()
      .required('errors.required')
      .notOneOf(existingChannelNames, 'errors.notUnique')
      .min(3, 'errors.outOfLenght')
      .max(20, 'errors.outOfLenght'),
  });

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema,
    onSubmit: async ({ name }) => {
      try {
        await createChannel(name);
        handleClose();
        toast.success(t('modals.addSuccess'));
      } catch (error) {
        rollbar.error('Add', error);
        toast.error(t('errors.noConnection'));
      }
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  const nameIsInvalid = formik.errors.name && formik.touched.name;

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.addTitle')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit} autoComplete="off">
          <Form.Group className="mb-3" controlId="name">
            <Form.Control autoFocus isInvalid={nameIsInvalid} type="text" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={formik.isSubmitting} />
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

export default Add;
