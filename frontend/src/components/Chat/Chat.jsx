import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import { toast } from 'react-toastify';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';

import useServer from '../../hooks/useServer.js';
import { selectors as loadingStatusSelectors } from '../../slices/loadingStatusSlice.js';
import { selectors as channelsSelectors } from '../../slices/channelsSlice.js';
import { selectors as messagesSelectors } from '../../slices/messagesSlice.js';

import Channels from './components/Channels.jsx';
import Modal from '../common/Modal/index.jsx';
import Messages from './components/Messages.jsx';
import fetchInitialData from '../../slices/thunks.js';
import useAuth from '../../hooks/useAuth.js';

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
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const { logOut } = useAuth();
  const dispatch = useDispatch();
  const { connectSocket, getServerData, disconnectSocket } = useServer();

  useEffect(() => {
    dispatch(fetchInitialData(getServerData));
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  const loadingState = useSelector(loadingStatusSelectors.getStatus);

  useEffect(() => {
    switch (loadingState) {
      case 'authError':
        toast.error(t('errors.authError'));
        rollbar.error('Chat#authError');
        logOut();
        break;

      case 'failed':
        toast.error(t('errors.noConnection'));
        rollbar.error('Chat#noConnection');
        break;

      default:
        break;
    }
  }, [loadingState]);

  const channels = useSelector(channelsSelectors.selectAllChannels);
  const currentChannel = useSelector(channelsSelectors.selectCurrentChannel);
  const currentChannelMessages = useSelector(messagesSelectors.selectCurrentChannelMessages);

  return (
    <>
      <Container className="h-100 my-4 overflow-hidden rounded border">
        <Row className="h-100 bg-white flex-nowrap">
          {loadingState === 'successful'
            ? (
              <>
                <Channels channels={channels} currentChannelId={currentChannel.id} />
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
