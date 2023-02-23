import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

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
  const dispatch = useDispatch();

  const handleSelect = (id) => () => {
    dispatch(channelsSlice.actions.setCurrentChannel(id));
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
  );
};

export default Channels;
