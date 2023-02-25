const appearanceMap = {
  currentUser: {
    justify: 'end',
    bgColour: 'primary',
    authorColour: 'primary',
  },
  other: {
    justify: 'start',
    bgColour: 'light',
    authorColour: 'dark',
  },
};

const Message = ({
  author, body, variant, time,
}) => {
  const appearance = appearanceMap[variant];

  return (
    <div className={`d-flex mb-3 justify-content-${appearance.justify}`}>
      <div>
        <div className={`small text-${appearance.authorColour} text-${appearance.justify}`}>
          {author}
          {' '}
          <i style={{ opacity: '50%' }}>{time}</i>
        </div>
        <div className={`d-flex justify-content-${appearance.justify}`}>
          <div className={`px-3 py-2 text-break text-bg-${appearance.bgColour} message-corners-${appearance.justify}`}>
            {body}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
