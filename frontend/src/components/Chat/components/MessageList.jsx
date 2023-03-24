import { useEffect, useRef } from 'react';
import LeoProfanity from 'leo-profanity';

import useAuth from '../../../hooks/useAuth.js';

const MESSAGE_TYPE = 'bubble';

const scrollToMarker = (marker, behavior = 'auto') => {
  marker.scrollIntoView({
    behavior,
    block: 'start',
  });
};

const SimpleMessage = ({
  author, body,
}) => (
  <div className="text-break mb-2">
    <b>{author}</b>
    {': '}
    {body}
  </div>
);

const BubbledMessage = ({
  author, body,
  color = 'light', justify = 'start',
}) => (
  <div className={`d-flex mb-3 justify-content-${justify}`}>
    <div>
      <div className={`px-3 py-2 text-break text-bg-${color} message-corners-${justify}`}>
        <div className="small position-relative">
          <b>{author}</b>
          <div className="visually-hidden">: </div>
        </div>
        {body}
      </div>
    </div>
  </div>
);

const EnhancedMessage = ({
  author, body, time, color = 'primary', justify = 'start',
}) => {
  const authorColor = color === 'light' ? 'dark' : color;

  return (
    <div className={`d-flex mb-3 justify-content-${justify}`}>
      <div>
        <div className={`small text-${authorColor} text-${justify}`}>
          {author}
          {' '}
          <i style={{ opacity: '50%' }}>{time}</i>
        </div>
        <div className={`d-flex justify-content-${justify}`}>
          <div className={`px-3 py-2 text-break text-bg-${color} message-corners-${justify}`}>
            {body}
          </div>
        </div>
      </div>
    </div>
  );
};

const messageMap = {
  simple: SimpleMessage,
  bubble: BubbledMessage,
  withTime: EnhancedMessage,
};

const Message = messageMap[MESSAGE_TYPE];

const Messages = ({ channelId, content }) => {
  const { getUserName } = useAuth();
  const currentUserName = getUserName();

  const profanityFilter = LeoProfanity;

  const scrollRef = useRef();
  useEffect(() => {
    scrollToMarker(scrollRef.current);
  }, [channelId]);

  useEffect(() => {
    scrollToMarker(scrollRef.current, 'smooth');
  }, [content.length]);

  return (
    <div id="messages-box" className="overflow-auto px-3 pt-3 mb-auto">
      {content.map(({
        id, username, body, timestamp,
      }) => {
        const time = (new Date(timestamp)).toLocaleTimeString(undefined, { timeStyle: 'short' });
        const color = currentUserName === username ? 'primary' : 'light';
        const justify = currentUserName === username ? 'end' : 'start';
        return (
          <Message
            key={id}
            author={username}
            time={time}
            body={profanityFilter.clean(body)}
            color={color}
            justify={justify}
          />
        );
      })}
      <div className="scroll-marker" ref={scrollRef} />
    </div>
  );
};

export default Messages;
