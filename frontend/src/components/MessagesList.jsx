import { useEffect, useRef } from 'react';
import Message from './Message.jsx';

const scrollToMarker = (marker, behavior = 'auto') => {
  marker.scrollIntoView({
    behavior,
    block: 'start',
  });
};

const Messages = ({ channelId, content }) => {
  const scrollRef = useRef();

  useEffect(() => {
    scrollToMarker(scrollRef.current);
  }, [channelId]);

  useEffect(() => {
    scrollToMarker(scrollRef.current, 'smooth');
  }, [content.length]);

  return (
    <div id="messages-box" className="overflow-auto p-3 mb-auto">
      {content.map(({ id, username, body }) => <Message key={id} author={username} body={body} />)}
      <div className="scroll-marker" ref={scrollRef} />
    </div>
  );
};

export default Messages;
