import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

import useServer from '../../hooks/useServer.js';
import * as channelsSlice from '../../slices/channelsSlice.js';
import * as messagesSlice from '../../slices/messagesSlice.js';

import Channels from './components/Channels.jsx';
import Modal from '../common/Modal/index.jsx';
import Messages from './components/Messages.jsx';

const Placeholder = () => {
  const { t } = useTranslation();

  return (
    <div className="m-auto w-auto">
      <Spinner animation="border" variant="primary" role="status">
        <span className="visually-hidden">{t('loading')}</span>
      </Spinner>
    </div>
  );
};

const Chat = () => {
  const { connectSocket, fetchData, disconnectSocket } = useServer();

  useEffect(() => {
    fetchData();
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  const channels = useSelector(channelsSlice.selectors.selectAll);

  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  const currentChannel = useSelector((state) => (
    channelsSlice.selectors.selectById(state, currentChannelId)
  ));

  const currentChannelMessages = useSelector(messagesSlice.selectors.selectAll)
    .filter(({ channelId }) => channelId === currentChannelId);

  return (
    <>
      <Container className="h-100 my-4 overflow-hidden rounded border">
        <Row className="h-100 bg-white flex-nowrap">
          {currentChannel && currentChannelMessages
            ? (
              <>
                <Channels channels={channels} currentChannelId={currentChannelId} />
                <Messages channel={currentChannel} messages={currentChannelMessages} />
              </>
            )
            : <Placeholder />}
        </Row>
      </Container>
      <Modal />
    </>
  );
};

export default Chat;
