const Message = ({
  author, body, time, variant = 'primary', justify = 'start',
}) => {
  const authorColor = variant === 'light' ? 'dark' : variant;

  return (
    <div className={`d-flex mb-3 justify-content-${justify}`}>
      <div>
        <div className={`small text-${authorColor} text-${justify}`}>
          {author}
          {' '}
          <i style={{ opacity: '50%' }}>{time}</i>
        </div>
        <div className={`d-flex justify-content-${justify}`}>
          <div className={`px-3 py-2 text-break text-bg-${variant} message-corners-${justify}`}>
            {body}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
