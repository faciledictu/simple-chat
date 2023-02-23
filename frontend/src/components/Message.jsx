import useAuth from '../hooks/useAuth.js';

const coloursMap = {
  currentUser: {
    justify: 'end',
    bgColour: 'primary',
    authorColour: 'primary',
  },
  other: {
    justify: 'start',
    bgColour: 'light',
    authorColour: 'secondary',
  },
};

const Message = ({ author, body }) => {
  const { userId } = useAuth();
  const messageType = userId.username === author ? 'currentUser' : 'other';
  const appearance = coloursMap[messageType];

  return (
    <div className={`d-flex mb-3 justify-content-${appearance.justify}`}>
      <div>
        <div className={`px-3 text-${appearance.authorColour} text-${appearance.justify}`}>{author}</div>
        <div className={`px-3 py-2 rounded-4 text-break text-bg-${appearance.bgColour}`}>
          {body}
        </div>
      </div>
    </div>
  );
};

export default Message;
