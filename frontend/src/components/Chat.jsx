import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

import useServer from '../hooks/useServer.js';
import * as channelsSlice from '../slices/channelsSlice.js';
import * as messagesSlice from '../slices/messagesSlice.js';

import ChannelsSidebar from './ChannelsSidebar.jsx';
import Modal from './modals/index.jsx';
import MessagesFrame from './MessagesFrame.jsx';

const Chat = () => {
  const { t } = useTranslation();
  const { connectSocket, fetchData, disconnectSocket } = useServer();

  useEffect(() => {
    fetchData();
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  const modalType = useSelector((state) => state.modal.type);

  const channels = useSelector(channelsSlice.selectors.selectAll);

  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  const currentChannel = useSelector((state) => (
    channelsSlice.selectors.selectById(state, currentChannelId)
  ));

  const currentChannelMessages = useSelector(messagesSlice.selectors.selectAll)
    .filter(({ channelId }) => channelId === currentChannelId);

  const renderContent = () => {
    if (currentChannel && currentChannelMessages) {
      return (
        <>
          <ChannelsSidebar channels={channels} currentChannelId={currentChannelId} />
          <MessagesFrame channel={currentChannel} messages={currentChannelMessages} />
        </>
      );
    }

    return (
      <div className="m-auto w-auto">
        <Spinner animation="border" variant="primary" role="status">
          <span className="visually-hidden">{t('loading')}</span>
        </Spinner>
      </div>
    );
  };

  return (
    <>
      <Container className="h-100 my-4 overflow-hidden rounded border">
        <Row className="h-100 bg-white flex-nowrap">
          {renderContent()}
        </Row>
      </Container>
      <Modal type={modalType} />
    </>
  );
};

export default Chat;
