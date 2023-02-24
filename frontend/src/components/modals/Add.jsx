import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import { object, string } from 'yup';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import useSocket from '../../hooks/useSocket.js';
import * as channelsSlice from '../../slices/channelsSlice.js';
import * as modalSlice from '../../slices/modalSlice.js';

const Add = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { createChannel } = useSocket();

  const handleClose = () => dispatch(modalSlice.actions.close());

  const existingChannelNames = useSelector(channelsSlice.selectors.selectAll)
    .map(({ name }) => name);

  const validationSchema = object({
    name: string()
      .trim()
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
        console.log(error);
        toast.error(t('errors.noConnection'));
      }
    },
  });
  console.log(formik);
  const nameIsValid = !formik.errors.name && formik.values.name !== '';
  const nameIsInvalid = !!formik.errors.name && formik.values.name !== '';

  return (
    <Modal show onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.addTitle')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3 position-relative" controlId="name">
            <Form.Control autoFocus isValid={nameIsValid} isInvalid={nameIsInvalid} type="text" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} disabled={formik.isSubmitting} />
            <Form.Label className="visually-hidden">
              {t('modals.name')}
            </Form.Label>
            <Form.Control.Feedback type="invalid" tooltip>{t(formik.errors.name)}</Form.Control.Feedback>
          </Form.Group>
          {formik.status === 'noConnection' ? <Alert variant="danger">{t('errors.noConnection')}</Alert> : null }
          <Form.Group className="d-flex gap-2 col-12 justify-content-end">
            <Button variant="outline-primary" onClick={handleClose} className="col-3">
              {t('modals.cancel')}
            </Button>
            <Button variant="primary" type="submit" className="col-3" disabled={formik.isSubmitting || !nameIsValid}>
              {t('modals.send')}
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;
