import { useEffect, useRef } from 'react';
import LeoProfanity from 'leo-profanity';

import useAuth from '../hooks/useAuth.js';

const MESSAGE_TYPE = 'simple';

const profanityFilter = LeoProfanity;
profanityFilter.add(profanityFilter.getDictionary('en'));
profanityFilter.add(profanityFilter.getDictionary('fr'));
profanityFilter.add(profanityFilter.getDictionary('ru'));

const scrollToMarker = (marker, behavior = 'auto') => {
  marker.scrollIntoView({
    behavior,
    block: 'end',
  });
};

const SimpleMessage = ({
  author, body, color = 'light', justify = 'start',
}) => (
  <div className={`d-flex mb-3 justify-content-${justify}`}>
    <div className={`px-3 py-2 text-break text-bg-${color} message-corners-${justify}`}>
      <div className={`small text-${justify}`}>
        {author}
        <span className="visually-hidden">: </span>
      </div>
      {body}
    </div>
  </div>
);

const ExtendedMessage = ({
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
  extended: ExtendedMessage,
};

const Message = messageMap[MESSAGE_TYPE];

const Messages = ({ channelId, content }) => {
  const { userId } = useAuth();

  const scrollRef = useRef();
  useEffect(() => {
    scrollToMarker(scrollRef.current);
  }, [channelId]);

  useEffect(() => {
    scrollToMarker(scrollRef.current, 'smooth');
  }, [content.length]);

  return (
    <div id="messages-box" className="overflow-auto p-3 mb-auto">
      {content.map(({
        id, username, body, timestamp,
      }) => {
        const time = (new Date(timestamp)).toLocaleTimeString(undefined, { timeStyle: 'short' });
        const color = userId.username === username ? 'primary' : 'light';
        const justify = userId.username === username ? 'end' : 'start';
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
