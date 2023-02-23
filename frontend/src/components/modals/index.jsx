import Add from './Add.jsx';
import Rename from './Rename.jsx';
import Remove from './Remove.jsx';

const modalMap = {
  add: Add,
  rename: Rename,
  remove: Remove,
};

const Modal = ({ type }) => {
  const CurrentModal = modalMap[type];

  if (CurrentModal) {
    return <CurrentModal />;
  }

  return null;
};

export default Modal;
