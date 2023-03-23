import { useDispatch, useSelector } from 'react-redux';

import Modal from 'react-bootstrap/Modal';

import * as modalSlice from '../../slices/modalSlice.js';
import Add from './Add.jsx';
import Rename from './Rename.jsx';
import Remove from './Remove.jsx';

const modalMap = {
  add: Add,
  rename: Rename,
  remove: Remove,
};

const ModalWindow = () => {
  const dispatch = useDispatch();
  const modalType = useSelector((state) => state.modal.type);
  const isOpened = useSelector((state) => state.modal.isOpened);
  const handleClose = () => dispatch(modalSlice.actions.close());

  const CurrentModal = modalMap[modalType];

  return (
    <Modal show={isOpened} onHide={handleClose}>
      {CurrentModal ? <CurrentModal handleClose={handleClose} /> : null}
    </Modal>
  );
};

export default ModalWindow;
