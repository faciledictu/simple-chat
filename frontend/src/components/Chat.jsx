import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import routes from '../routes.js';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';
import { actions as currentChannelActions } from '../slices/currentChannelSlice.js';
import Channels from './Channels.jsx';
import Messages from './Messages.jsx';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const Chat = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const route = routes.data();
      const headers = getAuthHeader();
      const { data } = await axios.get(route, { headers });
      dispatch(channelsActions.addChannels(data.channels));
      dispatch(messagesActions.addMessages(data.messages));
      dispatch(currentChannelActions.setCurrentChannel(data.currentChannelId));
    };
    console.log('fetch');
    fetchData();
  }, []);

  return (
    <Container className="h-100 my-4 overflow-hidden rounded border">
      <Row className="h-100 bg-white flex-md-row">

        <Col xs={4} md={2} className="border-end pt-5 bg-light">
          <div className="ps-3">
            Каналы
          </div>
          <Channels />
        </Col>

        <Col className="p-0 h-100">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 small">
              Yet another text
            </div>
            <Messages />
          </div>
        </Col>

      </Row>
    </Container>
  );
};

export default Chat;
