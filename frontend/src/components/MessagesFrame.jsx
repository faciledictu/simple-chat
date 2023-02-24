import { useTranslation } from 'react-i18next';
import Col from 'react-bootstrap/Col';

import MessageForm from './MessageForm.jsx';
import MessagesList from './MessagesList.jsx';
import ChannelName from './ChannelName.jsx';

const MessageFrameHeader = ({ channelName, messagesCount }) => {
  const { t } = useTranslation();

  return (
    <div className="border-bottom bg-light p-3">
      <p className="m-0">
        <b><ChannelName name={channelName} /></b>
      </p>
      <p className="m-0 text-muted">
        {t('chat.messages', { count: messagesCount })}
      </p>
    </div>
  );
};

const MessagesFrame = ({ channel, messages }) => (
  <Col className="p-0 d-flex flex-column h-100">
    <MessageFrameHeader channelName={channel.name} messagesCount={messages.length} />
    <MessagesList channelId={channel.id} content={messages} />
    <MessageForm channelId={channel.id} />
  </Col>
);

export default MessagesFrame;
