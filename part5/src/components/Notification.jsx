const Notification = ({ message, type }) => {
  if (message === null || typeof message !== 'string') {
    return null;
  }

  const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };

  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    
  };

  return (
    <div style={type === 'error' ? errorStyle : successStyle}>
      {message}
    </div>
  );
};


export default Notification;
