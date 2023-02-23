const Message = ({ author, body }) => (
  <div className="d-flex mb-3">
    <div>
      <div className="px-3"><b>{author}</b></div>
      <div className="px-3 py-2 rounded-4 bg-light text-break">
        {body}
      </div>
    </div>
  </div>
);

export default Message;
