import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import { toast } from 'react-toastify';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import { useServer } from '../../../providers/ServerProvider.jsx';
import ChannelName from '../ChannelName.jsx';
import { selectors as modalSelectors } from '../../../slices/modalSlice.js';

const Remove = ({ handleClose }) => {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const [isSubmitting, setSubmitting] = useState(false);
  const submitRef = useRef();
  const { removeChannel } = useServer();

  const { channelId, channelName } = useSelector(modalSelectors.getModalContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await removeChannel(channelId);
      handleClose();
      toast.success(t('modals.removeSuccess'));
    } catch (error) {
      rollbar.error('Remove', error);
      toast.error(t('errors.noConnection'));
      setSubmitting(false);
    }
  };

  return (
    <>
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
            <Button disabled={isSubmitting} variant="danger" type="submit" className="col-3" ref={submitRef}>
              {t('modals.remove')}
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
};
export default Remove;
