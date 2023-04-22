const Notification = ({ message }) => {
    if (message === null) {
      return null;
    }
  
    if (message.includes("Added") || message.includes("Updated")) {
      return (
        <div className="success_message">
          {message}
        </div>
      );
    }
  
    return (
      <div className="error_message">
        {message}
      </div>
    );
  };
  
  export default Notification;
  