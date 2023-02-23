import { useEffect } from 'react';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';

import routes from '../routes.js';
import useAuth from '../hooks/useAuth.js';
import useSocket from '../hooks/useSocket.js';
import * as channelsSlice from '../slices/channelsSlice.js';
import * as messagesSlice from '../slices/messagesSlice.js';
import * as modalSlice from '../slices/modalSlice.js';

import Channels from './Channels.jsx';
import Messages from './Messages.jsx';
import Modal from './modals/index.jsx';
import ChannelName from './ChannelName.jsx';

const getAuthHeader = (userId) => {
  if (userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

const Chat = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const socket = useSocket();
  const { userId } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const route = routes.data();
      const headers = getAuthHeader(userId);
      const { data } = await axios.get(route, { headers });
      dispatch(channelsSlice.actions.addChannels(data.channels));
      dispatch(messagesSlice.actions.addMessages(data.messages));
      dispatch(channelsSlice.actions.setCurrentChannel(data.currentChannelId));
    };

    fetchData();
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleOpen = () => {
    dispatch(modalSlice.actions.open({ type: 'add' }));
  };

  const modalType = useSelector((state) => state.modal.type);

  const channels = useSelector(channelsSlice.selectors.selectAll);

  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  const currentChannel = useSelector((state) => (
    channelsSlice.selectors.selectById(state, currentChannelId)
  ));

  const channelMessages = useSelector(messagesSlice.selectors.selectAll)
    .filter(({ channelId }) => channelId === currentChannelId);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    onSubmit: async ({ body }) => {
      const message = {
        body,
        username: userId.username,
        channelId: currentChannelId,
        timestamp: Date.now(),
      };
      socket.emit('newMessage', message, (response) => {
        if (response.status === 'ok') {
          formik.resetForm();
        }
      });
    },
  });

  const renderContent = () => {
    if (currentChannel && channelMessages) {
      return (
        <>
          <Col xs={4} md={2} className="border-end pt-5 bg-light">
            <div className="mb-2 d-flex justify-content-between align-items-center">
              <div className="text-truncate"><b>{t('chat.channels')}</b></div>
              <Button variant="outline-primary" className="rounded-circle p-0 d-flex align-items-center" onClick={handleOpen}>
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
            <Channels channels={channels} currentChannelId={currentChannelId} />
          </Col>

          <Col className="p-0 h-100">
            <div className="d-flex flex-column h-100">
              <div className="border-bottom bg-light p-3">
                <p className="m-0">
                  <b><ChannelName name={currentChannel.name} /></b>
                </p>
                <p className="m-0 text-muted">
                  {t('chat.messages', { count: channelMessages.length })}
                </p>
              </div>
              <Messages content={channelMessages} />
              <div className="p-3">
                <Form onSubmit={formik.handleSubmit} className="border rounded-pill overflow-hidden">
                  <InputGroup>
                    <Form.Control
                      type="text"
                      name="body"
                      value={formik.values.body}
                      placeholder={t('chat.writeMessage')}
                      onChange={formik.handleChange}
                      aria-label={t('chat.newMessage')}
                      className="border-0 ps-3 py-0"
                      style={{ boxShadow: 'none' }}
                    />
                    <Button
                      type="submit"
                      disabled={formik.isSubmitting || formik.values.body === ''}
                      className="rounded-circle p-0 m-1 d-flex"
                    >
                      <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 30 30"
                        fill="currentColor"
                        width={30}
                        height={30}
                      >
                        <path
                          d="M7.16,6.59v6.83a.51.51,0,0,0,.48.51l11.17.78a.29.29,0,0,1,0,.58l-11.17.78a.51.51,0,0,0-.48.51v6.83a.5.5,0,0,0,.72.46l19-8.6a.3.3,0,0,0,0-.54l-19-8.6A.5.5,0,0,0,7.16,6.59Z"
                        />
                      </svg>
                      <span className="visually-hidden">{t('chat.send')}</span>
                    </Button>
                  </InputGroup>
                </Form>
              </div>
            </div>
          </Col>
        </>
      );
    }

    return (
      <div className="m-auto w-auto">
        <Spinner animation="border" variant="secondary" role="status">
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
