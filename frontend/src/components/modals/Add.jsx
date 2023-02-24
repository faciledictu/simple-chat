import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';

import { object, string } from 'yup';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import useSocket from '../../hooks/useSocket.js';
import * as channelsSlice from '../../slices/channelsSlice.js';
import * as modalSlice from '../../slices/modalSlice.js';

const Add = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const socket = useSocket();

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
      socket.emit('newChannel', { name }, (response) => {
        if (response.status === 'ok') {
          // dispatch(channelsSlice.actions.addChannel(response.data));
          dispatch(channelsSlice.actions.setCurrentChannel(response.data.id));
          handleClose();
        }
      });
    },
  });

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
            <Form.Control autoFocus isValid={nameIsValid} isInvalid={nameIsInvalid} type="text" value={formik.values.name} onChange={formik.handleChange} disabled={formik.isSubmitting} />
            <Form.Label className="visually-hidden">
              {t('modals.name')}
            </Form.Label>
            <Form.Control.Feedback type="invalid" tooltip>{t(formik.errors.name)}</Form.Control.Feedback>
          </Form.Group>
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
