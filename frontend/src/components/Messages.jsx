import Message from './Message.jsx';

const Messages = ({ content }) => (
  <div id="messages-box" className="overflow-auto p-3">
    {content.map(({ id, username, body }) => <Message key={id} author={username} body={body} />)}
  </div>
);

export default Messages;
