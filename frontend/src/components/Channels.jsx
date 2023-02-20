import { useSelector, useDispatch } from 'react-redux';
import Nav from 'react-bootstrap/Nav';

import * as channelsSlice from '../slices/channelsSlice.js';

const Channels = ({ currentChannelId }) => {
  const dispatch = useDispatch();
  const channels = useSelector(channelsSlice.selectors.selectAll);
  const navElements = channels.map(({ id, name }) => (
    <Nav.Item key={id}>
      <Nav.Link eventKey={id}>{name}</Nav.Link>
    </Nav.Item>
  ));

  const handleSelect = (id) => {
    dispatch(channelsSlice.actions.setCurrentChannel(Number(id)));
  };

  return (
    <Nav variant="pills" className="flex-column" activeKey={currentChannelId} onSelect={handleSelect}>
      {navElements}
    </Nav>
  );
};

export default Channels;
