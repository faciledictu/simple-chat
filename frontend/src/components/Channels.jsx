import { useSelector, useDispatch } from 'react-redux';
import Nav from 'react-bootstrap/Nav';

import { selectors } from '../slices/channelsSlice.js';
import { actions as currentChannelActions } from '../slices/currentChannelSlice.js';

const Channels = () => {
  const dispatch = useDispatch();
  const channels = useSelector(selectors.selectAll);

  const navElements = channels.map(({ id, name }) => (
    <Nav.Item key={id}>
      <Nav.Link eventKey={id}>{name}</Nav.Link>
    </Nav.Item>
  ));

  const currentChannelId = useSelector((state) => state.currentChannel.id);

  const handleSelect = (id) => {
    dispatch(currentChannelActions.setCurrentChannel(id));
  };

  return (
    <Nav variant="pills" className="flex-column" activeKey={currentChannelId} onSelect={handleSelect}>
      {navElements}
    </Nav>
  );
};

export default Channels;
