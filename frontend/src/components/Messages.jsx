import { useSelector } from 'react-redux';

// import { selectors } from '../slices/messagesSlice.js';

const Messages = () => {
  const currentChannelId = useSelector((state) => state.currentChannel.id);

  return (
    <div>
      Messages of channel
      {currentChannelId}
    </div>
  );
};

export default Messages;
