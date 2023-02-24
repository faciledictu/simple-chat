import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import useSocket from '../../hooks/useSocket.js';
import * as modalSlice from '../../slices/modalSlice.js';
import ChannelName from '../ChannelName.jsx';

const Remove = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const submitRef = useRef();
  const { removeChannel } = useSocket();

  const { channelId, channelName } = useSelector((state) => state.modal.context);

  const handleClose = () => dispatch(modalSlice.actions.close());

  const handleSubmit = async (e) => {
    console.log(e);
    e.preventDefault();
    submitRef.current.disabled = true;
    try {
      await removeChannel(channelId);
      handleClose();
      toast.success(t('modals.removeSuccess'));
    } catch (error) {
      console.log(error);
      toast.error(t('errors.noConnection'));
      submitRef.current.disabled = false;
    }
  };

  return (
    <Modal show onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.removeTitle')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div>
          <p><b><ChannelName name={channelName} /></b></p>
          <p>{t('modals.removeWarning')}</p>
        </div>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="d-flex gap-2 col-12 justify-content-end">
            <Button variant="outline-primary" onClick={handleClose} className="col-3">
              {t('modals.cancel')}
            </Button>
            <Button variant="danger" type="submit" className="col-3" ref={submitRef}>
              {t('modals.remove')}
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default Remove;
