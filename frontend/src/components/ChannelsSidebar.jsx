import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

import * as channelsSlice from '../slices/channelsSlice.js';
import * as modalSlice from '../slices/modalSlice.js';
import ChannelName from './ChannelName.jsx';

const PersistentChannel = ({
  name, isActive, variant, onSelect,
}) => (
  <Button active={isActive} variant={variant} className="text-truncate text-start w-100 border-0" onClick={onSelect}>
    <ChannelName name={name} />
  </Button>
);

const RemovableChannel = ({
  name, isActive, variant, onSelect, handleRename, handleRemove,
}) => {
  const { t } = useTranslation();

  return (
    <Dropdown as={ButtonGroup} className="d-flex">
      <Button active={isActive} variant={variant} className="text-truncate text-start w-100 border-0" onClick={onSelect}>
        <ChannelName name={name} />
      </Button>

      <Dropdown.Toggle active={isActive} split variant={variant} className="border-0" />
      <Dropdown.Menu>
        <Dropdown.Item onClick={handleRename}>{t('chat.rename')}</Dropdown.Item>
        <Dropdown.Item onClick={handleRemove}>{t('chat.remove')}</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

const Channels = ({ channels, currentChannelId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleSelect = (id) => () => {
    dispatch(channelsSlice.actions.setCurrentChannel(id));
  };
  const handleAdd = () => {
    dispatch(modalSlice.actions.open({ type: 'add' }));
  };

  const handleRename = (id, name) => () => {
    const context = {
      channelId: id,
      channelName: name,
    };

    dispatch(modalSlice.actions.open({ type: 'rename', context }));
  };

  const handleRemove = (id, name) => () => {
    const context = {
      channelId: id,
      channelName: name,
    };

    dispatch(modalSlice.actions.open({ type: 'remove', context }));
  };

  return (
    <Col xs={4} md={3} className="border-end pt-5 bg-light">
      <div className="mb-2 d-flex justify-content-between align-items-center">
        <div className="text-truncate"><b>{t('chat.channels')}</b></div>
        <Button variant="outline-primary" className="rounded-circle p-0 d-flex align-items-center" onClick={handleAdd}>
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            width={20}
            height={20}
          >
            <rect x="9.5" y="5" width="1" height="10" />
            <rect x="5" y="9.5" width="10" height="1" />
          </svg>
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <ul className="flex-column nav nav-pills nav-fill">
        {channels.map(({ id, name, removable }) => {
          const isActive = id === currentChannelId;
          const variant = isActive ? 'outline-primary' : null;
          const Channel = removable ? RemovableChannel : PersistentChannel;

          return (
            <li key={id} className="nav-item w-100">
              <Channel
                key={id}
                name={name}
                isActive={isActive}
                variant={variant}
                onSelect={handleSelect(Number(id))}
                handleRename={handleRename((Number(id)), name)}
                handleRemove={handleRemove(Number(id), name)}
              />
            </li>
          );
        })}
      </ul>
    </Col>
  );
};

export default Channels;
